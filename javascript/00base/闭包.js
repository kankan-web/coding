var a = 1;

function foo() {
  var a = 2;
  return function () {
    console.log(a);
  }
}

var bar = foo();
bar();

for(var i = 1; i <= 5; i ++){
  setTimeout(function() {
    console.log(i)
  }, 0)
}