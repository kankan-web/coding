var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/*
 可以引⼊的库和版本相关请参考 “环境说明”
 以下为示例代码，仅供参考。请根据题目要求定义好方法及参数。
*/
/*
 Please refer to the "Environmental Notes" for the libraries and versions that can be introduced.
 The following is sample code for reference only.
 Please define the methods and parameters according to the requirements of the question.
*/
var test = {
    isChecked: false,
    name: "China",
    children: [{
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
function sortTree(tree) {
    // 在这⾥写代码
    //新数组
    var newTree = __assign(__assign({}, tree), { children: [] });
    // please write your code here
    if (tree.children && tree.children.length > 0) {
        var sortArr = tree.children.sort(function (a, b) {
            //a为true,b is true,no
            //a is false b is false, no
            //a is true, b is false, a
            //a is false,b is true ,b
            if (a.isChecked !== b.isChecked) {
                return b.isChecked ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
        for (var _i = 0, sortArr_1 = sortArr; _i < sortArr_1.length; _i++) {
            var item = sortArr_1[_i];
            newTree.children.push(sortTree(item));
        }
    }
    return newTree;
}
// 请勿删除，模块导出的函数才能被测试模块调⽤
// Do not remove the following code so that the module's exported functions can be called by the test module
// module.exports = {
//   sortTree
// }
var result = sortTree(test);
console.log('res', result[1]);
