// Repeatable axe-core scans in the real Electron renderer.
const { _electron: electron, expect } = require("@playwright/test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const output =
  process.env.DESKTOP_TEST_OUTPUT ||
  fs.mkdtempSync(path.join(os.tmpdir(), "careconnect-week9-axe-"));
const profile = fs.mkdtempSync(
  path.join(fs.realpathSync(os.tmpdir()), "careconnect-week9-axe-profile-"),
);
const scans = [];
const rendererErrors = [];
let app;

async function scan(page, state) {
  const result = await page.evaluate(async () => {
    const report = await window.axe.run(document, {
      resultTypes: ["violations", "incomplete"],
    });
    return {
      violations: report.violations.map((item) => ({
        id: item.id,
        impact: item.impact,
        description: item.description,
        help: item.help,
        nodes: item.nodes.map((node) => ({
          target: node.target,
          failureSummary: node.failureSummary,
        })),
      })),
      incomplete: report.incomplete.map((item) => ({
        id: item.id,
        impact: item.impact,
        help: item.help,
        targets: item.nodes.map((node) => node.target),
      })),
    };
  });
  scans.push({ state, ...result });
  assert.deepEqual(
    result.violations,
    [],
    `${state} has axe violations: ${JSON.stringify(result.violations, null, 2)}`,
  );
  console.log(`PASS ${state}: 0 axe violations`);
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  app = await electron.launch({
    args: [path.join(__dirname, ".."), `--user-data-dir=${profile}`],
    env: { ...process.env, ELECTRON_RUN_AS_NODE: undefined },
  });
  const page = await app.firstWindow();
  page.on("pageerror", (error) => rendererErrors.push(error.message));
  await page.addScriptTag({
    url: pathToFileURL(require.resolve("axe-core/axe.min.js")).href,
  });

  await scan(page, "Log in");
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await scan(page, "Forgot password");
  await page.getByLabel("Email", { exact: true }).fill("person@example.test");
  await page.getByRole("button", { name: "Send reset link" }).click();
  await scan(page, "Reset confirmation");
  await page.getByRole("button", { name: "Back to sign in" }).click();
  await page.getByRole("button", { name: "Sign up" }).click();
  await scan(page, "Sign up");
  await page.getByLabel("Name", { exact: true }).fill("Axe Demo");
  await page.getByLabel("Email", { exact: true }).fill("axe@example.test");
  await page.getByLabel("Password", { exact: true }).fill("Demo-only-2468");
  await page
    .getByLabel("Confirm password", { exact: true })
    .fill("Demo-only-2468");
  await page.getByRole("button", { name: "Create account" }).click();
  await scan(page, "Review account");
  await page
    .getByRole("button", { name: "Confirm and create account" })
    .click();
  await scan(page, "Account created");
  await page.getByRole("button", { name: "Go to sign in" }).click();
  await page.getByRole("button", { name: "Open sample workspace" }).click();
  await expect(
    page.getByRole("heading", { name: "Good morning, Olivia" }),
  ).toBeVisible();
  await scan(page, "Dashboard");
  await page.getByRole("button", { name: /Appointments/ }).first().click();
  await scan(page, "Appointments");
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await scan(page, "Settings dialog");
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Keyboard shortcuts", exact: true })
    .click();
  await scan(page, "Keyboard shortcuts dialog");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "New appointment" }).click();
  await page.getByRole("button", { name: "Add appointment" }).click();
  await scan(page, "Appointment validation errors");

  assert.deepEqual(rendererErrors, []);
  const summary = {
    date: new Date().toISOString(),
    platform: process.platform,
    source: "axe-core in the real Electron renderer",
    stateCount: scans.length,
    violationCount: scans.reduce(
      (total, item) => total + item.violations.length,
      0,
    ),
    scans,
    rendererErrors,
  };
  fs.writeFileSync(
    path.join(output, "axe-results.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
  );
  await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>CareConnect axe-core results</title><style>body{font:20px system-ui;margin:56px;color:#102a43;background:#f7fafc}main{max-width:900px;margin:auto;background:#fff;border:2px solid #08736e;border-radius:14px;padding:42px}h1{font-size:38px}.result{font-size:34px;color:#166534;font-weight:750}li{margin:10px 0}small{color:#52667a}</style></head><body><main><h1>CareConnect Safeview accessibility scan</h1><p class="result">0 axe-core violations</p><p>${scans.length} application states scanned in the real Electron renderer.</p><ul>${scans.map((item) => `<li>${item.state}: 0 violations</li>`).join("")}</ul><small>${summary.date} · ${process.platform} · Automated axe-core evidence; retain the separate axe DevTools UI screenshot required by the assignment.</small></main></body></html>`);
  await page.screenshot({
    path: path.join(output, "axe-core-zero-violations.png"),
    fullPage: true,
  });
  console.log(`Evidence: ${output}`);
})()
  .catch((error) => {
    console.error(error.stack || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (app) await app.close();
  });
