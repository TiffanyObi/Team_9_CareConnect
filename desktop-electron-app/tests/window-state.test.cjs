'use strict';

const assert = require('node:assert/strict');
const {EventEmitter} = require('node:events');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  DEFAULT_BOUNDS,
  MINIMUM_BOUNDS,
  createWindowStateStore,
  normalizeWindowState,
} = require('../src/main/window-state.js');

const displays = [
  {workArea: {x: 0, y: 0, width: 1920, height: 1080}},
  {workArea: {x: 1920, y: 0, width: 1280, height: 1024}},
];

test('uses safe defaults when no state exists', () => {
  assert.deepEqual(normalizeWindowState(null, displays), {
    width: DEFAULT_BOUNDS.width,
    height: DEFAULT_BOUNDS.height,
    maximized: false,
  });
});

test('restores a visible saved position and maximized state', () => {
  assert.deepEqual(
    normalizeWindowState({x: 2100, y: 80, width: 1000, height: 800, maximized: true}, displays),
    {x: 2100, y: 80, width: 1000, height: 800, maximized: true},
  );
});

test('moves an off-screen window back to the primary display', () => {
  assert.deepEqual(
    normalizeWindowState({x: 9000, y: 9000, width: 1200, height: 800}, displays),
    {width: 1200, height: 800, maximized: false},
  );
});

test('enforces minimum size and clamps oversized windows', () => {
  assert.deepEqual(
    normalizeWindowState({x: 10, y: 10, width: 200, height: 300}, displays),
    {
      x: 10,
      y: 10,
      width: MINIMUM_BOUNDS.width,
      height: MINIMUM_BOUNDS.height,
      maximized: false,
    },
  );
  assert.deepEqual(
    normalizeWindowState({width: 5000, height: 5000}, displays),
    {width: 1920, height: 1080, maximized: false},
  );
});

test('writes normal bounds and maximized state when a tracked window closes', t => {
  const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'careconnect-window-state-'));
  t.after(() => fs.rmSync(userData, {recursive: true, force: true}));
  const store = createWindowStateStore({
    app: {getPath: () => userData},
    screen: {getAllDisplays: () => displays},
  });
  const window = new EventEmitter();
  window.isDestroyed = () => false;
  window.getNormalBounds = () => ({x: 120, y: 80, width: 1280, height: 760});
  window.isMaximized = () => true;

  const stopTracking = store.track(window);
  window.emit('close');

  assert.deepEqual(JSON.parse(fs.readFileSync(store.filePath, 'utf8')), {
    x: 120,
    y: 80,
    width: 1280,
    height: 760,
    maximized: true,
  });
  stopTracking();
});
