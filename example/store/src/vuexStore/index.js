import { createStore } from 'vuex'

export default createStore({
    //全局state，类似于vue种的data
    state() {
      return {
        vuexmsg: "hello vuex",
        name: "xiaoyue",
      };
    },


    //修改state函数
    mutations: {
    },

    //提交的mutation可以包含任意异步操作
    actions: {
    },

    //类似于vue中的计算属性
    getters: {
    },

    //将store分割成模块（module）,应用较大时使用
    modules: {
    }
})
