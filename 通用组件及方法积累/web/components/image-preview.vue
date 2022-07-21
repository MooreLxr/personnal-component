<template>
  <div class="image-preview">
    <viewer :images="source">
      <img  v-for="(src,index) in source"
            :src="src"
            :key="index">
</viewer>
  </div>
</template>

<script>
/**
* author lxr
* since 
* @description 
*/
import Vue from 'vue'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
Viewer.setDefaults({
  Options: { 
    'inline': true,
    'button': true,
    'navbar': true,
    'title': true,
    'toolbar': true,
    'tooltip': true,
    'movable': true,
    'zoomable': true,
    'rotatable': true,
    'scalable': true,
    'transition': true,
    'fullscreen': true,
    'keyboard': true,
    'url': 'data-source'
  }
})

export default {
  name: 'image-preview',
  props: ['source'],
  data () {
    return {}
  },
  created () {},
  mounted () {},
  methods: {},
}
</script>

<style lang="less">
.image-preview {
  img{
    width: 130px;
    margin-right: 10px;
  }
}
</style>