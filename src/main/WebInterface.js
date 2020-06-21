const regexp = /[A-Za-z0-9]*/g

export function isValidName (name) {
  if (typeof name !== 'string') {
    return false
  }
  if (name.length < 1) {
    return false
  }
  const match = name.match(regexp)
  if (match != null && match[0] === name && name !== 'available') {
    return true
  }
  return false
}

export function isValidMethod (methodPath) {
  if (typeof methodPath !== 'string') {
    return false
  }
  if (methodPath.length <= 3) {
    return false
  }
  return methodPath.split('.').every(isValidName)
}

export class WebInterface {
  constructor () {
    this.expose = { available: [] }
  }

  registry (name, item) {
    if (isValidName(name) && this.expose.available.indexOf(name) === -1) {
      this.expose.available.push(name)
      this.expose[name] = item
    }
  }

  getHandler () {
    return this.__handle.bind(this)
  }

  async __handle (event, method, ...args) {
    if (typeof event.frameId === 'number') {
      // console.log('is from inside', BrowserWindow.fromWebContents(event.sender).id)
    }
    if (!isValidMethod(method)) {
      return { status: -2, msg: 'invalid method', result: {} }
    }
    const path = method.split('.')
    var current = this.expose
    while (path.length > 0) {
      var target = path.shift()
      if (Array.isArray(current.available) && current.available.indexOf(target) !== -1) {
        current = current[target]
      } else {
        return { status: -2, msg: 'invalid method', result: {} }
      }
    }
    if (typeof current !== 'function') {
      return { status: -2, msg: 'invalid method', result: {} }
    } else {
      try {
        return {
          status: 0,
          msg: 'success',
          result: await current(...args)
        }
      } catch (error) {
        return {
          status: -1,
          msg: 'error',
          result: {},
          error
        }
      }
    }
  }
}
