import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createWorker } from './pwa-worker.mjs';

async function filesAt(root, prefix = '') {
  const entries = await readdir(resolve(root, prefix), { withFileTypes: true });
  const groups = await Promise.all(entries.map((entry) => {
    const name = `${prefix}${entry.name}`;
    return entry.isDirectory() ? filesAt(root, `${name}/`) : [name];
  }));
  return groups.flat();
}

export function careconnectPwa() {
  let config;
  return {
    name: 'careconnect-static-shell',
    apply: 'build',
    configResolved(resolved) { config = resolved; },
    async closeBundle() {
      const out = resolve(config.root, config.build.outDir);
      const files = (await filesAt(out)).filter((name) => name !== 'sw.js' && !name.endsWith('.map')).sort();
      const hash = createHash('sha256');
      for (const file of files) { hash.update(file); hash.update(await readFile(resolve(out, file))); }
      await writeFile(resolve(out, 'sw.js'), createWorker({
        version: hash.digest('hex').slice(0, 16),
        assets: files,
      }));
    },
  };
}
