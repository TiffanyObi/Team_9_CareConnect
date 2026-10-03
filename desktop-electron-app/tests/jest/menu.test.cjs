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
  },
);
