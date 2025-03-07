//fn.bind(obj)
Function.prototype.myBind=function (context){
  if(typeof this!=='function'){
    throw new TypeError('必须是个function')
  }
  const fn = this;
  //获取参数
  const arg = Array.prototype.slice(arguments,1)
  
  return function (){
    //传递剩余参数
    const newAges = arg.concat(Array.prototype.slice.call(arguments))
    //绑定上下文，传入合并后的对象
    return fn.apply(context,newAges)
  }
}