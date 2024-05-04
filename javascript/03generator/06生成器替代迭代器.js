//迭代器
function createArrayIterator(arr) {
  let index = 0;
  return {
    next: function () {
      if (index < arr.length) {
        return { done: false, value: arr[index++] };
      } else {
        return { done: true, value: undefined };
      }
    },
  };
}
const names = ["abc", "cba", "bca"];
const namesIterator = createArrayIterator(names);
console.log(namesIterator.next());
console.log(namesIterator.next());
console.log(namesIterator.next());
console.log(namesIterator.next());

//生成器代替迭代器
function* createArrayIterator2(arr) {
  // //方法一：
  // let index = 0;
  // yield arr[index++];
  // yield arr[index++];
  // yield arr[index++];
  //方法二：
  // for (const item of arr) {
  //   yield item;
  // }
  //方法三:
  yield* arr;
}
const names2 = ["abc", "cba", "bca"];
const namesIterator2 = createArrayIterator2(names2);

//2.创建一个函数，这个函数可以迭代一个范围内的数字
function* createRangeIterator(start, end) {
  //方法一
  // let index=start
  // return {
  //   next:function(){
  //     if(index<end){
  //       return {done:false,value:index++}
  //     }else{
  //       return {done:true,value:undefined}
  //     }
  //   }
  // }
  //方法二：
  let index = start;
  while (index < end) {
    yield index++;
  }
}
const numbers = createRangeIterator(10, 20);
console.log(numbers.next());
console.log(numbers.next());
console.log(numbers.next());
console.log(numbers.next());
//3.class案例
class Classroom {
  constructor(address, name, students) {
    this.address = address;
    this.name = name;
    this.students = students;
  }
  entry(student) {
    this.students.push(student);
  }
  foo = () => {
    console.log("foo function");
  };
  // [Symbol.iterator]=function*(){
  //   yield* this.students;
  // }
  *[Symbol.iterator]() {
    yield* this.students;
  }
}
const classroom = new Classroom("1幢1楼", "1班", ["张三", "李四", "王五"]);
for (const item of classroom) {
  console.log("学生是：", item);
}
