module.exports = function (source) {
  debugger;
  // 为了避免 JSON 有语法错误，所以先 parse/stringify 一遍
  return `module.exports = ${JSON.stringify(JSON.parse(source))}`;

  // 写成 ESM 格式也可以，但是 webpack 内部还需要将 esm 转化为 cjs，为了降低复杂度，直接使用 cjs
  // return `export default ${JSON.stringify(JSON.parse(source))}`
};

