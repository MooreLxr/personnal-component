<template>
  <div class="v-viewer">
    <viewer :images="source" @inited="inited">
      <template v-for="(item, i) in source">
        <img
          :key="i"
          :src="item"
          alt=""
          style="width: 100%; height: 100%;"
          v-show="false">
      </template>
    </viewer>
  </div>
</template>

<script>
/**
* author lxr
* @Date: 2021-12-08 10:40:20
* @description 图片预览
*/
import Vue from 'vue'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    navbar: true,
    title: false,
    zoomRatio: 0.3,
    toolbar: {
      zoomIn: true,
      zoomOut: true,
      reset: true,
      rotateLeft: true,
      rotateRight: true,
      prev: true,
      next: true,
      play: false,
      flipHorizontal: false,
      flipVertical: false
    }
  }
})

export default {
  name: 'v-viewer',
  props: {
    source: {
      type: Array
    }
  },
  data () {
    return {}
  },
  created () {},
  mounted () {},
  methods: {
    // 初始化图片预览插件
    inited (viewer) {
      this.$viewer = viewer
      this.$viewer.show()
    }
  }
}
</script>

<style lang="scss" scoped>
.v-viewer {}
</style>