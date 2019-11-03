<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <!-- 按钮区域 -->
      <div class="btn">
        <!--  @change="toggleList"  切换素材列表 全部与收藏 -->
        <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
          <!-- label:指定当前选中单选框的值 -->
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button @click="open" style="float:right" type="success" size="small">添加素材</el-button>
      </div>
      <!-- 对话框 -->
      <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
        <!-- <span>上传组件</span> -->
        <!-- 上传组件 -->
        <!-- action 是图片上传的接口地址  因为此时发请求的不是axios，而是el-upload，所以必须写完整的地址-->
        <!-- header 上传组件的请求头 -->
        <!-- name 提交文件的字段名称  需要和后台保持一致  -->
        <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          :show-file-list="false"
          :headers="headers"
          name="image"
          :on-success="hangleSuccess"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-dialog>
      <!-- 素材区域 -->
      <div class="img_list">
        <div class="img_item" v-for="item in images" :key="item.id">
          <img :src="item.url" />
          <!-- v-show="!reqParams.collect"   当处于收藏的时候，不能进行操作-->
          <div class="footer" v-show="!reqParams.collect">
            <span
              @click="toggleStatus(item)"
              class="el-icon-star-off"
              :class="{red:item.is_collected}"
            ></span>
            <span @click="deleteImage(item.id)" class="el-icon-delete"></span>
          </div>
        </div>
      </div>
      <!-- 分页 依赖总条数-->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import local from '../../utils/local'
export default {
  data () {
    // 提交的筛选参数
    return {
      reqParams: {
        collect: false,
        page: 1,
        per_page: 10
      },
      // 素材列表
      images: [],
      // 总条数
      total: 0,
      dialogVisible: false,
      // 上传成功后的图片地址
      imageUrl: null,
      // 设置请求头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      }
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    async getImages () {
      // 获取数据
      const { data: { data } } = await this.$axios.get('user/images', { params: this.reqParams })
      // 将数据赋值给images
      this.images = data.results
      // 给总条数赋值
      this.total = data.total_count
    },
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 切换素材列表 全部与收藏
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 切换取消收藏与添加收藏
    async toggleStatus (item) {
      const { data: { data } } = await this.$axios.put(`user/images/${item.id}`, { collect: !item.is_collected })
      // 成功(改当前图片的状态，提示添加或取消收藏成功)
      item.is_collected = data.collect
      this.$message.success(data.collect ? '添加收藏成功' : '取消收藏成功')
    },
    // 删除
    deleteImage (id) {
      // 显示确认框
      this.$confirm('此操作将永久删除该图片, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 点击了确认
        // 1.发请求
        await this.$axios.delete(`/user/images/${id}`)
        // 2.提示
        this.$message.success('删除成功')
        // 3.更新列表
        this.getImages()
      }).catch(() => {
        //   点击了取消
      })
    },
    // 上传图片成功之后的回调函数
    hangleSuccess (res) {
      // res是响应主体，res.data.url是图片地址
      // 实现预览
      this.imageUrl = res.data.url
      // 提示
      this.$message.success('上传成功')
      // 设置定时器，上传组件2秒后自动关闭
      window.setTimeout(() => {
        // 关闭对话框
        this.dialogVisible = false
        // 更新列表
        this.getImages()
      }, 2000)
    },
    // 打开对话框
    open () {
      // 点击添加素材时，对话框显示
      this.dialogVisible = true
      // 再次打开对话框时，重置预览图地址为null
      this.imageUrl = null
    }
  }
}

</script>

<style scoped lang='less'>
.img_list {
  margin-top: 20px;
  .img_item {
    width: 180px;
    height: 180px;
    border: 1px dashed #ddd;
    position: relative;
    display: inline-block;
    margin-right: 50px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      width: 100%;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      position: absolute;
      left: 0;
      bottom: 0;
      text-align: center;
    }
    //默认：span .red 此时加red类是无效的
    //&：链接符，把上一个选择器和下一个选择器连接在一起===>span.red
    span {
      margin: 0 20px;
      &.red {
        color: red;
      }
    }
  }
}
</style>
