<template>
  <div class="time-line">
    <div class="time-line-line"
         :style="`left:${showDate?'74px':'14px'}`"></div>
    <slot></slot>
  </div>
</template>

<script>
/** 
 * created by lxr at 2019-10-30 10:47
 * @description 时间轴
 * 调用示例：
 * import timeLine from "@/components/time-line/time-line"
 * import timeLineItem from "@/components/time-line/time-line-item"
 * <time-line :showDate="true">
      <time-line-item v-for="(item,i) in historyData"
                      :key="i">
        <div slot="date">{{item.startingTime | timeFormat}}</div>
        <div slot="content">
          <span>{{item.disasterName}}</span>
        </div>
      </time-line-item>
    </time-line>
 */
export default {
  props: {
    //是否展示左侧的日期
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
.time-line {
  width: 100%;
  position: relative;
  padding: 5px;
  box-sizing: border-box;
  .time-line-line {
    position: absolute;
    top: 22px;
    bottom: 13px;
    width: 4px;
    background-color: #ddd;
  }
}
</style>