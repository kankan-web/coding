var getIntersectionNode = function(headA, headB) {
    let lenA=0
    let lenB=0
    let nodeA = headA
    let nodeB = headB
    //求链表A的长度
    while(nodeA){
        lenA++
        nodeA=nodeA.next
    }
    //求链表B的长度
    while(nodeB){
        lenB++
        nodeB=nodeB.next
    }
    //让curA为最长链表的头，lenA为其长度
    let curA= headA
    let curB = headB
    //如果链表A的长度大于链表B的长度，则让curA为链表A的头，lenA为链表A的长度
    if(lenA>lenB){
        let len = lenA-lenB
        for(;len>0;len--) curA = curA.next
    }else{
        let len = lenB-lenA
        for(;len>0;len--) curB=curB.next
    }
    //让curA和curB在同一起点上（末尾位置对齐）
    while(curA&&curA!==curB){
        curA=curA.next
        curB=curB.next
    }
    return curA
};
//代码随想录版本
var getListLen = function(head) {
    let len = 0, cur = head;
    while(cur) {
       len++;
       cur = cur.next;
    }
    return len;
}
var getIntersectionNode = function(headA, headB) {
    let curA = headA,curB = headB,
        lenA = getListLen(headA),   // 求链表A的长度
        lenB = getListLen(headB);  
    if(lenA < lenB) {       // 让curA为最长链表的头，lenA为其长度
    
        // 交换变量注意加 “分号” ，两个数组交换变量在同一个作用域下时
        // 如果不加分号，下面两条代码等同于一条代码: [curA, curB] = [lenB, lenA]
        
        [curA, curB] = [curB, curA];
        [lenA, lenB] = [lenB, lenA];
    }
    let i = lenA - lenB;   // 求长度差
    while(i-- > 0) {       // 让curA和curB在同一起点上（末尾位置对齐）
        curA = curA.next;
    }
    while(curA && curA !== curB) {  // 遍历curA 和 curB，遇到相同则直接返回
        curA = curA.next;
        curB = curB.next;
    }
    return curA;
};