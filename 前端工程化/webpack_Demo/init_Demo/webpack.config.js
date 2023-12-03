const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode:'development',
  entry:{
    index:'./src/index.js',

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
  
};