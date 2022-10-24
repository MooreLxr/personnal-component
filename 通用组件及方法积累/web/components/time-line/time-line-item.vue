<template>
  <div class="time-line-item">
    <slot name="prefix"></slot>
    <div class="time-line-item__wrap">
      <div class="time-line-item__line" ref="line"></div>
      <div class="time-line-item__date" v-if="$slots.date" ref="dateDom">
        <slot name="date"></slot>
      </div>
      <div class="time-line-item__dot" ref="dotDom">
        <slot name="dot" v-if="$slots.dot"></slot>
        <span class="dot" v-else></span>
      </div>
      <div class="time-line-item__content">
        <slot name="content"></slot>
      </div>
    </div>
    <slot name="suffix"></slot>
  </div>
</template>

<script>
/** 
 * created by lxr at 2019-10-30 10:47
 * @description 时间轴的每项
 */
export default {
  data () {
    return {}
  },
  created () {},
  mounted() {
    this.setLinePos()
  },
  methods: {
    setLinePos() {
      const { line, dateDom, dotDom } = this.$refs
      let w = 0
      if (dateDom) {
        const style = getComputedStyle(dateDom)
        w += dateDom.clientWidth
        w += +style['margin-left'].replace('px', '')
        w += +style['margin-right'].replace('px', '')
      }
      if (dotDom) {
        w += (dotDom.clientWidth / 2)
        w += +getComputedStyle(dotDom)['margin-left'].replace('px', '')
      }
      line.style.left = w + 'px'
    }
  }
}

</script>

<style lang="scss" scoped>
.time-line-item {
  width: 100%;
  transition: all .3s;
}
.time-line-item__wrap {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}
.time-line-item__line {
  width: 0.5px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  bottom: 0;
}
.time-line-item__date {
  width: 70px;
  text-align: right;
  color: rgba(0, 0, 0, 0.6);
  font-size: 16px;
  display: inline-block;
}
.time-line-item__dot {
  margin: 0 5px;
  position: relative;
  .dot {
    height: 12px;
    width: 12px;
    display: inline-block;
    border-radius: 50%;
    background-color: #666;
  }
}
.time-line-item__content {
  flex: 1;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 5px;
  background: #fff;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  margin-left: 12px;
  &:after {
    content: "";
    position: absolute;
    left: -20px;
    top: 50%;
    width: 0;
    height: 0;
    border: 10px solid #fff;
    border-top-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
    transform: translateY(-50%);
  }
}
</style>
