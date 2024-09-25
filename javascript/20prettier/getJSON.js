const str = `{
  "trailingComma": "es5",
  "tabWidth": 4,
  "semi": false,
  "singleQuote": true
}`

function convertToObject(str) {
  // 使用正则表达式提取 {} 中的内容
  const match = str.match(/\{([\s\S]*)\}/);
  console.log('match',match)
  if (match) {
    str = `{${match[1]}}`;
  } else {
    console.error('未找到有效的对象内容');
    return null;
  }
  
  // 移除 // 后面的注释
  str = str.replace(/\/\/.*$/gm, '');
  console.log('移除注释',str)
  // 将所有的单引号替换为双引号
  str = str.replace(/'/g, '"');
  console.log('替换引号',str)
  
  // 将没有引号的属性名加上双引号
  str = str.replace(/(\w+):/g, '"$1":');
  console.log('双引号',str)
  
  // 移除末尾的分号（如果有的话）
  str = str.replace(/;$/, '');
  console.log('移除分号',str)

  // 使用 Function 构造函数解析字符串
  try {
    const obj = new Function(`return ${str};`)();
    console.log('object',typeof obj)
    return obj;
  } catch (error) {
    console.error('解析失败:', error);
    return null;
  }
}

const res = convertToObject(str)
console.log('结果为',res,typeof res)