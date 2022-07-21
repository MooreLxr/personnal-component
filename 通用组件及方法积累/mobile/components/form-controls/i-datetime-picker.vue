<template>
  <div class="i-datetime-picker">
    <van-field
      v-model="fieldValue"
      is-link
      readonly
      :required="required"
      :label="label"
      placeholder="请选择"
      :rules="rules"
      :input-align="inputAlign"
      @click="show = true"
    />
    <van-popup v-model="show" round position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        :type="type"
        title=""
        :formatter="formatter"
        :min-date="minDate"
        :max-date="maxDate"
        :min-hour="minHour"
        :max-hour="maxHour"
        :min-minute="minMinute"
        :max-minute="maxMinute"
        :filter="filter"
        @confirm="changeDate"
        @cancel="show = false"
      />
    </van-popup>
  </div>
</template>

<script>
/**
* author lxr
* @Date: 2021-10-28 10:20:10
* @description
*/
import moment from 'moment'

export default {
  name: 'i-datetime-picker',
  props: {
    label: {
      type: String,
      default: '时间'
    },
    required: Boolean, // 是否必填
    rules: Array, // 表单校验规则
    /**
     * 时间类型,可选值为
     * date, datetime, time, year-month, month-day, datehour
    */
    type: {
      type: String,
      default: 'datetime'
    },
    formatText: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    },
    value: [String, Date],
    filter: {
      type: Function // (type, vals) => vals
    },
    /**
     * 输入框对齐方式，可选值为 center right
    */
    inputAlign: {
      type: String,
      default: 'left'
    },
    /**
     * 当type=date/datetime 时有效
    */
    minDate: Date,
    maxDate: Date,
    /**
     * 当type=time 时有效
    */
    minHour: [Number, String],
    maxHour: [Number, String],
    minMinute: [Number, String],
    maxMinute: [Number, String]
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      show: false,
      currentDate: new Date(),
      fieldValue: ''
    }
  },
  created () {
    if (this.type === 'time') {
      this.fieldValue = this.currentDate = this.value
      return
    }
    this.initValue()
  },
  mounted () {},
  methods: {
    initValue () {
      if (this.value) {
        this.fieldValue = moment(this.value).format(this.formatText)
        if (typeof this.value === 'string') {
          const val = this.value.replace(/-/g, '/').replace('T', ' ')
          this.currentDate = new Date(val)
        } else this.currentDate = this.value
      }
    },
    formatter (type, val) {
      if (type === 'year') {
        return val + '年'
      }
      if (type === 'month') {
        return val + '月'
      }
      if (type === 'day') {
        return val + '日'
      }
      if (type === 'hour') {
        return val + '时'
      }
      if (type === 'minute') {
        return val + '分'
      }
      return val
    },
    changeDate (val) {
      this.fieldValue = this.type === 'time' ? val : moment(val).format(this.formatText)
      this.$emit('change', this.type === 'time' ? val : moment(val).format('YYYY-MM-DD HH:mm:ss'))
      this.show = false
    }
  },
  watch: {
    value () {
      this.initValue()
    }
  }
}
</script>
