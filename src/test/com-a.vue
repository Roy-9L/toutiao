<template>
  <div class="container-a">
    <p>COM-A-------{{str}}</p>
  </div>
</template>

<script>
import evenrBus from '../eventBus'
export default {
  data () {
    return {
      str: ''
    }
  },
  created () {
    // 绑定事件
    evenrBus.$on('B2A', (data) => {
      this.str = data
    })
  }
}
</script>

<style scoped lang='less'></style>
