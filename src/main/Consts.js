import path from 'path'
import { version as ProgramVersion } from '../../package.json'
export const isDev = process.env.NODE_ENV === 'development'
export const isDebug = process.argv.includes('--debug')
export const version = ProgramVersion
export const Backend = 'https://api.r18g.fun/api'

export const MainWindowPage = isDev ? 'http://localhost:9080' : `file://${__dirname}/index.html`
export const ModuleWindowPage = isDev ? 'http://localhost:9080' : `file://${__dirname}/index.html`

export const MainPreloadScript = isDev
  ? path.resolve('./src/preload/main.js')
  : path.join(__dirname, 'preload/main.js')

export const BiliBiliPreloadScript = isDev
  ? path.resolve('./src/preload/bilibili.js')
  : path.join(__dirname, 'preload/bilibili.js')

export const ModulePreloadScript = isDev
  ? path.resolve('./src/preload/module.js')
  : path.join(__dirname, 'preload/module.js')
