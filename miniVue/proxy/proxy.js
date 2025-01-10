const reactive = obj => {
    // 如果obj不是一个对象，就没必要包装了
    if(typeof obj !== 'object' || !obj) {
        return obj;
    }
    const proxyConfig = {
        get(target, key, receiver) {
            console.log('拦截到正在获取属性：' + key);
            return Reflect.get(target, key, receiver)
        },
        set(target, key, val, receiver) {
            console.log('拦截到正在修改属性：' + key);
            return Reflect.set(target, key, val, receiver);;
        },
        deleteProperty(target, key) {
            console.log('拦截到正在删除属性：' + key);
            return Reflect.deleteProperty(target, key);
        }
    };
    const observed = new Proxy(obj, proxyConfig);
    return observed;
}
console.log('---------------代理简单对象-----------------') 
const state = reactive({
  foo: 'foo'
})
// 1.获取
state.foo // ok
// 2.设置已存在属性
state.foo = 'fooooooo' // ok
// 3.设置不存在属性
state.dong = 'dong' // ok
// 4.删除属性
delete state.dong // ok


console.log('---------------代理简单数组-----------------') 
let list = ['张三','李四','王五','赵六'];

let listProxy = reactive(list);

console.log(listProxy[0]) // 拦截到正在获取属性：0
listProxy[0] = '李四'; // 拦截到正在修改属性：0

listProxy[6] = 6; // 拦截到正在修改属性：6

/**
 * 拦截到正在获取属性：push
 * 拦截到正在获取属性：length
 * 拦截到正在修改属性：7
 * 拦截到正在修改属性：length
 */
listProxy.push('赵七'); 


console.log('---------------代理复杂对象-----------------')
let person = {
    name: 'yuanwill',
    age: 26,
    address: {
        home: 'guangzhou',
        now: 'shenzhen'
    }
};
const personProxy = reactive(person)
personProxy.name = {
    firstName: 'yuan',
    lastName: 'will'
}; // 拦截到正在修改属性：name

personProxy.name.firstName = 'haha'; // 拦截到正在获取属性：name
console.log(personProxy.name); // 拦截到正在获取属性：name
/**
 * 拦截到正在获取属性：address
 * shenzhen
 */
console.log(personProxy.address.now)

personProxy.address.home = '北京'//拦截到正在获取属性：address

console.log('---------------创建复杂的porxy响应函数-----------------') 
const observer = obj => {
    // 如果obj不是一个对象，就没必要包装了
    if(typeof obj !== 'object' || !obj) {
        return obj;
    }
    const proxyConfig = {
        get(target, key, receiver) {
            console.log('拦截到正在获取属性：' + key);
            const result = Reflect.get(target, key, receiver);
            return observer(result);
        },
        set(target, key, val, receiver) {
            console.log('拦截到正在修改属性：' + key);
            return Reflect.set(target, key, val, receiver);;
        }
    };
    const observed = new Proxy(obj, proxyConfig);
    return observed;
}
const personProxyNew = observer(person)
personProxyNew.name = {
    firstName: 'yuan',
    lastName: 'will'
}; // 拦截到正在修改属性：name

/**
 * 拦截到正在获取属性：name
 * 拦截到正在修改属性：firstName
 */
personProxyNew.name.firstName = 'haha'; 
/**
 * 拦截到正在获取属性：name
 * { firstName: 'haha', lastName: 'will' }
 */
console.log(personProxyNew.name); 

/**
 * 拦截到正在获取属性：address
 * 拦截到正在获取属性：now
 * shenzhen
 */
console.log(personProxyNew.address.now)
/**
 * 拦截到正在获取属性：address
 * 拦截到正在修改属性：home
 */
personProxyNew.address.home = '北京'
