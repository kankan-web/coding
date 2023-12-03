const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode:'development',
  entry:{
    index:'./src/index.js',
    another:'./src/another-module.js'
    // index:{
    //   import:'./src/index.js',
    //   dependOn:'shared'
    // },
    //   another:{
    //     import:'./src/another-module.js',
    //     dependOn:'shared'
    //   },
    // shared:'lodash'
  },
  plugins:[
    new HtmlWebpackPlugin({
      // title:'管理输出'
      title:'开发环境'
    })
  ],
  output: {
    filename:'[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean:true
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  // optimization: {
  //   runtimeChunk: 'single',
  // },
  optimization: {
    splitChunks:{
      chunks:'all'
    }
  },
};