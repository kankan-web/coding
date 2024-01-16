var a = 1;

function foo() {
  var a = 2;
  return function () {
    console.log(a);
  }
}

var bar = foo();
bar();