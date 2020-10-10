/* This modulue intend to mock the following statement:
 *
 * import { app } from 'electron'
 *
 * and
 *
 * import { session } from 'electron'
 *
 * because when running the `./Platform` code in pure node.js environment,
 * there'll be no 'electron' to import from, and that break the code.
 *
 * by using isDev = process.env.NODE_ENV === 'development', and use `require` instead of `import`
 * the intentional design might work. Let's hope!
 *
 * NOTE: as well, on Windows it need `cross-env` as dev-dependency to set the NODE_ENV
*/

const isDev = process.env.NODE_ENV === 'development'

var _app = {}
_app.pathKV = { 'appData': '.' }
_app.setPath = function (key, value) { _app.pathKV[key] = value }
_app.getPath = function (key) { return _app.pathKV[key] }

var _session = {}
_session.defaultSession = {}
_session.defaultSession.clearStorageData = console.log

let _appElectron
let _sessionElectron

if (!isDev) {
  _appElectron = require('electron').app
  _sessionElectron = require('electron').session
}

export const appMock = isDev ? _app : 404
export const app = isDev ? _app : _appElectron
export const sessionMock = isDev ? _session : 404
export const session = isDev ? _session : _sessionElectron
