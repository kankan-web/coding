//实现Promise.all
function all(promiseList){
 
  //返回值为promise
  return new Promise((resolve,reject)=>{
    const List = []
    let count = 0
    //遍历promiseList
    promiseList.forEach((item,index)=>{
      Promise.resolve(item).then(result=>{
        List[index]=result//将结果存储
        count++
        if(count===promiseList.length){
          //所有的promise已经完成
          resolve(List)
        }
      }).catch((err)=>{
        //将错误返回
        reject(err)
      })
    })
  })
}
//Promise.all([Promise1,Promise2])

console.log('结果是：',all([Promise.resolve(1),2]).then(res=>{
  console.log('res',res)
}))