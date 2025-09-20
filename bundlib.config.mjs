import { defineConfig } from 'bundlib'

export default defineConfig({
  interop: true,
  esModule: true,
  min: ['browser', 'module'],
  equals: true,
  project: './tsconfig.build.json',
})
