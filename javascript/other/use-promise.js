async function foo() {
  const res = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('张三');
    }, 1000);
  });
  return res
}
const obj = foo()
// obj.then((res) => {
//   console.log(res)
// })
console.log(obj)