# 运行

1. 先运行`pnpm run build`
2. 会在根目录下创建一个 dist 文件夹
3. 进入 example 文件中，运行 npx webpack
4. 会在 example 文件夹下生成一个 dist 文件夹，该文件夹下含有一个 main 文件，文件中包含结果

# 插件介绍

### babel

Babel 是一个工具链，主要用于在当前和旧的浏览器或环境中，将 ECMAScript 2015+ 代码转换为 JavaScript 向后兼容版本的代码。以下是 Babel 可以做的主要事情：

- 转换语法
- Polyfill 目标环境中缺少的功能（通过如 core-js 的第三方 polyfill）
- 源代码转换(codemods)

1. 安装依赖

```
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

2. 创建 babel.config.js 或 babel.config.json 配置文件
3. 编写配置内容，可参考官网

### cross-env

### del

