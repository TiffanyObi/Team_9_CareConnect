import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(appRoot, 'dist');
const htmlPath = path.join(distRoot, 'index.html');
const requiredPwaFiles = ['manifest.json', 'sw.js'];

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

for (const requiredFile of requiredPwaFiles) {
  if (!fs.existsSync(path.join(distRoot, requiredFile))) {
    throw new Error(`PWA build output is missing dist/${requiredFile}.`);
  }
}

const manifest = JSON.parse(fs.readFileSync(path.join(distRoot, 'manifest.json'), 'utf8'));
for (const icon of manifest.icons || []) {
  const iconPath = path.resolve(distRoot, icon.src);
  if (!iconPath.startsWith(`${distRoot}${path.sep}`) || !fs.existsSync(iconPath)) {
    throw new Error(`Manifest icon does not exist inside dist: ${icon.src}`);
  }
}

console.log(`Verified ${assetPaths.length} relative JavaScript/CSS asset paths, the manifest, service worker, and ${manifest.icons?.length || 0} icons.`);
