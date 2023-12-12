const path = require('path')
module.exports={
  entry:'./src/index.js',
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'webpack-numbers.js',
    library: {
      name: 'webpackNumbers',
      type: 'umd',
    },
  },
  devtool: 'source-map',
  externals: {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_',
    },
  },
}