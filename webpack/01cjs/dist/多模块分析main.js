var __webpack_modules__ = [
  ,
  /*! unknown exports (runtime-defined) */
  /*! runtime requirements: module */
  /*! CommonJS bailout: module.exports is used directly at 1:0-14 */
  /***/ (module) => {
    module.exports = (...args) => args.reduce((x, y) => x + y, 0);

    /***/
  },

  /*! unknown exports (runtime-defined) */
  /*! runtime requirements: module */
  /*! CommonJS bailout: module.exports is used directly at 1:0-14 */
  /***/ (module) => {
    module.exports = (...args) => args.reduce((x, y) => x - y, 0);
  },
];
/************************************************************************/
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {
  // Check if module is in cache
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  // Create a new module (and put it into the cache)
  var module = (__webpack_module_cache__[moduleId] = {
    // no module.id needed
    // no module.loaded needed
    exports: {},
  });

  // Execute the module function
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

  // Return the exports of the module
  return module.exports;
}

/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
  /*! unknown exports (runtime-defined) */
  /*! runtime requirements: __webpack_require__ */
  const sum = __webpack_require__(/*! ./sum */ 1);
  const other = __webpack_require__(/*! ./other */ 2);
  console.log(sum(3, 8));
  console.log(other(3, 8));
})();

