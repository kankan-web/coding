function fooFn() {
  return new Promise((resolve, reject) => {
    let err = new Error('error code:401')
    err.code = 1007
    err.err_msg = '我是错误信息'
    reject(err)
  })
}

async function newErrorFun() {
  try {
    await fooFn()
  } catch (error) {
    console.log('test:', error.code, error.err_msg)
  }
}

newErrorFun()