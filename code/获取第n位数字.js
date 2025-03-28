// 给定如下数列，获取第n（包括0）位数字：
// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89......
//0+1 =1
//1+1 = 2
function num(n){
  if(n<=0){
    return 
  }else if(n==1){
    return 0
  }else if(n==2){
    return 1
  }else{
    let a= 0,b=1
    for(let i=2;i<n;i++){
      let c = a + b
      a = b
      b = c
    }
    return b
  }
}
num(5)
console.log(num(5))
console.log(num(6))
console.log(num(7))
console.log(num(8))

//const arr =[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55,]

