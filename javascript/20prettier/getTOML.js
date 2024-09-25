const str = `
# .prettierrc.toml
trailingComma = "es5"
tabWidth = 4
semi = false
singleQuote = true
`;
function convertToObject(str) {
  // 移除注释和空行
  const lines = str.split('\n').filter(line => {
    line = line.trim();
    return line && !line.startsWith('#');
  });

  const result = {};

  for (let line of lines) {
    // 分割键值对
    const [key, value] = line.split('=').map(part => part.trim());
    
    if (key && value) {
      // 处理布尔值
      if (value.toLowerCase() === 'true') {
        result[key] = true;
      } else if (value.toLowerCase() === 'false') {
        result[key] = false;
      }
      // 处理数字
      else if (!isNaN(value)) {
        result[key] = Number(value);
      }
      // 处理字符串（移除引号）
      else {
        result[key] = value.replace(/^["']|["']$/g, '');
      }
    }
  }

  return result;
}



const res = convertToObject(str);
console.log('结果为', res, typeof res);