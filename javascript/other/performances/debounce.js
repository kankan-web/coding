//普通函数防抖
function debounce1(func, delay) {
  //1.定义一个定时器，保存上一次的定时器
  let timer;
  //2.返回一个函数，这个函数就是防抖函数
  return function () {
    let context = this;
    let args = arguments;
    //3.如果定时器存在，则清除定时器，否则不处理
    timer ? clearTimeout(timer) : null
    //4.重新设置定时器,进行延迟执行
    timer = setTimeout(() => {
      //5.执行函数
      func.apply(context, args)
    }, delay)
  }
}
//增加立即执行,immediate,默认不立即执行
function debounce2(func, delay, immediate = false) {
  //1.一个定时器，保存上一次的定时器
  let timer;
  //2.用于标识
  let isFlag = false
  return function () {
    let context = this;
    let args = arguments;
    //3.如果定时器存在，则清除定时器，否则不处理
    timer ? clearTimeout(timer) : null;
    //4.如果需要第一次执行，则进入第一次执行
    if (immediate && !isFlag) {
      //5.执行函数
      func.apply(context, args)
      //6.改变isFlag的值
      isFlag = true
    } else {
      timer = setTimeout(() => {
        func.apply(context, args)
        //7.执行完成后将falg置为false，用于下次立即执行判断
        isFlag = false
      }, delay)
    }
  }
}
