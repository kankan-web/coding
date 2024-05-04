function inheritPrototype(Child, Father) {
  let prototype = Object.create(Father.prototype)//创建对象
  prototype.constructor = Child//增强对象
  Child.prototype = prototype//赋值对象
}
function Father(name) {
  this.name = name
  this.colors = ['red', 'blue']
}
Father.prototype.sayName = function () {
  console.log(this.name)
}
function Child(name, age) {
  Father.call(this, name)
  this.age = age
}
inheritPrototype(Child, Father)
Child.prototype.sayAge = function () {
  console.log(this.age)
}
const person1 = new Child('Andy', 20)
person1.colors.push('yello')
console.log(person1.colors)//[ 'red', 'blue', 'yello' ]
person1.sayName()//Andy
person1.sayAge()//20

const person2 = new Child('Kobe', 34)
console.log(person2.colors)
person2.sayName()//Kobe
person2.sayAge()//34