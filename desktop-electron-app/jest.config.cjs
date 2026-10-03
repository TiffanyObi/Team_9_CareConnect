module.exports = {
  testMatch: [
    "<rootDir>/tests/jest/**/*.test.cjs",
    "<rootDir>/tests/jest/**/*.test.jsx",
  ],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/jest/setup.cjs"],
  transform: {
    "^.+\\.[cm]?jsx?$": [
      "babel-jest",
      {
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          ["@babel/preset-react", { runtime: "automatic" }],
        ],
      },
    ],
  },
  collectCoverageFrom: ["src/**/*.{js,jsx,cjs}"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "json", "json-summary", "lcov"],
  coverageThreshold: {
    global: { statements: 60, branches: 60, functions: 60, lines: 60 },
    "./src/**/*.{js,jsx,cjs}": { statements: 60, branches: 60, functions: 60, lines: 60 },
  },
  maxWorkers: 2,
};
