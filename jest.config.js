const CI = process.env.CI

module.exports = {

  testEnvironment: 'node',
  browser: false,

  cacheDirectory: 'node_modules/.cache/jest',

  preset: 'ts-jest',

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    CI ? 'json' : 'lcov',
    'text',
    'text-summary',
  ],
  coverageThreshold: null,

  verbose: true,

}
