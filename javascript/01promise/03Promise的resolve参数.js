/**
 * resolve(参数)
 * 1. 普通的值获取对象 pending->fulfilled
 * 2.传入一个promise
 *  那么当前的promise的状态会由传入的promise来决定
 *  相当于状态进行了移交
 * 3.传入一个对象，并且这个对象有实现then方法（并且这个对象是实现了thenable）
 *  那么也会执行该then方法，并且由该then方法决定后续状态
 */
const promise = new Promise((resolve, reject) => {
  resolve('hello')
  reject('err message')
})
new Promise((resolve, reject) => {
  // resolve(promise)
  const obj = {
    then: function (resolve, reject) {
      resolve('thenable value')
    }
  }
  resolve(obj)
}).then(res => {
  console.log('请求成功：', res)
}).catch(err => {
  console.log('请求失败：', err)
})