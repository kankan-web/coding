const pending = 'PENDING'
const fulfilled = 'FULFILLED'
const rejected = 'REJECTED'
class HYPromise {
  constructor(executor) {
    this.status = pending
    this.value = undefined
    this.reason = undefined
    this.onFulfilledFns = []
    this.onRejectedFns = []
    const resolve = (value) => {
      if (this.status === pending) {
        queueMicrotask(() => {
          if (this.status !== pending) return
          this.status = fulfilled

          this.value = value
          console.log('resolve')
          this.onFulfilledFns.forEach(fn => fn(this.value))
        })
      }
    }
    const reject = (reason) => {
      if (this.status === pending) {
        queueMicrotask(() => {
          if (this.status !== pending) return
          this.status = fulfilled
          this.reason = reason
          console.log('reject')
          this.onRejectedFns.forEach(fn => fn(this.reason))
        })
      }
    }
    executor(resolve, reject)
  }
  then(onFulfilled, onRejected) {
    if (this.status === fulfilled) {
      onFulfilled(this.value)
    }
    if (this.status === rejected) {
      onRejected(this.reason)
    }
    if (this.status === pending) {
      this.onFulfilledFns.push(onFulfilled)
      this.onRejectedFns.push(onRejected)
    }
  }
}

const promise = new HYPromise((resolve, reject) => {
  console.log('执行')

  resolve(123)
  reject(456)

})
//1.让promise支持多次调用
promise.then((res) => {
  console.log('res1', res)
}, (err) => {
  console.log('err1', err)
})
promise.then((res) => {
  console.log('res2', res)
}, (err) => {
  console.log('err2', err)
})
setTimeout(() => {
  promise.then((res) => {
    console.log('res3', res)
  }, (err) => {
    console.log('err3', err)
  })
}, 1000)
//原生的promise
// const promise = new Promise((resolve, reject) => {
//   resolve('123')
// })
// promise.then((res) => {
//   console.log('第一次调用', res)
// }, (err) => {
//   console.log('第一次调用', err)
// })
// promise.then((res) => {
//   console.log('第2次调用', res)
// }, (err) => {
//   console.log('第2次调用', err)
// })
// setTimeout(() => {
//   promise.then((res) => {
//     console.log('第3次调用', res)
//   }, (err) => {
//     console.log('第3次调用', err)
//   })
// },1000)