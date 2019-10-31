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
          <el-select v-model="reqParams.channel_id " placeholder="请选择">
            <el-option
              v-for="item in channelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期：">
          <!-- v-model 绑定的值是数组[起始日期 begin_pubdate,结束日期 end_pubdate] -->
          <el-date-picker
            v-model="dataArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果布局 -->
    <!-- <page></page>
    <page>内容2</page>-->
    <page>
      <!-- allData===>对象 是一个变量(数据)，收集了当前插槽上所有的自定义属性 -->
      <!-- scope:作用域数据 -->
      <!-- 2.6.0 vue 版本之前的写法 -->
      <!-- <div slot="content" slot-scope="scope">{{scope.pn}} {{scope.test}}</div> -->
      <!-- 新版本使用 v-slot 指令  v-slot:插槽名称=“作用域插槽的数据”-->
      <!-- v-slot 只能用在组件(components)上 或 template标签上，不能用在div上-->
      <!-- <template v-slot:content="scope">{{scope.pn}} {{scope.test}}</template>
      <div slot="footer">footer</div>-->
    </page>
  </div>
</template>

<script>
import page from '../../test/page'
export default {
  components: { page },
  data () {
    return {
      // 提交给后台的参数对象
      // reqParams最终由axios进行数据提交，当字段的值是null时，axios不会提交该字段
      reqParams: {
        // 想默认选中谁，就把status改成谁的默认值
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pibdate: null
      },
      // 频道选项
      channelOptions: [{ value: 1, label: '科技' }, { value: 2, label: '娱乐' }],
      // 日期范围
      dataArr: []
    }
  }
}
</script>

<style scoped lang='less'></style>
