<template>
  <div class="picture-swipe" :style="`background-image:${source.length?'':`url(../assets/images/noData.png)`}`">
    <viewer :images="source" @inited="inited">
      <template v-for="(item, i) in source">
        <img
          :key="i"
          :src="item.url"
          alt=""
          style="width: 100%; height: 100%;"
          v-if="item.type === 'image'"
          v-show="false">
        <video :src="item.url" v-else :key="i" v-show="false"></video>
      </template>
    </viewer>
    <div class="picture-wrap" v-if="partImages.length">
      <template v-for="(item, i) in partImages">
        <video
          :src="item.url"
          :key="i"
          preload="meta"
          v-if="item.type==='video'"
        ></video>
        <img
          :key="i"
          src="../assets/images/more.png"
          alt=""
          @click.stop="showPreview"
          v-else-if="item.type==='more'"
          class="more-icon">
        <img
          :src="item.url"
          :key="i"
          alt=""
          class="image-item"
          @click.stop="showPreview"
          v-else
          :style="`width:calc(100%/${picNum})`">
      </template>
    </div>
  </div>
</template>

<script>
/**
 * @author lxr
 * @description 图片预览组件
 * @module @/components/picture-swipe 组件地址
 * @example 调用示例
 * <picture-swipe :source="imgData" :picNum="3"></picture-swipe>
 *
 * imgData: [
     { type: 'image', url: 'http://www.w3school.com.cn/i/eg_tulip.jpg' },
     { type: 'video', url: 'http://www.w3school.com.cn/i/movie.ogg' }, // 暂不支持视频
     { type: 'image', url: 'http://www.w3school.com.cn/i/eg_tulip.jpg' }
   ] //列表展示的数据
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
  props: {
    source: {
      type: Array
    },
    // 一行展示的图片数，
    picNum: {
      type: Number
    },
    // 超出显示 “更多” 按钮
    showMoreIcon: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      partImages: []
    }
  },
  created () {
    const { source, picNum, showMoreIcon } = this
    if (picNum) {
      this.partImages = picNum < source.length ? source.slice(0, picNum) : source
    } else {
      this.partImages = source
    }
    if (showMoreIcon && picNum < source.length) {
      this.partImages.push({
        type: 'more',
        url: '../assets/images/more.png'
      })
    }
    console.log('show', this.partImages)
  },
  mounted () {},
  methods: {
    // 初始化图片预览插件
    inited (viewer) {
      this.$viewer = viewer
    },
    showPreview () {
      setTimeout(() => {
        this.showImgPreview()
      }, 200)
    },
    // 弹出图片预览插件
    showImgPreview () {
      this.$viewer.show()
    }
  }
}
</script>

<style lang="scss" scoped>
.picture-swipe {
  width: 100%;
  height: 100%;
  min-height: 60px;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center;

  .picture-wrap {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .image-item {
      height: calc(100% - 10px);
      padding: 5px;
      margin: 5px 0;
      box-sizing: border-box;
    }

    .more-icon {
      width: 40px;
      height: 40px;
    }
  }

  .viewer-backdrop {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .viewer-list > li {
    opacity: 0.4;
  }
}
</style>
