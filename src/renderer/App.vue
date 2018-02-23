<template>
  <div id="app" class="flex">
    <router-view class="flex-1"></router-view>
    <code class="flex-1">{{appConfig}}</code>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'electron-vue-frame',
  computed: {
    ...mapGetters(['appConfig'])
  }
}
</script>

<style lang="stylus">
@import './assets/styles/variable'
@import './assets/base.styl'
</style>
