<template>
  <div class="container-b">
    <p>
      COM-B
      <button @click="fn">B2A</button>
    </p>
  </div>
</template>

<script>
import evenrBus from '../eventBus'
export default {
  data () {
    return {
      msg: 'B组件的数据'
    }
  },
  methods: {
    fn () {
      // 触发事件
      evenrBus.$emit('B2A', this.msg)
    }
  }
}
</script>

<style scoped lang='less'></style>
