<template>
  <div class="i-picker">
    <van-field
      v-model="fieldValue"
      placeholder="请选择"
      is-link
      readonly
      :required="required"
      :label="label"
      :rules="rules"
      :input-align="inputAlign"
      @click="show = true"
    />
    <van-popup v-model="show" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        :value-key="valueKey"
        :defaultIndex="defaultIndex"
        @confirm="onConfirm"
        @cancel="onCancel"
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

export default {
  name: 'i-picker',
  props: {
    label: {
      type: String,
      required: true
    },
    required: Boolean, // 是否必填
    rules: Array, // 表单校验规则
    columns: { // 选择器数据源
      type: Array,
      required: true
    },
    valueKey: { // 选项对象中，选项文字对应的键名
      type: String,
      default: 'text'
    },
    defaultIndex: { // 单列选择时，默认选中项的索引,默认0
      type: [Number, String],
      default: 0
    },
    value: { // 级联选择器选中项的值
      type: [Number, String],
      default: ''
    },
    /**
     * 输入框对齐方式，可选值为 center right
    */
    inputAlign: {
      type: String,
      default: 'left'
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      show: false,
      fieldValue: ''
    }
  },
  created () {
    this.setInitValue()
  },
  mounted () {},
  watch: {
    value () {
      this.setInitValue()
    }
  },
  methods: {
    setInitValue () {
      if (this.value === null || this.value === '') {
        this.fieldValue = ''
        return
      }
      const defaultItem = this.columns.filter(e => e.value === this.value)
      this.fieldValue = defaultItem.length && defaultItem[0][this.valueKey]
    },
    onConfirm (data, index) {
      this.fieldValue = data[this.valueKey]
      this.$emit('change', data.value, this.columns[index])
      this.show = false
    },
    onCancel () {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.i-picker {
  position: relative;

  &::after {
    position: absolute;
    box-sizing: border-box;
    content: '';
    pointer-events: none;
    right: 16px;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #ebedf0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}
</style>
