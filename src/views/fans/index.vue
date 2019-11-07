<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <!-- 选项卡 -->
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="list">
          <div class="fans_list">
            <div class="fans_item" v-for="item in fansList" :key="item.id.toString()">
              <el-avatar :size="80" :src="item.photo"></el-avatar>
              <p>{{item.name}}</p>
              <el-button type="primary" plain>+关注</el-button>
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
        <el-tab-pane label="粉丝画像" name="picture">
          <!-- 3.准备DOM容器，具备高宽 -->
          <div ref="dom" style="width: 600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// 2.导入echarts
import echarts from 'echarts'
import circleUrl from '../../assets/wec.png'
export default {
  data () {
    return {
      activeName: 'picture',
      circleUrl,
      fansList: [],
      reqParams: {
        page: 1,
        per_page: 21
      },
      total: 0
    }
  },
  mounted () {
    // 4.初始化echarts
    // 因为echarts绘制图表需要操作dom，所以在mounted中进行初始化
    // 获取dom
    const dom = this.$refs.dom
    // 初始化
    const myEcharts = echarts.init(dom)
    // 5.准备  配置项和数据
    const option = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    }
    // 6.使用配置项和数据
    myEcharts.setOption(option)
  },
  created () {
    this.getFansList()
  },
  methods: {
    // 分页
    pager (newPage) {
      this.reqParams.page = newPage
      this.getFansList()
    },
    async getFansList () {
      const { data: { data } } = await this.$axios.get('followers', { params: this.reqParams })
      this.fansList = data.results
      this.total = data.total_count
    }
  }
}
</script>

<style scoped lang='less'>
.fans_item {
  width: 140px;
  height: 185px;
  padding-top: 20px;
  border: 1px dashed #ddd;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
  text-align: center;
}
</style>
