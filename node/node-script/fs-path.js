const fs = require('fs')
const path = require('path')
console.log('获取当前目录', process.cwd())
console.log('获取当前文件路径', __dirname)
console.log('获取当前文件路径', __filename)

console.log('------------------------')

console.log('args', process.argv)
console.log(path.resolve(__dirname, '../skills'))