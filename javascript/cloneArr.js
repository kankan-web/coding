function cloneArr(target) {
  if (typeof target === 'object') {
    let newObj = Array.isArray(target) ? [] : {}
    for (key in target) {
      newObj[key] = cloneArr(target[key])
    }
    return newObj
  } else {
    return target
  }
}
