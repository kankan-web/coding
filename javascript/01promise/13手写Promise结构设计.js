//三种状态定义
const PROMISE_STATUS_PENDING = 'PENDING'
const PROMISE_STATUS_FULFILLED = 'FULFILLED'
const PROMISE_STATUS_REJECTED = 'REJECTED'
class MPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING
    this.value = undefined// 成功之后的值
    this.reason = undefined// 失败的原因
    //resolve和reject函数
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
    // 同步调用执行器ß
    executor(resolve, reject)

  }
}

const promise = new HYPromise((resolve, reject) => {
  console.log('执行')
  resolve(123)
  reject()
})