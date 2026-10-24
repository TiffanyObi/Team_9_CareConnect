import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { careconnectPwa } from './scripts/pwa-build.mjs';

export default defineConfig({
  plugins: [react(), careconnectPwa()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/test/**'],
    },
  },
});
