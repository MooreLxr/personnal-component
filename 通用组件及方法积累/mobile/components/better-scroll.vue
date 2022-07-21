<template>
  <div ref="wrapper">
    <slot></slot>
    <slot name="bottom"></slot>
  </div>
</template>

<script>
/**
 * @author lxr
 * @since created by lxr 2019-08-15 10:08:00
 * @description: 滚动组件
 */
import BScroll from 'better-scroll'

export default {
  props: {
    /**
       * 1 滚动的时候会派发scroll事件，会截流。
       * 2 滚动的时候实时派发scroll事件，不会截流。
       * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
       */
    probeType: {
      type: Number,
      default: 1
    },
    /**
       * 点击列表是否派发click事件
       */
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {//该参数用于监听滚动位置
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    /**
       * 是否派发滚动到底部的事件，用于上拉加载
       */
    pullup: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发顶部下拉的事件，用于下拉刷新
     */
    pulldown: {
      type: Boolean,
      default: false
    },
    /**
     * 是否监听DOM变化
     */
    observeDOM:{
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._initScroll()
    })

    window.addEventListener('resize',()=> {
      this.scroll && this.scroll.handleEvent({type:'resize'})
    })
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        observeDOM:this.observeDOM, //是否监听DOM变化
        // bindToWrapper:true,
        pullUpLoad: {
          threshold: 10           //当上拉距离超过盒子高度的10px的时候,就派发一个上拉加载的事件
        },
        pullDownRefresh: {
          threshold: -10         //当下拉长度距离盒子顶部的高度超过10px的时候,就派发一个下拉刷新的事件
        },
        useTransition: true,   //防止iphone微信滑动卡顿
        mouseWheel: true        //pc的鼠标滚轮事件
      })

      //重写resize方法解决跳转页面后安卓软键盘弹起后better-scroll定位问题
      this.scroll.__proto__._resize = function (str) {
        var _this = this;
        if (!this.enabled) {
          return;
        }
      };

      // 是否派发滚动到底部事件，用于上拉加载
      if (this.pullup) {
        this.scroll.on("pullingUp", () => {    //上拉加载事件
          this.$emit('pullUp');
          this.scroll.finishPullUp();//可以多次执行上拉加载，没有这段代码上拉只会加载一次
        });
      }
      // 是否派发顶部下拉事件，用于下拉刷新
      if (this.pulldown) {
        this.scroll.on("pullingDown", () => {  //下拉刷新事件
          this.$emit("pulldown")
          this.scroll.finishPullDown()//可以多次执行下拉刷新，没有这段代码下只会刷新一次
        });
      }

      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {//监听滚动事件
          this.$emit('scroll', pos);
        })
      }
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    /**
     *  el: 目标元素;
        time: 到达目标元素所需时间，单位ms; 
        offsetX: 距离目标元素所偏移X轴的距离;设置为true时，到达目标元素中心位置
        offsetY: 距离目标元素所偏移Y轴的距离;设置为true时，到达目标元素中心位置
        easing: 动画函数(一般不建议修改)
     */
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data:{
      handler () {
        this.$nextTick(() => {
          this.refresh()
        })
      },
      deep: true
    }
  }
}
</script>

