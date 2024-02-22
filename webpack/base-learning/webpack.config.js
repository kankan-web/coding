const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');

module.exports = {
  // context: path.resolve(__dirname, 'src'),//设置上下文
  // entry: './src/index.js',// entry:设置打包文件入口
  entry: {
    index: {
      import: './src/index.js',
      dependOn: ['react-vendor']
    },
    'react-vendor': {
      import: ['react', 'redux']
    },
    test: {
      import: './src/test.js'
    }
  },
  mode: 'development',//设置模块：开发/生产
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   loader: 'css-loader'
      // },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ]
  },
  // plugins：打包时用到的插件
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html')
    })
  ],
  // output：设置打包文件出口
  // output: {
  //   filename: 'main.js',
  //   path: path.resolve(__dirname, 'dist'),
  // },
};