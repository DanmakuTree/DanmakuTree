function rand (element) {
  if (element === 0) { return element }
  var result
  var a

  switch (typeof (element)) {
    case 'string':
      // console.log(element.length);
      for (a = ''; a.length < element.length;) a += '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'[(Math.random() * 60) | 0]
      result = a
      break
    case 'number':
      // console.log(element.toString().length);
      var b = element.toString()
      for (a = '123456789'[(Math.random() * 9) | 0]; a.length < b.length;) a += '0123456789'[(Math.random() * 10) | 0]
      result = parseInt(a, 10)
      break
    default:
      break
  }

  return result
}

export default rand
