"use strict";
var a = 1;

function foo() {
  var a = 2;
  return function () {
    console.log(this.a);
  }
}

var bar = foo().bind(this);
bar();
