/**
 * server.js — Express server that calls the Figma API.
 *
 * Endpoints:
 *   GET  /api/config  → the node map from config.json
 *   GET  /api/file    → live file metadata via the Figma REST API (needs FIGMA_TOKEN)
 *   POST /api/push    → maps the project document onto the configured Figma
 *                       text nodes and relays the update (see note below)
 *
 * NOTE ON WRITES: the public Figma REST API is read-only for file content —
 * text edits go through the Plugin API (or the Figma MCP server). This server
 * therefore builds the complete { nodeId: characters } update map from
 * config.json and POSTs it to FIGMA_WRITE_ENDPOINT when one is configured
 * (e.g. a small companion plugin bridge); otherwise it returns the map so the
 * caller can inspect/apply it. Set these env vars before `npm run server`:
 *
 *   FIGMA_TOKEN           personal access token (read endpoints)
 *   FIGMA_WRITE_ENDPOINT  optional URL that accepts { updates: {nodeId: text} }
 *   PORT                  optional, default 3001
 */
import express from 'express';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, 'config.json'), 'utf8'));

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3001;
const FIGMA_API = 'https://api.figma.com/v1';

/* ------------------------------------------------------------- node mapping
 * config.json identifies the CARDS; their text children come from the Figma
 * node map documented in PLAN.md:
 *   goalCard        2:40 → 6:10/6:11 (goal), 6:13/6:14 (success criteria)
 *   scopeCard       2:44 → 6:17/6:18 (in), 6:20/6:21 (out)
 *   stakeholders    2:49 → placeholder 6:27/6:28
 *   timelineCard    2:53 → rows 6:32/6:33, 6:41/6:42, 6:50/6:51 + desc nodes
 *   titleSlide      2:10 → 2:18 main, 2:19 sub, meta 2:24/2:27/2:30
 *   draftBadge      6:2  → 6:3 ("DRAFT")
 * ------------------------------------------------------------------------- */
const TEXT_NODES = {
  title: { main: '2:18', sub: '2:19', fields: ['2:24', '2:27', '2:30'] },
  goalCard: { title: '2:41', rows: [['6:10', '6:11'], ['6:13', '6:14']] },
  scopeCard: { title: '2:45', rows: [['6:17', '6:18'], ['6:20', '6:21']] },
  stakeholdersCard: { title: '2:50', placeholder: ['6:27', '6:28'] },
  timelineCard: {
    title: '2:54',
    rows: [
      { date: '6:33', tag: '6:32', desc: '6:38' },
      { date: '6:42', tag: '6:41', desc: '6:47' },
      { date: '6:51', tag: '6:50', desc: '6:56' },
    ],
  },
  draftBadge: '6:3',
};

/** Flatten the project document into { nodeId: characters } for Figma. */
export function buildUpdateMap(project) {
  const updates = {};
  const put = (node, text) => {
    if (node && text != null) updates[node] = String(text);
  };

  // Title slide
  put(TEXT_NODES.title.main, project.title.mainTitle);
  put(TEXT_NODES.title.sub, project.title.subtitle);
  project.title.fields.slice(0, TEXT_NODES.title.fields.length).forEach((f, i) => {
    put(TEXT_NODES.title.fields[i], f.value);
  });

  // Goal card (first two tiered items map to the two designed rows)
  project.overview.goals.slice(0, TEXT_NODES.goalCard.rows.length).forEach((g, i) => {
    put(TEXT_NODES.goalCard.rows[i][0], g.label);
    put(TEXT_NODES.goalCard.rows[i][1], g.text);
  });

  // Scope card (join list items into the designed single text rows)
  const join = (items) => items.map((s) => s.text).join(', ');
  put(TEXT_NODES.scopeCard.rows[0][1], join(project.overview.scope.inScope));
  put(TEXT_NODES.scopeCard.rows[1][1], join(project.overview.scope.outOfScope));

  // Stakeholders card
  if (project.overview.stakeholders.length > 0) {
    put(TEXT_NODES.stakeholdersCard.placeholder[0], `${project.overview.stakeholders.length} stakeholders`);
    put(
      TEXT_NODES.stakeholdersCard.placeholder[1],
      project.overview.stakeholders.map((c) => `${c.name} — ${c.role}`).join('  ·  '),
    );
  }

  // Timeline card (already date-ordered in state)
  project.overview.timeline.slice(0, TEXT_NODES.timelineCard.rows.length).forEach((t, i) => {
    const row = TEXT_NODES.timelineCard.rows[i];
    put(row.date, t.date);
    put(row.tag, t.tag);
    put(row.desc, t.desc);
  });

  // Draft badge
  put(TEXT_NODES.draftBadge, project.draft ? config.defaults.status : '');

  return updates;
}

/* ----------------------------------------------------------------- routes */
app.get('/api/config', (_req, res) => res.json(config));

app.get('/api/file', async (_req, res) => {
  if (!process.env.FIGMA_TOKEN) {
    return res.status(400).json({ error: 'FIGMA_TOKEN is not set on the server.' });
  }
  try {
    const r = await fetch(`${FIGMA_API}/files/${config.fileKey}?depth=1`, {
      headers: { 'X-Figma-Token': process.env.FIGMA_TOKEN },
    });
    const body = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: body.err || 'Figma API error' });
    res.json(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.post('/api/push', async (req, res) => {
  const updates = buildUpdateMap(req.body);

  if (!process.env.FIGMA_WRITE_ENDPOINT) {
    // Nothing to relay to — hand the map back so the caller can apply it
    // (e.g. via the Figma desktop plugin / MCP write path).
    return res.json({
      updated: 0,
      relayed: false,
      message:
        'FIGMA_WRITE_ENDPOINT is not configured; returning the prepared update map. ' +
        'The Figma REST API is read-only for file content — apply these via the Plugin API.',
      updates,
    });
  }

  try {
    const r = await fetch(process.env.FIGMA_WRITE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileKey: config.fileKey, updates }),
    });
    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({ error: `Write endpoint failed: ${text}` });
    }
    res.json({ updated: Object.keys(updates).length, relayed: true });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

/* Serve the production build when present (npm run build && npm start). */
const dist = join(__dirname, 'dist');
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(join(dist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`project-plan-app server listening on http://localhost:${PORT}`);
  console.log(`Figma file: ${config.fileKey} (${Object.keys(config.nodes).length} mapped nodes)`);
});
