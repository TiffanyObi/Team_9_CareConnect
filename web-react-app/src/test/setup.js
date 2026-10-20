import { webcrypto } from 'node:crypto';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: webcrypto });
}

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-text-scale');
  document.documentElement.removeAttribute('data-high-contrast');
  document.documentElement.removeAttribute('data-reduced-motion');
});
