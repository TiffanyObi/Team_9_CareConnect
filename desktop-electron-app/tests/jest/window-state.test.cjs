/** @jest-environment node */
const { EventEmitter } = require("node:events");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  normalizeWindowState,
  createWindowStateStore,
} = require("../../src/main/window-state.js");
const displays = [
  { workArea: { x: 0, y: 0, width: 1920, height: 1080 } },
  { workArea: { x: 1920, y: 0, width: 1280, height: 1024 } },
];
let directory;
beforeEach(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), "careconnect-jest-state-"));
});
afterEach(() => {
  jest.useRealTimers();
  fs.rmSync(directory, { recursive: true, force: true });
});
function store() {
  return createWindowStateStore({
    app: { getPath: () => directory },
    screen: { getAllDisplays: () => displays },
  });
}
function window() {
  const w = new EventEmitter();
  w.isDestroyed = () => false;
  w.getNormalBounds = () => ({ x: 50, y: 70, width: 1100, height: 700 });
  w.isMaximized = () => true;
  return w;
}
test.each([
  [null, displays, { width: 1440, height: 940, maximized: false }],
  [
    { x: 2100, y: 80, width: 1000, height: 800, maximized: true },
    displays,
    { x: 2100, y: 80, width: 1000, height: 800, maximized: true },
  ],
  [
    { x: 9000, y: 9000, width: 1000, height: 800 },
    displays,
    { width: 1000, height: 800, maximized: false },
  ],
  [
    { x: -100, y: -20, width: 9999, height: 9999 },
    displays,
    { x: 0, y: 0, width: 1920, height: 1080, maximized: false },
  ],
  [
    { width: 1, height: 1 },
    displays,
    { width: 800, height: 600, maximized: false },
  ],
  [
    { width: NaN, height: Infinity },
    [],
    { width: 1440, height: 940, maximized: false },
  ],
])("normalizes saved bounds %j", (value, screens, expected) => {
  expect(normalizeWindowState(value, screens)).toEqual(expected);
});
test("saves, reads and disposes window state; corrupt file falls back", () => {
  const s = store();
  const w = window();
  const stop = s.track(w);
  w.emit("close");
  expect(store().initialState).toEqual({
    ...w.getNormalBounds(),
    maximized: true,
  });
  stop();
  expect(w.listenerCount("close")).toBe(0);
  fs.writeFileSync(s.filePath, "broken");
  expect(store().initialState.width).toBe(1440);
});
test("debounces movement, skips destroyed windows, and handles write failure", () => {
  jest.useFakeTimers();
  const s = store(),
    w = window();
  const stop = s.track(w);
  w.emit("resize");
  w.emit("move");
  jest.advanceTimersByTime(201);
  expect(fs.existsSync(s.filePath)).toBe(true);
  const write = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {
    throw Error("Disk full");
  });
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  w.emit("maximize");
  jest.advanceTimersByTime(201);
  expect(error).toHaveBeenCalled();
  write.mockRestore();
  error.mockRestore();
  w.isDestroyed = () => true;
  w.emit("close");
  stop();
});
