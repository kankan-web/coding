"use strict";
// 1. JSONP cllaback，收集 modules 至 __webpack_modules__
// 2. 代码实现参考本章最后部分源码解析
(self["webpackChunk"] = self["webpackChunk"] || []).push([
  [1],
  [
    // 1. 该 chunk 中的所有 modules，从下边可以看出也是全部由包裹函数构成
    // 2. 该 modules 的 index 为 moduleId，从以下代码可以看到 moduleId=0 为空白
    // 3. 如果该 chunk 中包含的模块的 moduleId 过大，则使用对象表示，key 为 moduleId
    [
      ,
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
          /* harmony export */
        });
        const sum = (...args) => args.reduce((x, y) => x + y, 0);

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = sum;
      },
    ],
  ],
]);

