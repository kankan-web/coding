"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;
var _schemaUtils = require("schema-utils");
var _options = _interopRequireDefault(require("./options.json"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
//使用 schema-utils 的 validate 接口校验 Loader 配置是否符合预期

function loader(source) {
  const {
    version,
    webpack
  } = this;
  const options = this.getOptions();
  (0, _schemaUtils.validate)(_options.default, options, "Loader");
  const newSource = `
  /**
   * Loader API Version: ${version}
   * Is this in "webpack mode": ${webpack}
   */
  /**
   * Original Source From Loader
   */
  ${source}`;
  return newSource;
}