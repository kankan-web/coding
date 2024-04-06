const names = ['lll','nnn','bbb']
const num = [78,21,23,34,45]
function createArrayInterator(arr){
  let index=0
  return {
    next:function(){
      if(index < arr.length){
        return {done:false,value:arr[index++]}
      }else{
        return {done:true,value:undefined}
      }
    }
  }
}
const namesIterator = createArrayInterator(names)
console.log(namesIterator.next())
console.log(namesIterator.next())
console.log(namesIterator.next())
console.log(namesIterator.next())
const numIterator = createArrayInterator(num)
console.log(numIterator.next())
console.log(numIterator.next())
console.log(numIterator.next())
console.log(numIterator.next())

//创建一个无限迭代器,关键在于done永远为false
function createrNumberInterator(){
  let index=0
  return {
    next:function(){
      return {done:false,value:index++}
    }
  }
}
const numberInterator=createrNumberInterator()
console.log(numberInterator.next())
console.log(numberInterator.next())
