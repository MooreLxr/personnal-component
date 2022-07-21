<template>
  <div class="i-cascader">
    <van-field
      v-model="fieldValue"
      is-link
      readonly
      :required="required"
      :label="label"
      :rules="rules"
      @click="show = true"
    />
    <van-popup v-model="show" round position="bottom">
      <van-cascader
        v-model="cascaderValue"
        title="请选择"
        :options="source"
        :value="value"
        :field-names="fieldNames"
        :active-color="activeColor"
        @close="show = false"
        @change="onChange"
        @finish="onFinish"
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
  name: 'i-cascader',
  props: {
    label: {
      type: String,
      required: true
    },
    required: Boolean, // 是否必填
    rules: Array, // 表单校验规则
    options: { // 级联选择器数据源
      type: Array,
      required: true
    },
    fieldNames: { // 级联选择器自定义 options 结构中的字段
      type: Object,
      default: () => {
        return {
          text: 'text',
          value: 'value',
          children: 'children'
        }
      }
    },
    // 异步加载子节点的方法
    // 例如：loadNode (node, resolve) { setTimeout(() => {resolve([{text:'音乐教室',value:'fdfaff454'}])}, 500) }
    loadNode: {
      type: Function,
      default: null
    },
    value: { // 级联选择器选中项的值
      type: String,
      default: ''
    },
    activeColor: { // 级联选择器选中状态的高亮颜色
      type: String,
      default: '#ee0a24'
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      show: false,
      fieldValue: '',
      cascaderValue: '',
      source: this.options
    }
  },
  created () {
    this.cascaderValue = this.value
  },
  mounted () {},
  watch: {
    value () {
      this.cascaderValue = this.value
    }
  },
  methods: {
    onChange ({ value, selectedOptions }) {
      if (!this.loadNode) return
      let node
      const { fieldNames } = this
      const each = (arr) => {
        for (const item of arr) {
          if (item[fieldNames.value] === value) {
            node = item
            break
          } else {
            const child = item[fieldNames.children]
            if (child && child.length) each(child)
          }
        }
      }
      each(this.source)
      // 为点击的节点添加children
      const loadFn = this.loadNode
      loadFn(node, data => {
        node.children = data || []
      })
    },
    // 全部选项选择完毕后，会触发 finish 事件
    onFinish ({ selectedOptions }) {
      this.show = false
      const { fieldNames } = this
      this.fieldValue = selectedOptions.map(option => option[fieldNames.text]).join('/')
      const lastItem = selectedOptions[selectedOptions.length - 1]
      this.$emit('change', this.fieldValue, lastItem)
    }
  }
}
</script>
