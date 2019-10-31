<template>
  <el-container class="home-container">
    <el-aside :width="isOpen?'200px':'64px'">
      <!-- logo -->
      <div class="logo" :class="{smallLogo:!isOpen}"></div>
      <!-- 导航菜单 -->
      <!-- default-active="1" 当前激活菜单的 index   菜单项的index的值和default-active的值相等 当前菜单想被选中
        background-color="#545c64"  背景样式
        text-color="#fff"  默认文本颜色
        active-text-color="#ffd04b"  激活文本颜色
        style="border-right:none" 去除导航栏的默认1px灰色左边框
        collapse=“false” 组件展开状态
        collapse="true"  组件收起状态
      -->
      <!-- 给el-menu加上属性  router    按照 index 的值 进行跳转  开启路由功能-->
      <el-menu
        :default-active="$route.path"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="border-right:none"
        :collapse="!isOpen"
        :collapse-transition="false"
        router
      >
        <!-- index="/" 当前菜单项的唯一标识 -->
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <!-- 图标 -->
        <span class="el-icon-s-fold icon" @click="toggleMenu"></span>
        <!-- 文字 -->
        <span class="text">江苏传智播客科技教育有限公司</span>
        <!-- 下拉菜单组件 -->
        <el-dropdown class="dropdown" @command="handleClick">
          <span class="el-dropdown-link">
            <img class="headIcon" :src="photo" alt />
            <span class="userName">{{name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item icon="el-icon-setting" @click.native="setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" @click.native="logout">退出登录</el-dropdown-item>-->
            <el-dropdown-item icon="el-icon-setting" command="setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <!-- 二级路由容器 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import local from '../../utils/local'
export default {
  data () {
    return {
      // 侧边栏是不是展开的
      isOpen: true,
      // 头像
      photo: '',
      // 名称
      name: ''
    }
  },
  created () {
    const user = local.getUser() || {}
    this.photo = user.photo
    this.name = user.name
  },
  methods: {
    toggleMenu () {
      // 切换侧边栏 展开与收起
      this.isOpen = !this.isOpen
    },
    // 绑定的click事件无效，因为是给element-ui提供的组件绑定的click事件，如果组件不支持click事件，则无法触发
    // 组件不支持，则可以通过给组件解析后的DOM绑定事件
    // Vue提供了修饰符功能，如：prevent，once，stop，native。。。native：把事件绑定在原生的DOM上
    setting () {
      this.$router.push('/setting')
    },
    logout () {
      // 1.清除用户信息
      local.delUser()
      this.$router.push('/login')
    },
    handleClick (command) {
      // command的值可能为setting或logout
      // 根据command的值去执行不同的业务(调不同的方法)
      // 恰好有一个名为setting和logout的方法，否则要用if-else的方式去判断
      this[command]()
      // this.setting()===command  setting
      // this.logout()===command  logout
    }
  }
}
</script>

<style scoped lang='less'>
.home-container {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .el-aside {
    background-color: #002033;
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url(../../assets/logo_admin.png) no-repeat center /
        140px auto;
    }
    .smallLogo {
      background: url(../../assets/logo_admin_01.png) no-repeat center / 36px
        auto;
    }
  }
  .el-header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .icon {
      font-size: 30px;
      //使内容中线对齐
      vertical-align: middle;
      margin-right: 10px;
    }
    .text {
      vertical-align: middle;
    }
    .dropdown {
      float: right;
      .headIcon {
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      .userName {
        margin-left: 5px;
        font-weight: 700;
        vertical-align: middle;
        cursor: pointer;
      }
    }
  }
  // .el-main {
  //   padding: 0;
  // }
}
</style>
