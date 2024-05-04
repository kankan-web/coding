function* foo() {
  console.log("函数开始执行～");

  const value1 = 100;
  try {
    yield value1; //暂停时的返回值
  } catch (error) {
    console.log("捕获到异常情况：", error);
  }

  const value2 = 200;
  yield value2;

  console.log("函数执行结束～");
}
const generator = foo();
console.log("返回值1：", generator.next());
console.log("返回值2：", generator.throw());
