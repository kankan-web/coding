function createAnother(origin) {
  //通过调用函数创建一个新对象
  let clone = Object.create(origin)
  // 以某种方式增强这个对象
  clone.sayHi = function () {
    console.log('hi')
  }
  return clone
}


