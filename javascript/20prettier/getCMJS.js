const str = `

// prettier.config.js, .prettierrc.js, prettier.config.cjs, or .prettierrc.cjs

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  trailingComma: "es5",
  tabWidth: 4,
  semi: false,
  singleQuote: true,
};

module.exports = config;

`

function convertToObject(str) {
  // 使用正则表达式提取 = {} 中的内容
  const match = str.match(/=\s*(\{[\s\S]*\})/);
  if (match) {
    str = match[1];
  } else {
    console.error('未找到有效的对象内容');
    return null;
  }
  
  // 移除 // 后面的注释
  str = str.replace(/\/\/.*$/gm, '');
    
  // 将所有的单引号替换为双引号
  str = str.replace(/'/g, '"');
  
  // 将没有引号的属性名加上双引号
  str = str.replace(/(\w+):/g, '"$1":');
  
  // 移除末尾的分号（如果有的话）
  str = str.replace(/;$/, '');

  // 使用 Function 构造函数解析字符串
  try {
    const obj = new Function(`return ${str};`)();
    return obj;
  } catch (error) {
    console.error('解析失败:', error);
    return null;
  }
}

const res = convertToObject(str)
console.log('结果为',res,typeof res)