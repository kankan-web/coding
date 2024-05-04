//创建一个可迭代对象来访问数组
const interableObj={
  names:['bas','jks','fsf'],
  [Symbol.iterator]:function(){
    let index=0
    return {
      next:()=>{
        if(index<this.names.length){
          return {done:false,value:this.names[index++]}
        }else{
          return {done:true,value:undefined}
        }
      }
    }
  }
}
//interableObj对象就是一个可迭代对象
console.log(interableObj[Symbol.iterator])
const interator = interableObj[Symbol.iterator]()
console.log(interator.next())
console.log(interator.next())
console.log(interator.next())
console.log(interator.next())
//interableObj对象就是一个可迭代对象
console.log(interableObj[Symbol.iterator])
const interator2 = interableObj[Symbol.iterator]()
console.log(interator2.next())
console.log(interator2.next())
console.log(interator2.next())
console.log(interator2.next())
//两次创建的迭代对象互不影响
//3.for...of可以遍历的东西必须时一个可迭代对象
const obj={
  name:'why',
  age:18
}
for(const item of obj){
  console.log(item)
}