在vue组件中如何获取到当前的路由信息？
- 如果使用的是vue2，则：
```
<template>
    <div>
        <p>当前路由路径:{{$route.path}}</p>
        <p>当前路由参数:{{$route.params}}</p>
    </div>
</template>
```
- 如果使用的是vue3，则使用useRoute:
```
const route = useRoute()
console.log('当前路由路径',route.path)
console.log('当前路由参数',route.params)
```