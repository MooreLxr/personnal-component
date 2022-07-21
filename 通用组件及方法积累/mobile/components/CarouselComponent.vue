<template>
  <div class="carousel-wrap"
       ref="container"
       :style="`height:${isHeightAuto ? '':'100%'};overflow:hidden;`">
    <div v-if="dataProvide && dataProvide.length" class="slider" ref="slider">
      <!-- 图片展示 -->
      <div class="slider-group"
           ref="sliderGroup"
           :style="`width:${thumbnailVisible?'80%':'100%'};height:${isHeightAuto?'':'100%'};`">
        <div class="slider-item-wrap" ref="sliderWrap" :style="`height:${isHeightAuto?'auto':'100%'};left:0;`">
          <div v-for="(item,index) in dataProvide"
               :key="index"
               class="slider-item"
               :style="`height:${isHeightAuto?'':'100%'};`"
               :ref="`sliderItem`+index"
               @touchmove="move"
               @touchstart="move"
               @touchend="move">
            <span class="img-label" v-if="showLabel">{{item.label}}</span>
            <!-- 图片 -->
            <video :src="item.filepath"
                    controls="controls"
                    v-if="item.btype=='video'"
                    preload="meta"
                    :ref="`image`+index"></video>
            <img :src="item.filepath"
                 :ref="`image`+index"
                 alt=""
                 class="img-item"
                 :style="`height:${isHeightAuto?'auto':'100%'};`" 
                 v-else />
          </div>
        </div>

        <!-- 左右按钮 -->
        <div class="btn-group" v-if="dataProvide.length>1" v-show="btnVisible">
          <div class="prev" @click="prev()">
            <img :src="`${assets}/img/mobile/common/left.png`" alt="" class="icon">
          </div>
          <div class="next" @click="next()">
            <img :src="`${assets}/img/mobile/common/right.png`" alt="" class="icon">
          </div>
        </div>
        <img :src="`${assets}/img/onduty/hide.png`"
             class="thumb-icon"
             alt=""
             @click="toggleThumbnail"
             v-show="thumbnailFlag">
      </div>

      <!-- 缩略图 -->
      <div class="thumbnail-group"
           :style="`width:${thumbnailVisible?'20%':'0'};`"
           v-if="thumbnailFlag">
        <div class="oImg-wrap" ref="oImgWrap">
          <div class="oImg"
               ref="oImg"
               v-for="(item,index) in dataProvide"
               :key="index"
               :class="{'active':currentIndex==index}"
               @click="showCurImg(index)">
            <video :src="item.filepath"
                    v-if="item.btype=='video'"
                    poster
                    preload="meta"></video>
            <img :src="item.filepath" alt="" v-else/>
          </div>
        </div>
      </div>

      <!-- 点 -->
      <div class="dots-group" v-if="dotVisible&&dataProvide&&dataProvide.length>1">
        <span class="dot"
              v-for="(item,i) in dataProvide.length"
              :key="i"
              :class="{'active':currentIndex===i}"
              @click="showCurImg(i)"></span>
      </div>
    </div>

    <!-- 无数据 -->
    <div v-if="dataProvide && dataProvide.length==0" class="nodata">
      <img :src="`${assets}/img/mobile/common/nodata.png`" alt="" style="width:200px;">
    </div>
  </div>
</template>

<script>
/**
 * 调用方式<carousel-component :dataProvide="imgData" :thumbnailFlag="true" :isLoop="false" v-if="dataProvide && dataProvide.length"></carousel-component>
 * this.imgData = [
      { btype: "image", filepath: "http://122.112.238.229:8081/upload/2020-12-16/0bbacccb-67d0-4666-9298-03031c70d7f4_small.jpeg" },
      { btype: "video", filepath: "http://www.w3school.com.cn/i/movie.ogg" },
      { btype: "image", filepath: "http://122.112.238.229:8081/upload/2020-12-15/273f3b11-49b2-4587-9770-87ce27b65c0b_small.jpeg" }
    ]
 */
