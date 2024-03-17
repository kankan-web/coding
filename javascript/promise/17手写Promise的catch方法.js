const pending = 'PENDING'
const fulfilled = 'FULFILLED'
const rejected = 'REJECTED'
function execFunctionWithCatchError(execFn, value, resolve, reject) {
  try {
    const result = execFn(value)
    resolve(result)
  } catch (err) {
    reject(err)
  }
}
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
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }
  then(onFulfilled, onRejected) {
    onRejected = onRejected || function (err) {
      throw err
    }

    return new HYPromise((resolve, reject) => {
      if (this.status === fulfilled && onFulfilled) {
        execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
      }
      if (this.status === rejected && onRejected) {
        execFunctionWithCatchError(onRejected, this.reason, resolve, reject)
      }
      if (this.status === pending) {
        onFulfilled && this.onFulfilledFns.push(() => {
          execFunctionWithCatchError(onFulfilled, this.value, resolve, reject)
        })
        onRejected && this.onRejectedFns.push(() => {
          execFunctionWithCatchError(onRejected, this.reason, resolve, reject)
        })
      }
    })
  }
  catch(onRejected) {
    return this.then(undefined, onRejected)
  }
}
