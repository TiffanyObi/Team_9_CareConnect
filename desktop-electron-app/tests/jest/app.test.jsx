import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { App } from "../../src/renderer/App.jsx";
const sample = { id: "sample", name: "Olivia Reed", sample: true };
const click = (name) =>
  fireEvent.click(screen.getAllByRole("button", { name })[0]);
const input = (name, value) =>
  fireEvent.change(screen.getByLabelText(name, { exact: true }), {
    target: { value },
  });
function mount(user = sample, onLogout = jest.fn(() => "")) {
  return render(<App user={user} onLogout={onLogout} />);
}
function visit() {
  click(/Appointments/);
}
function newVisit() {
  click("New appointment");
}
function validForm(title = "Test visit") {
  input("Visit title", title);
  input("Date", "2099-10-01");
  input("Time", "10:00");
  input("Location", "Demo room");
}

test("HP-02/03/04/05 and SP-01 navigation, selection and live search counts", async () => {
  mount();
  expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();
  const dash = screen.getAllByRole("button", { name: /Dashboard/ })[0];
  dash.focus();
  fireEvent.keyDown(dash, { key: "ArrowDown" });
  expect(
    screen.getAllByRole("button", { name: /Appointments/ })[0],
  ).toHaveFocus();
  fireEvent.keyDown(document.activeElement, { key: "End" });
  expect(
    screen.getByRole("button", { name: "Keyboard shortcuts" }),
  ).toHaveFocus();
  fireEvent.keyDown(document, { key: "F6" });
  expect(screen.getByRole("button", { name: "New appointment" })).toHaveFocus();
  fireEvent.keyDown(document.activeElement, { key: "ArrowRight" });
  expect(screen.getByRole("button", { name: "Save note" })).toHaveFocus();
  fireEvent.keyDown(document, { key: "F6" });
  expect(screen.getByRole("main")).toHaveFocus();
  fireEvent.keyDown(document, { key: "F6", shiftKey: true });
  expect(screen.getByRole("button", { name: "New appointment" })).toHaveFocus();
  visit();
  await waitFor(() =>
    expect(screen.getByRole("heading", { level: 1 })).toHaveFocus(),
  );
  const visits = screen.getAllByRole("button", { name: /Care check-in/ });
  fireEvent.click(visits[0]);
  expect(visits[0]).toHaveAttribute("aria-pressed", "true");
  fireEvent.keyDown(visits[0], { key: "Home" });
  expect(
    screen.getByRole("button", { name: /Physical therapy/ }),
  ).toHaveFocus();
  fireEvent.keyDown(document.activeElement, { key: "End" });
  expect(screen.getByRole("button", { name: /Wellness review/ })).toHaveFocus();
  input("Find an appointment", "therapy");
  expect(screen.getByText("1 visits")).toHaveAttribute("role", "status");
  input("Find an appointment", "zzzz");
  expect(screen.getByText(/No visits found/)).toHaveAttribute("role", "status");
  click("Clear search");
  expect(screen.getByText("3 visits")).toBeVisible();
  fireEvent.keyDown(document, { key: "f", metaKey: true });
  await waitFor(() => expect(screen.getByRole("searchbox")).toHaveFocus());
  fireEvent.keyDown(document, { key: "1", metaKey: true });
  expect(
    screen.getByRole("heading", { name: "Good morning, Olivia" }),
  ).toBeVisible();
});

