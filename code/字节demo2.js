/** 
 * 题目名称最长子串
问题描述
给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。

示例 1:
输入: "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

示例 2:
输入: "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。

示例 3:
输入: "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke" "kew"，所以其长度为 3。
请注意，答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
 * 
 * 
 */
function childStr(str){
  let maxLength=0
  //不重复，哈希
  const chartMap={}
  let temp=0
  for(let i=0;i<str.length;i++){
    const chart= str[i]//当前字符
    if(chartMap[chart]){//已经重复了
      temp=chartMap[chart]+1
      console.log(temp,i)
    }
    chartMap[chart]=i//位置信息
    maxLength=Math.max(maxLength,i-temp)//更新最长
  }
  return maxLength
}
const test1="abcabcbb"
const test2 = "bbbbb"
const test3 = 'pwwkew'
// console.log('结果是',childStr(test1))
// console.log('结果是',childStr(test2))
console.log('结果是',childStr(test3))