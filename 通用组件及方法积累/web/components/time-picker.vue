<template>
  <div class="time-picker">
    <van-field v-model="timeText" :label="placeholder" readonly placeholder="请选择" clearable @focus="openPicker" />

    <van-popup v-model="showPicker" round position="bottom">
      <van-datetime-picker
        v-model="value"
        :type="type"
        :formatter="formatter"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import { DatetimePicker, Popup, Field } from 'vant'
Vue.use(DatetimePicker)
Vue.use(Popup)
Vue.use(Field)
import 'vant/lib/datetime-picker/style/index'
import 'vant/lib/popup/style/index'
import 'vant/lib/field/style/index'
import moment from 'moment'

export default {
  name: 'time-picker',
  props: {
    // 时间类型 date, datetime、year-month、month-day、datehour
    type: {
      type: String,
      default: 'datetime'
    },
    // 默认时间
    currentDate: {
      type: Date,
      default: () => { return new Date() }
    },
    formatText: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    },
    // 自定义列排序数组, 子项可选值为year、month、day、hour、minute
    columnsOrder: {
      type: Array,
      default: () => { return [] }
    },
    // 顶部标题
    title: {
      type: String,
      default: ''
    },
    placeholder: String
  },
  data () {
    return {
      showPicker: false,
      value: ''
    }
  },
  created () {
    this.value = this.currentDate
  },
  mounted () {},
  computed: {
    timeText () {
      return moment(this.value).format(this.formatText)
    }
  },
  methods: {
    openPicker () {
      this.showPicker = true
    },
    onConfirm (value) {
      this.showPicker = false
      this.$emit('change', this.value)
    },
    // 选项格式化函数
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      } else if (type === 'day') {
        return `${val}日`
      } else if (type === 'hour') {
        return `${val}时`
      } else if (type === 'minute') {
        return `${val}分`
      }
      return val
    }
  },
}
</script>

<style lang="scss">
.time-picker{
  .van-cell{
    line-height: 32px;
  }
}
</style>