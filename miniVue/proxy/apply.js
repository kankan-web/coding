//proxy的应用
const user = {
    firstName: 'John',
    lastName: 'Doe',
    age: 25
};

const userProxy = new Proxy(user, {
    get(target, property) {
        if (property === 'fullName') {
            return `${target.firstName} ${target.lastName}`;
        }
        return target[property];
    },
    set(target, property, value) {
        if (property === 'age') {
            if (typeof value !== 'number') {
                throw new TypeError('Age must be a number');
            }
            if (value < 0) {
                throw new RangeError('Age must be a positive number');
            }
        }
        target[property] = value;
        return true;
    }
});

// 使用代理对象
console.log(userProxy.fullName); // 自动格式化输出：John Doe

userProxy.age = 30; // 正常设置
console.log(userProxy.age); // 输出：30

try {
    userProxy.age = 'thirty'; // 触发类型错误
} catch (e) {
    console.error(e.message); // 输出：Age must be a number
}

try {
    userProxy.age = -5; // 触发范围错误
} catch (e) {
    console.error(e.message); // 输出：Age must be a positive number
}