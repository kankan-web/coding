/**
 * Prmoise中直接传入的函数被称为executor
 * 这个回调函数有两个参数：resolve、rejecte
 * - resolve：回调函数，在成功时，回调resolve函数
 * - rejecte：回调函数，在失败时，回调rejecte函数
 */
function foo() {
  return new Promise((resolve, reject) => {
    resolve()
  })
}
const promise1 = foo()

const promise2 = new Promise((resolve, reject) => {
  console.log('立即执行里面的代码')
  resolve('success')
  console.log('继续执行代码')
  // reject('fail')
})
promise2.then((res) => {
  console.log('请求成功', res)
}, (err) => {
  console.log('请求失败', err)
})

promise1.then((res) => {
  console.log('请求成功', res)
})
promise1.catch((err) => {
  console.log('请求失败', err)
})