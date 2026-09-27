const os=require('node:os');
const {_electron:electron,expect}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'careconnect-auth-evidence-'));
console.log('Evidence: '+root);
const results=[];const errors=[];
const ACCOUNT='careconnect-demo-accounts-v1';
const LEGACY='careconnect-desktop-demo-v1';
const password='Demo-only-2468';
const ok=name=>{results.push({name,status:'Pass'});console.log('PASS '+name);};
(async()=>{
 const profile=fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()),'careconnect-auth-'));
 const app=await electron.launch({args:[path.resolve(__dirname,'..'),`--user-data-dir=${profile}`]});
 const actual=await app.evaluate(({app})=>app.getPath('userData'));assert.equal(actual,profile);
 const page=await app.firstWindow();page.setDefaultTimeout(8000);page.on('pageerror',e=>errors.push(e.message));
 fs.mkdirSync(path.join(root,'auth-screenshots'),{recursive:true});
 const alert=()=>page.getByRole('alert');
 async function signup(name,email){
  await page.getByRole('button',{name:'Sign up',exact:true}).click();
  await page.getByLabel('Name',{exact:true}).fill(name);
  await page.getByLabel('Email',{exact:true}).fill(email);
  await page.getByLabel('Password',{exact:true}).fill(password);
  await page.getByLabel('Confirm password',{exact:true}).fill(password);
  await page.getByRole('button',{name:'Create account',exact:true}).click();
  await page.getByRole('heading',{name:'Log in',exact:true}).waitFor();
 }
 async function login(email,pw=password){
  await page.getByLabel('Email',{exact:true}).fill(email);
  await page.getByLabel('Password',{exact:true}).fill(pw);
  await page.getByRole('button',{name:'Log in',exact:true}).click();
 }
 async function visits(){await page.getByRole('button',{name:/Appointments/}).first().click();}
 try{
  await page.getByRole('heading',{name:'Log in',exact:true}).waitFor();
  await page.screenshot({path:path.join(root,'auth-screenshots','login.png'),fullPage:true});
  await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].webContents.send('action','appointments'));
  await expect(page.getByRole('heading',{name:'Log in',exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Appointments',exact:true})).toHaveCount(0);ok('A01 Login gate ignores workspace menu commands');
  await page.getByRole('button',{name:'Log in',exact:true}).click();await expect(alert()).toContainText('Complete all fields');ok('A02 Empty login rejected');
  await page.getByRole('button',{name:'Sign up',exact:true}).click();
  await page.screenshot({path:path.join(root,'auth-screenshots','signup.png'),fullPage:true});
  await page.getByLabel('Name',{exact:true}).fill('Alex Demo');
  await page.getByLabel('Email',{exact:true}).fill('not-an-email');
  await page.getByLabel('Password',{exact:true}).fill(password);await page.getByLabel('Confirm password',{exact:true}).fill(password);
  await page.getByRole('button',{name:'Create account',exact:true}).click();await expect(alert()).toContainText('Enter an email');
  assert(await alert().evaluate(el=>el===document.activeElement));ok('A03 Invalid email rejected and error receives focus');
  await page.getByLabel('Email',{exact:true}).fill('Alex@example.test');
  await page.getByLabel('Password',{exact:true}).fill('short');await page.getByLabel('Confirm password',{exact:true}).fill('short');
  await page.getByRole('button',{name:'Create account',exact:true}).click();await expect(alert()).toContainText('at least 8');ok('A04 Short password rejected');
  await page.getByLabel('Password',{exact:true}).fill(password);await page.getByLabel('Confirm password',{exact:true}).fill('different');
  await page.getByRole('button',{name:'Create account',exact:true}).click();await expect(alert()).toContainText('do not match');ok('A05 Password mismatch rejected');
  await page.getByLabel('Confirm password',{exact:true}).fill(password);
  await page.evaluate(()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new DOMException('Test failure','QuotaExceededError');};});
  await page.getByRole('button',{name:'Create account',exact:true}).click();await expect(alert()).toContainText('Could not read or save');
  await expect(page.getByRole('heading',{name:'Create a demo account'})).toBeVisible();
  assert.equal(await page.getByLabel('Name',{exact:true}).inputValue(),'Alex Demo');
  await page.evaluate(()=>{Storage.prototype.setItem=window.originalSet;});ok('A06 Account save failure preserves form');
  await page.getByRole('button',{name:'Create account',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('Demo account created');
  const stored=await page.evaluate(k=>localStorage.getItem(k),ACCOUNT);assert(!stored.includes(password));assert.equal(JSON.parse(stored).length,1);ok('A07 Sign-up stores salted hash and returns to login');
  await page.getByRole('button',{name:'Sign up',exact:true}).click();
  await page.getByLabel('Email',{exact:true}).fill(' ALEX@EXAMPLE.TEST ');
  await page.getByLabel('Password',{exact:true}).fill(password);await page.getByLabel('Confirm password',{exact:true}).fill(password);
  await page.getByRole('button',{name:'Create account',exact:true}).click();await expect(alert()).toContainText('already exists');ok('A08 Duplicate email is case insensitive');
  await page.getByRole('button',{name:'Back to login',exact:true}).click();
  await login('alex@example.test','wrong-password');await expect(alert()).toContainText('Email or password is incorrect');ok('A09 Wrong credentials rejected');
  await login(' ALEX@EXAMPLE.TEST ');await page.getByRole('heading',{name:'Good morning, Alex',exact:true}).waitFor();
  await visits();const note=()=>page.getByRole('textbox',{name:'Note for this visit'});
  await note().fill('Alex private demo note');await page.getByRole('button',{name:'Save note',exact:true}).last().click();
  await page.reload();await page.getByRole('heading',{name:'Good morning, Alex',exact:true}).waitFor();await visits();assert.equal(await note().inputValue(),'Alex private demo note');ok('A10 Login and saved account data survive reload');
  await note().fill('Discard this edit');await page.getByRole('button',{name:'Log out',exact:true}).click();
  await page.getByRole('button',{name:'Keep editing',exact:true}).click();assert.equal(await note().inputValue(),'Discard this edit');
  await page.getByRole('button',{name:'Log out',exact:true}).click();await page.getByRole('button',{name:'Discard and log out',exact:true}).click();
  await page.getByRole('heading',{name:'Log in',exact:true}).waitFor();await page.reload();await page.getByRole('heading',{name:'Log in',exact:true}).waitFor();
  await login('alex@example.test');await page.getByRole('heading',{name:'Good morning, Alex',exact:true}).waitFor();await visits();assert.equal(await note().inputValue(),'Alex private demo note');ok('A11 Logout Keep editing and Discard protect saved data; reload stays logged out');
  await note().fill('Save on logout');await page.getByRole('button',{name:'Log out',exact:true}).click();
  await page.evaluate(()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new DOMException('Test failure','QuotaExceededError');};});
  await page.getByRole('button',{name:'Save and log out',exact:true}).click();await expect(alert()).toContainText('Could not save');
  await expect(page.getByRole('dialog')).toBeVisible();await page.evaluate(()=>{Storage.prototype.setItem=window.originalSet;});
  await page.getByRole('button',{name:'Save and log out',exact:true}).click();await page.getByRole('heading',{name:'Log in',exact:true}).waitFor();
  await login('alex@example.test');await page.getByRole('heading',{name:'Good morning, Alex',exact:true}).waitFor();await visits();assert.equal(await note().inputValue(),'Save on logout');ok('A12 Save-and-logout stays open on failed save and succeeds on retry');
  await page.getByRole('button',{name:'Log out',exact:true}).click();await signup('Blair Demo','blair@example.test');await login('blair@example.test');
  await page.getByRole('heading',{name:'Good morning, Blair',exact:true}).waitFor();await visits();assert.equal(await note().inputValue(),'');
  await page.getByRole('button',{name:'Log out',exact:true}).click();await login('alex@example.test');await page.getByRole('heading',{name:'Good morning, Alex',exact:true}).waitFor();await visits();assert.equal(await note().inputValue(),'Save on logout');ok('A13 Accounts have separate workspace data');
  await page.getByRole('button',{name:'Log out',exact:true}).click();
  const legacy={items:[{id:7,title:'Existing sample visit',provider:'Demo',date:'2099-01-01',time:'10:00',location:'Sample room',note:'Preserve original sample note'}],contrast:false,dense:false};
  await page.evaluate(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key:LEGACY,value:legacy});
  await page.getByRole('button',{name:'Open sample workspace',exact:true}).click();await page.getByRole('heading',{name:'Good morning, Olivia',exact:true}).waitFor();await visits();assert.equal(await note().inputValue(),'Preserve original sample note');
  await page.getByRole('button',{name:'Log out',exact:true}).click();assert.deepEqual(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),LEGACY),legacy);ok('A14 Original sample data remains intact and accessible');
  await page.evaluate(k=>localStorage.setItem(k,'{broken account data'),ACCOUNT);await login('alex@example.test');await expect(alert()).toContainText('Could not read or save');assert.equal(await page.evaluate(k=>localStorage.getItem(k),ACCOUNT),'{broken account data');ok('A15 Corrupt account storage fails safely without resetting it');
  for(const width of [800,1024,1440,1920]){await app.evaluate(({BrowserWindow},width)=>BrowserWindow.getAllWindows()[0].setContentSize(width,900),width);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  await app.evaluate(({BrowserWindow})=>BrowserWindow.getAllWindows()[0].webContents.setZoomFactor(2));await page.waitForTimeout(200);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));ok('A16 Login layout fits desktop widths and 200 percent zoom');
  assert.deepEqual(errors,[]);ok('A17 No uncaught renderer errors');
 } catch(e){results.push({name:'Interrupted check',status:'Fail',error:e.stack});await page.screenshot({path:path.join(root,'auth-screenshots','failure.png'),fullPage:true}).catch(()=>{});throw e;}
 finally{fs.writeFileSync(path.join(root,'auth-test-results.json'),JSON.stringify({date:new Date().toISOString(),platform:process.platform,profile,actual,results,errors},null,2));await app.evaluate(({dialog})=>{dialog.showMessageBoxSync=()=>1;}).catch(()=>{});await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
