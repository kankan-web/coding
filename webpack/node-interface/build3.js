const webpack = require('webpack')
// 学习配置一
function f1 () {
  return webpack({
    entry: './index.js',
    mode: 'none',
    output: {
      iife: false,
      pathinfo: 'verbose'
    }
  })
}

// 学习配置二
function f2 () {
  return webpack({
    entry: './index.js',
    mode: 'none',
    optimization: {
      runtimeChunk: true,
    }
  })
}


// 学习配置一时，切换到 f1，学习配置二时，切换到 f2
f1().run((err, stat) => {
  console.log(stat.toJson())
})