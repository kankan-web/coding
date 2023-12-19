//发送请求，可以查看http_service获取请求后所进行的操作
//1.简单
// fetch('http://127.0.0.1:4275?hello=world', {
//   method: 'POST'
// })
// 2.复杂
fetch('http://127.0.0.1:4275?hello=world', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'xm',
    age: 18
  })
})