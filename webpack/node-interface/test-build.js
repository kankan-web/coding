const webpack = require('webpack')
const path = require('path')
const compiler = webpack({
  entry: './test.js',
  mode: 'none',
  output: {
    life: false,
    pathinfo: 'verbose'
  }
})
compiler.run((err, stats) => {
  console.log(stats.toJson)
  compiler.close((closeErr) => {
    console.log('closeErr', closeErr)
  });
})