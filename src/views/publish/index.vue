<template>
  <div class="container-publish">
    <el-card>
      <div slot="header">
        <my-bread>{{$route.query.id?'修改':'发布'}}文章</my-bread>
      </div>
      <el-form ref="form" label-width="120px">
        <el-form-item label="标题:">
          <el-input v-model="articleForm.title" style="width:400px" size="small"></el-input>
        </el-form-item>
        <el-form-item label="内容:">
          <!-- 4.使用富文本 -->
          <!-- options="editorOption" 配置选项-->
          <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面:">
          <!-- 单选框组 组件 -->
          <!-- @change="articleForm.cover.images=[]"  清空之前选择的图片地址 -->
          <el-radio-group v-model="articleForm.cover.type" @change="articleForm.cover.images=[]">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 封面图组件  提供确认的图片地址 -->
          <!-- 单图时 -->
          <div v-if="articleForm.cover.type===1">
            <!-- 双向数据绑定，向子组件封面图组件传值 -->
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <!-- 三图时 -->
          <div v-if="articleForm.cover.type===3">
            <!-- 双向数据绑定，向子组件封面图组件传值 -->
            <my-image v-for="i in 3" :key="i" v-model="articleForm.cover.images[i-1]"></my-image>
          </div>
        </el-form-item>
        <el-form-item label="频道:">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <!-- 使用v-if和v-else时，必须是同级关系 -->
        <!-- 当$route.query.id存在时（有id时），执行v-if -->
        <el-form-item v-if="$route.query.id">
          <el-button type="success" @click="update(false)">修改</el-button>
          <el-button @click="update(true)">存入草稿</el-button>
        </el-form-item>
        <!-- 否则，执行v-else -->
        <el-form-item v-else>
          <el-button type="primary" @click="create(false)">发表</el-button>
          <el-button @click="create(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 1.导入富文本样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 2.导入富文本组件
// 从vue-quill-editor包中导入一个名为 quillEditor 组件
import { quillEditor } from 'vue-quill-editor'
export default {
  // 3.配置组件
  components: {
    quillEditor
  },
  data () {
    return {
      // 提交文章表单
      articleForm: {
        title: null,
        content: null,
        // 文章所属id
        channel_id: null,
        // 封面
        cover: {
          // 封面类型默认为1：单图
          type: 1,
          images: []
        }
      },
      // 富文本配置对象
      editorOption: {
        // 默认值为空
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            // 引号   代码块
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            // 有序列表  无序列表
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            // 缩进
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            // 图片
            ['image']
          ]
        }
      }
    }
  },
  // 侦听器
  watch: {
    // key：被监听的(this下的)数据的字段名
    // value：值改变后触发的函数  该函数中有两个传参 (newVal,oldVal)
    '$route.query.id': function (newVal, oldVal) {
      // 如果newVal存在，表示修改  ，要填充表单内容
      if (newVal) {
        // 修改   填充表单内容
        this.getArticle(newVal)
      } else { // 如果newVal存在，表示重置
        // 新建   重置表单
        this.articleForm = {
          title: null,
          content: null,
          // 文章所属id
          channel_id: null,
          // 封面
          cover: {
            // 封面类型默认为1：单图
            type: 1,
            images: []
          }
        }
      }
    }
  },
  created () {
    // 根据地址栏是否有id来判断
    const articleId = this.$route.query.id
    // 如果articleId存在
    if (articleId) {
      // 修改逻辑
      // 填充表单内容
      this.getArticle(articleId)
    }
  },
  methods: {
    // 获取文章详情
    async getArticle (id) {
      const { data: { data } } = await this.$axios.get(`articles/${id}`)
      this.articleForm = data
    },
    // 新建
    async create (draft) {
      await this.$axios.post(`articles?draft=${draft}`, this.articleForm)
      // 成功
      this.$message.success(draft ? '存入草稿成功' : '发表成功')
      // 跳转到内容管理页面
      this.$router.push('/article')
    },
    // 修改
    async update (draft) {
      // await this.$axios.put(`articles/${this.articleForm.id}?draft=${draft}`, this.articleForm)
      await this.$axios.put(`articles/${this.$route.query.id}?draft=${draft}`, this.articleForm)
      // 成功
      this.$message.success(draft ? '存入草稿成功' : '修改成功')
      // 跳转到内容管理页面
      this.$router.push('/article')
    }
  }
}
</script>

<style scoped lang='less'>
// el-input {
//   width: 100px;
// }
</style>
