/** @type { import('ts-jest').JestConfigWithTsJest } */
const config = {
  testEnvironment: 'node',
  preset: 'ts-jest',

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    process.env.CI ? 'json' : 'lcov',
    'text',
    'text-summary',
  ],

  testMatch: [
    '**/__test__/**/*.test.ts',
  ],

  cacheDirectory: 'node_modules/.cache/jest',
  verbose: true,
};

export default config;
