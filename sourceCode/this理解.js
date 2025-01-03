//  const vm = new Vue({
//         data: {
//             name: '我是若川',
//         },
//         methods: {
//             sayName(){
//                 console.log(this.name);
//             }
//         },
//     });
function Person(options){
}

const p = new Person({
    data: {
        name: '若川'
    },
    methods: {
        sayName(){
            console.log(this.name);
        }
    }
});

console.log(p.name);
// undefined
console.log(p.sayName());
// Uncaught TypeError: p.sayName is not a function

function Vue(options){
  this._init(options);
  initMixin(Vue);
}
function initMixin(Vue){
  Vue.prototype._init = function(options){}
}