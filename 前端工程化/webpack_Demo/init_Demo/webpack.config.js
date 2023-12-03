const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // entry: './src/index.js',
  entry:{
    index:'./src/index.js',
    print:'./src/print.js'
  },
  plugins:[
    new HtmlWebpackPlugin({
      // title:'管理输出'
      title:'开发环境'
    })
  ],
  mode:'development',
  output: {
    // filename: 'main.js',
    // filename:'bundle.js',
    filename:'[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean:true
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  optimization: {
    runtimeChunk: 'single',
  },
};