const PROMISE_STATUS_PENDING = 'PENDING'
const PROMISE_STATUS_FULFILLED = 'FULFILLED'
const PROMISE_STATUS_REJECTED = 'REJECTED'
class HYPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined
    this.reason = undefined
    const resolve = (value) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        this.status = PROMISE_STATUS_FULFILLED
        queueMicrotask(() => {
          this.value = value
          console.log('resolve')
          this.onFulfilled(this.value)
        })
      }
    }
    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        this.status = PROMISE_STATUS_REJECTED
        queueMicrotask(() => {
          this.reason = reason
          console.log('reject')
          this.onRejected(this.reason)
        })
      }
    }
    executor(resolve, reject)
  }
  then(onFulfilled, onRejected) {
    this.onFulfilled = onFulfilled
    this.onRejected = onRejected
  }
}

const promise = new HYPromise((resolve, reject) => {
  console.log('执行')
  reject(456)

  resolve(123)
})
promise.then((res) => {
  console.log('res', res)
}, (err) => {
  console.log('err', err)
})