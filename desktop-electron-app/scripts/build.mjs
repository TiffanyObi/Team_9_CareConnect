import path from 'node:path';
import {fileURLToPath} from 'node:url';

import {build} from 'esbuild';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dependency = name => path.join(appRoot, 'node_modules', name);

await Promise.all([
  build({
    entryPoints: [path.join(appRoot, 'src', 'renderer', 'main.jsx')],
    bundle: true,
    minify: true,
    outfile: path.join(appRoot, 'dist', 'renderer.js'),
    platform: 'browser',
    jsx: 'automatic',
    target: ['chrome140'],
    alias: {
      react: dependency('react'),
      'react-dom': dependency('react-dom'),
      scheduler: dependency('scheduler'),
    },
    logLevel: 'info',
  }),
  build({
    entryPoints: [path.join(appRoot, 'src', 'preload', 'preload.js')],
    bundle: true,
    minify: true,
    outfile: path.join(appRoot, 'dist', 'preload.cjs'),
    platform: 'node',
    target: ['node22'],
    external: ['electron'],
    logLevel: 'info',
  }),
]);
