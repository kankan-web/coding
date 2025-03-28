function formatNumberWithCommas(s) {
  
  //小数点判断
  const has = s.includes('.')
  let result = ''
  let count = 0
  //处理有小点
  
    let [newS1,newS2] = s.split('.')//根据小数点来进行分割
    newS1 = newS1.replace(/^0+/,"")//处理开头为0

    for(let i=newS1.length-1;i>=0;i--){
      result=newS1[i]+result
      count++
      if(count===3&&i!==0){
        result=","+result
        count=0
      }
    }
    if(has){
      result+='.'+newS2
    }
  
  return result
}

// 测试样例
console.log(formatNumberWithCommas("1294512.12412")); // '1,294,512.12412'
console.log(formatNumberWithCommas("0000123456789.99")); // '123,456,789.99'
console.log(formatNumberWithCommas("987654321")); // '987,654,321'