import { webcrypto } from 'node:crypto';
import { MessageChannel, MessagePort } from 'node:worker_threads';
import { ReadableStream, TransformStream, WritableStream } from 'node:stream/web';
import { TextDecoder, TextEncoder } from 'node:util';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, jest } from '@jest/globals';

Object.defineProperty(globalThis, 'TextDecoder', { configurable: true, value: TextDecoder });
Object.defineProperty(globalThis, 'TextEncoder', { configurable: true, value: TextEncoder });
for (const [name, value] of Object.entries({ MessageChannel, MessagePort, ReadableStream, TransformStream, WritableStream })) {
  if (!globalThis[name]) Object.defineProperty(globalThis, name, { configurable: true, value });
}

const fetchApi = require('undici');
for (const [name, value] of Object.entries(fetchApi)) {
  if (['fetch', 'Headers', 'Request', 'Response'].includes(name) && !globalThis[name]) {
    Object.defineProperty(globalThis, name, { configurable: true, value });
  }
}

if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: webcrypto });
}

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
  document.documentElement.removeAttribute('data-text-scale');
  document.documentElement.removeAttribute('data-high-contrast');
  document.documentElement.removeAttribute('data-reduced-motion');
});
