const os=require('node:os');
const {_electron:electron,expect}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const evidence=process.env.CLIPBOARD_TEST_OUTPUT||fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'careconnect-clipboard-evidence-'));
 fs.mkdirSync(evidence,{recursive:true});console.log('Evidence: '+evidence);
 const profile=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'careconnect-clipboard-profile-'));
 const app=await electron.launch({args:[path.join(__dirname,'..'),`--user-data-dir=${profile}`],env:{...process.env,ELECTRON_RUN_AS_NODE:undefined}});
 const page=await app.firstWindow();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  assert.equal(await app.evaluate(({app})=>app.getPath('userData')),profile);
  await app.evaluate(({clipboard})=>{global.savedClipboard=clipboard.availableFormats().map(format=>[format,clipboard.readBuffer(format)]);});
  await page.getByRole('button',{name:'Open sample workspace',exact:true}).click();
  await page.getByRole('button',{name:/Appointments/}).first().click();
  await page.getByRole('heading',{name:'Appointments',exact:true}).waitFor();
  await app.evaluate(({Menu})=>{const original=Menu.buildFromTemplate;Menu.buildFromTemplate=function(template){const menu=original.call(Menu,template);global.copyTestMenu=menu;return menu;};});
  async function copy(){
   await page.getByRole('button',{name:'More actions',exact:true}).click();
   await expect.poll(()=>app.evaluate(()=>!!global.copyTestMenu)).toBe(true);
   await app.evaluate(()=>{const menu=global.copyTestMenu;global.copyTestMenu=null;menu.closePopup();menu.items.find(i=>i.label==='Copy appointment details').click();});
  }
  await copy();
  await expect.poll(()=>page.locator('[role="alert"], [role="status"]').allTextContents()).toContain(process.env.BASELINE?'Could not copy. Select and copy the details instead.':'Appointment details copied.');
  const outcome=await page.locator('[role="alert"], [role="status"]').allTextContents();
  console.log(JSON.stringify({phase:process.env.BASELINE?'before':'after',url:page.url(),title:await page.title(),outcome,errors}));
  await page.screenshot({path:path.join(evidence,process.env.BASELINE?'before.png':'after.png')});
  if(!process.env.BASELINE){
   assert.equal(await app.evaluate(({clipboard})=>clipboard.readText()),'Physical therapy | 2026-10-01 15:30 | Northside Clinic');
   await page.getByRole('button',{name:/Care check-in/}).click();await copy();
   await expect.poll(()=>app.evaluate(({clipboard})=>clipboard.readText())).toBe('Care check-in | 2026-10-05 10:00 | Video visit');
   console.log('PASS actual clipboard matches the second selected appointment');
   // A native failure must show an error; a later success must remove it.
   await app.evaluate(({clipboard})=>{global.originalWrite=clipboard.writeText;clipboard.writeText=()=>{throw new Error('Test clipboard failure');};});
   await copy();await expect(page.getByRole('alert')).toHaveText('Could not copy. Select and copy the details instead.');
   await expect(page.getByRole('status')).toHaveText('Copy failed. Try again.');
   await app.evaluate(({clipboard})=>{clipboard.writeText=global.originalWrite;});
   await copy();await expect(page.getByRole('status')).toHaveText('Appointment details copied.');
   await expect(page.getByRole('alert')).toHaveCount(0);
   console.log('PASS native failure and retry clear stale error and status');
   const validation=await page.evaluate(async()=>{const results=[];for(const value of [null,'','x'.repeat(100001)]){try{await window.desktop.copyAppointmentDetails(value);results.push(false);}catch{results.push(true);}}return results;});
   assert.deepEqual(validation,[true,true,true]);console.log('PASS invalid clipboard payloads rejected');
   assert.equal(await app.evaluate(({clipboard})=>clipboard.readText()),'Care check-in | 2026-10-05 10:00 | Video visit');
   await page.screenshot({path:path.join(evidence,'after.png')});
  }
  assert.deepEqual(errors,[]);
 }finally{
  await app.evaluate(({clipboard})=>{if(global.originalWrite)clipboard.writeText=global.originalWrite;if(global.savedClipboard){clipboard.clear();for(const [format,data] of global.savedClipboard)clipboard.writeBuffer(format,data);}});
  await app.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
