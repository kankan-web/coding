# 1.介绍
这个项目主要是用来记录前端工程化中-package知识点的学习，而做的小Demo。
# 2.依赖(package_Demo)
## 1.1 如果项目中需要使用到完全不同版本的eslint，应该如何做？
```
npm install eslint7@npm:eslint@7
npm install eslint8@npm:eslint@8
```
此时的package.json中的dependencies
```
 "dependencies": {
    "eslint6": "npm:eslint@^6.8.0",
    "eslint7": "npm:eslint@^7.32.0"
  }
```