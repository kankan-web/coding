async function foo() {
  console.log("foo function start~");
  console.log("中间代码～");
  console.log("foo function end~");
  //1.返回一个值：
  // return "hello world";
  //2。返回thenable
  // return {
  //   then: function (resolve, reject) {
  //     resolve("hello world");
  //   },
  // };
  //3.返回promise
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("hello world");
    }, 20000);
  });
}
//异步函数的返回值一定是一个promise
const promise = foo();
promise.then((res) => {
  console.log("promise then function exec:", res);
});
