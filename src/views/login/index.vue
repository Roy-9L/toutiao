<template>
  <!-- 全屏容器 -->
  <div class="container">
    <!-- 卡片容器  el-card是一个element组件，根元素上默认添加一个类和组件的名称一致 -->
    <el-card class="box-card">
      <img src="../../assets/logo_index.png" alt />
      <!-- 表单 -->
      <!-- el-form 上添加属性  rules  值是  校验规则对象 -->
      <el-form ref="LoginForm" :model="LoginForm" :rules="LoginRules">
        <!-- 表单容器 -->
        <!-- el-form-item 上添加属性  prop  值是  当前字段的名字 -->
        <el-form-item prop="mobile">
          <!-- 表单元素 -->
          <el-input v-model="LoginForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <!-- 表单容器 -->
        <!-- el-form-item 上添加属性  prop  值是  当前字段的名字 -->
        <el-form-item prop="code">
          <!-- 表单元素 -->
          <el-input
            v-model="LoginForm.code"
            placeholder="请输入验证码"
            style="width:240px;margin-right:8px"
          ></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <!-- 表单容器 -->
        <el-form-item>
          <!-- 表单元素 -->
          <el-checkbox :value="true">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <!-- 表单容器 -->
        <el-form-item>
          <!-- 表单元素 -->
          <el-button type="primary" @click="login" style="width:100%;">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 导入本地操作用户信息的模块
import local from '../../utils/local'
export default {
  data () {
    // 自定义校验(要在return之前声明) 手机号
    //     - rule  当前字段的校验规则
    // - value 当前字段的值
    // - callback 校验完毕后的回调函数
    //   - callback()  成功
    //   - callback(new Error('提示信息'))  失败
    const checkMobile = (rule, value, callback) => {
      // 1开头  第二位 3-9 之间  9位数字结尾
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('手机号码格式不正确'))
      }
    }
    return {
      LoginForm: {
        mobile: '18999999999',
        code: '246810'
      },
      // 校验规则对象
      LoginRules: {
        // 因为可能有多条校验规则，所以是数组格式
        mobile: [
          // trigger:触发 blur  失去焦点时触发
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          },
          {
            len: 6,
            message: '验证码为6位',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    login () {
      // 对整个表单进行验证
      this.$refs['LoginForm'].validate(async valid => {
        if (valid) {
          // valid=true,校验成功，进行登录(发送请求，跳转到首页)
          // 发送请求
          // this.$axios
          //   .post('authorizations', this.LoginForm)
          //   .then(res => {
          //     // 成功 res.data是响应主体
          //     // 保存用户信息(token)
          //     local.setUser(res.data.data)
          //     this.$router.push('/Home')
          //   })
          //   .catch(() => {
          //     // 失败，提示
          //     this.$message.error('手机号或验证码错误')
          //   })

          // const res=await this.$axios.post('authorizations', this.LoginForm)

          // 一下代码可能出现异常(报错)  使用try(可能报错的代码)catah(e){处理错误}   e:exception 异常
          try {
            // 对象结构赋值
            const {
              data: { data }
            } = await this.$axios.post('authorizations', this.LoginForm)
            local.setUser(data)
            this.$router.push('/Home')
          } catch (e) {
            this.$message.error('手机号或验证码错误')
          }
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  width: 100%;
  height: 100%;
  //   background: pink;
  position: absolute;
  left: 0;
  top: 0;
  background: url(../../assets/login_bg.jpg) no-repeat center / cover;
  .el-card {
    width: 400px;
    height: 350px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 200px;
      display: block;
      margin: 0 auto 30px;
    }
  }
}
</style>
