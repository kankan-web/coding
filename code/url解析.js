/**
 * ## 问题1
 * 解析url中的queryString
 *
 * 输入：https://www.youzan.com?name=coder&age=20&callback=https%3A%2F%2Fyouzan.com%3Fname%3Dtest&list[]=a&list[]=b&json=%7B%22str%22%3A%22abc%22,%22num%22%3A123%7D
 * 输出：{
 *  name: "coder",
 *  age: "20",
 *  callback: "https://youzan.com?name=test",
 *  list: ["a", "b"],
 *  json: {
 *      str: 'abc',
 *      num: 123
 *  }
 * }
 */
function parseQuery(url) {
    // coding...
    const parseUrl = new URL(url)
    console.log('parseUrl',parseUrl)
    //查询参数处理
    const searchParam = {}
    parseUrl.searchParams.forEach((value,key)=>{
      console.log('查询的参数',key,value)
      // console.log('是否为数组',key.includes('['),value,key)
      // console.log('是否为对象',/[\{\}]/.test(value),value,key)
      //处理数组情况
      if(key.includes('[')){
        const newKey = key.split('[')[0]
        if(!searchParam[newKey]){
          searchParam[newKey]=[]
        }
        searchParam[newKey].push(value)
      //处理对象情况
      }else if(/[\{\}]/.test(value)){
        const obj = JSON.parse(value)
        searchParam[key]=obj
      }
      else{
        searchParam[key]=value
      }
     
    })
    return searchParam
}
const url = 'https://www.youzan.com?name=coder&age=20&callback=https%3A%2F%2Fyouzan.com%3Fname%3Dtest&list[]=a&list[]=b&json=%7B%22str%22%3A%22abc%22,%22num%22%3A123%7D';
console.log(parseQuery(url));