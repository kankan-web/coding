/**
 * 1.第一题：foo1、foo2
 * 解：
 * 1. foo都会作为变量被加入到GlobalObject，并且属性值为undefined
 * 2. 执行到赋值语句时，foo一开始的值为foo1函数地址
 * 3. 调用foo()函数，输出为foo1
 * 4. 再执行到赋值语句，foo赋值为foo2函数地址
 * 5. 调用foo()函数，输出为foo2
 */
// var foo = function () {
//   console.log('foo1');
// }

// foo();

// var foo = function () {
//   console.log('foo2');
// }

// foo();
/**
 * 2.题目2
 * 1.构建GlobalObject，由于函数声明优先于变量声明，此时foo存储的是foo2函数地址
 * 2.调用foo()，输出foo2
 * 3.经过赋值语句，将foo中存储的地址转为foo1
 * 4.调用foo()，输出foo1
 */
// foo();

// var foo = function foo() {
//   console.log('foo1');
// }

// function foo() {
//   console.log('foo2');
// }

// foo();
/**
 * 3.第三题：undefined、10
 * 由于var定义的变量会进行变量提升，
 * 所以函数执行上下文在预编译时就已经将foo作为了变量对象并赋值为undefined
 */
// var foo = 1;
// function bar() {
//   console.log(foo);
//   var foo = 10;
//   console.log(foo);
// }

// bar();
/**
 * 4.第四题
 * 函数作用域中没有定义foo变量，因此会往上级查找
 */
// var foo = 1;
// function bar() {
//   console.log(foo);
//   foo = 2;
// }
// bar();
// console.log(foo);

