function deepClone(obj) {
    if (typeof obj!== 'object' || obj === null) {
        return obj;
    }
    let clone;
    if (Array.isArray(obj)) {
        clone = [];
        for (let i = 0; i < obj.length; i++) {
            clone[i] = deepClone(obj[i]);
        }
    } else {
        clone = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                clone[key] = deepClone(obj[key]);
            }
        }
    }
    return clone;
}
//解决循环引用
function deepClone(obj, map = new Map()) {
    if (typeof obj!== 'object' || obj === null) {
        return obj;
    }
    //如果已经存在，直接返回，防止循环引用
    if (map.has(obj)) {
        return map.get(obj);
    }
    let clone;
    if (Array.isArray(obj)) {
        clone = [];
        map.set(obj, clone);
        for (let i = 0; i < obj.length; i++) {
            clone[i] = deepClone(obj[i], map);
        }
    } else {
        clone = {};
        map.set(obj, clone);
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                clone[key] = deepClone(obj[key], map);
            }
        }
    }
    return clone;
}
