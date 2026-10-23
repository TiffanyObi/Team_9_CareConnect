import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { isUpcomingAppointment, sortAppointments } from '../src/utils/dateTime.js';
import { createWorker } from '../scripts/pwa-worker.mjs';
import { careconnectPwa } from '../scripts/pwa-build.mjs';

test('later-today visits stay upcoming while past and invalid visits do not', () => {
  const now = new Date('2026-10-22T12:00:00');
  assert.equal(isUpcomingAppointment({ date: '2026-10-22', time: '15:30' }, now), true);
  assert.equal(isUpcomingAppointment({ date: '2026-10-22', time: '09:00' }, now), false);
  assert.equal(isUpcomingAppointment({ date: '2026-10-22', time: '12:00' }, now), false);
  assert.equal(isUpcomingAppointment({ date: '2026-10-23', time: '09:00' }, now), true);
  assert.equal(isUpcomingAppointment({ date: 'bad', time: '09:00' }, now), false);
});

test('sorting visits leaves the input unchanged', () => {
  const late = { date: '2026-10-23', time: '09:00' }, early = { date: '2026-10-22', time: '09:00' };
  const list = [late, early];
  assert.deepEqual(sortAppointments(list), [early, late]);
  assert.equal(list[0], late);
});

function workerHarness({ failInstall = false } = {}) {
  const listeners = {}, deleted = [], fetched = [], cached = [];
  let skipped = false, claimed = false;
  const cache = { addAll: async (requests) => { if (failInstall) throw Error('offline'); cached.push(...requests); }, match: async (key) => key === '/index.html' ? 'STATIC SHELL' : 'STATIC CHUNK' };
  const self = { location: { origin: 'https://demo.test' }, clients: { claim: async () => { claimed = true; } }, skipWaiting: () => { skipped = true; }, addEventListener: (name, handler) => { listeners[name] = handler; } };
  const caches = { open: async () => cache, keys: async () => ['careconnect-shell:/:old', 'careconnect-shell:/:new', 'another-app'], delete: async (key) => { deleted.push(key); } };
  vm.runInNewContext(createWorker({ version: 'new', assets: ['/index.html', '/assets/page.js'] }), { self, caches, URL, Request, fetch: async (request) => { fetched.push(request); return 'NETWORK'; } });
  return { listeners, deleted, fetched, cached, get skipped() { return skipped; }, get claimed() { return claimed; } };
}

test('worker installation precaches the full static shell', async () => {
  const h = workerHarness(); let work;
  h.listeners.install({ waitUntil(promise) { work = promise; } }); await work;
  assert.equal(h.cached.length, 2);
  assert.equal(h.cached[0].cache, 'reload');
});

test('failed worker install removes its partial cache and fails the install', async () => {
  const h = workerHarness({ failInstall: true }); let work;
  h.listeners.install({ waitUntil(promise) { work = promise; } });
  await assert.rejects(work, /offline/);
  assert.deepEqual(h.deleted, ['careconnect-shell:/:new']);
});

test('worker activation removes only its own older cache', async () => {
  const h = workerHarness(); let work;
  h.listeners.activate({ waitUntil(promise) { work = promise; } }); await work;
  assert.deepEqual(h.deleted, ['careconnect-shell:/:old']); assert.equal(h.claimed, true);
});

test('nested offline navigations use the static shell without caching private responses', async () => {
  const h = workerHarness(); let response;
  h.listeners.fetch({ request: { url: 'https://demo.test/care/health-log', method: 'GET', mode: 'navigate' }, respondWith(promise) { response = promise; } });
  assert.equal(await response, 'STATIC SHELL'); assert.equal(h.fetched.length, 0);
  assert.equal(h.cached.length, 0);
});

test('worker ignores APIs, query requests, other origins, and writes', () => {
  const h = workerHarness();
  for (const request of [
    { url: 'https://demo.test/api/records', method: 'GET' },
    { url: 'https://demo.test/assets/page.js?patient=demo', method: 'GET' },
    { url: 'https://other.test/assets/page.js', method: 'GET' },
    { url: 'https://demo.test/assets/page.js', method: 'POST' },
  ]) h.listeners.fetch({ request, respondWith() { assert.fail('Private or unrelated request was intercepted'); } });
});

test('worker serves cached lazy chunks and waits for an explicit update action', async () => {
  const h = workerHarness(); let response;
  h.listeners.fetch({ request: { url: 'https://demo.test/assets/page.js', method: 'GET' }, respondWith(promise) { response = promise; } });
  assert.equal(await response, 'STATIC CHUNK'); assert.equal(h.skipped, false);
  h.listeners.message({ data: { type: 'OTHER' } }); assert.equal(h.skipped, false);
  h.listeners.message({ data: { type: 'APPLY_UPDATE' } }); assert.equal(h.skipped, true);
});

test('production worker includes lazy chunks and public icons and changes with the build', async () => {
  const root = await mkdtemp(join(tmpdir(), 'careconnect-build-test-'));
  try {
    await mkdir(join(root, 'dist/assets'), { recursive: true });
    await mkdir(join(root, 'dist/icons'), { recursive: true });
    await writeFile(join(root, 'dist/index.html'), '<div>shell</div>');
    await writeFile(join(root, 'dist/assets/page.js'), 'route code');
    await writeFile(join(root, 'dist/icons/icon.png'), 'image');
    const plugin = careconnectPwa(); plugin.configResolved({ root, base: '/', build: { outDir: 'dist' } });
    await plugin.closeBundle(); const initial = await readFile(join(root, 'dist/sw.js'), 'utf8');
    assert.match(initial, /\/assets\/page.js/); assert.match(initial, /\/icons\/icon.png/);
    await writeFile(join(root, 'dist/assets/page.js'), 'new route code');
    await plugin.closeBundle(); assert.notEqual(await readFile(join(root, 'dist/sw.js'), 'utf8'), initial);
  } finally { await rm(root, { recursive: true, force: true }); }
});
