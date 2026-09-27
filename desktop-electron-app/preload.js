const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('desktop',{
 platform:process.platform,
 onAction:callback=>{const listener=(_event,value)=>callback(value);ipcRenderer.on('action',listener);return()=>ipcRenderer.removeListener('action',listener);},
 onContrast:callback=>{const listener=(_event,value)=>callback(value);ipcRenderer.on('contrast',listener);return()=>ipcRenderer.removeListener('contrast',listener);},
 copyAppointmentDetails:text=>ipcRenderer.invoke('copy-appointment-details',text),
 contextMenu:()=>ipcRenderer.send('context-menu')
});
