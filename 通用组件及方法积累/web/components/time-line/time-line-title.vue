<template>
  <div class="time-line-title"
       :style="`padding-left:${showDate?'62px':'2px'};`">
    <div class="time-line-title-dot">
      <span class="dot-outside"></span>
      <span class="dot-inner"></span>
    </div>
    <div class="time-line-title-tooltip">
      <slot></slot>
    </div>
  </div>
</template>

<script>
/** 
 * created by lxr at 2019-10-30 14:31
 * @description 时间轴顶部年份
 */
export default {
  props: {
    showDate: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  created () { },
  methods: {}
}

</script>

<style lang="scss">
.time-line-title {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  box-sizing: border-box;
  cursor: pointer;
  .time-line-title-dot {
    height: 18px;
    width: 18px;
    flex: 0 0 18px;
    position: relative;
    .dot-outside {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #0066ff;
      display: inline-block;
    }
    .dot-inner {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #fff;
      position: absolute;
      display: inline-block;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
    }
  }
  .time-line-title-tooltip {
    flex: 1;
    box-sizing: border-box;
    margin-left: 12px;
    font-family: Georgia;
    font-size: 26px;
    line-height: 44px;
    color: #0066ff;
    font-weight: bold;
  }
}
</style>