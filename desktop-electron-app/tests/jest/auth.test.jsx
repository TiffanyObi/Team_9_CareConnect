import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DemoSession } from "../../src/renderer/auth/DemoSession.jsx";
const click = (name) =>
  fireEvent.click(screen.getByRole("button", { name, exact: true }));
const input = (name, value) =>
  fireEvent.change(screen.getByLabelText(name, { exact: true }), {
    target: { value },
  });
const mount = () =>
  render(
    <DemoSession>
      {(user, logout) => (
        <div>
          <h1>{user.name}</h1>
          <button onClick={logout}>Leave</button>
        </div>
      )}
    </DemoSession>,
  );
function signup() {
  click("Sign up");
  input("Name", "Alex Demo");
  input("Email", "alex@example.test");
  input("Password", "demo-password");
  input("Confirm password", "demo-password");
}

test("SP-09/11 required field errors are linked and preserve entered values", () => {
  mount();
  click("Log in");
  expect(screen.getByRole("alert")).toHaveFocus();
  for (const x of ["Email", "Password"]) {
    expect(screen.getByLabelText(x)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(x)).toHaveAccessibleDescription();
  }
  click("Sign up");
  input("Name", "Alex");
  click("Create account");
  expect(screen.getByLabelText("Name")).toHaveValue("Alex");
  for (const x of ["Email", "Password", "Confirm password"])
    expect(screen.getByLabelText(x)).toHaveAccessibleDescription();
});

test("SP-12 and email/short password validation moves focus without clearing values", () => {
  mount();
  signup();
  input("Email", "bad");
  click("Create account");
  expect(screen.getByLabelText("Email")).toHaveAccessibleDescription();
  input("Email", "alex@example.test");
  input("Password", "short");
  click("Create account");
  expect(screen.getByLabelText("Password")).toHaveAccessibleDescription();
  input("Password", "demo-password");
  input("Confirm password", "different");
  click("Create account");
  expect(screen.getByLabelText("Confirm password")).toHaveFocus();
  expect(screen.getByLabelText("Name")).toHaveValue("Alex Demo");
});

test("HP-15/16/17 SP-10 create once, duplicate email, wrong password, valid login and logout", async () => {
  const view = mount();
  signup();
  click("Create account");
  await screen.findByRole("heading", { name: "Account created" });
  expect(screen.getByRole("heading")).toHaveFocus();
  expect(screen.getByRole("status")).toHaveTextContent("ready");
  const list = JSON.parse(localStorage.getItem("careconnect-demo-accounts-v1"));
  expect(list).toHaveLength(1);
  expect(JSON.stringify(list)).not.toContain("demo-password");
  click("Go to sign in");
  click("Sign up");
  input("Name", "Other");
  input("Email", " ALEX@EXAMPLE.TEST ");
  input("Password", "demo-password");
  input("Confirm password", "demo-password");
  click("Create account");
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("already exists"),
  );
  click("Back to login");
  input("Email", "alex@example.test");
  input("Password", "wrong");
  click("Log in");
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Email or password is incorrect",
    ),
  );
  input("Password", "demo-password");
  click("Log in");
  await screen.findByRole("heading", { name: "Alex Demo" });
  expect(sessionStorage.getItem("careconnect-demo-session-v1")).toBe(
    list[0].id,
  );
  view.unmount();
  mount();
  expect(screen.getByRole("heading")).toHaveTextContent("Alex Demo");
  click("Leave");
  expect(screen.getByRole("heading")).toHaveTextContent("Log in");
});

test("HP-18/19 SP-13 recovery is account neutral and has both return paths", () => {
  mount();
  click("Forgot password?");
  click("Send reset link");
  expect(screen.getByLabelText("Email")).toHaveAccessibleDescription();
  input("Email", "invalid");
  click("Send reset link");
  expect(screen.getByLabelText("Email")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  input("Email", "unknown@example.test");
  click("Send reset link");
  const message = screen.getByRole("status").textContent;
  expect(message).toContain("If a demo account");
  expect(screen.getByRole("heading")).toHaveFocus();
  click("Try another email address");
  input("Email", "registered@example.test");
  click("Send reset link");
  expect(screen.getByRole("status")).toHaveTextContent(message);
  click("Back to sign in");
  expect(screen.getByRole("heading")).toHaveFocus();
});

test("storage errors preserve form and sample workspace; logout errors leave session", async () => {
  mount();
  signup();
  const write = jest
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw Error("Full");
    });
  click("Create account");
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not read or save",
    ),
  );
  expect(screen.getByLabelText("Name")).toHaveValue("Alex Demo");
  write.mockRestore();
  click("Back to login");
  click("Open sample workspace");
  expect(screen.getByRole("heading")).toHaveTextContent("Olivia Reed");
  const remove = jest
    .spyOn(Storage.prototype, "removeItem")
    .mockImplementation(() => {
      throw Error("Denied");
    });
  click("Leave");
  expect(screen.getByRole("heading")).toHaveTextContent("Olivia Reed");
  remove.mockRestore();
  click("Leave");
  expect(screen.getByRole("heading")).toHaveTextContent("Log in");
});

test("corrupt accounts fail safely; sample-session writes fail visibly", async () => {
  localStorage.setItem("careconnect-demo-accounts-v1", "broken");
  sessionStorage.setItem("careconnect-demo-session-v1", "unknown");
  mount();
  input("Email", "alex@example.test");
  input("Password", "password");
  click("Log in");
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not read or save",
    ),
  );
  expect(localStorage.getItem("careconnect-demo-accounts-v1")).toBe("broken");
  const write = jest
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw Error("Denied");
    });
  click("Open sample workspace");
  expect(screen.getByRole("alert")).toHaveTextContent("Could not open");
  write.mockRestore();
});

test('SP-05 busy account command cannot submit twice and exposes unavailable state', async () => {
  mount(); signup();
  let finish;
  const derive = jest.spyOn(crypto.subtle, 'deriveBits').mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  click('Create account');
  await waitFor(() => expect(screen.getByRole('button', {name: 'Please wait…'})).toBeDisabled());
  expect(screen.getByLabelText('Email')).toBeDisabled();
  fireEvent.click(screen.getByRole('button', {name: 'Please wait…'}));
  expect(derive).toHaveBeenCalledTimes(1);
  finish(new ArrayBuffer(32));
  await screen.findByRole('heading', {name: 'Account created'});
  expect(JSON.parse(localStorage.getItem('careconnect-demo-accounts-v1'))).toHaveLength(1);
});
