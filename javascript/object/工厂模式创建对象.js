//无法准确知道对象的标识
function createPerson(name, age, job) {
  let obj = new Object()
  obj.name = name;
  obj.age = age;
  obj.job = job;
  obj.sayName = function () {
    console.log(this.name)
  }
  return obj;
}
let person1 = createPerson('Nart', 30, 'Doctor')
let person2 = createPerson('Andy', 20, 'Software Engineer')