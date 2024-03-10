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
// mode 为 production/development 时有何区别
// 当 mode 为 production 时，将自动开启 terser 对代码进行压缩及 Tree Shaking
//学习配置三
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
// [contenthash] 中 hash 是如何生成的，使用了哪种 hash 算法？
// 嗯对，现在 webpack 已经支持了数组选项，见 https://webpack.js.org/configuration/configuration-types/#exporting-multiple-configurations
function f4() {
  return webpack([
    {
      entry: './index.js',
      mode: 'none',
      output: {
        filename: 'main.[contenthash].js'
      }
    }, {
      entry: './index.js',
      mode: 'none',
      output: {
        filename: 'main.[contenthash:6].js'
      }
    }
  ])
}

// [contenthash] 中 hash 是如何生成的，使用了哪种 hash 算法？
// webpack 默认使用 md4 算法，webpack v5.54.0+ 后，支持 xxhash64 算法，比 md4 算法更快
// 见：https://webpack.js.org/configuration/experiments/#experimentsfuturedefaults
// > You can provide a non-crypto hash function for performance reasons.
function f5() {
  return webpack([
    {
      entry: './index.js',
      mode: 'none',
      output: {
        filename: 'main.[contenthash:6].md4.js',
        hashFunction: 'md4'
      }
    }, {
      entry: './index.js',
      mode: 'none',
      output: {
        filename: 'main.[contenthash:6].xxhash64.js',
        hashFunction: 'xxhash64'
      }
    }
  ])
}

function f6() {
  return webpack({
    entry: './index.js',
    mode: 'none',
    output: {
      filename: '[name].[contenthash:8].js',
      path: path.resolve(__dirname, 'build'),
    }
  })
}

// output.publicPath 如何影响上线
// 好吧，在打包这里一点都不影响
function f7() {
  return webpack({
    entry: './index.js',
    mode: 'none',
    output: {
      publicPath: 'https://static.shanyue.tech'
    }
  })
}

// 将 runtime 专门打包到 dist/runtime 路径
function f8() {
  return webpack({
    entry: './index.js',
    mode: 'none',
    output: {
      filename: '[name].[contenthash:8].js',
      // output.path 必须为一个绝对路径
      path: path.resolve(__dirname, 'dist/runtime'),
    },
    optimization: {
      runtimeChunk: true,
    }
  })
}

// mode 为 development 时的 devtool 配置
// devtool 配置用来加强 debug 的配置
function f9() {
  return webpack([
    {
      entry: './index.js',
      mode: 'development',
      devtool: 'eval',
      output: {
        filename: 'main.eval.js'
      }
    },
    {
      entry: './index.js',
      mode: 'development',
      devtool: 'eval-source-map',
      output: {
        filename: 'main.eval-source-map.js'
      }
    }
  ])
}


function f10() {
  return webpack({
    entry: './index.js',
    mode: 'none',
    output: {
      filename: '[id]-[name]-[contenthash]-[chunkhash].js'
    }
  })
}

function f11() {
  return webpack({
    entry: './index.js',
    mode: 'none',
    output: {
      environment: {
        const: true,
        arrowFunction: true,
        forOf: true
      }
    }
  })
}

function f12() {
  return webpack({
    entry: './index.js',
    mode: 'none',
    output: {
      environment: {
        const: true,
        arrowFunction: true,
        forOf: true
      }
    }
  })
}
//查看配置一，切换f1，查看配置二，切换f2
// console.time('time')
f1().run((err, stat) => {
  // console.timeEnd('time')
  console.log(stat.toJson())
  // console.log(stat.endTime - stat.startTime)
  // console.log(JSON.stringify(stat.toJson()))
})