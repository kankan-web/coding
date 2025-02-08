import { createApp } from 'vue'
import store from './vuexStore/index'
import './style.css'
import App from './App.vue'
import {createPinia} from 'pinia'
const pinia = createPinia()
createApp(App).use(pinia).mount("#app");
// createApp(App).use(store).mount('#app')



