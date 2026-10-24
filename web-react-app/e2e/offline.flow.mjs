import assert from 'node:assert/strict';

// Use a fresh desktop Playwright context and a production build on HTTPS or localhost.
export async function runOfflineFlow(page, context, baseURL) {
  const origin = new URL(baseURL).origin;
  const errors = [];
  const recordError = (error) => errors.push(error.message);
  page.on('pageerror', recordError);
  try {
    await page.goto(`${origin}/login`);
    await page.getByLabel('Email', { exact: true }).fill('omartinez@careconnect.com');
    await page.getByLabel('Password', { exact: true }).fill('password');
    await page.getByRole('button', { name: 'Log in', exact: true }).click();
    await page.getByRole('heading', { name: 'Dashboard', exact: true }).waitFor();
    await page.getByText('Ready for offline use on this device.', { exact: true }).waitFor();
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
    });
    const manifest = await page.evaluate(async () => (await fetch(document.querySelector('link[rel="manifest"]').href)).json());
    assert.equal(manifest.display, 'standalone');
    assert.ok(manifest.icons.some((icon) => icon.sizes === '512x512'));
    await context.setOffline(true);
    // The appointment form's lazy chunk has not yet been visited online.
    await page.goto(`${origin}/appointments/new`);
    await page.getByRole('heading', { name: 'New appointment', exact: true }).waitFor();
    await page.getByText(/You are offline/).waitFor();
    await page.getByLabel(/Provider/).selectOption('Dr. Maya Chen');
    const future = new Date(); future.setFullYear(future.getFullYear() + 1);
    const date = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, '0')}-${String(future.getDate()).padStart(2, '0')}`;
    await page.getByLabel(/Appointment date/).fill(date);
    await page.getByLabel(/Start time/).fill('10:30');
    await page.getByLabel(/Visit type/).selectOption('Medication review');
    const note = `Offline demo ${Date.now()}`;
    await page.getByLabel(/Notes/).fill(note);
    await page.getByRole('button', { name: 'Save appointment', exact: true }).click();
    await page.getByRole('heading', { name: 'Appointment saved', exact: true }).waitFor();
    await page.reload();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('careconnect-safeview-appointments:olivia-martinez-demo')));
    assert.equal(saved.filter((visit) => visit.notes === note).length, 1);
    await page.getByRole('button', { name: /Log out Olivia/ }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Log out', exact: true }).click();
    await page.getByRole('heading', { name: 'Log in', exact: true }).waitFor();
    await page.goto(`${origin}/appointments/new`);
    await page.getByRole('heading', { name: 'Log in', exact: true }).waitFor();
    assert.equal(await page.getByText(note, { exact: true }).count(), 0);
    await context.setOffline(false); await page.reload();
    await page.getByRole('heading', { name: 'Log in', exact: true }).waitFor();
    assert.deepEqual(errors, []);
    return { status: 'passed', origin, flow: 'offline unvisited route, appointment save, reload, logout, private route, reconnect' };
  } finally { await context.setOffline(false); page.off('pageerror', recordError); }
}
