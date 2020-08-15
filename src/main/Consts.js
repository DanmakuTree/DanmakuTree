import path from 'path'
import { version as ProgramVersion } from '../../package.json'
import { app } from 'electron'
export const isDev = process.env.NODE_ENV === 'development'
export const isDebug = process.argv.includes('--debug')
export const version = ProgramVersion
export const gitVersion = {
  'version': process.env.GIT_VERSION || 'UNKNOWN',
  'hash': process.env.GIT_COMMITHASH || 'UNKNOWN',
  'branch': process.env.GIT_BRANCH || 'UNKNOWN'
}

export const Backend = isDev ? 'http://127.0.0.1:8369' : 'https://api.r18g.fun/api'

export const MainWindowPage = isDev ? 'http://localhost:9080/embed.html' : `file://${__dirname}/embed.html`
export const ModuleWindowPage = isDev ? 'http://localhost:9080/externalWindow.html' : `file://${__dirname}/externalWindow.html`

app.setPath('userData', app.getPath('appData') + '/DanmakuTree')
export const DataPath = app.getPath('userData')

export const MainPreloadScript = isDev
  ? path.resolve('./src/preload/main.js')
  : path.join(__dirname, 'preload/main.js')

export const BiliBiliPreloadScript = isDev
  ? path.resolve('./src/preload/bilibili.js')
  : path.join(__dirname, 'preload/bilibili.js')

export const ModulePreloadScript = isDev
  ? path.resolve('./src/preload/module.js')
  : path.join(__dirname, 'preload/module.js')
