function clone(target, map = new Map()) {
  if (typeof target === 'object') {
    let newObj = Array.isArray(target) ? [] : {}
    if (map.get(target)) {
      return map.get(target)
    }
    map.set(target, newObj)
    for (key in target) {
      newObj[key] = clone(target[key])
    }
    return newObj
  } else {
    return target
  }
}

