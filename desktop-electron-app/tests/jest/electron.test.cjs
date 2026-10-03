/** @jest-environment node */
const { EventEmitter } = require("node:events");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
let mockElectron, mockWindows, mockMenus, mockState;
jest.mock("electron", () => mockElectron, { virtual: true });
jest.mock("../../src/main/window-state.js", () => ({
  MINIMUM_BOUNDS: { width: 800, height: 600 },
  createWindowStateStore: () => mockState,
}));
const CHANNELS = require("../../src/shared/ipc-channels.cjs");
const url = pathToFileURL(path.resolve(__dirname, "../../index.html")).href;
beforeEach(async () => {
  jest.resetModules();
  mockWindows = [];
  mockMenus = [];
  mockState = {
    initialState: { width: 1200, height: 800, maximized: true },
    track: jest.fn(() => jest.fn()),
  };
  const app = new EventEmitter();
  app.whenReady = () => Promise.resolve();
  app.quit = jest.fn();
  class Window extends EventEmitter {
    constructor(options) {
      super();
      this.options = options;
      this.webContents = new EventEmitter();
      Object.assign(this.webContents, {
        send: jest.fn(),
        getURL: () => url,
        mainFrame: {},
        setWindowOpenHandler: jest.fn(),
        session: { setPermissionRequestHandler: jest.fn() },
      });
      this.maximize = jest.fn();
      this.loadFile = jest.fn();
      this.isDestroyed = () => false;
      mockWindows.push(this);
    }
    static getAllWindows() {
      return mockWindows.filter((w) => !w.closed);
    }
  }
  const theme = new EventEmitter();
  theme.shouldUseHighContrastColors = true;
  mockElectron = {
    app,
    BrowserWindow: Window,
    Menu: {
      setApplicationMenu: jest.fn(),
      buildFromTemplate: jest.fn((template) => {
        const menu = { template, popup: jest.fn() };
        mockMenus.push(menu);
        return menu;
      }),
    },
    clipboard: { writeText: jest.fn() },
    dialog: { showMessageBoxSync: jest.fn(() => 0) },
    ipcMain: new EventEmitter(),
    nativeTheme: theme,
    screen: {},
  };
  mockElectron.ipcMain.handle = jest.fn();
  require("../../src/main/main.js");
  await Promise.resolve();
});
function event() {
  return {
    sender: mockWindows[0].webContents,
    senderFrame: mockWindows[0].webContents.mainFrame,
  };
}
function copy() {
  return mockElectron.ipcMain.handle.mock.calls[0][1];
}
test("secure window, load contrast, native actions and permissions", () => {
  const w = mockWindows[0];
  expect(w.options.webPreferences).toMatchObject({
    sandbox: true,
    contextIsolation: true,
    nodeIntegration: false,
  });
  expect(w.maximize).toHaveBeenCalled();
  expect(w.loadFile).toHaveBeenCalled();
  expect(w.webContents.setWindowOpenHandler.mock.calls[0][0]()).toEqual({
    action: "deny",
  });
  const prevent = jest.fn();
  w.webContents.emit("will-navigate", { preventDefault: prevent });
  expect(prevent).toHaveBeenCalled();
  const callback = jest.fn();
  w.webContents.session.setPermissionRequestHandler.mock.calls[0][0](
    null,
    null,
    callback,
  );
  expect(callback).toHaveBeenCalledWith(false);
  w.webContents.emit("did-finish-load");
  expect(w.webContents.send).toHaveBeenCalledWith(
    CHANNELS.SYSTEM_CONTRAST,
    true,
  );
  mockElectron.nativeTheme.emit("updated");
  const file = mockMenus[0].template.find((x) => x.label === "&File");
  file.submenu[0].click();
  expect(w.webContents.send).toHaveBeenCalledWith(CHANNELS.ACTION, "new");
});
test("IPC permits trusted frame, rejects bad payloads and spoofed senders", () => {
  copy()(event(), "Visit");
  expect(mockElectron.clipboard.writeText).toHaveBeenCalledWith("Visit");
  for (const value of [null, "", "x".repeat(100001), 42])
    expect(() => copy()(event(), value)).toThrow("Invalid");
  expect(() => copy()({ sender: {} }, "Visit")).toThrow("Untrusted");
  expect(() => copy()({ ...event(), senderFrame: {} }, "Visit")).toThrow(
    "Untrusted",
  );
  mockWindows[0].webContents.getURL = () => "https://evil.example";
  expect(() => copy()(event(), "Visit")).toThrow("Untrusted");
});
test("context IPC, close choices, activate and destroyed-window guard", () => {
  mockElectron.ipcMain.emit(CHANNELS.CONTEXT_MENU, { sender: {} });
  expect(mockMenus).toHaveLength(1);
  mockElectron.ipcMain.emit(CHANNELS.CONTEXT_MENU, event());
  expect(mockMenus[1].popup).toHaveBeenCalled();
  mockMenus[1].template.forEach((x) => x.click());
  const prevent = jest.fn();
  mockWindows[0].webContents.emit("will-prevent-unload", {
    preventDefault: prevent,
  });
  expect(prevent).not.toHaveBeenCalled();
  mockElectron.dialog.showMessageBoxSync.mockReturnValue(1);
  mockWindows[0].webContents.emit("will-prevent-unload", {
    preventDefault: prevent,
  });
  expect(prevent).toHaveBeenCalled();
  mockWindows[0].isDestroyed = () => true;
  mockElectron.nativeTheme.emit("updated");
  mockMenus[0].template.find((x) => x.label === "&Help").submenu[0].click();
  mockWindows[0].closed = true;
  mockWindows[0].emit("closed");
  mockElectron.app.emit("activate");
  expect(mockWindows).toHaveLength(2);
  mockElectron.app.emit("window-all-closed");
});
test("preload exposes narrow invoke/send and removable subscriptions", () => {
  const ipc = new EventEmitter();
  ipc.invoke = jest.fn(() => Promise.resolve());
  ipc.send = jest.fn();
  const contextBridge = { exposeInMainWorld: jest.fn() };
  mockElectron.ipcRenderer = ipc;
  mockElectron.contextBridge = contextBridge;
  require("../../src/preload/preload.js");
  const bridge = contextBridge.exposeInMainWorld.mock.calls[0][1];
  expect(contextBridge.exposeInMainWorld.mock.calls[0][0]).toBe("desktop");
  const fn = jest.fn();
  const off = bridge.onAction(fn);
  ipc.emit(CHANNELS.ACTION, {}, "settings");
  expect(fn).toHaveBeenCalledWith("settings");
  off();
  expect(ipc.listenerCount(CHANNELS.ACTION)).toBe(0);
  const stop = bridge.onContrast(fn);
  ipc.emit(CHANNELS.SYSTEM_CONTRAST, {}, true);
  expect(fn).toHaveBeenCalledWith(true);
  stop();
  bridge.contextMenu();
  bridge.copyAppointmentDetails("Visit");
  expect(ipc.invoke).toHaveBeenCalledWith(
    CHANNELS.COPY_APPOINTMENT_DETAILS,
    "Visit",
  );
  expect(ipc.send).toHaveBeenCalledWith(CHANNELS.CONTEXT_MENU);
});
