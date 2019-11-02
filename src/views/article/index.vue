<template>
  <div class="container-aryicle">
    <!-- 筛选条件布局 -->
    <el-card>
      <!-- 头 -->
      <div slot="header">
        <!-- 使用面包屑导航组件 -->
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 内容   表单-->
      <!-- size：控制表单内组建的尺寸 (medium、small、mini) -->
      <el-form label-width="80px" size="small">
        <el-form-item label="状态：">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <!-- 选择器 -->
          <!-- clearable : 清空频道选项   但清空后值变成了空字符""  要在提交前进行判断 判断频道的channel_id是否为“” 如果是，将值改为null-->
          <!-- 使用频道组件 -->
          <!-- <el-select v-model="reqParams.channel_id" placeholder="请选择" clearable>
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>-->
          <!-- v-model 语法糖 1. :value  2. @input -->
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期：">
          <!-- v-model 绑定的值是数组[起始日期 begin_pubdate,结束日期 end_pubdate] -->
          <el-date-picker
            v-model="dataArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果布局 -->
    <!-- <page></page>
    <page>内容2</page>-->
    <!-- <page> -->
    <!-- allData===>对象 是一个变量(数据)，收集了当前插槽上所有的自定义属性 -->
    <!-- scope:作用域数据 -->
    <!-- 2.6.0 vue 版本之前的写法 -->
    <!-- <div slot="content" slot-scope="scope">{{scope.pn}} {{scope.test}}</div> -->
    <!-- 新版本使用 v-slot 指令  v-slot:插槽名称=“作用域插槽的数据”-->
    <!-- v-slot 只能用在组件(components)上 或 template标签上，不能用在div上-->
    <!-- <template v-slot:content="scope">{{scope.pn}} {{scope.test}}</template>
    <div slot="footer">footer</div>-->
    <!-- </page> -->
    <el-card style="margin-top:20px">
      <div slot="header">
        <span>根据筛选条件共查询到{{total}}条结果</span>
      </div>
      <!-- 表格 -->
      <!-- data 属性  绑定数据（数组 [{},{}]） -->
      <el-table :data="articles">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]" style="width:150px;height:100px">
              <div slot="error">
                <img src="../../assets/error.gif" alt width="150" height="100" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态">
          <!-- 插槽 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status===2">审核通过</el-tag>
            <el-tag type="warning" v-if="scope.row.status===3">审核失败</el-tag>
            <el-tag type="danger" v-if="scope.row.status===4">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              plain
              @click="toEdit(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              @click="delArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- layout:当前分页组件包含的布局  total:总条数-->
      <!-- page-size 默认一页显示10条 -->
      <!--  @current-change  当页码发生改变时触发，默认传入新的页码 -->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev,pager,next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
// import page from '../../test/page'
export default {
  // components: { page },
  data () {
    return {
      // 提交给后台的参数对象
      // reqParams最终由axios进行数据提交，当字段的值是null时，axios不会提交该字段
      reqParams: {
        // 想默认选中谁，就把status改成谁的默认值
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        // 分页
        // 当前页码
        page: 1,
        // 每页多少条
        per_page: 20
      },
      // 频道选项
      channelOptions: [],
      // 日期范围
      dataArr: [],
      // 文章列表数据
      articles: [],
      // 总条数  默认0
      total: 0
    }
  },
  created () {
    // this.getChannelOptions()
    // 页面渲染时，获取文章列表数据
    this.getArticles()
  },
  methods: {
    // 获取频道选项数据
    // async getChannelOptions () {
    //   // 获取数据
    //   const { data: { data } } = await this.$axios.get('channels')
    //   // 把数据赋值给channelOptions
    //   this.channelOptions = data.channels
    // },
    // 获取文章列表数据
    async getArticles () {
      // 获取数据
      const { data: { data } } = await this.$axios.get('articles', { params: this.reqParams })
      // 把数据赋值给articles
      this.articles = data.results
      // 给总条数数据赋值
      this.total = data.total_count
    },
    // 分页函数
    pager (newPage) {
      // 修改当前的页码为新的页码
      this.reqParams.page = newPage
      // 重新获取数据
      this.getArticles()
    },
    // 选择日期
    changeDate (dataArr) {
      // console.log(dataArr)
      // 打印得到的dataArr是数组[date(起始时间),date结束时间()]
      // 但我们需要的dataArr是数组 [string,string]  string === '2019-10-31'
      // value-format='yyyy-MM-dd' 格式转换成功
      // 注意：当情况日期之后，dataArr是null，对应的begin_pubdate和end_pubdate的值也该为null
      if (dataArr) {
        this.reqParams.begin_pubdate = dataArr[0]
        this.reqParams.end_pubdate = dataArr[1]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    search () {
      // 获取筛选数据(准备日期数据)
      // 处理频道空字符串的问题
      if (this.reqParams.channel_id === '') this.reqParams.channel_id = null
      // 每当筛选完成后，当前页码都要变成1
      this.reqParams.page = 1
      this.getArticles()
    },
    toEdit (id) {
      // 第一种 query传参方式
      // this.$router.push(`/publish?id=${id}`)
      // 第二种 query传参方式
      this.$router.push({ path: '/publish', query: { id } })
    },
    // 删除
    async delArticle (id) {
      // 发请求
      await this.$axios.delete(`articles/${id}`)
      // 删除成功后提示用户
      this.$message.success('删除成功')
      // 重新请求数据
      this.getArticles()
    }
  }
}
</script>

<style scoped lang='less'></style>
