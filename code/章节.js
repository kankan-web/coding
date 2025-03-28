// 一本书的目录会有很多章节，每个章节下又会有一些子章节，由此可以形成一个章节树
// 实现一个序列化函数serialize，输出包含所有章节名称的一维数组，同时根据每个章节所在的层级，在章节名称前面加上该章节所在的层级结构
// 示例输入
const chapterTree = {
  name: '总章节',
  children: [
    {
      name: '章节一',
      children: [
        {
          name: '第一节',
          children: [{ name: '第一小节' }, { name: '第二小节' }]
        },
        { name: '第二节' }
      ]
    },
    { name: '章节二', children: [{ name: '第三节' }, { name: '第四节' }] }
  ]
};
// 输出
// [
// '总章节',
// '(1)章节一',
// '(1.1)第一节',
// '(1.1.1)第一小节',
// '(1.1.2)第二小节',
// '(1.2)第二节',
// '(2)章节二',
// '(2.1)第三节',
// '(2.2)第四节'
// ];
function foo(obj){
 const newArr = []
 //递归
 function dept(item,index){
  if(index===-1) newArr.push(item.name)//处理第一个
  //标题设置
  const newName =''+index+item.name
  newArr.push(newName)
  if(!item.children) return
  item.children.forEach((temp,index)=>{
    dept(temp,index)
  })
 }
 dept(obj,-1)
 return newArr
}
foo(chapterTree)
console.log(foo(chapterTree))