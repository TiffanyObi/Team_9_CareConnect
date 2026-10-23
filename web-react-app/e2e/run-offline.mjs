import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { runOfflineFlow } from './offline.flow.mjs';

// Uses Zach's Playwright dependency; no change to his package or runner setup.
const playwright = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const out = resolve(process.env.EVIDENCE_DIR || '/private/tmp/terence-offline-evidence');
await mkdir(out, { recursive: true });
const results = [];
for (const name of ['chromium', 'firefox', 'webkit']) {
  let browser, context;
  try {
    browser = await playwright[name].launch();
    context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, serviceWorkers: 'allow' });
    await context.tracing.start({ screenshots: true, snapshots: true });
    const page = await context.newPage();
    const result = await runOfflineFlow(page, context, baseURL);
    await page.screenshot({ path: resolve(out, `${name}-reconnected.png`), fullPage: true });
    results.push({ browser: name, ...result });
  } catch (error) {
    results.push({ browser: name, status: 'failed', error: error.message });
  } finally {
    if (context) { await context.tracing.stop({ path: resolve(out, `${name}-trace.zip`) }); await context.close(); }
    if (browser) await browser.close();
  }
}
await writeFile(resolve(out, 'offline-results.json'), JSON.stringify({ baseURL, results }, null, 2));
console.log(JSON.stringify(results, null, 2));
if (results.some((result) => result.status !== 'passed')) process.exitCode = 1;
