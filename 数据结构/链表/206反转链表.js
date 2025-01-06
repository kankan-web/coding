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

//反转链表
function reverseList(head) {
  let prev = null;
  let current = head;
  while(current){
    let next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
}