<template>
  <div class="time-line">
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
 * <time-line>
      <time-line-item
        v-for="(item,i) in historyData"
        :key="i"
      >
        <div slot="date">{{item.startingTime | timeFormat}}</div>
        <div slot="content">
          <span>{{item.disasterName}}</span>
        </div>
      </time-line-item>
    </time-line>
 */
export default {
  data () {
    return {}
  },
  created () { },
  methods: {}
}

</script>

<style lang="scss" scoped>
</style>
