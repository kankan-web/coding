var __webpack_modules__ = [
  ,
  /*! unknown exports (runtime-defined) */
  /*! runtime requirements: module */
  /*! CommonJS bailout: module.exports is used directly at 1:0-14 */
  /***/ (module) => {
    module.exports = (...args) => args.reduce((x, y) => x + y, 0);
  },
];
/************************************************************************/
// The module cache：用于缓存已加载的模块，提高性能
var __webpack_module_cache__ = {};

// 是webpack的模块加载器。它检查模块是否已在缓存中，
//如果不在，则创建新模块并执行对应的模块代码，然后返回模块的导出
function __webpack_require__(moduleId) {
  // 检查模块是否在缓存中
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  // 创建一个新model，并把它放于缓存中
  var module = (__webpack_module_cache__[moduleId] = {
    // no module.id needed
    // no module.loaded needed
    exports: {},
  });

  // 执行模块函数
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

  //返回导出的模块
  return module.exports;
}

/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
//这个入口（entry）需要被包裹在一个立即执行函数表达式（IIFE）中，
//因为这样可以使其与其他模块在同一个代码块（chunk）中相互隔离。
//这样做是为了确保这个模块的执行环境独立，不会与其它模块产生不必要的作用域冲突或影响。
(() => {
  /*! unknown exports (runtime-defined) */
  /*! runtime requirements: __webpack_require__ */
  const sum = __webpack_require__(/*! ./sum */ 1);

  console.log(sum(3, 8));
})();

