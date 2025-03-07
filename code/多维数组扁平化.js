// 多维数组扁平化。 

const arr = [2,1,[3,4,[5,6,7]],9,[10,11]]; 

function steamroller (arr) {
  const newArr =[]
  function foo(list){
    if(list.length<=0) return 
    list.forEach(item=>{
      if(!Array.isArray(item)){
        newArr.push(item)
      }else{
        foo(item)
      }
    })
  }
  foo(arr)
  
  newArr.sort((a,b)=>a-b)
  return newArr
} 

console.log(steamroller(arr)); // [ 1, 2, 3, 4, 5, 6, 7, 9, 10, 11 ]