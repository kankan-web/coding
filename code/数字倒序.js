//不是当作字符串

function newNum1(num){
  const str = String(num)
  const arr = str.split('')
  return parseInt(arr.reverse().join(''))
}
const num1 = 12345
console.log(newNum1(num1))

function newNum2(num){
  const res = []
  let newNum = 0
  while(num){
    const temp = num%10//取余
    res.push(temp)
    num = Math.floor(num/10)
  }
  
  for(let i=0;i<res.length;i++){
    newNum = newNum*10+res[i]
  }
  return newNum
}
console.log('不使用字符串',newNum2(num1))