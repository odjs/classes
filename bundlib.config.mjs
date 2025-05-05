import { config } from 'bundlib'

export default config({
  interop: true,
  esModule: true,
  min: ['browser', 'module'],
  equals: true,
  project: './tsconfig.build.json',
})
