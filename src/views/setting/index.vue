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
          <!-- 自定义rules 进行表单验证，限制用户的输入(只能是汉字、数字、长度。。。) -->
          <!-- <el-form label-width="120px" :rules="rules"> -->
          <el-form label-width="120px">
            <el-form-item label="编号:">{{userInfo.id}}</el-form-item>
            <el-form-item label="手机:">{{userInfo.mobile}}</el-form-item>
            <!-- <el-form-item label="媒体名称:" Prop=> -->
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
              <el-button @click="saveInfo" type="primary">保存设置</el-button>
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
            :http-request="updatePhoto"
          >
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import local from '../../utils/local'
import eventBus from '../../eventBus'
export default {
  data () {
    return {
      userInfo: {
        name: null,
        intro: null,
        email: null,
        photo: null
      }
      // imageUrl: null
    }
  },
  // 组件初始化
  created () {
    // 获取用户信息
    this.getUserInfo()
  },
  methods: {
    // 修改头像(上传图片)
    async updatePhoto (result) {
      // 当选择文件后会触发当前函数(updatePhoto),此时会默认传入一个选择后的结果，结果中会包含选择的文件信息
      // console.log(result)
      // 1.获取图片文件数据
      const file = result.file
      // 2.创建一个formData
      const formData = new FormData()
      // 3.追加图片数据到formData  字段的名字需要和后台一致
      formData.append('photo', file)
      // 4.使用axios提交数据
      const { data: { data } } = await this.$axios.patch('user/photo', formData)
      // 5.拿着上传成功后的图片地址进行预览
      this.userInfo.photo = data.photo
      // 6.提示
      this.$message.success('头像修改成功')
      // 7.更新home组件的头像(photo)
      eventBus.$emit('updatePhoto', data.photo)
      // 8.更新本地存储的photo
      // 1.先把本地存储中的数据拿出来
      const user = local.getUser()
      // 2.修改
      user.photo = data.photo
      // 3.再把修改好的数据存入本地存储中
      local.setUser(user)
    },
    // 获取用户信息
    async getUserInfo () {
      const { data: { data } } = await this.$axios.get('user/profile')
      // 将获取到的用户信息填充到表单中
      this.userInfo = data
    },
    // 保存用户信息 (除去头像不能保存 因为编辑用户资料接口只能提交三个参数接口，不能同时保存信息和photo  ，photo由编辑用户头像接口单独进行编辑)
    async saveInfo () {
      // patch和put都是修改请求
      // patch   局部修改
      // put   完整修改
      try {
        await this.$axios.patch('user/profile', {
          name: this.userInfo.name,
          intro: this.userInfo.intro,
          email: this.userInfo.email
        })
        // 成功
        // 提示
        this.$message.success('保存用户信息成功')
        // 更新home
        // 触发事件
        eventBus.$emit('updateName', this.userInfo.name)
        // 更新本地存储
        // 1.先把本地存储中的数据拿出来
        const user = local.getUser()
        // 2.修改
        user.name = this.userInfo.name
        // 3.再把修改好的数据存入本地存储中
        local.setUser(user)
      } catch (e) {
        this.$message({
          type: 'error',
          message: '参数错误'
        })
      }
    }
  }
}
</script>

<style scoped lang='less'></style>
