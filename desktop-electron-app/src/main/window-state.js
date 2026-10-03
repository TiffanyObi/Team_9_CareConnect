'use strict';

const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_BOUNDS = Object.freeze({width: 1440, height: 940});
const MINIMUM_BOUNDS = Object.freeze({width: 800, height: 600});
const SAVE_DELAY_MS = 200;

function finiteInteger(value) {
  return Number.isFinite(value) ? Math.round(value) : undefined;
}

function intersectionArea(first, second) {
  const width = Math.max(0, Math.min(first.x + first.width, second.x + second.width) - Math.max(first.x, second.x));
  const height = Math.max(0, Math.min(first.y + first.height, second.y + second.height) - Math.max(first.y, second.y));
  return width * height;
}

function normalizeWindowState(value, displays) {
  const state = value && typeof value === 'object' ? value : {};
  const availableDisplays = Array.isArray(displays) && displays.length ? displays : [];
  const primaryArea = availableDisplays[0]?.workArea ?? {
    x: 0,
    y: 0,
    width: DEFAULT_BOUNDS.width,
    height: DEFAULT_BOUNDS.height,
  };
  const requested = {
    x: finiteInteger(state.x),
    y: finiteInteger(state.y),
    width: Math.max(MINIMUM_BOUNDS.width, finiteInteger(state.width) ?? DEFAULT_BOUNDS.width),
    height: Math.max(MINIMUM_BOUNDS.height, finiteInteger(state.height) ?? DEFAULT_BOUNDS.height),
  };
  const requestedWithPosition = requested.x !== undefined && requested.y !== undefined;
  const targetDisplay = requestedWithPosition
    ? availableDisplays
        .map(display => ({display, area: intersectionArea(requested, display.workArea)}))
        .sort((left, right) => right.area - left.area)[0]
    : undefined;
  const workArea = targetDisplay?.area > 0 ? targetDisplay.display.workArea : primaryArea;
  const width = Math.min(requested.width, workArea.width);
  const height = Math.min(requested.height, workArea.height);
  const normalized = {
    width,
    height,
    maximized: state.maximized === true,
  };

  if (requestedWithPosition && targetDisplay?.area > 0) {
    normalized.x = Math.min(Math.max(requested.x, workArea.x), workArea.x + workArea.width - width);
    normalized.y = Math.min(Math.max(requested.y, workArea.y), workArea.y + workArea.height - height);
  }

  return normalized;
}

function readState(filePath, displays) {
  try {
    return normalizeWindowState(JSON.parse(fs.readFileSync(filePath, 'utf8')), displays);
  } catch {
    return normalizeWindowState(null, displays);
  }
}

function writeState(filePath, state) {
  const directory = path.dirname(filePath);
  const temporaryPath = `${filePath}.tmp`;
  fs.mkdirSync(directory, {recursive: true});
  fs.writeFileSync(temporaryPath, `${JSON.stringify(state, null, 2)}\n`, {encoding: 'utf8', mode: 0o600});
  fs.renameSync(temporaryPath, filePath);
}

function createWindowStateStore({app, screen}) {
  const filePath = path.join(app.getPath('userData'), 'careconnect', 'window-state.json');
  const displays = screen.getAllDisplays();
  const initialState = readState(filePath, displays);

  function track(window) {
    let timer;
    let disposed = false;

    const save = () => {
      if (disposed || window.isDestroyed()) return;
      const bounds = window.getNormalBounds();
      try {
        writeState(filePath, {
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
          maximized: window.isMaximized(),
        });
      } catch (error) {
        console.error('Unable to save window state.', error);
      }
    };
    const scheduleSave = () => {
      clearTimeout(timer);
      timer = setTimeout(save, SAVE_DELAY_MS);
    };

    window.on('resize', scheduleSave);
    window.on('move', scheduleSave);
    window.on('maximize', scheduleSave);
    window.on('unmaximize', scheduleSave);
    window.on('close', save);

    return () => {
      clearTimeout(timer);
      disposed = true;
      window.removeListener('resize', scheduleSave);
      window.removeListener('move', scheduleSave);
      window.removeListener('maximize', scheduleSave);
      window.removeListener('unmaximize', scheduleSave);
      window.removeListener('close', save);
    };
  }

  return {filePath, initialState, track};
}

module.exports = {
  DEFAULT_BOUNDS,
  MINIMUM_BOUNDS,
  createWindowStateStore,
  normalizeWindowState,
};
