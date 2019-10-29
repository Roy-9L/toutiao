// 导入
import VueRouter from 'vue-router'
// 进行路由配置
// 登录页面
import Login from '@/views/login'
// 首页
import Home from '../views/Home'
// 欢迎页面
import welcome from '../views/welcome'
// 404页面
import NotFound from '../views/404'

import local from '../utils/local'
// 使用
import Vue from 'vue'
Vue.use(VueRouter)
// 重写路由的push方法
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

// 实例化
const router = new VueRouter({
  // 路由配置对象
  // 关键选项：routes 作用：配置路由规则
  routes: [
    // 登录
    {
      path: '/login',
      component: Login
    },
    // 首页
    {
      path: '/',
      component: Home,
      children: [
        // 欢迎页面
        {
          path: '/Home',
          component: welcome
        }
        /// / 404   错误写法，不能写在二级路由里  否则在进行跳转时，地址会默认带上二级路由的 /
        // {
        //   //* 表示：除了以上路径的所有地址，都跳转到这个组件（NotFound）  一级路由
        //   path: '*',
        //   component: NotFound
        // }
      ]
    },
    // 404  正确写法
    {
      //* 表示：除了以上路径的所有地址，都跳转到这个组件（NotFound）  一级路由
      path: '*',
      component: NotFound
    }
  ]
})

// 路由导航守卫(前置导航守卫)  是 vue-router 提供功能   router实例提供函数 beforeEach(()=>{ 每一次跳转路由会执行 })
router.beforeEach((to, from, next) => {
  // to 跳转目标路由对象
  // from 从哪里跳过来的路由对象
  // next() 放行  next('/login') 拦截到登录
  // next()
  // 如果你访问的不是登录页面，且又没有登录，跳转到登录页面。
  const user = local.getUser()
  if (to.path !== '/login' && !user) return next('/login')
  next()
})
// 导出
export default router
