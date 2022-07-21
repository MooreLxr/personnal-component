<template>
  <div class="calendar">
    <div class="full-date-wrap">
      <img :src="require(`../assets/images/arrow_left.png`)" alt="" class="left-icon" @click="changeMonth(-1)">
      <span class="time" @click="visible=true">{{selFullDate | formatDate}}</span>
      <img :src="require(`../assets/images/arrow_right.png`)" alt="" class="right-icon" @click="changeMonth(1)">
      <span class="today-shortCut" @click="locateToday" v-if="showToday">今日</span>
    </div>
    <!-- 星期 -->
    <div class="week-item-wrap">
      <div class="week-item" v-for="(item,i) in weekArr" :key="i">{{item}}</div>
    </div>
    <!-- 日期 -->
    <div :class="`date-item-wrap ${showLunarDate ? 'lunar-date-wrap':''}`">
      <div v-for="(item,index) in calendarData" :key="index" :class="`date-item ${item.className} ${item==selDate? 'active':''}`" @click="clickDate(item)">
        <div class="date-item-date">
          <span class="date">{{item.date}}</span>
          <span class="lunarDate" v-if="showLunarDate">{{item.lunarDate}}</span>
          <slot name="detail" :params="item.params"></slot>
        </div>
      </div>
    </div>
    <!-- 自定义选择年、月份 -->
    <van-action-sheet v-model="visible" title="">
      <van-datetime-picker
        v-model="selFullDate"
        type="year-month"
        title="选择年月"
        :formatter="formatter"
        @confirm="confirm"
        @cancel="cancel"
      />
    </van-action-sheet>
  </div>
</template>

<script>
/**
 * @author lxr
 * @since created by lxr 2021-07-21 09:36:00
 * @description 日历组件
 */
import Vue from 'vue'
import moment from 'moment'
import * as JDatePickerScript from '@/utils/lunarDatePicker'
import { DatetimePicker, ActionSheet } from 'vant'
import 'vant/lib/action-sheet/style'
import 'vant/lib/datetime-picker/style'
Vue.use(DatetimePicker)
Vue.use(ActionSheet)

