/** @jest-environment node */
const { createMenuTemplate } = require("../../src/main/menu.js");
test.each(["darwin", "win32", "linux"])(
  "native roles and actions on %s",
  (platform) => {
    const send = jest.fn();
    const menu = createMenuTemplate(send, platform);
    expect(menu.map((x) => x.label).filter(Boolean)).toEqual([
      "&File",
      "&Edit",
      "&View",
      "&Window",
      "&Help",
    ]);
    for (const group of menu)
      for (const item of group.submenu || []) if (item.click) item.click();
    expect(send).toHaveBeenCalledWith("new");
    expect(send).toHaveBeenCalledWith("save");
    expect(send).toHaveBeenCalledWith("about");
    expect(send).toHaveBeenCalledWith("settings");
    expect(menu.some((x) => x.role === "appMenu")).toBe(platform === "darwin");
    const groups = menu.flatMap((item) => item.submenu || []);
    const settings = groups.find((item) => item.label === "Settings…");
    expect(settings.accelerator).toBe("CmdOrCtrl+,");
  },
);

test("development menu exposes Developer Tools without shipping it in production", () => {
  const development = createMenuTemplate(jest.fn(), "darwin", true);
  const production = createMenuTemplate(jest.fn(), "darwin", false);
  const viewItems = (menu) => menu.find((item) => item.label === "&View").submenu;

  expect(viewItems(development)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        label: "Developer Tools",
        role: "toggleDevTools",
        accelerator: "Alt+Command+I",
      }),
    ]),
  );
  expect(viewItems(production)).not.toEqual(
    expect.arrayContaining([expect.objectContaining({role: "toggleDevTools"})]),
  );
});
