module.exports = {
  preset: 'jest-expo',
  testTimeout: 15000,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: ['App.tsx', 'src/**/*.{ts,tsx}', '!src/**/__tests__/**', '!src/types/**'],
  coverageReporters: ['text', 'html', 'lcov', 'json-summary'],
  coverageThreshold: { global: { statements: 75, lines: 75, functions: 75, branches: 65 } },
  transformIgnorePatterns: ['node_modules/(?!((jest-)?react-native[^/]*|@react-native[^/]*/[^/]+|expo[^/]*|@expo[^/]*/[^/]+|@react-navigation/[^/]+|@noble/hashes)/)'],
};
