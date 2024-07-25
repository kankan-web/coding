const { ConcatSource } = require("webpack-sources");
//实现了一个添加页脚的plugin插件功能
class FooterPlugin {
  constructor(option) {
    console.log("options", option);
    this.option = option;
  }
  apply(complier) {
    console.log(typeof complier);
    complier.hooks.compilation.tap("FooterPlugin", (compilation) => {
      compilation.hooks.processAssets.tap("FooterPlugin", (assets) => {
        for (const chunk of compilation.chunks) {
          for (const file of chunk.files) {
            const comment = `/*${this.option.banner}*/`;
            compilation.updateAsset(
              file,
              (old) => new ConcatSource(old, "\n", comment)
            );
          }
        }
      });
    });
  }
}
module.exports = FooterPlugin;

