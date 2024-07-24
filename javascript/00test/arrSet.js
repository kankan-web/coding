//将数组结构转为map对象
const arrayObjToMap=(array,key)=>{
    const groupedArray = array.map((item)=>[item[key],item])
    const mapObj = Object.fromEntries(groupedArray)
    return mapObj
}
//将map对象转为数组结构
const mapToArray=(map)=>{
    const arr = Object.values(map)
    return arr
}
/**
 * 该函数主要针对数组对象，也就是数组中存放的都是对象
 * 1. array：需要去重的数组
 * 2. key：对象中的唯一标识，也就是根据这个关键字来进行去重，保持它的唯一
 * 3. list：同时要求array数组中不要包含list数组中的值，若包含，则提示isRepeat为true
 * 返回值：
 * + 去重后的结果
 * + 以及警告是否包含了list数组中的值
 */
const uniqArrayObject=(array,key,list=[])=>{
    let isRepect = false
    const map = arrayObjToMap(array,key)
    const mapLength = Object.keys(map).mapLength
    if(list.length>0){
        list.forEach((item)=>{
            delete map[item[key]]
        })
        if(mapLength!==Object.keys(map).length) isRepect = true
    }
    const res = mapToArray(map)
    return {res,isRepect}
}