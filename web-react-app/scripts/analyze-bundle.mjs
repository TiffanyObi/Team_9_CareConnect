import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const dist = resolve(process.argv[2] || 'dist');
const html = await readFile(resolve(dist, 'index.html'), 'utf8');
const initial = [...html.matchAll(/(?:src|href)="([^"]+\.js)"/g)]
  .map((match) => match[1].replace(/^\.?\//, ''));
const chunks = [];
for (const name of (await readdir(resolve(dist, 'assets'))).filter((name) => name.endsWith('.js'))) {
  const bytes = await readFile(resolve(dist, 'assets', name));
  chunks.push({ file: `assets/${name}`, bytes: bytes.length, gzipBytes: gzipSync(bytes).length, initial: initial.includes(`assets/${name}`) });
}
const initialGzipBytes = chunks.filter((chunk) => chunk.initial).reduce((sum, chunk) => sum + chunk.gzipBytes, 0);
console.log(JSON.stringify({ dist, buildTime: (await stat(resolve(dist, 'index.html'))).mtime.toISOString(), initialGzipBytes, proposedBudgetBytes: 200 * 1024, withinProposedJsBudget: initialGzipBytes <= 200 * 1024, chunks }, null, 2));
