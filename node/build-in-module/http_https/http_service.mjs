import http from 'http'

const server = http.createServer((req, res) => {
  // ====请求====
   // 1.获取请求的路径和方法
   const { url, method } = req
   console.log(method, url)
   //2.解析query：
   const query = Object.fromEntries(
    new URL(url, 'http://127.0.0.1:4275/').searchParams
  )
  console.log('query',query)
  //3.解析body
  let body=[]
  req.on('data',(chunk)=>{
    body.push(chunk)
  })
  .on('end', () => {
    body = Buffer.concat(body).toString()
    body = JSON.parse(body)
    console.log('body', body)
  })
  //4.请求头
  console.log('headers', req.headers)
  //====响应====
  res.statusCode = 200//状态码
  res.setHeader('Content-Type', 'text/html')//设置响应头
  res.end('<h1>Hello, World!</h1>')//终止并设置返回内容
})
server.listen(4275, () => {
  console.log('Server running at http://127.0.0.1:4275/')
})
