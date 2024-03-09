const webpack = require('webpack')
const path = require('path')
const { stdout } = require('process')

// # 更好地查看日志
// $ node build2.js  | jq -c -C ".[]" | less
function f1() {
  const compiler = webpack({
    entry: './index.js',
    mode: 'none',
    infrastructureLogging: {
      debug: true,
      stream: stdout
    }
  })

  compiler.run((err, stat) => {
    const logs = Array.from(stat.compilation.logging, ([hook, logs]) => {
      return logs.map(r => {
        return {
          readableTime: new Date(r.time).toJSON(),
          api: hook,
          ...r,
        }
      })
    }).flat()
    console.log(JSON.stringify(logs))
  })
}

function f2() {
  const compiler = webpack({
    entry: './index.js',
    mode: 'none',
    infrastructureLogging: {
      debug: true,
      stream: stdout
    }
  })
  console.time('构建时间')
  compiler.run((err, stat) => {
    console.timeEnd('构建时间')
    console.log(stat.toJson().time)
    console.log(stat.endTime - stat.startTime)
  })
}

f2()
