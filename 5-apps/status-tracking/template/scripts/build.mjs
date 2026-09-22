/**
 * Pure-Node production build — no native binaries, no child processes.
 *
 * Corporate policy blocks spawning native executables (esbuild, etc.), so
 * Vite cannot run on this machine. This script produces an equivalent static
 * bundle using @babel/core (pure JavaScript) plus native browser ES modules:
 *
 *   1. Transpile every src/**\/*.{js,jsx} through @babel/preset-react
 *      (automatic runtime) into dist/src/*.js
 *   2. Rewrite relative ".jsx" import specifiers to ".js" and strip CSS
 *      imports (the stylesheet is linked from the generated index.html)
 *   3. Copy React/ReactDOM UMD builds into dist/vendor and emit tiny ESM
 *      shims wired up through an import map ("react", "react-dom/client",
 *      "react/jsx-runtime")
 *   4. Write dist/index.html loading the UMD globals + import map + entry
 *
 * Output is served by server.js (`npm start` → http://localhost:3001).
 */
import { transformFileSync } from '@babel/core';
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'src');
const DIST = join(root, 'dist');
const VENDOR = join(DIST, 'vendor');

/* ---- 1 · clean ---------------------------------------------------------- */
rmSync(DIST, { recursive: true, force: true });
mkdirSync(VENDOR, { recursive: true });

/* ---- 2 · transpile src --------------------------------------------------- */
function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(jsx?|mjs)$/.test(entry)) yield full;
  }
}

let count = 0;
for (const file of walk(SRC)) {
  const out = join(DIST, 'src', relative(SRC, file)).replace(/\.jsx$/, '.js');
  mkdirSync(dirname(out), { recursive: true });

  let { code } = transformFileSync(file, {
    babelrc: false,
    configFile: false,
    presets: [['@babel/preset-react', { runtime: 'automatic', development: false }]],
    filename: file,
  });

  // Relative imports of .jsx files now point at .js outputs.
  code = code.replace(/(from\s+['"])([^'"]+)\.jsx(['"])/g, '$1$2.js$3');
  // CSS imports have no meaning in native ESM; index.html links the sheet.
  code = code.replace(/^import\s+['"][^'"]+\.css['"];?\s*$/gm, '');

  writeFileSync(out, code);
  count++;
}

/* ---- 3 · copy static assets + vendor shims ------------------------------- */
copyFileSync(join(SRC, 'styles.css'), join(DIST, 'src', 'styles.css'));

const umd = [
  ['react', 'umd/react.production.min.js'],
  ['react-dom', 'umd/react-dom.production.min.js'],
];
for (const [pkg, file] of umd) {
  const from = join(root, 'node_modules', pkg, file);
  if (!existsSync(from)) {
    console.error(`Missing UMD build: ${pkg}/${file} — run npm install first.`);
    process.exit(1);
  }
  copyFileSync(from, join(VENDOR, `${pkg}.umd.js`));
}

// ESM facades over the UMD globals, resolved by the import map below.
writeFileSync(
  join(VENDOR, 'react.js'),
  `const R = window.React;
export default R;
export const {
  useState, useEffect, useRef, useMemo, useCallback, useReducer,
  useContext, createContext, memo, Fragment, StrictMode,
} = R;
`,
);
writeFileSync(
  join(VENDOR, 'react-dom-client.js'),
  `const RD = window.ReactDOM;
export default RD;
export const createRoot = RD.createRoot.bind(RD);
`,
);
writeFileSync(
  join(VENDOR, 'jsx-runtime.js'),
  `const R = window.React;
export const Fragment = R.Fragment;
export function jsx(type, props, key) {
  return R.createElement(type, key === undefined ? props : { ...props, key });
}
export const jsxs = jsx;
`,
);

/* ---- 4 · index.html with import map -------------------------------------- */
writeFileSync(
  join(DIST, 'index.html'),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Project Plan</title>
    <link rel="stylesheet" href="/src/styles.css" />
    <script src="/vendor/react.umd.js"></script>
    <script src="/vendor/react-dom.umd.js"></script>
    <script type="importmap">
      {
        "imports": {
          "react": "/vendor/react.js",
          "react-dom/client": "/vendor/react-dom-client.js",
          "react/jsx-runtime": "/vendor/jsx-runtime.js",
          "react/jsx-dev-runtime": "/vendor/jsx-runtime.js"
        }
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
`,
);

console.log(`Built ${count} modules + ${umd.length} vendor bundles → dist/`);
