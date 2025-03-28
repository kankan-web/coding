// #### 题目：版本号比较

// 编写一个函数，该函数接收两个字符串参数，它们表示软件的版本号 v1 和 v2。如果 v1 > v2 返回 1，如果 v1 < v2 返回 -1，否则返回 0。

// 版本号是由若干修订号组成，每项修订号之间以点分隔。每项修订号可能包含任意数量的数字。版本号不以 0 开始，除非整个版本号就是 0.

// 请注意，修订号的比较是基于单个修订号的数字值，而不是整体作为一个数字进行比较。例如，2.5 不等于 2.50。
// 函数示例：compareVersion("version1", "version2")

// 测试用例：


function compareVersion(str1,str2){
  const arr1 = str1.split('.')
  const arr2 = str2.split('.')
  //位置配平
  if(arr1.length<arr2.length){
    const length = arr2.length-arr1.length
    for(let i=0;i<length;i++){
      arr1.push('0')
    }
  }else if(arr1.length>arr2.length){
  const length = arr1.length-arr2.length
    for(let i=0;i<length;i++){
      arr2.push('0')
    }
  }

  let temp = 0
  for(let j=0;j<arr1.length;j++){
    if(parseInt(arr1[j])<parseInt(arr2[j])){
      return -1
    }else if(parseInt(arr1[j])>parseInt(arr2[j])){
      return 1
    }
  }
  return temp
}
console.log(compareVersion("0.1", "0.0.1") == 1)
console.log(compareVersion("1.0", "1.0.0") == 0)
console.log(compareVersion("7.3.2", "7.3") == 1)
console.log(compareVersion("1.2.10", "1.2.2") == 1)
console.log(compareVersion("1.13", "1.13.4") == -1)
console.log(compareVersion("1.0", "0.1") == 1)
console.log(compareVersion("0.1", "1.1") == -1)
console.log(compareVersion("1.0.1", "1") == 1)
console.log(compareVersion("7.5.2.4", "7.5.3") == -1)
