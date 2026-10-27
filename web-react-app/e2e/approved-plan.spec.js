import { expect, test } from '@playwright/test';

async function loginAsOlivia(page) {
  await page.goto('/#/login');
  await page.getByLabel('Email').fill('omartinez@careconnect.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15_000 });
}

test('H02 and H03: appointment groups open details and Back returns to the list', async ({ page }) => {
  await loginAsOlivia(page);
  await page.goto('/#/appointments');

  const upcoming = page.getByRole('heading', { name: 'Upcoming appointments' }).locator('..');
  const past = page.getByRole('heading', { name: 'Past appointments' }).locator('..');
  await expect(upcoming).toContainText('Physical therapy follow-up');
  await expect(past).toContainText('Primary care check-in');

  await upcoming.getByRole('link', { name: /Physical therapy follow-up/ }).click();
  await expect(page.getByRole('heading', { name: 'Appointment details' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Visit summary' }).locator('..')).toContainText('Physical therapy follow-up');
  await page.getByRole('link', { name: 'Back to appointments' }).click();
  await expect(page.getByRole('heading', { name: 'Appointments', exact: true })).toBeVisible();
  await expect(upcoming).toContainText('Physical therapy follow-up');
});

test('H05 and S03: an unmatched visit search explains the empty state and clears cleanly', async ({ page }) => {
  await loginAsOlivia(page);
  await page.goto('/#/search');

  await page.getByPlaceholder('Search visit subject').fill('no matching visit');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByText('No visits match these filters. Adjust your criteria and search again.')).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.getByText('Choose any filters, then select Search to display matching visits.')).toBeVisible();
  await expect(page.getByPlaceholder('Search visit subject')).toHaveValue('');
});

test('H08: F1 opens Help and Back preserves the prior appointment task', async ({ page }) => {
  await loginAsOlivia(page);
  await page.goto('/#/appointments');
  await page.keyboard.press('F1');

  await expect(page.getByRole('heading', { name: 'Help & shortcuts' })).toBeVisible();
  await expect(page.getByText('Open Appointments', { exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Appointments', exact: true })).toBeVisible();
});

test('S02: a past appointment date is rejected and is not saved', async ({ page }) => {
  await loginAsOlivia(page);
  await page.goto('/#/appointments/new');

  await page.getByLabel('Provider').selectOption('Dr. Maya Chen');
  await page.getByLabel('Appointment date').fill('2020-01-01');
  await page.getByLabel('Start time').fill('10:30');
  await page.getByLabel('Visit type').selectOption({ label: 'Medication review' });
  await page.getByRole('button', { name: 'Save appointment' }).click();

  await expect(page.getByRole('alert')).toContainText('Choose an appointment date and time in the future');
  await expect(page.getByRole('heading', { name: 'New appointment' })).toBeVisible();
  await expect(page).toHaveURL(/\/appointments\/new$/);
});

test('S06: repeated appointment submission creates only one saved visit', async ({ page }) => {
  await loginAsOlivia(page);
  await page.goto('/#/appointments/new');

  const uniqueNote = `Repeated-submit check ${Date.now()}`;
  await page.getByLabel('Provider').selectOption('Dr. Maya Chen');
  await page.getByLabel('Appointment date').fill('2035-07-10');
  await page.getByLabel('Start time').fill('09:15');
  await page.getByLabel('Visit type').selectOption({ label: 'Medication review' });
  await page.getByLabel('Notes').fill(uniqueNote);
  await page.getByRole('button', { name: 'Save appointment' }).evaluate((button) => {
    button.click();
    button.click();
  });

  await expect(page.getByRole('heading', { name: 'Appointment saved' })).toBeVisible();
  const matchingVisits = await page.evaluate((note) => {
    const key = 'careconnect-safeview-appointments:olivia-martinez-demo';
    const visits = JSON.parse(localStorage.getItem(key) || '[]');
    return visits.filter((visit) => visit.notes === note).length;
  }, uniqueNote);
  expect(matchingVisits).toBe(1);
});
