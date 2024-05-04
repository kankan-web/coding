//1. 编写一个迭代器
// const interator={
//   next:function(){
//     return {done:true,value:1234}
//   }
// }
//2. 查看原生迭代器内容
const names = ['abc','cba','nab']
const array1 = ['a', 'b', 'c'];
const iterator1 = array1[Symbol.iterator]();
console.log(iterator1.next())
console.log(iterator1.next())
console.log(iterator1.next())
console.log(iterator1.next())


//3.自定义迭代器对象访问数组
let index=0
const namesIterator={
  next:function(){
    if(index<names.length){
      return {done:false,value:names[index++]}
    }else{
      return {done:true,value:undefined}
    }
  }
}
console.log(namesIterator.next())
console.log(namesIterator.next())
console.log(namesIterator.next())
console.log(namesIterator.next())
console.log(namesIterator.next())