const downloadFile = (url,num) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {

      if (Math.random() > 0.5) {
        reject('error')
      } else {
        
        console.log(url)
        resolve(true)
      }
    }, 100)
  })
}
/**
 * 实现一个批量下载的函数，最大并发请求为 concurrency 
 * 要求尽可能快的完成
 */
// type DownloadFiles = (urlList: string[], concurrency: number) =>Promise<boolean>


//实现一个批量下载的函数，最大并发请求为 concurrency 
const handleDownLoadFile=(urlList,concurrency )=>{
  if(concurrency>6) return '最大并发数不能超过6'
  const queue = []
  let temp = []
  for(let i=0;i<urlList.length;i++){
    const item = new Promise()
    if(i%concurrency===0){
      temp.push(item)
      queue.push(temp)
      temp=[]
    }else{
      temp.push(item)
    }
  }
  for(let j=0;j<queue.length;j++){
    // Promise.all(queue[j])
    // downloadFile(queue[j])

  }
  return new Promise((resolve,reject)=>{
    
  })
}
// console.log(handleDownLoadFile)
const urlList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

handleDownLoadFile(urlList, 3).then(() => console.log('finish'))
