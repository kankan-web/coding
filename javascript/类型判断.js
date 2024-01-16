function getType(target) {
  let type = typeof target
  if (type !== 'object') {
    return type
  } else {
    return Object.prototype.toString.call(target).replace(/^\[object (\S+)\]$/, '$1')
  }
}

