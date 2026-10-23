module.exports = {
  testEnvironment: 'jsdom',
  testTimeout: 15000,
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js'],
  testMatch: ['<rootDir>/src/**/*.test.[jt]s?(x)'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/test/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageProvider: 'v8',
  coverageReporters: ['text', 'html', 'lcov'],
};
