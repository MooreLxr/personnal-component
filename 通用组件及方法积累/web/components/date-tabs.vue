<template>
  <div class="date-tabs">
    <div class="date-tabs-wrap" ref="container">
      <div v-for="(item,i) in dataProvider"
           :key="i"
           class="date-item"
           :class="{'active':selItem===item}"
           @click="selectTime(item)"
           :ref="'dateItem'+i">
        <span>{{item.label}}</span>
      </div>
    </div>
    <!-- 时间控件  -->
    <el-date-picker
      v-model="customTM"
      :type="pickType"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      v-show="showTime"
      @change="setNewTime"
      :style="`width: 400px; left:${timePosition}px;`"
    />
  </div>
</template>

<script>
/**
 * @author lxr
 * @since created by lxr 2019-07-04 10:39:00
 * @description  日期选项卡
 * @example 调用示例
 * <date-tabs :dataProvider="tabs" :pickType="'datetimerange'" :dtFormat="'yyyy-MM-dd'"></date-tabs>
 * tabs: [
    { label: "本年", key: "year",checked: true },
    { label: "半年", key: "halfyear" },
    { label: "本季度", key: "quarter" },
    { label: "本月", key: "month" },
    { label: "本周", key: "week" },
    { label: "今日", key: "day" },
    { label: "最近三天", key: "three" },
    { label: "自定义", key: "custom" }
  ]
 */
import moment from 'moment'

