<template>
  <!--发布文章模块===>封面图组件 -->
  <div class="my-image">
    <!-- 图片按钮 -->
    <div class="btn_box" @click="open">
      <!-- 如果你是动态绑定的src属性，指向图片是不会打包的  所以看不到图片效果 -->
      <!-- 使用import主动导入图片资源，让webpack去打包 -->
      <!-- 如果value没有图片传入的地址，则使用默认图片的地址 -->
      <img :src="value||defaultImage" alt />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <!-- 选项卡组件 -->
      <!-- activeName  当前激活选项卡的name属性的值 -->
      <el-tabs v-model="activeName" type="card">
        <!-- el-tab-pane  面板  一个选项卡对应一个面板 -->
        <el-tab-pane label="素材库" name="images">
          <!-- 全部与收藏按钮 -->
          <!--  @change="toggleList"  切换素材列表 全部与收藏 -->
          <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
            <!-- label:指定当前选中单选框的值 -->
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 素材库 -->
          <div class="img_list">
            <!-- :class="{selected:selectedImageUrl===item.img}"   当记录的图片地址与当前图片地址一样时，添加伪类(样式)  实现选中当前图片-->
            <div
              class="img_item"
              @click="selectedImage(item.url)"
              v-for="item in images"
              :key="item.id"
              :class="{selected:selectedImageUrl===item.url}"
            >
              <img :src="item.url" />
              <!-- v-show="!reqParams.collect"   当处于收藏的时候，不能进行操作
              <div class="footer" v-show="!reqParams.collect">
                <span
                  @click="toggleStatus(item)"
                  class="el-icon-star-off"
                  :class="{red:item.is_collected}"
                ></span>
                <span @click="deleteImage(item.id)" class="el-icon-delete"></span>
              </div>-->
            </div>
          </div>
          <!-- 分页 -->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            @current-change="pager"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <!-- 上传组件 -->
          <!-- action 是图片上传的接口地址  因为此时发请求的不是axios，而是el-upload，所以必须写完整的地址-->
          <!-- headers 上传组件的请求头   配置token-->
          <!-- name 提交文件的字段名称  需要和后台保持一致  -->
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :headers="headers"
            name="image"
            :on-success="hangleSuccess"
          >
            <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="confirmImage" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import local from '../utils/local'
// 如果你是动态绑定的src属性，指向图片是不会打包的
// 导入图片数据          主动导入图片资源，webpack是会去打包的
import defaultImage from '../assets/default.png'
// import
export default {
  // 接收父组件发布文章组件传的值   value在发布文章的时候没有值，编辑的时候才有图片数据
  props: ['value'],
  name: 'my-image',
  data () {
    return {
      // 控制对话框显示与隐藏
      dialogVisible: false,
      // 当前激活选项卡的name属性的值
      activeName: 'images',
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      // 图片列表
      images: [],
      // 总条数
      total: 0,
      // 当前选中的图片地址
      selectedImageUrl: null,
      // 设置请求头  上传组件时用
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      },
      // 当前上传的图片地址
      uploadImageUrl: null,
      // 按钮的默认图片
      // defaultImage: '../assets/default.png'
      defaultImage
    }
  },
  methods: {
    // 切换素材列表 全部与收藏
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    open () {
      // 打开对话框
      this.dialogVisible = true
      // 打开对话框时调用 getImages ()  获取素材列表数据
      this.getImages()
    },
    async getImages () {
      // 获取数据
      const { data: { data } } = await this.$axios.get('user/images', { params: this.reqParams })
      // 将数据赋值给images
      this.images = data.results
      // 给总条数赋值
      this.total = data.total_count
    },
    // 分页
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 选中图片
    selectedImage (url) {
      // 记录当前选中图片的地址 代表当前点击的图片已被选中
      this.selectedImageUrl = url
      // console.log(url)
    },
    // 上传图片成功之后的回调函数
    hangleSuccess (res) {
      // res是响应主体，res.data.url是图片地址
      // 实现预览
      this.uploadImageUrl = res.data.url
      // 提示
      this.$message.success('上传成功')
    },
    // 确认图片
    confirmImage () {
      if (this.activeName === 'images') {
        // 素材库
        if (!this.selectedImageUrl) {
          return this.$message.warning('请选中一张图片')
        }
        // 给img的src赋值图片地址
        // this.defaultImage = this.selectedImageUrl
        // 提交图片地址给父组件 发布文章组件
        this.$emit('input', this.selectedImageUrl)
        this.dialogVisible = false
      } else {
        if (!this.uploadImageUrl) {
          return this.$message.warning('请上传一张图片')
        }
        // 给img的src赋值图片地址
        // this.defaultImage = this.uploadImageUrl
        // 提交图片地址给父组件 发布文章组件
        this.$emit('input', this.uploadImageUrl)
        this.dialogVisible = false
      }
    }
  }
}
</script>

<style scoped lang='less'>
.my-image {
  display: inline-block;
  margin-right: 20px;
}
.btn_box {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.dialog-footer {
  width: 100%;
  text-align: center;
  display: inline-block;
}
.img_list {
  margin-top: 20px;
  .img_item {
    width: 180px;
    height: 150px;
    border: 1px dashed #ddd;
    position: relative;
    display: inline-block;
    margin-right: 50px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    // 伪元素
    &.selected::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3) url(../assets/selected.png) no-repeat
        center / 50px 50px;
    }
  }
}
</style>
