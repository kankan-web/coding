function Father(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
  this.sayFather = function () {
    return this.name
  }
}
function Child(father) {
  //继承Father
  Father.call(this, father)
}
let person1 = new Child('andy')
person1.colors.push('black')
console.log(person1.colors)//'red,blue,green,black'
console.log(person1.name)//father 
let person2 = new Child()
console.log(person2.colors)//'red,blue,green'
console.log(person2.sayFather())
