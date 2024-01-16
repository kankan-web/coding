function Father(name) {
  this.name = name
  this.color = ['red', 'blue']
}
Father.prototype.sayFather = function () {
  console.log(this.name)
}
function Child(name, age) {
  //继承属性
  Father.call(this, name)
  this.age = age
}
//继承方法
Child.prototype = new Father()
Child.prototype.sayAge = function () {
  console.log(this.age)
}

let person1 = new Child('Andy', 20)
person1.color.push('block')
console.log(person1.color)//[ 'red', 'blue', 'block' ]
person1.sayFather()//Andy
person1.sayAge()//20

let person2 = new Child('Greg', 10)
console.log(person2.color)//[ 'red', 'blue' ]
person2.sayFather()//Greg
person2.sayAge()//10