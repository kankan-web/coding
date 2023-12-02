const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode:'development',
  output: {
    // filename: 'main.js',
    filename:'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module:{
    rules:[
      {//处理css
        test:/\.css$/i,
        use:['style-loader','css-loader']
      },
      {
        test:/\.(png|jpg|svg|jpeg|gif)$/i,
        type:'asset/resource'
      }
    ]
  }
};