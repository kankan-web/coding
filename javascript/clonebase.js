function clonebase(target) {
  if (typeof target === 'object') {
    let newObj = {}
    for (key in target) {
      newObj[key] = clonebase(target[key])
    }
    return newObj
  } else {
    return target
  }
}

