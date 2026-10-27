import { expect, test } from '@playwright/test';

async function loginAsOlivia(page) {
  await page.goto('/#/login');
  await page.getByLabel('Email').fill('omartinez@careconnect.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
}

test('medication flow: add, log multiple doses, update dashboard, and keep user data separate', async ({ page }) => {
  await loginAsOlivia(page);
  await page.goto('/#/medications/new');
  await page.getByLabel(/Medication name/).fill('Rescue demo medication');
  await page.getByLabel(/Dosage/).fill('5 mg');
  await page.getByLabel(/Schedule/).fill('As directed');
  await page.getByLabel(/Instructions/).fill('Demo instructions only.');
  await page.getByRole('button', { name: 'Save medication' }).click();
  await expect(page.getByRole('heading', { name: 'Rescue demo medication', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Log as taken' }).click();
  await page.getByRole('button', { name: 'Log as taken' }).click();
  await expect(page.getByText('2 doses logged today')).toBeVisible();
  await expect(page.getByText('Rescue demo medication taken')).toHaveCount(2);
  await page.getByRole('link', { name: 'CareConnect Safeview dashboard' }).click();
  await expect(page.getByText(/last logged/)).toBeVisible();

  await page.getByRole('button', { name: /Log out Olivia Martinez/ }).click();
  await page.getByRole('dialog', { name: 'Log out of CareConnect?' }).getByRole('button', { name: 'Log out' }).click();
  await page.getByRole('link', { name: 'Create a new account' }).click();
  await page.getByLabel('Full name').fill('Separate Recipient');
  await page.getByLabel('Email').fill(`separate-${Date.now()}@example.test`);
  await page.getByLabel('Password', { exact: true }).fill('password123');
  await page.getByLabel('Confirm password').fill('password123');
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.getByRole('button', { name: 'Save and open Dashboard' }).click();
  await page.goto('/#/medications');
  await expect(page.getByRole('heading', { name: 'No medications added' })).toBeVisible();
  await expect(page.getByText('Rescue demo medication')).toHaveCount(0);
});

test('care and settings flow: save health log, read message, open emergency notice, and save accessible view', async ({ page }) => {
  await loginAsOlivia(page);
  await page.getByRole('link', { name: 'Care', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Care', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Open health log' }).click();
  await page.getByLabel('Symptom').selectOption('Knee pain');
  await page.getByLabel(/Private notes/).fill('Improved after today’s exercises.');
  await page.getByLabel(/Share this entry/).check();
  await page.getByRole('button', { name: 'Save health log' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Knee pain was added' })).toBeVisible();
  await expect(page.getByText('Shared with caregiver')).toBeVisible();

  await page.goto('/#/messages');
  await page.getByRole('button', { name: /Dr. Maya Chen/ }).click();
  await expect(page.getByRole('region', { name: 'Message details' })).toContainText('Preparing for your medication review');

  await page.goto('/#/care/emergency');
  await page.getByRole('button', { name: 'Call emergency services' }).click();
  await expect(page.getByRole('alertdialog', { name: 'Demo only — no call placed' })).toContainText('cannot call emergency services');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Call emergency services' })).toBeFocused();

  await page.goto('/#/settings');
  await page.getByLabel('Text size').selectOption('200');
  await page.getByLabel(/High contrast/).check();
  await page.getByLabel(/Reduce motion/).check();
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-text-scale', '200');
  await expect(page.locator('html')).toHaveAttribute('data-high-contrast', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true');
  await page.reload();
  await expect(page.getByLabel('Text size')).toHaveValue('200');
});
