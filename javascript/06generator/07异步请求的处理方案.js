function requestData(url) {
  //异步请求的代码放入到executor中
  return new Promise((resolve, reject) => {
    //模拟网络请求
    setTimeout(() => {
      resolve(url);
    }, 1000);
  });
}
// requestData("hello")
//   .then((res) => {
//     console.log("res", res);
//   })
//   .catch((err) => {
//     console.log("err", err);
//   });
//需求：
//1>url:hello->res:hello
//2>url:world->res:helloworld
//3>url:123->res:helloworld123
//方法一：回调地狱的方式：
// requestData("hello").then((res) => {
//   requestData(res + "world").then((res) => {
//     requestData(res + "123").then((res) => {
//       console.log(res);
//     });
//   });
// });
//方法二：利用promise的返回值
requestData("hello")
  .then((res) => {
    return requestData(res + "world");
  })
  .then((res) => {
    return requestData(res + "123");
  })
  .then((res) => {
    console.log("2222", res);
  });
//方法三：Promise+generator实现
function* getData() {
  const res1 = yield requestData("hello");
  const res2 = yield requestData(res1 + "world");
  const res3 = yield requestData(res2 + "world");
  console.log("3333", res3);
}
//手动执行
// const generator = getData();
// generator.next().value.then((res) => {
//   generator.next(res).value.then((res) => {
//     generator.next(res).value.then((res) => {
//       generator.next(res);
//     });
//   });
// });
//自动执行
function execGenerator(genFn) {
  const generator = genFn();
  function exec(res) {
    const result = generator.next(res);
    if (result.done) {
      return result.value;
    }
    result.value.then((res) => {
      exec(res);
    });
  }
  exec();
}
execGenerator(getData);
//方法四：async+await
async function getData2() {
  const res1 = await requestData("hello");
  const res2 = await requestData(res1 + "world");
  const res3 = await requestData(res2 + "world");
  console.log("4444", res3);
}
getData2();
