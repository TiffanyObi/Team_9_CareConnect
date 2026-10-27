import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(appRoot, 'dist');
const htmlPath = path.join(distRoot, 'index.html');

if (!fs.existsSync(htmlPath)) {
  throw new Error('Build output is missing dist/index.html. Run npm run build first.');
}

const html = fs.readFileSync(htmlPath, 'utf8');
const assetPaths = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)]
  .map((match) => match[1]);

if (assetPaths.length === 0) {
  throw new Error('No JavaScript or CSS assets were found in dist/index.html.');
}

for (const assetPath of assetPaths) {
  if (path.posix.isAbsolute(assetPath) || assetPath.startsWith('../')) {
    throw new Error(`Asset path must be relative for GitHub Pages: ${assetPath}`);
  }
  const resolvedAsset = path.resolve(distRoot, assetPath);
  if (!resolvedAsset.startsWith(`${distRoot}${path.sep}`) || !fs.existsSync(resolvedAsset)) {
    throw new Error(`Build asset does not exist inside dist: ${assetPath}`);
  }
}

console.log(`Verified ${assetPaths.length} relative JavaScript/CSS asset paths.`);
