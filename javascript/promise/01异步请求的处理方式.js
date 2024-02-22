function request(url, successCallBack, failCallBack) {
  setTimeout(() => {
    if (url === 'hello') {//如果为hello则表示请求成功
      const name = 'Andy'
      successCallBack(name)
    } else {//否则表示请求失败
      const message = "请求失败，url错误"
      failCallBack(message)
    }
  }, 3000)
}
const res = request('hello', (res) => {
  console.log('成功的回调函数', res)
}, (err) => {
  console.log('失败的回调函数', err)
})