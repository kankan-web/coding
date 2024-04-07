### 运行
```
> node example.js->output.js
> node output.js
```

### 依赖关系
- `index.js`->1
  - `increment.js`->2
  - `math.js`->3
- `hello.js`->4
对于以下依赖树，由于JS执行查找模块为深度优先搜索遍历，对所有模块构造一个以深度优先的树
- entry->1
  - A->2
    - B->3
    - C->4
  - D->5
  - E->6
  - F->7