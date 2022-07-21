<template>
  <div :class="`carousel ${rowCount>1 ? 'carousel-multiple': ''}`">
    <div class="carousel-wrap" v-if="source && source.length" @mouseenter="mEnter" @mouseleave="mLeave">
      <!-- image, video, player:极简播放器 -->
      <div class="slider-group" ref="container">
        <div class="slider-item-wrap" ref="sliderWrap">
          <div class="slider-item" v-for="(item, i) in source" :key="i" :ref="`sliderItem`+i" @click="itemClick(item)">
            <my-player :ref="item.id" :player-id="item.id" :configData="item" v-if="item.btype === 'player'" v-show="item.bshow"></my-player>
            <video :src="item.url" v-if="item.btype === 'video'"></video>
            <img :src="item.url" alt="" v-else />
            <span class="img-label" v-if="showLabel">{{item.label}}</span>
          </div>
        </div>
      </div>
      <!-- 箭头 -->
      <div class="arrow-wrap" v-show="showArrow">
        <img src="../assets/images/left_arrow.png" alt="" class="arrow left-arrow" @click="prev">
        <img src="../assets/images/right_arrow.png" alt="" class="arrow right-arrow" @click="next">
      </div>
      <!-- 点 -->
      <div class="dots-group">
        <span class="dot" v-for="(item,i) in pages" :key="i" :class="{'active':currentIndex===i}" @click="showCurImg(i)"></span>
      </div>
    </div>
  </div>
</template>

<script>
/**
* author lxr
* since 2021-05-06 13:51:00
* @description 
  <carousel :source="source"></carousel>
  source = [
    { url: 'https://img0.baidu.com/it/u=103721101,4076571305&fm=26&fmt=auto&gp=0.jpg', btype:'image', label:'图片测试' },
    { url: 'http://pic.5tu.cn/uploads/allimg/1508/080955475880.png', btype:'image', label:'图片测试' },
    { url: '', btype:'video', label:'video测试' },
    { url: '', btype:'player', label:'极简播放器测试' }
  ]
*/
import myPlayer from '@/components/MyPlayer-popup'
import computedStyle from '@/utils/computedStyle'

export default {
  name: 'carousel',
  components: { myPlayer },
  props: {
    source: {
      type: Array,
      default: () => []
    },
    // 行显示个数
    rowCount: {
      type: Number,
      default: 1
    },
    // 列显示个数
    colCount: {
      type: Number,
      default: 1
    },
    // 是否展示标签
    showLabel: {
      type: Boolean,
      default: false
    },
    // 是否循环轮播
    isLoop: {
      type: Boolean,
      default: true
    },
    // 轮播间隔时间
    interval: {
      type: Number,
      default: 3000
    },
    // 箭头展示方式 ：always/hover/never
    arrow: {
      type: String,
      default: 'always'
    }
  },
  data () {
    return {
      currentIndex: 0,
      pages: 0, // 总页数
      showArrow: null
    }
  },
  created () {
    if (this.arrow === 'always') this.showArrow = true
    if (this.arrow === 'never') this.showArrow = false
  },
  mounted () {
    if(this.source.length) {
      this.initStyle()
      this.timer = setInterval(() => {
        this.next()
      }, 60000)
    }
  },
  methods: {
    initStyle () {
      const container = this.$refs.container
      const conWidth = container.clientWidth
      const conHeight = container.clientHeight
      const { source, rowCount, colCount } = this
      const pages = Math.ceil(source.length/rowCount/colCount) // 页数
      const style = computedStyle(this.$refs.sliderItem0[0])
      const marginRight = parseInt(style.marginRight) || 0
      const marginLeft = parseInt(style.marginLeft) || 0
      const marginTop = parseInt(style.marginTop) || 0
      const marginBottom = parseInt(style.marginBottom) || 0
      
      this.pages = pages
      this.$refs.sliderWrap.style.height = conHeight * pages + 'px' // 设置容器总width
      for (let i= 0, len = source.length; i<len; i++) {
        let sliderItem = this.$refs['sliderItem'+i][0]
        // 设置单张图的width,height
        sliderItem.style.width = conWidth/rowCount - marginRight - marginLeft + 'px'
        sliderItem.style.height = conHeight/colCount - marginTop - marginBottom + 'px'
      }
    },
    showCurImg (index) {
      this.currentIndex = index
      let sliderWrap = this.$refs.sliderWrap
      let conHeight = this.$refs.container.clientHeight
      sliderWrap.style.top = -index * conHeight + 'px'
      this.$emit('change', this.currentIndex)
    },
    prev () {
      if(this.currentIndex > 0) this.currentIndex--
      else this.currentIndex = 0
      this.showCurImg(this.currentIndex)
    },
    next () {
      let { pages } = this
      if (this.currentIndex < (pages - 1)) this.currentIndex++
      else this.currentIndex = 0
      this.showCurImg(this.currentIndex)
    },
    itemClick (e) {
      this.$emit('itemClick', e)
    },
    mEnter () {
      if (this.arrow === 'hover') this.showArrow = true
    },
    mLeave () {
      if (this.arrow === 'hover') this.showArrow = false
    }
  },
  beforeDestroy () {
    this.timer && clearInterval(this.timer)
  }
}
</script>

<style lang="scss">
.carousel{
  width: 100%;
  height: 100%;
  .carousel-wrap{
    width: 100%;
    height: 100%;
  }
  .slider-group{
    width: 100%;
    height: calc(100% - 16px);
    overflow: hidden;
    position: relative;
    .slider-item-wrap{
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      transition: all .1s;
      .slider-item{
        display: inline-block;
        height: 100%;
        position: relative;
        margin: 0 5px;
        vertical-align: top;
        .img-label{
          position: absolute;
          left: 0;
          bottom: 0;
          color: #fff;
          background-color: rgba(0,0,0,0.5);
          font-size: 16px;
          padding: 5px;
          z-index: 999;
        }
        img, video{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .dots-group{
    font-size: 0;
    text-align: center;
    padding: 5px 0;
    .dot{
      width: 30px;
      height: 6px;
      display: inline-block;
      margin: 0 5px;
      background-color: #0C4D62;
      cursor: pointer;
      &.active{
        background-color: #fff;
        border: 1px solid #fff;
      }
    }
  }
  .arrow{
    position: absolute;
    top: calc(50% - 20px);
    width: 30px;
    cursor: pointer;
    &.left-arrow{
      left: 0;
    }
    &.right-arrow{
      right:0;
    }
  }
}
</style>
