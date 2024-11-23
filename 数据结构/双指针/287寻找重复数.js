//NOTE：需要好好思考一下
function findDuplicate(nums) {
  // 初始化快慢指针
  let slow = nums[0];
  let fast = nums[0];

  // 第一次相遇：找到环中的相遇点
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);

  // 找到环的入口，即重复的数
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }

  return slow;
}

// 示例用法
const nums = [1, 3, 4, 2, 2];
console.log(findDuplicate(nums)); // 输出: 2