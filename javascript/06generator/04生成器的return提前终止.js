function* foo() {
  console.log("函数开始执行～");
  const value1 = 100;
  console.log("第一段代码", value1);
  const n = yield value1; //暂停时的返回值

  const value2 = 200;
  console.log("第二段代码", value2);
  yield;

  const value3 = 300;
  console.log("第三段代码", value3);
  yield;

  console.log("函数执行结束～");
  return "123";
}
const generator = foo();
console.log("返回值1：", generator.next());
console.log("返回值2：", generator.return());
console.log("返回值3：", generator.next());
console.log("返回值4：", generator.next());
