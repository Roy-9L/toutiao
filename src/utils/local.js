// 导出一个本地操作用户信息的模块（设置用户，获取用户，清除用户）
const KEY = 'toutiao-pc-user-key'
const local = {
  setUser (user) {
    // 数据存储：setItem(key,value)  key:获取数据时需要使用，value:json格式的字符串
    const jsonStr = JSON.stringify(user)
    window.sessionStorage.setItem(KEY, jsonStr)
  },
  getUser () {
    // 获取：getItem(key)
    const jsonStr = window.sessionStorage.getItem(KEY)
    return JSON.parse(jsonStr)
  },
  delUser () {
    // 删除数据：removeItem(key) 或  setItem(key,"")
    window.sessionStorage.removeItem(KEY)
  }
}
export default local
