var removeDuplicates = function(nums) {
    if(nums.length===1) return 1
    let left = 0
    let right = 1
    while(right<=nums.length-1){
        if(nums[left]===nums[right]){
            nums.splice(right,1)
        }else{
            left++
            right++
        }
    }
    return nums.length
};