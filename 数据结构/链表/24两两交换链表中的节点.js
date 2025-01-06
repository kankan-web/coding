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

// 两两交换链表中的节点
/**
 * 为什么这里需要设置虚拟头节点来进行处理
 * 因为如果直接处理头节点，那么头节点会发生变化，我们需要返回新的头节点
 */
var swapPairs = function (head) {
  let ret = new ListNode(0, head),//创建虚拟头节点
    temp = ret;
  while (temp.next && temp.next.next) {
    let node1 = temp.next;// 第一个节点
    let node2 = temp.next.next;// 第二个节点
    temp.next = node2;// 将虚拟头节点的next指向第二个节点
    node1.next = node2.next;// 将第一个节点的next指向第二个节点的next
    node2.next = node1;// 将第二个节点的next指向第一个节点
    temp = node1;// 将temp指向第一个节点
  }
  return ret.next;
};
