'use strict';

const {contextBridge, ipcRenderer} = require('electron');

const CHANNELS = require('../shared/ipc-channels.cjs');

function subscribe(channel, callback) {
  const listener = (_event, value) => callback(value);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

contextBridge.exposeInMainWorld('desktop', {
  platform: process.platform,
  onAction: callback => subscribe(CHANNELS.ACTION, callback),
  onContrast: callback => subscribe(CHANNELS.SYSTEM_CONTRAST, callback),
  copyAppointmentDetails: text => ipcRenderer.invoke(CHANNELS.COPY_APPOINTMENT_DETAILS, text),
  contextMenu: () => ipcRenderer.send(CHANNELS.CONTEXT_MENU),
});
