function addBigNum(num1,num2){
  const arr1 = num1.split('').reverse().join('')
  const arr2 = num2.split('').reverse().join('')
  let result =[]//结果
  let temp = 0//控制进位
  let maxLength = Math.max(arr1.length,arr2.length)
  for(let i=0;i<maxLength;i++){
    //获取当前的数
    const item1 = i<arr1.length?parseInt(arr1[i],10):0;
    const item2 = i<arr2.length?parseInt(arr2[i],10):0;
    //计算当前的和，如果需要进位呢？
    let sum = item1+item2+temp
    temp=Math.floor(sum/10)
    result.push(sum%10)
  }
  return result.reverse().join('')
}
//长度不等
console.log(addBigNum('12345','999'))