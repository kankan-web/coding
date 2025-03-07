/* 
 可以引⼊的库和版本相关请参考 “环境说明”
 以下为示例代码，仅供参考。请根据题目要求定义好方法及参数。
*/
/**
 * 给定一个选择器的树形结构，每个树形都有name，ischecked，和children，children为数组，
 * 是下一级的数组，你需要对每个节点的children排序，
 * 要求ischecked为第一关键字，如果为true则排在前面，
 * name为第二关键字升序
 * 返回一颗新树
 */
const test = {
  isChecked: false,
  name: "China",
  children: [
    {
      isChecked: true,
      name: "Zhejiang",
      children: [
        {
          children: [],
          isChecked: false,
          name: "Changzhou",
        },
        {
          children: [],
          isChecked: false,
          name: "Hangzhou",
        },
      ],
    },
    {
      isChecked: false,
      name: "Jiangsu",
      children: [
        {
          children: [],
          isChecked: true,
          name: "Nanjing",
        },
      ],
    },
    {
      isChecked: false,
      name: "Jiangsu",
      children: [
        {
          children: [],
          isChecked: false,
          name: "Changzhou",
        },
        {
          children: [],
          isChecked: false,
          name: "Suzhou",
        },
      ],
    },
  ],
};
const test2 = {
  children: [
    {
      children: [
        { children: [], isChecked: true, name: "Ningbo" },
        { children: [], isChecked: false, name: "Hangzhou" },
      ],
      isChecked: true,
      name: "Zhejiang",
    },
    {
      children: [
        { children: [], isChecked: true, name: "Nanjing" },
        { children: [], isChecked: false, name: "Changzhou" },
        { children: [], isChecked: false, name: "Suzhou" },
      ],
      isChecked: false,
      name: "Jiangsu",
    },
  ],
  isChecked: false,
  name: "China",
};

interface Tree {
  name: string;
  isChecked: boolean;
  children: Tree[];
}

// function sortTree(tree: Tree) {
//   // 在这⾥写代码
//   //新数组
//   const newTree: Tree = { ...tree }

//   // please write your code here
//   if (newTree.children && newTree.children.length > 0) {
//     //sort会修改原有数据
//     newTree.children = tree.children.map((item) => {
//       return sortTree(item)
//     }).sort((a: Tree, b: Tree) => {
//       //a为true,b is true,no
//       //a is false b is false, no
//       //a is true, b is false, a
//       //a is false,b is true ,b
//       if (a.isChecked !== b.isChecked) {//
//         return b.isChecked ? -1 : 1;
//       }
//       return a.name.localeCompare(b.name);
//     })
//   }
//   return newTree
// }
function sortTree(tree: Tree) {
  const newArr = JSON.parse(JSON.stringify(tree)) as Tree//要求返回新对象
  //建立递归函数
  function sort(node:Tree){
    if(node.children&&node.children.length>0){
      node.children.sort((a:Tree,b:Tree)=>{
        //针对第一种情况
        if(a.isChecked!=b.isChecked){
          // return b.isChecked?-1:1
          
        }
        //第二种情况
        return a.name.localeCompare(b.name)
      })
      node.children.forEach(item=>sort(item))
    }

  }
  newArr.children.forEach(item=>sort(item))
  return newArr
}



// 请勿删除，模块导出的函数才能被测试模块调⽤
// Do not remove the following code so that the module's exported functions can be called by the test module
// module.exports = {
//   sortTree
// }

const result = sortTree(test);
console.log("res", result[1]);
