// 封装一个插件，注册所有的全局组件
/**
 * vue插件封装

- 作用：在vue插件内，进行全局组件的注册
- 插件写法：固定模式
  - 使用一个js模块
  - 导出必须是一个对象
  - 对象中必须有一个属性：install
  - install的值必须是函数
    - 默认传参：Vue 对象
    - 基于 Vue 对象 实现想要的功能
- 使用插件：Vue.use(插件)

 */
import MyBread from './my-bread'

import MyChannel from './my-channel'

export default {
  install (Vue) {
    // 给予Vue做任何事情(注册全局组件、指令、过滤器、挂载原型函数。。。)
    // 注册
    Vue.component(MyBread.name, MyBread)
    Vue.component(MyChannel.name, MyChannel)
  }
}
