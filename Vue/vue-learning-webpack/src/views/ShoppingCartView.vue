<template>
  <div class="box">
    <table>
      <thead>
        <th>序号</th>
        <th>书籍名称</th>
        <th>出版日期</th>
        <th>价格</th>
        <th>购买数量</th>
        <th>操作</th>
      </thead>
      <tbody>
        <tr v-for="(item, index) in books" :key="item.name">
          <td>{{ index }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.date }}</td>
          <td>￥{{ item.price }}</td>
          <td>
            <button @click="handleCount(index, -1)">-</button>
            <span class="num">{{ item.count }}</span>
            <button @click="handleCount(index, 1)">+</button>
          </td>
          <td>
            <button @click="handleRemove(index)">移除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top: 20px">总价格：￥{{ total }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
/**
 * 功能特点：
 * 1. 以表格的形式显示书籍列表
 * 2. 底部显示购买书籍的总价格
 * 3. 点击+或-按钮可以增加或减少书籍数量。如果为1，则不能继续减少
 * 4. 单击“移除”按钮，可以将书籍移除。当所有的书籍移除完毕时，显示“购物车为空”
 */
const books = ref([
  { name: '《算法导论》', date: '2006-9', price: 85.0, count: 1 },
  { name: '《UNIX编程艺术》', date: '2006-2', price: 59.0, count: 1 },
  { name: '《编程珠玑》', date: '2008-10', price: 39.0, count: 1 },
  { name: '《代码大全》', date: '2006-3', price: 128.0, count: 1 }
])
const total = computed(() => {
  let total = 0
  for (let item of books.value) {
    total = item.price * item.count
  }
  return total
})
const handleCount = function (index, num) {
  if (books.value[index].count === 1 && num < 0) return
  books.value[index].count += num
  console.log(books.value[index])
}
const handleRemove = function (index) {
  books.value.splice(index, 1)
}
</script>

<style lang="less" scoped>
table,
td,
th {
  border: 1px solid #777;
  border-collapse: collapse;
  text-align: center;
}
table td,
table th {
  padding: 10px 30px;
}
table {
  margin: 0 auto;
}
.num {
  padding: 0 8px;
}
</style>
