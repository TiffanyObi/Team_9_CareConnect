import { act, screen, fireEvent, waitFor } from "@testing-library/react";
const client = require("react-dom/client");

test("renderer entry mounts login, opens workspace, and logs out", async () => {
  document.body.innerHTML = '<div id="root"></div>';
  const original = client.createRoot;
  let root;
  const spy = jest.spyOn(client, "createRoot").mockImplementation((node) => {
    root = original(node);
    return root;
  });
  await act(async () => {
    require("../../src/renderer/main.jsx");
  });
  expect(screen.getByRole("heading", { name: "Log in" })).toBeVisible();
  fireEvent.click(
    screen.getByRole("button", { name: "Open sample workspace" }),
  );
  await waitFor(() =>
    expect(
      screen.getByRole("heading", { name: "Good morning, Olivia" }),
    ).toBeVisible(),
  );
  fireEvent.click(screen.getByRole("button", { name: "Log out" }));
  expect(screen.getByRole("heading", { name: "Log in" })).toBeVisible();
  act(() => root.unmount());
  spy.mockRestore();
  document.body.innerHTML = "";
});
