function foo() {
  console.log("foo function start~");
  console.log("中间代码～");
  throw new Error("出错了");
  console.log("foo function end~");
}
async function foo1() {
  console.log("foo function start~");
  console.log("中间代码～");
  throw new Error("出错了");
  console.log("foo function end~");
}
//异步函数的返回值一定是一个promise
//1.普通函数
foo();
//2.异步函数
// foo1().catch((err) => {
//   console.log("throw Error", err);
// });
console.log("后续还有代码");
