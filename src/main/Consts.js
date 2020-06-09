import path from 'path'
import { version as ProgramVersion } from '../../package.json'
export const isDev = process.env.NODE_ENV === 'development'
export const isDebug = process.argv.includes('--debug')
export const version = ProgramVersion
export const Backend = 'https://api.r18g.fun'

export const MainWindowPage = isDev ? 'http://localhost:9080' : `file://${__dirname}/index.html`

export const MainPreloadScript = isDev
  ? path.resolve('./src/preload/main.js')
  : path.join(__dirname, 'preload/main.js')

export const CaptchaPreloadScript = isDev
  ? path.resolve('./src/preload/captcha.js')
  : path.join(__dirname, 'preload/captcha.js')

export const PluginPreloadScript = isDev
  ? path.resolve('./src/preload/plugin.js')
  : path.join(__dirname, 'preload/plugin.js')
