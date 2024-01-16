function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function () {
    console.log(this.name)
  }
}
const person1 = new Person('Nart', 30, 'Doctor')
const person2 = new Person('Andy', 20, 'Software Engineer')
console.log(person1.constructor === Person)
console.log(person2.constructor === Person)
console.log(person1 instanceof Person)
console.log(person1 instanceof Object)
// true
// true
// true
// true