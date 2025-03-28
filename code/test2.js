function compose(middleware) {
  //返回的是一个函数
  return function(){
    //这里进行递归
    function foo(index){
      if(index===middleware.length) return 
      const fun = middleware[index]
      fun(()=>foo(index+1))//
    }
    foo(0)
  }
}
const middleware = compose([
    (next) => {
        console.log(1);
        next();
        console.log(2);
    },
    (next) => {
        console.log(3);
        next();
        console.log(4);
    },
])

// 实现compose函数使输出结果如下
middleware(); // 输出：1, 3, 4, 2