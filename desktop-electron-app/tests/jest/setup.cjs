require("@testing-library/jest-dom");
const { webcrypto } = require("node:crypto");
const { TextEncoder, TextDecoder } = require("node:util");
Object.defineProperty(globalThis, "crypto", {
  value: webcrypto,
  configurable: true,
});
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;
if (typeof window !== "undefined") {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
  Object.defineProperty(HTMLElement.prototype, "offsetParent", {
    get() {
      return this.parentElement;
    },
  });
}
afterEach(() => {
  if (typeof window !== "undefined") {
    localStorage.clear();
    sessionStorage.clear();
    delete window.desktop;
  }
  jest.restoreAllMocks();
});
