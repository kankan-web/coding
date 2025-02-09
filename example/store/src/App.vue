<script setup>
import { onMounted,onBeforeUnmount,onUnmounted } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
// import { useStore } from 'vuex'
// let vuexStore = useStore()
// console.log(vuexStore.state.vuexmsg); //hello vuex

import { storeA } from './piniaStore/storeA'
let piniaStoreA = storeA()
console.log(piniaStoreA.piniaMsg); //hello pinia
console.log('父组件 setup 初始化')
onMounted(()=>{
  console.log('父组件 onMounted')
})
onBeforeUnmount(()=>{
  console.log('父组件 beforeUnmount')
})
onUnmounted(()=>{
  console.log('父组件 onUnmounted')
})

</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
