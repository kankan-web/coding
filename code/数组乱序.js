function newArr(arr){
  //遍历
  for(let i=arr.length-1;i>0;i--){
    let j = Math.floor(Math.random())*(i+1)
    //进行交换
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}
const num1 = [1,,2,3,4,5]
// newArr(num1)
console.log(newArr(num1))