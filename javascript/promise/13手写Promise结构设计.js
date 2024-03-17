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
        this.value = value
        console.log('resolve')

      }
    }
    const reject = (reason) => {
      if (this.status === PROMISE_STATUS_PENDING) {
        this.status = PROMISE_STATUS_REJECTED
        this.reason = reason
        console.log('reject')
      }
    }
    executor(resolve, reject)

  }
}

const promise = new HYPromise((resolve, reject) => {
  console.log('执行')
  resolve(123)
  reject()
})