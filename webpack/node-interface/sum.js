const add = require('./add')
console.log(add(1, 2))

module.exports = (...args) => args.reduce((x, y) => x + y, 0)