function object(o) {
  function F() { }
  F.prototype = o
  return new F()
}
let person = {
  name: 'andy',
  color: ['red', 'blue']
}
let person1 = object(person)
person1.color.push('yellow')
console.log(person1)// {}
console.log(person1.name)//andy
console.log(person1.color)//[ 'red', 'blue', 'yellow' ]

let person2 = object(person)
person2.color.push('green')
person2.name = 'Niko'
console.log(person2.name)//Niko
console.log(person2.color)//[ 'red', 'blue', 'yellow', 'green' ]
//Object.create
let person3 = Object.create(person)
console.log(person3.name)
console.log(person3)