export default {
  props: {
    dataProvider: {
      type: Array,
      default: []
    },
    //自定义时间控件类型（datetimerange,daterange等）
    pickType: {
      type: String,
      default: 'datetimerange'
    },
    //自定义时间控件格式化
    dtFormat: {
      type: String,
      default: 'yyyy-MM-dd HH:mm'
    }
  },
  data () {
    return {
      selItem: null,
      startTime: null,
      endTime: null,
      showTime: false, //时间查询容器展示标志
      timePosition: null,
      customTM: []
    };
  },
  created () {
    let { dataProvider } = this,
      defItem = dataProvider.filter(e => e.checked)
    defItem = defItem.length ? defItem[0] : dataProvider[0]
    if (defItem) this.selectTime(defItem)
  },
  mounted () {
    this.setTimePickerPosition()
  },
  methods: {
    selectTime (item) {
      this.showTime = false
      this.selItem = item
      let now = new Date()
      let day = now.getDay()
      let stime, etime
      // *********************************改变时间重新获取表格数据*******************************
      switch (item.key) {
        case 'year':
          this.startTime = moment(now).format('YYYY-01-01 00:00:00') //开始时间从当月1号开始计算
          etime = this.dateAdd(now, 'Y', 1)
          this.endTime = moment(etime).format('YYYY-01-01 00:00:00')
          break
        case 'halfyear':
          let months = now.getMonth() + 1
          if (months >= 1 && months <= 6) {
            stime = moment(now).format('YYYY-01-01 00:00:00')
            etime = moment(now).format('YYYY-07-01 00:00:00')
          } else {
            stime = moment(now).format('YYYY-07-01 00:00:00')
            etime = this.dateAdd(now, 'Y', 1)
          }
          this.startTime = moment(stime).format('YYYY-MM-01 00:00:00')
          this.endTime = moment(etime).format('YYYY-01-01 00:00:00')
          break
        case 'quarter':
          let month = now.getMonth() + 1
          if (month >= 1 && month <= 3) {
            stime = now.setMonth(1)
          } else if (month >= 4 && month <= 6) {
            stime = now.setMonth(4) // 有问题
          } else if (month >= 7 && month <= 9) {
            stime = now.setMonth(7)
          } else {
            stime = now.setMonth(10)
          }
          etime = this.dateAdd(new Date(stime), 'Q', 1)
          this.startTime = moment(stime).format('YYYY-MM-01 00:00:00')
          this.endTime = moment(etime).format('YYYY-MM-01 00:00:00')
          break
        case 'month':
          this.startTime = moment(now).format('YYYY-MM-01 00:00:00') //开始时间从当月1号开始计算
          etime = this.dateAdd(now, 'M', 1)
          this.endTime = moment(etime).format('YYYY-MM-01 00:00:00')
          break
        case 'week':
          if (day == 1) { // 从周一开始计算
            stime = now
          } else if (day == 0) {
            stime = now.setDate(now.getDate() - 6)
          } else {
            stime = now.setDate(now.getDate() - day + 1)
          }
          etime = this.dateAdd(new Date(stime), 'W', 1)
          this.startTime = moment(stime).format('YYYY-MM-DD 00:00:00')
          this.endTime = moment(etime).format('YYYY-MM-DD 00:00:00')
          break
        case 'day':
          this.startTime = moment(now).format('YYYY-MM-DD 00:00:00')
          etime = this.dateAdd(now, 'D', 1)
          this.endTime = moment(etime).format('YYYY-MM-DD 00:00:00')
          break
        case 'three':
          stime = this.dateAdd(now, 'D', -3)
          this.startTime = moment(stime).format('YYYY-MM-DD 00:00:00')
          etime = this.dateAdd(now, 'D', 1)
          this.endTime = moment(etime).format('YYYY-MM-DD 00:00:00')
          break
        case 'custom':
          this.showTime = true
          return
          break
      }
      let sendData = {
        startTime: this.startTime,
        endTime: this.endTime,
        key: item.key
      }
      this.$emit('change', sendData)
    },
    /**
     *   功能:实现DateAdd功能.
     *   参数:interval,字符串表达式，表示要添加的时间间隔.  年:Y、季:Q、 月:M、 周:W 、天:D、 小时:h、 分:m、 秒:s
     *   参数:number,数值表达式，表示要添加的时间间隔的个数.
     *   参数:date,时间对象.
     *   返回:新的时间对象.
     */
    dateAdd (date, interval, number) {
      if (date) {
        let tempDate = new Date(moment(date).format('YYYY/MM/DD HH:mm:ss'))
        switch (interval) {
          case 'Y':
            tempDate.setFullYear(tempDate.getFullYear() + number)
            return tempDate
          case 'Q':
            tempDate.setMonth(tempDate.getMonth() + number * 3)
            return tempDate
          case 'M':
            tempDate.setMonth(tempDate.getMonth() + number)
            return tempDate
          case 'W':
            tempDate.setDate(tempDate.getDate() + number * 7)
            return tempDate
          case 'D':
            tempDate.setDate(tempDate.getDate() + number)
            return tempDate
          case 'h':
            tempDate.setHours(tempDate.getHours() + number)
            return tempDate
          case 'm':
            tempDate.setMinutes(tempDate.getMinutes() + number)
            return tempDate
          case 's':
            tempDate.setSeconds(tempDate.getSeconds() + number)
            return tempDate
          default:
            tempDate.setDate(tempDate.getDate() + number)
            return tempDate
        }
      }
    },
    //接收时间控件传入的时间
    setNewTime (data) {
      this.customTM = data
      let sendData = {
        startTime: moment(data[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(data[1]).format('YYYY-MM-DD HH:mm:ss'),
        key: 'custom'
      }
      this.$emit('change', sendData)
    },
    setTimePickerPosition () {
      const width = this.$refs.container.clientWidth
      this.timePosition = width
    },
    //关闭时间控件
    close (data) {
      this.showTime = data
    }
  }
}
</script>

<style lang="scss" scoped>
.date-tabs {
  margin: 0 15px;
  position: relative;
  .date-item {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    min-width: 80px;
    padding: 0 5px;
    border-left: 1px solid #dcdcdc;
    border-top: 1px solid #dcdcdc;
    border-bottom: 1px solid #dcdcdc;
    user-select: none;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    &:first-child {
      border-radius: 4px 0 0 4px;
    }
    &:last-child {
      border-right: 1px solid #dcdcdc;
      border-radius: 0 4px 4px 0;
    }
    &.active {
      background-color: #007cff;
      color: #fff;
    }
  }
  .date-tabs-wrap {
    width: fit-content;
  }
  .el-date-editor {
    margin-left: 10px;
    position: absolute;
    top: 0;
  }
}
</style>
