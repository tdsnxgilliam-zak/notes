# Status update app template

Reusable React template for project status decks, matched to the Figma
file in `config.json`. Copy this folder per project, `npm install`, edit
`config.json`, and run — everything on every slide is editable inline in
the browser and persists to localStorage.

## Run it

```powershell
npm install --strict-ssl=false --ignore-scripts   # see caveats below
npm run build                                     # pure-Node Babel build → dist/
npm start                                         # http://localhost:3001
```

Rebuild after any source change (`npm run build`).

## Slides (all fields directly editable)

- **Title** — brand, classification, hero title/subtitle, meta fields
  (edit / remove / reorder with ‹ ›, add new fields).
- **Overview** — Goal & Objective items with 3 importance tiers
  (typographic weight), In/Out-of-scope lists (add via type-picker modal),
  stakeholder contact cards (shared owner pool), date-ordered timeline
  (DATE + ONE-WORD TAG + SHORT DESC). Cards resize with content.
- **Week N** (`+ Week` adds more) — clickable goal cards with desc,
  status, importance, and contact chips; task/deliverable checkboxes with
  optional owners. Goal and week progress % is derived from linked tasks.
- **DRAFT badge** — click to toggle; color comes from
  `config.json → defaults.statusColor`.

## Figma sync

`Push to Figma` POSTs the document to `server.js`, which maps content onto
the node IDs in `config.json`. The Figma REST API is read-only for file
content, so writes are relayed to `FIGMA_WRITE_ENDPOINT` when configured
(e.g. a plugin bridge); otherwise the server returns the prepared
`{ nodeId: text }` update map. Read endpoints need `FIGMA_TOKEN`.

## Environment / Rights Verification (2026-09-18)

This machine **can host a basic JS app**, and this user **can install and run external packages through npm**.

| Check | Result |
|---|---|
| Node.js | ✅ v26.9.0 — `C:\Program Files\nodejs` |
| npm | ✅ v11.19.1 |
| Run JS app | ✅ `node app.js` executed successfully |
| Install external package | ✅ `npm install cowsay` (41 packages) from registry.npmjs.org |
| Network to npm registry | ✅ Port 443 reachable |

### Caveats

**Corporate TLS interception** — default `npm install` fails with `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` because a corporate proxy intercepts HTTPS and Node does not trust its cert. Workarounds:

1. **Quick:** `npm install <pkg> --strict-ssl=false`, or persist with `npm config set strict-ssl false` (disables cert verification).
2. **Proper (recommended):** `npm config set cafile "C:\path\to\corp-root-ca.pem"` — keeps cert verification on.

**Blocked child processes** — corporate job-object policy kills any native
binary Node spawns (`AssignProcessToJobObject: (6) The handle is invalid`),
which means **Vite/esbuild cannot run** (dev server or build). This template
therefore builds with `scripts/build.mjs` — pure-Node Babel transpile +
native ES modules + import map, no child processes. Always install with
`--ignore-scripts` (esbuild's install script is also blocked). The Vite
config stays in place for machines without this restriction.

**PowerShell execution policy** — npm's `.ps1` shims are blocked (`PSSecurityException`). Use `npm.cmd` / run npm through `cmd`, or set `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`.
