// macOS real-process checks. Evidence stays outside the source repository.
const { _electron: electron, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const assert = require("node:assert/strict");
const CHANNELS = require("../src/shared/ipc-channels.cjs");
const root =
  process.env.DESKTOP_TEST_OUTPUT ||
  fs.mkdtempSync(path.join(os.tmpdir(), "careconnect-week8-integration-"));
fs.mkdirSync(root, { recursive: true });
const profile = fs.mkdtempSync(
  path.join(fs.realpathSync(os.tmpdir()), "careconnect-week8-profile-"),
);
const results = [];
let app, page;
const errors = [];
const pass = (name, detail) => {
  results.push({ name, status: "Pass", detail });
  console.log("PASS " + name);
};
async function launch() {
  app = await electron.launch({
    args: [path.join(__dirname, ".."), `--user-data-dir=${profile}`],
    env: { ...process.env, ELECTRON_RUN_AS_NODE: undefined },
  });
  page = await app.firstWindow();
  page.on("dialog", () => {});
  page.on("pageerror", (e) => errors.push(e.message));
}
async function action(label) {
  await app.evaluate(({ Menu }, label) => {
    const scan = (items) => {
      for (const item of items) {
        if (item.label === label) return item;
        if (item.submenu) {
          const found = scan(item.submenu.items);
          if (found) return found;
        }
      }
    };
    const item = scan(Menu.getApplicationMenu().items);
    if (!item) throw Error("Missing menu " + label);
    item.click();
  }, label);
}
async function tabAll() {
  const seen = new Set();
  const region = await page.locator("dialog[open]").count() ? page.locator("dialog[open]") : page;
  const targets = await region
    .locator("button:visible,input:visible,textarea:visible,a:visible")
    .count();
  for (let i = 0; i < targets * 2 + 10; i++) {
    await page.keyboard.press("Tab");
    const value = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      el.scrollIntoView({ block: "center" });
      const r = el.getBoundingClientRect();
      return {
        id: el.id || el.textContent || el.getAttribute("aria-label"),
        index: Array.from(document.querySelectorAll("button,input,textarea,a")).indexOf(el),
        outline: style.outlineStyle,
        width: parseFloat(style.outlineWidth),
        visible:
          r.width > 0 &&
          r.height > 0 &&
          r.left >= -1 &&
          r.right <= innerWidth + 1,
      };
    });
    if (value && value.index >= 0) {
      assert(value.visible, "Focused control clipped: " + value.id);
      assert(
        value.outline !== "none" && value.width >= 3,
        "Focus outline missing: " + value.id,
      );
      seen.add(value.index);
    }
  }
  assert.equal(seen.size, targets, "Every active control must receive keyboard focus");
  return { targetCount: targets, focusedCount: seen.size };
}
(async () => {
  console.log("Evidence: " + root);
  try {
    await launch();
    assert.equal(await page.title(), "CareConnect Safeview");
    assert.equal(
      await app.evaluate(({ app }) => app.getPath("userData")),
      profile,
    );
    await page.getByRole("button", { name: "Open sample workspace" }).click();
    await page.getByRole("heading", { name: "Good morning, Olivia" }).waitFor();
    pass("HP-01 Page identity and real Electron launch");
    // Use native menu callbacks so main -> preload -> renderer is exercised.
    await action("Appointments");
    await page
      .getByRole("heading", { name: "Appointments", exact: true })
      .waitFor();
    await action("Find appointments");
    await expect(page.getByRole("searchbox")).toBeFocused();
    await page.getByRole("searchbox").fill("therapy");
    await expect(page.getByText("1 visits")).toBeVisible();
    await page.getByRole("searchbox").fill("");
    pass("HP-03/04/05 Native navigation and find IPC");
    await action("New appointment…");
    await page
      .getByRole("button", { name: "Add appointment", exact: true })
      .click();
    await expect(page.getByRole("alert")).toBeFocused();
    for (const label of ["Visit title", "Date", "Time", "Location"]) {
      const field = page.getByLabel(label, { exact: true });
      await expect(field).toHaveAttribute("aria-invalid", "true");
      assert(await field.getAttribute("aria-describedby"));
    }
    pass("SP-02 Required visit field errors and summary focus");
    await page.keyboard.press("Escape");
    await action("Settings…");
    await page
      .getByRole("checkbox", { name: "High contrast", exact: true })
      .check();
    await page
      .getByRole("checkbox", { name: "Compact appointment rows" })
      .check();
    await page.keyboard.press("Escape");
    await action("Settings…");
    await expect(
      page.getByRole("checkbox", { name: "High contrast", exact: true }),
    ).not.toBeChecked();
    await expect(
      page.getByRole("checkbox", { name: "Compact appointment rows" }),
    ).not.toBeChecked();
    await page
      .getByRole("checkbox", { name: "Compact appointment rows" })
      .check();
    await page.getByRole("button", { name: "Save settings" }).click();
    await page.reload();
    await action("Settings…");
    await expect(
      page.getByRole("checkbox", { name: "Compact appointment rows" }),
    ).toBeChecked();
    await page.keyboard.press("Escape");
    pass("HP-08/SP-07 Settings cancel and save survive reopening/reload");
    await action("Keyboard shortcuts");
    await expect(page.getByRole("dialog")).toHaveAccessibleName(
      "Keyboard shortcuts",
    );
    await page.keyboard.press("Escape");
    pass("HP-10 Help menu action and Escape");
    const labels = await app.evaluate(({ Menu }) =>
      Menu.getApplicationMenu().items.map((x) => x.label),
    );
    for (const label of ["File", "Edit", "View", "Window", "Help"])
      assert(labels.some((x) => x.includes(label)));
    pass("HP-10 Native menus present", labels);
    const check = await app.evaluate(({ BrowserWindow }) => {
      const w = BrowserWindow.getAllWindows()[0];
      const p = w.webContents.getLastWebPreferences();
      return {
        sandbox: p.sandbox,
        contextIsolation: p.contextIsolation,
        nodeIntegration: p.nodeIntegration,
      };
    });
    assert.deepEqual(check, {
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    });
    assert.equal(await page.evaluate(() => typeof window.require), "undefined");
    pass("Secure renderer isolation");
    const validation = await page.evaluate(async () => {
      const out = [];
      for (const value of [null, "", "x".repeat(100001)]) {
        try {
          await window.desktop.copyAppointmentDetails(value);
          out.push(false);
        } catch {
          out.push(true);
        }
      }
      return out;
    });
    assert.deepEqual(validation, [true, true, true]);
    const denied = await app.evaluate(({ BrowserWindow, ipcMain }, channel) => {
      const wc = BrowserWindow.getAllWindows()[0].webContents;
      const handle = ipcMain._invokeHandlers.get(channel);
      if (!handle) throw Error("Missing IPC handler");
      const checks = [
        { sender: { getURL: () => wc.getURL() } },
        { sender: wc, senderFrame: {} },
      ];
      return checks.map((event) => {
        try {
          handle(event, "Visit");
          return false;
        } catch {
          return true;
        }
      });
    }, CHANNELS.COPY_APPOINTMENT_DETAILS);
    assert.deepEqual(denied, [true, true]);
    pass(
      "IPC payload and spoofed sender/frame rejection",
      "Main handler invoked directly for spoofed events; valid IPC tested in clipboard suite",
    );
    await page.emulateMedia({ reducedMotion: "reduce", contrast: "more" });
    await action("Appointments");
    await app.evaluate(({ BrowserWindow }) => {
      const w = BrowserWindow.getAllWindows()[0];
      w.setContentSize(800, 700);
      w.webContents.setZoomFactor(4);
    });
    await page.waitForTimeout(300);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
    const traversal = await tabAll();
    for (const name of ["Settings", "Keyboard shortcuts", "Log out"])
      await expect(
        page.getByRole("button", { name, exact: true }),
      ).toBeVisible();
    await page.evaluate(() => window.scrollTo(0,0));
    const workspaceImage = await app.evaluate(async ({BrowserWindow}) => Array.from((await BrowserWindow.getAllWindows()[0].webContents.capturePage()).toPNG()));
    fs.writeFileSync(path.join(root, "workspace-400-percent.png"), Buffer.from(workspaceImage));
    pass("HP-11/SP-06 400% workspace reflow and focus outlines", traversal);
    await page.getByRole("button", { name: "Settings", exact: true }).click();
    await tabAll();
    await page.keyboard.press("Escape");
    const motion = await page.evaluate(() =>
      [...document.querySelectorAll("*")].every((el) => {
        const s = getComputedStyle(el);
        return (
          s.animationName === "none" &&
          s.transitionDuration.split(",").every((x) => parseFloat(x) === 0)
        );
      }),
    );
    assert(motion);
    pass(
      "SP-08 Reduced-motion emulation has no CSS animation/transition",
      "Emulation; no OS safety certification",
    );
    await page.getByRole("button", { name: "Log out", exact: true }).click();
    await tabAll();
    await page.getByRole("button", { name: "Sign up", exact: true }).click();
    await tabAll();
    await page
      .getByRole("button", { name: "Create account", exact: true })
      .click();
    await expect(page.getByRole("alert")).toBeFocused();
    for (const label of ["Name", "Email", "Password", "Confirm password"])
      await expect(page.getByLabel(label, { exact: true })).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    await page.evaluate(() => window.scrollTo(0,0));
    const authImage = await app.evaluate(async ({BrowserWindow}) => Array.from((await BrowserWindow.getAllWindows()[0].webContents.capturePage()).toPNG()));
    fs.writeFileSync(path.join(root, "auth-400-percent-errors.png"), Buffer.from(authImage));
    pass(
      "HP-20/SP-11 400% auth reflow, keyboard focus, and linked errors",
      "Screen reader still requires manual check",
    );
    await app.evaluate(({ BrowserWindow }) => {
      const w = BrowserWindow.getAllWindows()[0];
      w.webContents.setZoomFactor(1);
      w.setBounds({ x: 50, y: 70, width: 1000, height: 750 });
    });
    await page.getByRole("button", { name: "Back to login" }).click();
    await page.getByRole("button", { name: "Open sample workspace" }).click();
    await action("Appointments");
    await page
      .getByRole("textbox", { name: "Note for this visit" })
      .fill("Window close test");
    await app.evaluate(({ dialog }) => {
      global.promptCalls = [];
      dialog.showMessageBoxSync = (_w, options) => {
        global.promptCalls.push(options);
        return 0;
      };
    });
    await app.evaluate(({ BrowserWindow }) =>
      BrowserWindow.getAllWindows()[0].close(),
    );
    await expect(
      page.getByRole("textbox", { name: "Note for this visit" }),
    ).toHaveValue("Window close test");
    assert.equal(await app.evaluate(() => global.promptCalls.length), 1);
    pass(
      "SP-04 Keep editing prevents real window close",
      "Native dialog choice stubbed; real beforeunload/window event",
    );
    await app.evaluate(({ dialog, BrowserWindow }) => {
      dialog.showMessageBoxSync = () => 1;
      BrowserWindow.getAllWindows()[0].close();
    });
    await expect
      .poll(() =>
        app.evaluate(
          ({ BrowserWindow }) => BrowserWindow.getAllWindows().length,
        ),
      )
      .toBe(0);
    await app.close();
    app = null;
    await launch();
    const restored = await app.evaluate(({ BrowserWindow }) =>
      BrowserWindow.getAllWindows()[0].getBounds(),
    );
    assert.deepEqual(restored, { x: 50, y: 70, width: 1000, height: 750 });
    pass("Window bounds persist after close and relaunch", restored);
    await page.getByRole("button", { name: "Open sample workspace" }).click();
    await action("Appointments");
    await expect(
      page.getByRole("textbox", { name: "Note for this visit" }),
    ).not.toHaveValue("Window close test");
    pass("SP-04 Discard close does not save note");
    await app.evaluate(({ BrowserWindow }) =>
      BrowserWindow.getAllWindows()[0].maximize(),
    );
    await expect
      .poll(() =>
        app.evaluate(({ BrowserWindow }) =>
          BrowserWindow.getAllWindows()[0].isMaximized(),
        ),
      )
      .toBe(true);
    await app.evaluate(({ BrowserWindow }) =>
      BrowserWindow.getAllWindows()[0].close(),
    );
    await expect
      .poll(() =>
        app.evaluate(
          ({ BrowserWindow }) => BrowserWindow.getAllWindows().length,
        ),
      )
      .toBe(0);
    await app.close();
    app = null;
    await launch();
    assert(
      await app.evaluate(({ BrowserWindow }) =>
        BrowserWindow.getAllWindows()[0].isMaximized(),
      ),
    );
    pass("Window maximized state restores on relaunch");
    await app.evaluate(({dialog}) => { global.promptCalls=[]; dialog.showMessageBoxSync=(_window,options)=>{global.promptCalls.push(options);return 0;}; });
    const before = await app.evaluate(() => global.promptCalls.length);
    await app.evaluate(({ BrowserWindow }) =>
      BrowserWindow.getAllWindows()[0].close(),
    );
    await expect
      .poll(() =>
        app.evaluate(
          ({ BrowserWindow }) => BrowserWindow.getAllWindows().length,
        ),
      )
      .toBe(0);
    assert.equal(
      await app.evaluate(() => global.promptCalls?.length || 0),
      before,
    );
    pass("HP-14 Clean close without edit prompt");
    assert.deepEqual(errors, []);
    pass("No uncaught renderer errors");
  } catch (error) {
    results.push({
      name: "Interrupted check",
      status: "Fail",
      error: error.stack,
    });
    if (page)
      await page
        .screenshot({ path: path.join(root, "failure.png"), fullPage: true })
        .catch(() => {});
    throw error;
  } finally {
    fs.writeFileSync(
      path.join(root, "integration-results.json"),
      JSON.stringify(
        {
          date: new Date().toISOString(),
          platform: process.platform,
          results,
          errors,
        },
        null,
        2,
      ),
    );
    if (app) await app.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
