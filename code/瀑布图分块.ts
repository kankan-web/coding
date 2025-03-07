/**
 * 瀑布图的数据是一个span数组，每个数组有starttime和endtime两个字段。
 * 你需要将数组分割成不连续的多个块，每个块的持续时间就可以反应出用户的体感响应时间。
 * 不连续是指：对于任意两个块A和B，A中的任何一个span在时间轴上都不会与B中的任何一个span有任何重叠。
 * 对于span端点有重叠的场景，例如[1,5]和[5,10]我们认为它连续。
 * 请你按照时间从早到晚，输出每个块的持续时间。
 * 数据保证按照span的起始时间升序。使用js
 */

interface Span {
  startTime: number;
  endTime: number;
}

function splitSpans(spans: Span[]) {
  // 在这⾥写代码
  // [{1,2},{2,4},{5,6}]
  // 输出为：[{1,4},{5,6}]
  // please write your code here
  if(spans.length===0){
    return []
  }
  
  const newArr:Span[] = []
  let start = spans[0].startTime
  let end =spans[0].endTime
  for(let i=1;i<spans.length;i++){
    //做分割
    if(spans[i].startTime>end){
      newArr.push({
        startTime:start,
        endTime:end
      })
      start=spans[i].startTime
      end = spans[i].endTime
    }else{//做更新
      end=Math.max(end,spans[i].endTime)
    }
  }
  
  
  return newArr;
}


// 请勿删除，模块导出的函数才能被测试模块调⽤
// Do not remove the following code so that the module's exported functions can be called by the test module
module.exports = {
  splitSpans
}