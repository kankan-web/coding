const webpack = require("webpack");
const path = require("path");
const FooterPlugin = require("./footerPlugin");

function build() {
  return webpack({
    mode: "development",
    devtool: "source-map",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "plugin.js",
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.other$/,
          use: [path.resolve(__dirname, "./test-loader.js")],
        },
      ],
    },
    plugins: [
      new FooterPlugin({
        banner: "这是页脚",
      }),
    ],
  });
}
build().run((err, stat) => {
  // console.log(err);
  // const { errors, stack } = stat.toJson();
  // console.log("error", errors);
  // console.log("stack", errors[0].stack);
  // console.log("hello", JSON.stringify(stat.toJson(), null, 2));
});