export default {
  props: {
    // 数据源(接口的数据，当需要在日历上做标记时必传)
    dataProvider: {
      type: Array,
      default: () => []
    },
    // 数据源和日历数据相匹配的字段(当需要在日历上做标记时必传)
    dataKey: {
      type: String,
      default: ''
    },
    // 今日快捷按钮
    showToday: {
      type: Boolean,
      default: false
    },
    // 是否显示农历日期
    showLunarDate: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      weekArr: ['一', '二', '三', '四', '五', '六', '日'],
      selFullDate: new Date(), // 日历选择的日期
      calendarData: null, // 日历数据
      selDate: null,
      visible: false
    }
  },
  created () {
    this.getCalendarData()
  },
  methods: {
    // 日历数据初始化
    getCalendarData () {
      const { selFullDate: now } = this
      const year = now.getFullYear()
      const month = now.getMonth()
      const currentDate = new Date(year, month, 1)
      const nextDate = new Date(year, month + 1, 1)
      const totalDays = (nextDate - currentDate) / 1000 / 3600 / 24 // 计算本月总共的天数
      let firstDay = currentDate.getDay() // 获取本月第一天是周几
      let temp
      const calendarData = []
      firstDay = firstDay === 0 ? 7 : firstDay // (周日该值等于0)

      // ------------------------填充上个月的日期---------------------
      temp = new Date(year, month, 1)
      for (let i = 0; i < firstDay - 1; i++) {
        temp = new Date(temp.setDate(temp.getDate() - 1))
        const lunarObj = JDatePickerScript.calendar.solar2lunar(temp.getFullYear(), temp.getMonth() + 1, temp.getDate())
        calendarData.unshift({
          date: temp.getDate(),
          fullDate: moment(temp).format('YYYY-MM-DD'),
          className: 'prevMonth',
          lunarDate: lunarObj.Term ? lunarObj.Term : lunarObj.IDayCn === '初一' ? lunarObj.IMonthCn : lunarObj.IDayCn
        })
      }
      // ------------------------填充当月的日期-----------------------
      temp = new Date(year, month, 1)
      for (let i = 0; i < totalDays; i++) {
        const lunarObj = JDatePickerScript.calendar.solar2lunar(temp.getFullYear(), temp.getMonth() + 1, temp.getDate())
        // console.log(lunarObj)
        calendarData.push({
          date: temp.getDate(),
          fullDate: moment(temp).format('YYYY-MM-DD'),
          className: moment(temp).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? 'curMonth today' : 'curMonth',
          lunarDate: lunarObj.Term ? lunarObj.Term : lunarObj.IDayCn === '初一' ? lunarObj.IMonthCn : lunarObj.IDayCn
        })
        temp = new Date(temp.setDate(temp.getDate() + 1))
      }
      // ------------------------填充下个月的日期-----------------------
      temp = new Date(year, month + 1, 1)
      const length = 42 - calendarData.length
      for (let i = 0; i < length; i++) {
        const lunarObj = JDatePickerScript.calendar.solar2lunar(temp.getFullYear(), temp.getMonth() + 1, temp.getDate())
        calendarData.push({
          date: temp.getDate(),
          fullDate: moment(temp).format('YYYY-MM-DD'),
          className: 'nextMonth',
          lunarDate: lunarObj.Term ? lunarObj.Term : lunarObj.IDayCn === '初一' ? lunarObj.IMonthCn : lunarObj.IDayCn
        })
        temp = new Date(temp.setDate(temp.getDate() + 1))
      }
      // ----------------------合并calendarData和dataProvider-------------------
      const { dataProvider, dataKey } = this
      if (dataProvider && dataProvider.length) {
        calendarData.forEach(calendar => {
          dataProvider.forEach(item => {
            if (
              item[dataKey] === calendar.date ||
              item[dataKey] === calendar.fullDate
            ) {
              calendar.params = item
            }
          })
        })
      }

      this.calendarData = calendarData
    },
    // 左右按钮切换
    changeMonth (signal) {
      const { selFullDate: now } = this
      const year = now.getFullYear()
      const month = now.getMonth()
      let day
      switch (signal) {
      case 1:
        day = new Date(year, month + 1, 1)
        break
      default:
        day = new Date(year, month - 1, 1)
        break
      }
      this.selFullDate = day
      this.getCalendarData()
      this.$emit('changeMonth', moment(this.selFullDate).format('YYYY-MM-DD'))
    },
    // 今日快捷键
    locateToday () {
      this.selFullDate = new Date()
      this.getCalendarData()
      const curDate = this.calendarData.filter(e => e.fullDate === this.selFullDate)
      this.selDate = curDate
      this.$emit('change', moment(this.selFullDate).format('YYYY-MM-DD'))
    },
    // 日历的日期点击
    clickDate (item) {
      this.selDate = item
      this.selFullDate = new Date(item.fullDate.replace(/-/g, '/'))
      this.$emit('change', moment(this.selFullDate).format('YYYY-MM-DD'))
    },
    formatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      }
      return val
    },
    confirm (val) {
      console.log(moment(this.selFullDate).format('YYYY-MM-DD'))
      this.visible = false
      this.selFullDate = val
      this.getCalendarData()
      this.$emit('changeMonth', moment(this.selFullDate).format('YYYY-MM-DD'))
    },
    cancel () {
      this.visible = false
    }
  },
  filters: {
    formatDate (val) {
      return moment(val).format('YYYY年MM月')
    }
  },
  watch: {
    dataProvider () {
      this.getCalendarData()
    }
  }
}
</script>

<style lang="scss">
.calendar {
  width: 100%;
  height: 100%;
  min-height: 380px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .full-date-wrap {
    background-color: #fff;
    color: #494949;
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left-icon,
    .right-icon {
      width: 26px;
      margin: 0 10px;
    }
    .today-shortCut {
      position: absolute;
      top: 6px;
      right: 10px;
      background-color: #e9f3ff;
      line-height: 28px;
      padding: 0 5px;
      border-radius: 3px;
      cursor: pointer;
    }
    .time{
      color: #000;
    }
  }
  .week-item-wrap {
    width: 100%;
    font-size: 0;
    border-bottom: 1px solid #e5ecf1;
    .week-item {
      width: calc(100% / 7);
      height: 50px;
      line-height: 50px;
      font-size: 17px;
      color: #000;
      display: inline-block;
      text-align: center;
      box-sizing: border-box;
    }
  }
  .date-item-wrap {
    font-size: 0;
    flex: 1;
    .date-item {
      width: calc(100% / 7);
      height: calc(100% / 6);
      display: inline-block;
      text-align: center;
      background-color: #fff;
      box-sizing: border-box;
      vertical-align: middle;
      position: relative;
      font-size: 13px;
      .date-item-date{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .date {
          font-size: 14px;
          color: #000;
          line-height: 30px;
        }
      }
      &:hover {
        background-color: rgba(58, 58, 58, 0.068);
      }
      &.prevMonth,
      &.nextMonth {
        .date, .lunarDate{
          color: #caced5;
        }
      }
      &.today {
        background-color: #e6effb;
      }
      &.active{
        background-color: #e9f3ff;
      }
    }
  }
  .lunar-date-wrap{
    .lunarDate{
      font-size: 11px;
      color: #000;
    }
    .date-item .date-item-date .date {
      line-height: 20px;
    }
    .date-item.active{
      background-color: transparent;
      .date-item-date{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #e6effb;
        margin: 0 auto;
      }
    }
  }
}
</style>
