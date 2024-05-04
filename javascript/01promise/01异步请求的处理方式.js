//非promise
function request(url, successCallBack, failCallBack) {
  setTimeout(() => {
    if (url === "hello") {
      //如果为hello则表示请求成功
      const name = "Andy";
      successCallBack(name);
    } else {
      //否则表示请求失败
      const message = "请求失败，url错误";
      failCallBack(message);
    }
  }, 3000);
}
const res = request(
  "hello",
  (res) => {
    console.log("成功的回调函数", res);
  },
  (err) => {
    console.log("失败的回调函数", err);
  }
);
//promise
function requestData(url) {
  //异步请求的代码放入到executor中
  return new Promise((resolve, reject) => {
    //模拟网络请求
    setTimeout(() => {
      if (url === "hello") {
        let names = ["bac", "fsai"];
        resolve(names);
      } else {
        let errMessage = "请求失败,url错误";
        reject(errMessage);
      }
    }, 3000);
  });
}
