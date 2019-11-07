<template>
  <div class="container-setting">
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 栅格系统 -->
      <!-- 一行，两列，每列12等分 -->
      <el-row>
        <el-col :span="12">
          <!-- 表单 -->
          <el-form label-width="120px">
            <el-form-item label="编号:"></el-form-item>
            <el-form-item label="手机:"></el-form-item>
            <el-form-item label="媒体名称:">
              <el-input v-model="userInfo.name" size="small"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍:">
              <!-- :rows="3"  3行 -->
              <el-input type="textarea" :rows="3" v-model="userInfo.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:">
              <el-input v-model="userInfo.email" size="small"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- 上传组件 -->
          <!-- 上传组件 -->
          <!-- action 是图片上传的接口地址  因为此时发请求的不是axios，而是el-upload，所以必须写完整的地址-->
          <!-- headers 上传组件的请求头   配置token -->
          <!-- name 提交文件的字段名称  需要和后台保持一致  -->
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
    <com-a></com-a>
    <div>
      <hr />
      <com-b></com-b>
    </div>
  </div>
</template>

<script>
import ComA from '../../test/com-a'
import ComB from '../../test/com-b'
export default {
  components: {
    ComA, ComB
  },
  data () {
    return {
      userInfo: {
        name: null,
        intro: null,
        email: null
      },
      imageUrl: null
    }
  }
}
</script>

<style scoped lang='less'></style>
