const {app, BrowserWindow, Menu, ipcMain, nativeTheme, dialog, clipboard} = require('electron');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
let main;
const trusted = pathToFileURL(path.join(__dirname,'index.html')).href;
const send = action => { if(main && !main.isDestroyed()) main.webContents.send('action',action); };
function menuTemplate(mac=process.platform==='darwin') {
 const action=(label,accelerator,command)=>({label,accelerator,click:()=>send(command)});
 return [ ...(mac?[{role:'appMenu',submenu:[{role:'about'},{type:'separator'},action('Settings…','CmdOrCtrl+,','settings'),{type:'separator'},{role:'services'},{role:'hide'},{role:'hideOthers'},{role:'unhide'},{type:'separator'},{role:'quit'}]}]:[]),
 {label:'&File',submenu:[action('New appointment…','CmdOrCtrl+N','new'),action('Save note','CmdOrCtrl+S','save'),{type:'separator'},{role:'close'},...(!mac?[{role:'quit'}]:[])]},
 {label:'&Edit',submenu:[{role:'undo'},{role:'redo'},{type:'separator'},{role:'cut'},{role:'copy'},{role:'paste'},{role:'selectAll'},...(!mac?[{type:'separator'},action('Settings…','CmdOrCtrl+,','settings')]:[])]},
 {label:'&View',submenu:[action('Dashboard','CmdOrCtrl+1','dashboard'),action('Appointments','CmdOrCtrl+2','appointments'),action('Find appointments','CmdOrCtrl+F','find'),{type:'separator'},{role:'resetZoom'},{role:'zoomIn'},{role:'zoomOut'},{role:'togglefullscreen'}]},
 {label:'&Window',submenu:[{role:'minimize'},{role:'zoom'},...(mac?[{role:'front'}]:[])]},
 {label:'&Help',submenu:[action('Keyboard shortcuts','F1','help'),{label:'About this prototype',click:()=>send('about')}]}];
}
function createWindow(){
 main=new BrowserWindow({width:1440,height:940,minWidth:800,minHeight:600,title:'CareConnect Safeview',backgroundColor:'#f7fafc',webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,sandbox:true,nodeIntegration:false}});
 main.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 main.webContents.on('will-navigate',event=>event.preventDefault());
 main.webContents.session.setPermissionRequestHandler((wc,permission,cb)=>cb(false));
 main.webContents.on('will-prevent-unload',event=>{ const choice=dialog.showMessageBoxSync(main,{type:'question',buttons:['Keep editing','Discard changes'],defaultId:0,cancelId:0,message:'You have unsaved changes.',detail:'Keep editing to save your work, or discard changes to close.'}); if(choice===1)event.preventDefault(); });
 main.loadFile(path.join(__dirname,'index.html'));
 main.webContents.on('did-finish-load',()=> main.webContents.send('contrast',nativeTheme.shouldUseHighContrastColors));
}
app.whenReady().then(()=>{
 Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate()));
 ipcMain.handle('copy-appointment-details',(event,text)=>{
  if(event.sender!==main?.webContents || event.senderFrame!==main.webContents.mainFrame || event.senderFrame.url!==trusted)throw new Error('Untrusted clipboard request.');
  if(typeof text!=='string' || !text.length || text.length>100000)throw new Error('Invalid appointment details.');
  clipboard.writeText(text);
 });
 ipcMain.on('context-menu',event=>{
  if(event.sender!==main?.webContents || event.senderFrame?.url!==trusted)return;
  Menu.buildFromTemplate([{label:'View appointment',click:()=>send('open-selected')},{label:'Copy appointment details',click:()=>send('copy-selected')}]).popup({window:main});
 });
 nativeTheme.on('updated',()=>{if(main&&!main.isDestroyed())main.webContents.send('contrast',nativeTheme.shouldUseHighContrastColors);});
 createWindow();app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
