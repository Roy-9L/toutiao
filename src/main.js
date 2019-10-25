import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
// ElementUI 是一个插件  集成了很多组件
Vue.use(ElementUI)
Vue.config.productionTip = false

// 根实例，
new Vue({
  render: h => h(App) // 渲染App根组件
}).$mount('#app') // 挂载到App这个容器下

// main.js的作用是入口文件
// 职责:1.创建一个根实例
// 职责:2.负责全局范围的依赖导入
