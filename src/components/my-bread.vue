<template>
  <!-- 面包屑导航组件 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>
      <slot></slot>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  // 定义组件时，可以给组件约定一个名字
  name: 'my-bread'
}
</script>

<style scoped lang='less'></style>
