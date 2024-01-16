function Father() {
  this.father = true
  this.color = ['red', 'blue']
}
Father.prototype.sayFather = function () {
  return this.father;
}
function Child() {
  this.child = false
}
//继承Father
Child.prototype = new Father()
Child.prototype.sayChild = function () {
  return this.child
}
let instance1 = new Child()
instance1.color.push('black')
console.log(instance1.sayFather())//true
console.log(instance1.color)//[ 'red', 'blue', 'black' ]
//问题：引用类型会相互影响
let instance2 = new Child()
console.log(instance2.color)//[ 'red', 'blue', 'black' ]