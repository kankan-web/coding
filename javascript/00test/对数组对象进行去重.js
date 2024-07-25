// 方法一：利用set的特性
let arr = [1,2,3,4,3,5,5]
console.log([...new Set(arr)])
let arrNew = [
    {
      id: '1',
      name: 'Jae'
    },
    {
      id: '2',
      name: 'Tom'
    },
    {
      id: '1',
      name: 'Jae'
    },
    {
      id: '3',
      name: 'Arthur'
    }
  ]
let res = [...new Set(arr.map(v=>JSON.stringify(v)))].map(s=>JSON.parse(s))
//方法二
let map=new Map()
for(let item of arrNew){
    if(!map.has(item.id)){
        map.set(item.id,item)
    }
}
const res2=[...map.values()]
//扩展，多个关键字
function uniqArrayObj=(array,...arg)=>{
    let map = new Map()
    for(item of array){
        let key = ''
        arg.forEach((i)=>{
            key +=item[i]
        })
        if(!map.has(key)){
            map.set(key,item)
        }
    }
    return [...map.values()]
}