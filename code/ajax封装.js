// 封装一个 ajax 请求方法
// 描述：请使用 fetch 封装一个 request 方法，支持 GET 和 POST 请求，并具有超时功能。
function request(url, options) {
  // 实现代码
  //默认配置
  const defaultOption={
    headers:{
      'Content-type':'application/json'
    },
    timeout:4000,//设置超时时间
  }
  
  //合并参数
  const param = {...defaultOption,...options}

  //超时处理
  const timeoutData = new Promise((resolve,reject)=>{
    setTimeout(()=>{
      reject(new Error('请求超时了'))
    },param.timeout)
  })

  const fetchData = fetch(url,param)
  return Promise.race([timeoutData,fetchData]).then((res)=>{
    if(res.msg!=='success'){
      throw new Error('请求失败')
    }
    return res.json()//返回结果
  }).catch((err)=>{
    console.log('请求失败')
    throw err
  })
}
//get请求
request('https://xxx.com/data',{
  method:'GET'
}).then((data)=>{
 console.log('data',data)
}).catch((err)=>{

})
//post请求
request('https://xxx.com/data',{
  method:"POST",
  body:JSON.stringify({key:'value'})
}).then((res)=>{
  console.log('data',res)
})