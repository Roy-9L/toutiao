<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <my-bread>发布文章</my-bread>
      </div>
      <el-form ref="form" label-width="120px">
        <el-form-item label="标题:">
          <el-input v-model="articleForm.title" style="width:400px" size="small"></el-input>
        </el-form-item>
        <el-form-item label="内容">富文本</el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="articleForm.cover.type">
            <el-radio :label="3">备选项</el-radio>
            <el-radio :label="6">备选项</el-radio>
            <el-radio :label="9">备选项</el-radio>
            <el-radio :label="9">备选项</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang='less'>
// el-input {
//   width: 100px;
// }
</style>
