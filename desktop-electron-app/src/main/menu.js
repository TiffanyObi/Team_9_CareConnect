'use strict';

function createMenuTemplate(sendAction, platform = process.platform) {
  const isMac = platform === 'darwin';
  const action = (label, accelerator, command) => ({
    label,
    accelerator,
    click: () => sendAction(command),
  });

  return [
    ...(isMac
      ? [{
          role: 'appMenu',
          submenu: [
            {role: 'about'},
            {type: 'separator'},
            action('Settings…', 'CmdOrCtrl+,', 'settings'),
            {type: 'separator'},
            {role: 'services'},
            {role: 'hide'},
            {role: 'hideOthers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'},
          ],
        }]
      : []),
    {
      label: '&File',
      submenu: [
        action('New appointment…', 'CmdOrCtrl+N', 'new'),
        action('Save note', 'CmdOrCtrl+S', 'save'),
        {type: 'separator'},
        {role: 'close'},
        ...(!isMac ? [{role: 'quit'}] : []),
      ],
    },
    {
      label: '&Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'selectAll'},
        ...(!isMac
          ? [{type: 'separator'}, action('Settings…', 'CmdOrCtrl+,', 'settings')]
          : []),
      ],
    },
    {
      label: '&View',
      submenu: [
        action('Dashboard', 'CmdOrCtrl+1', 'dashboard'),
        action('Appointments', 'CmdOrCtrl+2', 'appointments'),
        action('Find appointments', 'CmdOrCtrl+F', 'find'),
        {type: 'separator'},
        {role: 'resetZoom'},
        {role: 'zoomIn'},
        {role: 'zoomOut'},
        {role: 'togglefullscreen'},
      ],
    },
    {
      label: '&Window',
      submenu: [
        {role: 'minimize'},
        {role: 'zoom'},
        ...(isMac ? [{role: 'front'}] : []),
      ],
    },
    {
      label: '&Help',
      submenu: [
        action('Keyboard shortcuts', 'F1', 'help'),
        {label: 'About this prototype', click: () => sendAction('about')},
      ],
    },
  ];
}

module.exports = {createMenuTemplate};
