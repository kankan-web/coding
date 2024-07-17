//1. 暴力解法
// var rotate = function(nums, k) {
//     const length=nums.length
//     let temp = 0
//     for(let i=0;i<k;i++){
//         temp=nums.pop()
//         nums.unshift(temp)
//     }
//     return nums
// };
//2.翻转数组解法
let reverse = function(nums, start, end){
    while(start < end){
        [nums[start++], nums[end--]] = [nums[end], nums[start]];
    }
}
let rotate = function(nums, k) {
    k %= nums.length;
    reverse(nums, 0, nums.length - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, nums.length - 1);
    return nums;
};