export default {
  props: {
    dataProvide: {
      type: Array,
      default: []
    },
    //是否显示缩略图
    thumbnailFlag: {
      type: Boolean,
      default: false
    },
    dotVisible: {
      type: Boolean,
      default: false
    },
    //是否展示标签
    showLabel: {
      type: Boolean,
      default: false
    },
    //是否循环轮播
    isLoop: {
      type: Boolean,
      default: true
    },
    //轮播间隔时间
    interval: {
      type: Number,
      default: 3000
    },
    //父容器不设置高度，需要组件内部撑开高度(待完善)
    isHeightAuto: {
      type: Boolean,
      default: false
    },
    //点击图片预览
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      timer: "",
      currentIndex: 0,
      thumbnailVisible: this.thumbnailFlag,
      width: T.width,
      height: T.height,
      btnVisible: false, //按钮移入移出显示切换
      imgWidth:0,
    };
  },
  mounted () {
    let { dataProvide } = this;
    if (dataProvide && dataProvide.length) this.initSliderStyle();
    if (this.isLoop && dataProvide.length>1) {
      this.timer = setInterval(() => {
        this.next();
      }, this.interval);
    }
  },
  methods: {
    //给轮播图每个子元素width赋值
    initSliderStyle () {
      let sliderGroup = this.$refs.sliderGroup,
        conWidth = sliderGroup && sliderGroup.clientWidth, //容器总宽度
        sliderWrap = this.$refs.sliderWrap,
        image = this.$refs.image0,
        { dataProvide, isHeightAuto } = this;

      //给每个轮播设置宽度
      if (dataProvide && dataProvide.length > 0) {
        dataProvide.forEach((item, i) => {
          let sliderItem = this.$refs["sliderItem" + i][0];
          
          //轮播图高度自适应时需给容器动态设置为图片的高度
          if (isHeightAuto && image) {
            image.onload = function () {
              sliderWrap.style.height = image.clientHeight + "px";
              sliderGroup.style.height = image.clientHeight + "px";
            };
          }

          sliderItem.style.width = conWidth + "px";
          sliderWrap.style.width = dataProvide.length * conWidth + "px";
        });
        this.imgWidth = conWidth   //保留图片的width，当页面发生跳转时，该模块设置为display:none时导致clientWidth=0
      }
    },
    prev () {
      let index;
      if (this.currentIndex === 0)
        index = this.dataProvide.length - 1;
      else
        index = this.currentIndex - 1;

      this.showCurImg(index);
      this.$emit("getPicUrl", this.dataProvide[index], this.dataProvide.length);
    },
    next () {
      let index;
      if (this.currentIndex === this.dataProvide.length - 1) index = 0;
      else index = this.currentIndex + 1;

      this.showCurImg(index);
      this.$emit("getPicUrl", this.dataProvide[index], this.dataProvide.length);
    },
    showCurImg (index, signal) {
      if (index || index === 0) this.currentIndex = index;

      let { dataProvide } = this,
        sliderWrap = this.$refs.sliderWrap,
        w = this.imgWidth, //每张图的宽度
        left = sliderWrap && sliderWrap.style.left //容器的left
      left = left && Number(left.replace("px", ""));

      sliderWrap.style.left = -index * w + "px";
      this.setOpacity();
      sliderWrap.children[index].style.opacity = 1;
    },
    //设置所有图片的opacity==0
    setOpacity () {
      for (let i = 0; i < this.dataProvide.length; i++) {
        let sliderItem = this.$refs['sliderItem' + i];
        if (sliderItem && i !== this.currentIndex) sliderItem[0].style.opacity = 0;
      }
    },
    toggleThumbnail () {
      this.thumbnailVisible = !this.thumbnailVisible;
    },
    move (e) {
      e.stopPropagation();
      // this.btnVisible = true;
      switch (e.type) {
        case "touchstart":
          this.start = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
          break;
        case "touchend":
          let [startX, startY] = this.start;

          //获取滑动屏幕时的X,Y
          let endX = e.changedTouches[0].pageX;
          let endY = e.changedTouches[0].pageY;
          //获取滑动距离
          let distanceX = endX - startX;
          let distanceY = endY - startY;
          //判断滑动方向
          if (distanceX > 30) {
            this.prev();
          } else if (distanceX < -30) {
            this.next();
          }
          break;
        case "touchmove":
          break;
      }
    }
  },
  beforeDestroy () {
    if (this.timer) clearInterval(this.timer);
  }
};
</script>

<style lang="scss">
.carousel-wrap {
  width: 100%;
  .slider {
    width: 100%;
    height: 100%;
    font-size: 0;
    position: relative;
    //轮播图
    .slider-group {
      width: 80%;
      display: inline-block;
      overflow: hidden;
      position: relative;
      box-sizing: border-box;
      transition: all 0.5s;
      font-size: 14px;
      .multiple-wrap {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        transition: left 0.3s;
        .image-item {
          margin: 0 5px;
          vertical-align: middle;
        }
        .image-item:last-child {
          margin-right: 0;
        }
      }
      .slider-item-wrap {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 0;
        transition: left 0.3s;
        .slider-item {
          display: inline-block;
          vertical-align: top;
          position: relative;
          transition: opacity 0.8s;
          .img-item {
            width: 100%;
          }
          .img-label {
            position: absolute;
            left: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            color: #fff;
            padding: 10px;
            font-size: 14px;
          }
          .video-player-box {
            width: 100%;
            height: 100%;
          }
        }
      }
      .btn-group {
        div {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          background-color: rgba(0, 0, 0, 0.4);
          color: #fff;
          transform: translateY(-50%);
          -webkit-transform: translateY(-50%);
          text-align: center;
          line-height: 35px;
          cursor: pointer;
        }
        .prev {
          left: 0;
        }
        .next {
          right: 0;
        }
        .icon {
          width: 20px;
          vertical-align: middle;
        }
      }
      .thumb-icon {
        position: absolute;
        left: 0;
        top: 0;
        width: 30px;
      }
    }
    // 缩略图
    .thumbnail-group {
      width: 20%;
      height: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      display: inline-block;
      overflow-y: auto;
      transition: all 0.5s;
      font-size: 14px;
      vertical-align: top;
      background-color: #000;
      .oImg {
        cursor: pointer;
        border: 2px solid rgb(85, 85, 85);
        margin: 10px 0;
        img {
          width: 100%;
          display: inline-block;
        }
      }
      .oImg.active {
        border: 2px solid rgba(245, 255, 0, 0.5);
      }
    }
    //点
    .dots-group {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        background-color: #fff;
        border: 1px solid #eee;
        margin-right: 5px;
      }
      .dot:last-child {
        margin-right: 0;
      }
      .dot.active {
        background-color: #34a4eb;
      }
    }
  }
  .nodata {
    width: 100%;
    height: 100%;
    position: relative;
    min-height: 128px;
    img {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
  ::-webkit-scrollbar {
    width: 0 !important;
  }
  .play-icon {
    position: absolute;
    left: 50%;
    bottom: 10px;
    width: 40px;
    height: 40px;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
  }
  .video-js {
    width: 100%;
    height: 100%;
  }
  .video-js .vjs-big-play-button {
    height: 2em;
    width: 2em;
    line-height: 2em;
    border-radius: 1em;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .preview-pic {
    width: 100%;
    height: 100%;
    position: relative;
    img {
      width: 50%;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }
  }
}
</style>  
