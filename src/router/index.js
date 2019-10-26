// 导入
import VueRouter from 'vue-router'
// 进行路由配置
import Login from '@/views/login'

// 使用
import Vue from 'vue'
Vue.use(VueRouter)

// 实例化
const router = new VueRouter({
  // 路由配置对象
  // 关键选项：routes 作用：配置路由规则
  routes: [
    // 登录
    {
      path: '/login',
      component: Login
    }
  ]
})

// 导出
export default router
