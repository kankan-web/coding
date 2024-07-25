//1.数组原生方法
const nums=[1,2,3,4]
nums.reverse()
//tip:会修改原数组并返回修改后的数组

//2.巧妙利用数组交换
let reverse = function(nums, start, end){
    while(start < end){
        [nums[start++], nums[end--]] = [nums[end], nums[start]];
    }
}
reverse(nums,0,nums.length-1)