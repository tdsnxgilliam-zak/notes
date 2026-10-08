/**
 * figmaClient.js — browser-side Figma API wrapper.
 *
 * Talks to the local Express server (server.js), which owns the Figma
 * credentials and the node map from config.json. The Vite dev server
 * proxies /api → http://localhost:3001.
 */

/** Push the full project document to the Figma file via the server. */
export async function pushToFigma(project) {
  const res = await fetch('/api/push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `Figma sync failed (${res.status})`);
  }
  return body;
}

/** Fetch live file metadata (read path works with a plain REST token). */
export async function fetchFileMeta() {
  const res = await fetch('/api/file');
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Figma read failed (${res.status})`);
  return body;
}
