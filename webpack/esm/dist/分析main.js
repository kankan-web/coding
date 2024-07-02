(() => {
  // webpackBootstrap
  ("use strict");
  var __webpack_modules__ = [
    ,
    /* 0 */ /* 1 */
    /***/ (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      __webpack_require__.r(__webpack_exports__);
      /**
       * __webpack_require__.d是用来动态定义模块导出的对象。这里它定义了两个导出项：
       * 一个是默认导出（default），另一个是具名导出（name）。在调用时，
       * 它并不直接依赖于sum函数和name变量的具体值，而是创建了导出的占位符。
       * 实际的值（即sum函数和name字符串）会在后续代码中被赋予这些导出项。
       */
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
        /* harmony export */ name: () => /* binding */ name,
        /* harmony export */
      });
      const sum = (...args) => args.reduce((x, y) => x + y, 0);

      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = sum;

      const name = "sum";
    },
  ];
  /************************************************************************/
  // 用于缓存已加载的模块，提高性能
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

    // 返回导出的模块
    return module.exports;
  }

  /************************************************************************/
  /* webpack/runtime/define property getters */
  //作用：为模块添加属性，并确保属性是可枚举的
  (() => {
    // define getter functions for harmony exports
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (
          //确保key在definition中存在并且不在exports中
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          //为exports对象添加一系列可枚举的属性，这些属性值为definition对应的值
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
        }
      }
    };
  })();

  /* webpack/runtime/hasOwnProperty shorthand */
  //作用：判断一个对象是否具有某个属性，而非从原型链上继承而来的属性
  //Object.prototype.hasOwnProperty.call(obj, prop)//这种方法更通用
  //obj.hasOwnProperty(prop)
  (() => {
    __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();

  /* webpack/runtime/make namespace object */
  //作用：将一个对象标记为esmodel，并转换为一个具有Symbol.toStringTag属性的对象。
  (() => {
    // define __esModule on exports
    __webpack_require__.r = (exports) => {
      //用于判断当前环境是否支持Symbol的存在，如果存在，则设置对象的Symbol.toStringTag属性为"Module"。
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      }
      //设置对象的__esModule属性为true。
      //这个属性用于标识一个模块是否是一个ES模块，
      //如果一个模块没有被标记为ES模块，则它默认是一个CommonJS模块。
      Object.defineProperty(exports, "__esModule", { value: true });
    };
  })();

  /************************************************************************/
  var __webpack_exports__ = {};
  // 这个入口（entry）需要被包裹在一个立即执行函数表达式（IIFE）中，
  //因为这样可以使其与其他模块在同一个代码块（chunk）中相互隔离。
  //这样做是为了确保这个模块的执行环境独立，不会与其它模块产生不必要的作用域冲突或影响。 (() => {
  __webpack_require__.r(__webpack_exports__); //用于标记__webpack_exports__对象为ES模块。
  /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */ sum: () =>
      /* reexport safe */ _sum__WEBPACK_IMPORTED_MODULE_0__["default"],
    /* harmony export */
  });
  /* harmony import */ var _sum__WEBPACK_IMPORTED_MODULE_0__ =
    __webpack_require__(1);

  console.log((0, _sum__WEBPACK_IMPORTED_MODULE_0__["default"])(3, 4));
  console.log(_sum__WEBPACK_IMPORTED_MODULE_0__.name);
  console.log(_sum__WEBPACK_IMPORTED_MODULE_0__);
})();

