import { expect, test } from '@playwright/test';

test('account and access flow: reject bad login, sign up, save onboarding, reload, log out, and protect routes', async ({ page }) => {
  await page.goto('/#/login');
  await page.getByLabel('Email').fill('unknown@example.com');
  await page.getByLabel('Password').fill('incorrect-password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('alert')).toContainText('email or password is incorrect');

  await page.getByRole('link', { name: 'Create a new account' }).click();
  await page.getByLabel('Full name').fill('Playwright Recipient');
  await page.getByLabel('Email').fill(`playwright-${Date.now()}@example.test`);
  await page.getByLabel('Password', { exact: true }).fill('safe-demo-password-123');
  await page.getByLabel('Confirm password').fill('safe-demo-password-123');
  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page.getByRole('heading', { name: 'Set up your view' })).toBeVisible();
  await page.getByLabel('Text size').selectOption('150');
  await page.getByLabel(/High contrast/).check();
  await page.getByRole('button', { name: 'Save and open Dashboard' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-text-scale', '150');
  await expect(page.locator('html')).toHaveAttribute('data-high-contrast', 'true');

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-text-scale', '150');
  await expect(page.locator('html')).toHaveAttribute('data-high-contrast', 'true');

  await page.getByRole('button', { name: /Log out Playwright Recipient/ }).click();
  await page.getByRole('dialog', { name: 'Log out of CareConnect?' }).getByRole('button', { name: 'Log out' }).click();
  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();

  await page.goto('/#/appointments');
  await expect(page).toHaveURL(/\/#\/login$/);
  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
});

test('appointment flow: validate, create, search, edit, check in, copy, reload, and confirm saved data', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text) => window.localStorage.setItem('__playwright_clipboard__', text),
        readText: async () => window.localStorage.getItem('__playwright_clipboard__') || '',
      },
    });
  });

  await page.goto('/#/login');
  await page.getByLabel('Email').fill('omartinez@careconnect.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  await page.goto('/#/appointments/new');
  await page.getByRole('button', { name: 'Save appointment' }).click();
  await expect(page.getByRole('alert')).toContainText('Select a provider');
  await expect(page.getByRole('alert')).toContainText('Enter an appointment date');
  await expect(page.getByRole('alert')).toContainText('Enter a start time');
  await expect(page.getByRole('alert')).toContainText('Select a visit type');

  await page.getByLabel('Provider').selectOption('Dr. Maya Chen');
  await page.getByLabel('Appointment date').fill('2035-06-15');
  await page.getByLabel('Start time').fill('10:30');
  await page.getByLabel('Visit type').selectOption({ label: 'Specialist consultation' });
  await page.getByLabel('Notes').fill('Created by the Playwright appointment flow.');
  await page.getByRole('button', { name: 'Save appointment' }).click();

  await expect(page.getByRole('heading', { name: 'Appointment saved' })).toBeVisible();
  await page.getByRole('link', { name: 'Open appointment details' }).click();
  await expect(page.getByRole('heading', { name: 'Appointment details' })).toBeVisible();
  await expect(page.getByText('Created by the Playwright appointment flow.')).toBeVisible();

  await page.getByRole('link', { name: 'Search' }).click();
  await page.getByRole('heading', { name: 'Search visits' }).waitFor();
  await page.getByLabel('Subject').fill('Specialist consultation');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  const results = page.getByRole('region', { name: 'Search results' });
  await expect(results.getByText('1 visit found')).toBeVisible();
  await results.getByRole('link', { name: /Specialist consultation/ }).click();
  await expect(page.getByRole('heading', { name: 'Appointment details' })).toBeVisible();

  await page.getByRole('link', { name: 'Edit appointment' }).click();
  await expect(page.getByRole('heading', { name: 'Edit appointment' })).toBeVisible();
  await page.getByLabel('Provider').selectOption('Jordan Lee, PT');
  await page.getByLabel('Appointment date').fill('2035-06-20');
  await page.getByLabel('Start time').fill('13:45');
  await page.getByLabel('Visit type').selectOption({ label: 'Physical therapy follow-up' });
  await page.getByLabel('Notes').fill('Updated by the Playwright appointment flow.');
  await page.getByRole('button', { name: 'Save changes' }).click();

  await expect(page.getByRole('heading', { name: 'Appointment details' })).toBeVisible();
  await expect(page.getByText('Updated by the Playwright appointment flow.')).toBeVisible();
  await page.getByRole('button', { name: 'Check-in' }).click();
  await expect(page.getByRole('status', { name: 'Appointment check-in' }))
    .toContainText('You have been checked in');
  await page.getByRole('button', { name: 'Copy details' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Appointment details copied.' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain('Physical therapy follow-up | 2035-06-20 13:45');

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Appointment details' })).toBeVisible();
  await expect(page.getByText('Updated by the Playwright appointment flow.')).toBeVisible();
  await expect(page.getByText('Jordan Lee, PT', { exact: true })).toBeVisible();
  await expect(page.getByRole('status', { name: 'Appointment check-in' }))
    .toContainText('You have been checked in');
});
