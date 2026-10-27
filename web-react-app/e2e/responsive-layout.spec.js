import { expect, test } from '@playwright/test';

const widths = [375, 768, 1440];

for (const width of widths) {
  test(`responsive Care layout at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/login');
    await page.getByLabel('Email').fill('omartinez@careconnect.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
    await page.getByRole('link', { name: /Care and health log/ }).click();
    await expect(page.getByRole('heading', { name: 'Care', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Open health log' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Emergency assistance' })).toBeVisible();

    if (width < 1024) {
      await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeVisible();
    } else {
      await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({ path: testInfo.outputPath(`care-${width}px.png`), fullPage: true });
  });
}
