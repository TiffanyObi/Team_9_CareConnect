'use strict';

const {app, BrowserWindow, Menu, clipboard, dialog, ipcMain, nativeTheme, screen} = require('electron');
const path = require('node:path');
const {pathToFileURL} = require('node:url');

const CHANNELS = require('../shared/ipc-channels.cjs');
const {createMenuTemplate} = require('./menu.js');
const {MINIMUM_BOUNDS, createWindowStateStore} = require('./window-state.js');

const appRoot = path.resolve(__dirname, '..', '..');
const indexPath = path.join(appRoot, 'index.html');
const trustedRendererUrl = pathToFileURL(indexPath).href;

let mainWindow;
let stopTrackingWindow;

function sendAction(action) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(CHANNELS.ACTION, action);
  }
}

function isTrustedRenderer(event) {
  return event.sender === mainWindow?.webContents &&
    event.sender.getURL() === trustedRendererUrl;
}

function isTrustedMainFrame(event) {
  return isTrustedRenderer(event) && event.senderFrame === mainWindow.webContents.mainFrame;
}

function registerIpcHandlers() {
  ipcMain.handle(CHANNELS.COPY_APPOINTMENT_DETAILS, (event, text) => {
    if (!isTrustedMainFrame(event)) throw new Error('Untrusted clipboard request.');
    if (typeof text !== 'string' || text.length === 0 || text.length > 100000) {
      throw new Error('Invalid appointment details.');
    }
    clipboard.writeText(text);
  });

  ipcMain.on(CHANNELS.CONTEXT_MENU, event => {
    if (!isTrustedRenderer(event)) return;
    Menu.buildFromTemplate([
      {label: 'View appointment', click: () => sendAction('open-selected')},
      {label: 'Copy appointment details', click: () => sendAction('copy-selected')},
    ]).popup({window: mainWindow});
  });
}

function configureWindowSecurity(window) {
  window.webContents.setWindowOpenHandler(() => ({action: 'deny'}));
  window.webContents.on('will-navigate', event => event.preventDefault());
  window.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
}

function createWindow() {
  const stateStore = createWindowStateStore({app, screen});
  const {maximized, ...bounds} = stateStore.initialState;
  mainWindow = new BrowserWindow({
    ...bounds,
    minWidth: MINIMUM_BOUNDS.width,
    minHeight: MINIMUM_BOUNDS.height,
    title: 'CareConnect Safeview',
    backgroundColor: '#f7fafc',
    webPreferences: {
      preload: path.join(appRoot, 'dist', 'preload.cjs'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });

  configureWindowSecurity(mainWindow);
  stopTrackingWindow = stateStore.track(mainWindow);
  if (maximized) mainWindow.maximize();

  mainWindow.webContents.on('will-prevent-unload', event => {
    const choice = dialog.showMessageBoxSync(mainWindow, {
      type: 'question',
      buttons: ['Keep editing', 'Discard changes'],
      defaultId: 0,
      cancelId: 0,
      message: 'You have unsaved changes.',
      detail: 'Keep editing to save your work, or discard changes to close.',
    });
    if (choice === 1) event.preventDefault();
  });
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send(CHANNELS.SYSTEM_CONTRAST, nativeTheme.shouldUseHighContrastColors);
  });
  mainWindow.on('closed', () => {
    stopTrackingWindow?.();
    stopTrackingWindow = undefined;
    mainWindow = undefined;
  });
  mainWindow.loadFile(indexPath);
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(createMenuTemplate(sendAction)));
  registerIpcHandlers();
  nativeTheme.on('updated', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send(CHANNELS.SYSTEM_CONTRAST, nativeTheme.shouldUseHighContrastColors);
    }
  });
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
