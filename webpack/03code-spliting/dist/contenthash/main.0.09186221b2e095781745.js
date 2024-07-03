(() => {
  // webpackBootstrap
  var __webpack_modules__ = {};
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

    //返回导出的模块
    return module.exports;
  }

  // 暴露模块对象 (__webpack_modules__)
  __webpack_require__.m = __webpack_modules__;

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

  /* webpack/runtime/ensure chunk */
  (() => {
    __webpack_require__.f = {};
    // 这个文件仅包含入口块。
    // 用于加载额外代码块的区块加载函数。
    __webpack_require__.e = (chunkId) => {
      return Promise.all(
        Object.keys(__webpack_require__.f).reduce((promises, key) => {
          __webpack_require__.f[key](chunkId, promises);
          return promises;
        }, [])
      );
    };
  })();

  /* webpack/runtime/get javascript chunk filename */
  //函数作用是为webpack异步加载的代码块（chunk）生成文件名。
  (() => {
    // 此函数允许引用异步代码块。
    __webpack_require__.u = (chunkId) => {
      // 根据模板返回文件名的URL
      return (
        "" +
        chunkId +
        "." +
        chunkId +
        "." +
        "873db9a376d0f5b48e8f" +
        ".chunk.js"
      );
    };
  })();

  /* webpack/runtime/global */
  //该作用：是判断当前环境并返回对应的全局变量引用
  (() => {
    __webpack_require__.g = (function () {
      if (typeof globalThis === "object") return globalThis;
      try {
        return this || new Function("return this")();
      } catch (e) {
        if (typeof window === "object") return window;
      }
    })();
  })();

  /* webpack/runtime/hasOwnProperty shorthand */
  //作用：判断一个对象是否具有某个属性，而非从原型链上继承而来的属性
  (() => {
    __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();

  /* webpack/runtime/load script */
  (() => {
    //起到缓存的作用
    var inProgress = {};
    // “data-webpack未被使用，因为构建没有唯一的名称。”
    // 用于加载脚本，并确保脚本加载成功。
    __webpack_require__.l = (url, done, key, chunkId) => {
      if (inProgress[url]) {
        inProgress[url].push(done);
        return;
      }
      //用于在页面中查找指定src属性的script标签，并将标签对应的src属性值与传入的url进行比较。
      //如果匹配则将s赋值给script变量，并结束循环
      var script, needAttach;
      if (key !== undefined) {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
          var s = scripts[i];
          if (s.getAttribute("src") == url) {
            script = s;
            break;
          }
        }
      }
      //如果script值不存在，则创建script元素，初始化script元素属性
      //如果存在__webpack_require__.nc，则将script元素的nonce属性设置为__webpack_require__.nc的值。
      //nonce（数字唯一标识）用于增强安全性和避免跨站脚本攻击（XSS）。
      if (!script) {
        needAttach = true;
        script = document.createElement("script");

        script.charset = "utf-8";
        script.timeout = 120;
        if (__webpack_require__.nc) {
          script.setAttribute("nonce", __webpack_require__.nc);
        }

        script.src = url;
      }
      inProgress[url] = [done]; //将url作为key，done函数作为value，添加到inProgress对象中。
      //用于异步加载外部脚本，并处理加载完成或加载失败的情况。
      var onScriptComplete = (prev, event) => {
        // 避免在IE中造成的内存泄露
        script.onerror = script.onload = null;
        clearTimeout(timeout); //取消之前设置的定时器
        var doneFns = inProgress[url];
        delete inProgress[url]; //删除inProgress对象中的当前url对应的键值对
        script.parentNode && script.parentNode.removeChild(script); //如果加载脚本节点存在，则将其移出
        doneFns && doneFns.forEach((fn) => fn(event));
        if (prev) return prev(event);
      };
      //超时定时器，如果脚步在2分钟内未完成，将调用onScriptComplete函数，并传入模拟的超时事件对象
      var timeout = setTimeout(
        onScriptComplete.bind(null, undefined, {
          type: "timeout",
          target: script,
        }),
        120000
      );
      script.onerror = onScriptComplete.bind(null, script.onerror);
      script.onload = onScriptComplete.bind(null, script.onload);
      //如果 needAttach为 true，则将script元素添加到页面的head中。
      needAttach && document.head.appendChild(script);
    };
  })();

  /* webpack/runtime/make namespace object */
  //作用：将一个对象标记为esmodel，并转换为一个具有Symbol.toStringTag属性的对象。
  (() => {
    // define __esModule on exports
    __webpack_require__.r = (exports) => {
      //用于判断当前环境是否支持Symbol的存在，如果存在，则设置对象的Symbol.toStringTag属性为"Module"
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      }
      //设置对象的__esModule属性为true。
      //这个属性用于标识一个模块是否是一个ES模块，
      //如果一个模块没有被标记为ES模块，则它默认是一个CommonJS模块。
      Object.defineProperty(exports, "__esModule", { value: true });
    };
  })();

  /* webpack/runtime/publicPath */
  (() => {
    var scriptUrl;
    if (__webpack_require__.g.importScripts)
      scriptUrl = __webpack_require__.g.location + "";
    var document = __webpack_require__.g.document;
    if (!scriptUrl && document) {
      if (document.currentScript) scriptUrl = document.currentScript.src;
      if (!scriptUrl) {
        var scripts = document.getElementsByTagName("script");
        if (scripts.length) {
          var i = scripts.length - 1;
          while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl)))
            scriptUrl = scripts[i--].src;
        }
      }
    }
    // When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
    // or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
    if (!scriptUrl)
      throw new Error("Automatic publicPath is not supported in this browser");
    scriptUrl = scriptUrl
      .replace(/#.*$/, "")
      .replace(/\?.*$/, "")
      .replace(/\/[^\/]+$/, "/");
    __webpack_require__.p = scriptUrl;
  })();

  /* webpack/runtime/jsonp chunk loading */
  (() => {
    // 用于存储已加载和正在加载的代码块的对象。
    // undefined表示代码块尚未加载，null表示代码块已被预加载/预获取。
    // [resolve, reject, Promise]表示代码块加载过程中的处理函数和Promise对象，0表示代码块已加载完成。
    var installedChunks = {
      0: 0,
    };

    __webpack_require__.f.j = (chunkId, promises) => {
      // 用于JavaScript的JSONP（JSON with Padding）方式代码块加载。
      var installedChunkData = __webpack_require__.o(installedChunks, chunkId)
        ? installedChunks[chunkId]
        : undefined;
      if (installedChunkData !== 0) {
        // 0 means "already installed".

        // a Promise means "currently loading".
        if (installedChunkData) {
          promises.push(installedChunkData[2]);
        } else {
          if (true) {
            // all chunks have JS
            // setup Promise in chunk cache
            var promise = new Promise(
              (resolve, reject) =>
                (installedChunkData = installedChunks[chunkId] =
                  [resolve, reject])
            );
            promises.push((installedChunkData[2] = promise));

            // start chunk loading
            var url = __webpack_require__.p + __webpack_require__.u(chunkId);
            // create error before stack unwound to get useful stacktrace later
            var error = new Error();
            var loadingEnded = (event) => {
              if (__webpack_require__.o(installedChunks, chunkId)) {
                installedChunkData = installedChunks[chunkId];
                if (installedChunkData !== 0)
                  installedChunks[chunkId] = undefined;
                if (installedChunkData) {
                  var errorType =
                    event && (event.type === "load" ? "missing" : event.type);
                  var realSrc = event && event.target && event.target.src;
                  error.message =
                    "Loading chunk " +
                    chunkId +
                    " failed.\n(" +
                    errorType +
                    ": " +
                    realSrc +
                    ")";
                  error.name = "ChunkLoadError";
                  error.type = errorType;
                  error.request = realSrc;
                  installedChunkData[1](error);
                }
              }
            };
            __webpack_require__.l(
              url,
              loadingEnded,
              "chunk-" + chunkId,
              chunkId
            );
          }
        }
      }
    };
    // install a JSONP callback for chunk loading
    var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
      var [chunkIds, moreModules, runtime] = data;
      // add "moreModules" to the modules object,
      // then flag all "chunkIds" as loaded and fire callback
      var moduleId,
        chunkId,
        i = 0;
      if (chunkIds.some((id) => installedChunks[id] !== 0)) {
        for (moduleId in moreModules) {
          if (__webpack_require__.o(moreModules, moduleId)) {
            __webpack_require__.m[moduleId] = moreModules[moduleId];
          }
        }
        if (runtime) var result = runtime(__webpack_require__);
      }
      if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
      for (; i < chunkIds.length; i++) {
        chunkId = chunkIds[i];
        if (
          __webpack_require__.o(installedChunks, chunkId) &&
          installedChunks[chunkId]
        ) {
          installedChunks[chunkId][0]();
        }
        installedChunks[chunkId] = 0;
      }
    };

    var chunkLoadingGlobal = (self["webpackChunk"] =
      self["webpackChunk"] || []);
    chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
    chunkLoadingGlobal.push = webpackJsonpCallback.bind(
      null,
      chunkLoadingGlobal.push.bind(chunkLoadingGlobal)
    );
  })();

  /************************************************************************/
  var __webpack_exports__ = {};
  /**
   * 编译前代码
   * import('./sum').then(m => {
   *    console.log(m.default(3, 4))
   * })
   */
  debugger;
  //编译后的代码：
  __webpack_require__
    .e(/* import() */ 1)
    .then(__webpack_require__.bind(__webpack_require__, 1))
    .then((m) => {
      console.log(m.default(3, 4));
    });
})();

