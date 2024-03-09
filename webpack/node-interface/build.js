const webpack = require('webpack')
const path = require('path')

//学习配置一
function f1() {
  return webpack({
    entry: './index.js',
    mode: 'none',
    output: {
      life: false,//告诉 webpack 添加 IIFE 外层包裹生成的代码.
      /**
       * 告知 webpack 在 bundle 中引入「所包含模块信息」的相关注释。
       * 此选项在 development 模式时的默认值为 true，
       * 而在 production 模式时的默认值为 false。
       * 当值为 'verbose' 时，会显示更多信息，
       * 如 export，运行时依赖以及 bailouts。
       */
      pathinfo: 'verbose'
    }
  })
}
//学习配置二
function f2() {
  return webpack({
    entry: './index.js',
    mode: 'none',
    optimization: {
      runtimeChunk: true
    }
  })
}
/**
 * 由于webpack中没有传入可执行的回调函数，因此它会返回一个webpack Compiler实例
 * f1()就是一个compiler实例，实例中有以下方法：
 * 1. .run(callback):run 方法启动所有编译工作。 
 * - 完成之后，执行传入的的 callback 函数。
 * - 最终记录下来的概括信息（stats）和错误（errors），都应在这个 callback 函数中获取。
 * 2. .watch(watchOptions,handler)
 * - 调用 watch 方法会触发 webpack 执行，但之后会监听变更（很像 CLI 命令: webpack --watch），
 * - 一旦 webpack 检测到文件变更，就会重新执行编译。
 */
function f3() {
  return webpack([
    {
      entry: './index.js',
      mode: 'production',
      output: {
        filename: 'main.production.js'
      }
    },
    {
      entry: './index.js',
      mode: 'development',
      output: {
        filename: 'main.development.js'
      }
    },
    {
      entry: './index.js',
      output: {
        filename: 'main.unknown.js'
      }
    }
  ])
}
//查看配置一，切换f1，查看配置二，切换f2
console.time('time')
f3().run((err, stat) => {
  console.timeEnd('time')
  // console.log(stat.toJson().time)
  // console.log(stat.endTime - stat.startTime)
  // console.log(JSON.stringify(stat.toJson()))
})