const {_electron:electron,expect}=require('@playwright/test');
const fs=require('node:fs');const path=require('node:path');const os=require('node:os');
(async()=>{
 const root=path.resolve(__dirname,'..');const output=process.argv[2];if(!output)throw Error('Pass an absolute screenshot output path.');
 const report=path.join(root,'coverage','lcov-report','index.html');if(!fs.existsSync(report))throw Error('Run npm test -- --coverage first.');
 const profile=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'careconnect-coverage-profile-'));
 const app=await electron.launch({args:[root,`--user-data-dir=${profile}`],env:{...process.env,ELECTRON_RUN_AS_NODE:undefined}});
 try{
  await app.firstWindow();const pending=app.waitForEvent('window');
  await app.evaluate(async({BrowserWindow},report)=>{global.coverageWindow=new BrowserWindow({width:1400,height:1000,webPreferences:{contextIsolation:true,sandbox:true,nodeIntegration:false}});await global.coverageWindow.loadFile(report);},report);
  const page=await pending;await expect(page.getByRole('heading',{name:'All files',exact:true})).toBeVisible();
  fs.mkdirSync(path.dirname(output),{recursive:true});await page.screenshot({path:output,fullPage:true});console.log('Coverage screenshot: '+output);
 }finally{await app.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
