class ListNode {
  constructor(val, next) {
    this.val = val;
    this.next = next;
  }
}
// 创建链表
function createListNode(arr) {
  let head = new ListNode(arr[0]);
  let current = head;
  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }
  return head;
}
const list1 = createListNode([1, 2, 3, 4, 5]);
console.log(list1);
//删除链表中倒数第N个节点
var removeNthFromEnd = function(head, n) {
  // 创建哨兵节点，简化解题逻辑
  let dummyHead = new ListNode(0, head);
  let fast = dummyHead;
  let slow = dummyHead;
  while (n--) fast = fast.next;
  while (fast.next !== null) {
    slow = slow.next;
    fast = fast.next;
  }
  slow.next = slow.next.next;
  return dummyHead.next;
};