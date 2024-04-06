//模拟异步请求
function getUserInfo() {
     return new Promise((resolve, reject) => {
         setTimeout(() => {
             reject('请求出现错误111111')
         }, 1000)
     })
}
function getOtherInfo(){
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve('请求出现错误222222')
      }, 1000)
  })
}
//发送异步请求，捕获异常
//两次异步请求，只使用一次try-catch进行包裹
async function loggedIn1111() {
     try {
         // 执行中断
         let userInfo = await getUserInfo()
         console.log('loggedIn1111-执行11111')
         let otherInfo = await getOtherInfo()
         console.log('loggedIn1111-执行22222')
     } catch(e) {
         console.log(e)
     }
}
loggedIn1111()
// //两次异步请求，分别使用try-catch进行包裹
async function loggedIn2222() {
     try {
         // 执行中断
         let userInfo = await getUserInfo()
         console.log('loggedIn2222-执行11111')
        
     } catch(e) {
         console.log(e)
     }
     try {
         // 执行中断
         let otherInfo = await getOtherInfo()
         console.log('loggedIn2222-执行22222')
     }catch(e) {
         console.log(e)
     }
}
loggedIn2222()