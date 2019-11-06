<template>
  <!-- 内容管理模块===>频道组件 -->
  <el-select :value="value " @change="fn" placeholder="请选择" clearable>
    <el-option v-for="item in channelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'my-channel',
  props: ['value'],
  data () {
    return {
      // value: null,
      channelOptions: []
    }
  },
  created () {
    this.getChannelOptions()
  },
  methods: {
    // 频道改变函数
    fn (changeId) {
      // 清空后值是空字符 ''   要改成null
      if (changeId === '') {
        changeId = null
      }
      // 把id提交给父组件
      this.$emit('input', changeId)
    },
    // 获取频道选项数据
    async getChannelOptions () {
      // 获取数据
      const { data: { data } } = await this.$axios.get('channels')
      // 把数据赋值给channelOptions
      this.channelOptions = data.channels
    }
  }
}
</script>

<style scoped lang='less'>
</style>
