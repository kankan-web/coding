const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');
const config = {
  // context: path.resolve(__dirname, 'src'),//设置上下文
  // entry: './src/index.js',// entry:设置打包文件入口
  entry: {
    index: {
      import: './src/index.js',
      // dependOn: ['react-vendor']//2
    },
    // 'react-vendor': {//2
    //   import: ['react', 'redux']
    // },
    // test: {//2
    //   import: './src/test.js'
    // }
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
  output: {
    path: path.resolve(__dirname, 'build'),
    // publicPath: 'https://a.b.c/assets/',
    filename: 'test-demo.js',
    chunkFilename: 'asset_[id].js'
  },
  devtool: "source-map",
  // devServer: {
  //   client: {
  //     overlay: false
  //   },
  //   // compress: false,
  //   hot: 'only',
  //   open: true,
  //   // proxy: {
  //   //   // '/api': 'http://localhost:3000'//会带有/api/test完整路径
  //   //   '/api/*': {
  //   //     target: 'http://localhost:3000',
  //   //     bypass: (req, res, proxyOptions) => {
  //   //       if (req.url.indexOf('test2') !== -1) {
  //   //         return '/'
  //   //       }
  //   //     }
  //   //     // pathRewrite: {
  //   //     //   '^/api': ''
  //   //     // }
  //   //   }
  //   // }
  //   proxy: {
  //     '/api': 'http://localhost:3000'
  //   }
  // }
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
};
module.exports = (env, argv) => {
  /**
   * console.log(env, argv)
   * { WEBPACK_BUNDLE: true, WEBPACK_BUILD: true } 
   * {
   *  config: [ './webpack.config.js' ],
   *  mode: 'development',
   *  env: { WEBPACK_BUNDLE: true, WEBPACK_BUILD: true }
   * }
   */
  if (argv.mode === 'development') {
    config.output.filename = 'dev_demo.js'
  } else if (argv.mode === 'production') {
    config.output.filename = 'pro_demo.js'
  }
  return config
}
