<template>
  <div class="page">
    <!-- 头 -->
    <!-- <p>header</p> -->
    <!-- 内容 -->
    <div>
      <!-- 默认插槽:当时你只需要插入一处额外的内容 -->
      <!-- <slot></slot> -->
      <!-- 后备内容:当你未插入内容的时候，默认显示的内容 slot标签里面的 -->
      <!-- <slot>后备内容</slot> -->
      <!-- 具名插槽：当你要插入多次内容的时候 给一个name-->
      <!-- pn 自定义属性 -->
      <!-- 作用域插槽 -->
      <!-- <slot name="content" :pn="pageName" test="测试">后备内容</slot> -->
    </div>
    <!-- 尾 -->
    <p>
      <!-- <slot name="footer">后备尾</slot> -->
    </p>
  </div>
</template>

<script>
// 作用域插槽：组件内部的数据，在使用组件的插槽内容中使用。
// 作用域插槽：在slot标签上通过自定义属性指定的数据
export default {
  // 组件内部的数据
  data () {
    return {
      pageName: '组件内部数据'
    }
  }
}
</script>

<style scoped lang='less'></style>
