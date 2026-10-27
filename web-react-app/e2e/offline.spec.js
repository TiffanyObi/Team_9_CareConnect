import { test } from '@playwright/test';
import { runOfflineFlow } from './offline.flow.mjs';

test('PWA flow: installable shell, offline nested route, local save, reconnect, and update readiness', async ({ page, context, baseURL }) => {
  await runOfflineFlow(page, context, baseURL);
});