test("HP-06/07 SP-02/03 required fields, date, duplicate time and persistence", async () => {
  mount();
  newVisit();
  click("Add appointment");
  expect(screen.getByRole("alert")).toHaveFocus();
  for (const label of ["Visit title", "Date", "Time", "Location"]) {
    const field = screen.getByLabelText(label, { exact: true });
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription();
  }
  validForm();
  input("Date", "2020-01-01");
  click("Add appointment");
  expect(
    screen.getByLabelText("Date", { exact: true }),
  ).toHaveAccessibleDescription("Choose a future date and time.");
  input("Date", "2099-10-01");
  click("Add appointment");
  expect(screen.getByRole("heading", { name: "Test visit" })).toBeVisible();
  input("Note for this visit", "Question");
  click("Save note");
  expect(
    JSON.parse(localStorage.getItem("careconnect-desktop-demo-v1")).items.find(
      (x) => x.title === "Test visit",
    ).note,
  ).toBe("Question");
  newVisit();
  validForm("Duplicate");
  click("Add appointment");
  expect(screen.getByLabelText("Time", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  click("Cancel");
});

test("HP-08 SP-07 settings cancel rolls back, saving persists and dialog returns focus", () => {
  mount();
  const button = screen.getByRole("button", { name: "Settings", exact: true });
  button.focus();
  click("Settings");
  fireEvent.click(screen.getByLabelText("High contrast"));
  fireEvent.click(screen.getByLabelText("Compact appointment rows"));
  expect(document.querySelector(".app")).toHaveClass("high-contrast", "dense");
  fireEvent(
    screen.getByRole("dialog"),
    new Event("cancel", { bubbles: false, cancelable: true }),
  );
  expect(button).toHaveFocus();
  expect(document.querySelector(".app")).not.toHaveClass("high-contrast");
  click("Settings");
  expect(screen.getByLabelText("High contrast")).not.toBeChecked();
  fireEvent.click(screen.getByLabelText("High contrast"));
  click("Save settings");
  expect(
    JSON.parse(localStorage.getItem("careconnect-desktop-demo-v1")).contrast,
  ).toBe(true);
  click("Settings");
  expect(screen.getByLabelText("High contrast")).toBeChecked();
  click("Close dialog");
  expect(document.querySelector(".app")).toHaveClass("high-contrast");
});

test("save failure preserves edits, beforeunload blocks, and logout retry works", () => {
  const onLogout = jest.fn(() => "Session unavailable");
  mount(sample, onLogout);
  visit();
  input("Note for this visit", "Unsaved");
  const e = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(e);
  expect(e.defaultPrevented).toBe(true);
  const save = jest
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw Error("Full");
    });
  click("Save note");
  expect(screen.getByRole("alert")).toHaveTextContent("Could not save");
  expect(screen.getByLabelText("Note for this visit")).toHaveValue("Unsaved");
  click("Log out");
  click("Keep editing");
  expect(onLogout).not.toHaveBeenCalled();
  click("Log out");
  click("Save and log out");
  expect(onLogout).not.toHaveBeenCalled();
  save.mockRestore();
  click("Save and log out");
  expect(onLogout).toHaveBeenCalled();
  expect(screen.getByRole("alert")).toHaveTextContent("Session unavailable");
  click("Discard and log out");
  expect(onLogout).toHaveBeenCalledTimes(2);
});

test("HP-09 IPC actions, contrast, help, invalid commands and subscriptions cleanup", async () => {
  let action, contrast;
  const off = jest.fn();
  window.desktop = {
    platform: "darwin",
    onAction: (fn) => {
      action = fn;
      return off;
    },
    onContrast: (fn) => {
      contrast = fn;
      return off;
    },
    contextMenu: jest.fn(),
    copyAppointmentDetails: jest.fn().mockResolvedValue(),
  };
  const view = mount();
  act(() => contrast(true));
  expect(document.querySelector(".app")).toHaveClass("high-contrast");
  act(() => action("appointments"));
  const row = screen.getByRole("button", { name: /Physical therapy/ });
  fireEvent.keyDown(row, { key: "F10", shiftKey: true });
  expect(window.desktop.contextMenu).toHaveBeenCalled();
  act(() => action("copy-selected"));
  await waitFor(() =>
    expect(screen.getByText("Appointment details copied.")).toBeVisible(),
  );
  expect(window.desktop.copyAppointmentDetails).toHaveBeenCalledWith(
    expect.stringContaining("Physical therapy"),
  );
  window.desktop.copyAppointmentDetails.mockRejectedValueOnce(
    Error("Clipboard"),
  );
  act(() => action("copy-selected"));
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("Could not copy"),
  );
  act(() => action("open-selected"));
  expect(
    screen.getByRole("heading", { name: "Appointments", level: 1 }),
  ).toBeVisible();
  act(() => action("help"));
  expect(screen.getByRole("dialog")).toHaveAccessibleName("Keyboard shortcuts");
  act(() => action("new"));
  expect(screen.getByRole("dialog")).toHaveAccessibleName("Keyboard shortcuts");
  click("Close dialog");
  act(() => action("about"));
  expect(screen.getByText(/Team 9 · SWEN 661/)).toBeVisible();
  click("Close dialog");
  view.unmount();
  expect(off).toHaveBeenCalled();
});

test("empty and corrupt storage fall back safely; account keys stay separate", () => {
  localStorage.setItem(
    "careconnect-desktop-account-data-v1:a",
    JSON.stringify({ items: [], contrast: false, dense: false }),
  );
  const view = mount({ id: "a", name: "Alex Demo" });
  visit();
  expect(
    screen.getByText("Select an appointment to see its details."),
  ).toBeVisible();
  click("Save note");
  expect(localStorage.getItem("careconnect-desktop-demo-v1")).toBeNull();
  view.unmount();
  localStorage.setItem("careconnect-desktop-demo-v1", "broken");
  mount();
  expect(
    screen.getByRole("heading", { name: "Good morning, Olivia" }),
  ).toBeVisible();
  click("Log out");
});
