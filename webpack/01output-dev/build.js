const path = require("path");
const webpack = require("webpack");

//输出配置
function f1() {
  return webpack({
    entry: {
      index: "./index.js",
      print: "./print.js",
    },
    mode: "none",
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
      clean: true, //每次构建时都会清理一下dist文件
    },
  });
}
//使用开发环境配置

f1().run((err, stat) => {
  console.log(JSON.stringify(stat.toJson(), null, 2));
});
