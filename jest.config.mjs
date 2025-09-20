import { createDefaultPreset } from 'ts-jest'

const coverageOnCI = process.env.CI

const typescriptJestPreset = createDefaultPreset({
  tsconfig: './tsconfig.json',
})

/** @type { import('ts-jest').JestConfigWithTsJest } */
const config = {
  ...typescriptJestPreset,

  testEnvironment: 'node',

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: coverageOnCI
    ? ['text', 'json', 'clover', 'cobertura']
    : ['text', 'html'],

  testMatch: [
    '**/__test__/**/*.test.ts',
  ],

  cacheDirectory: 'node_modules/.cache/jest',
  verbose: true,
}

export default config
