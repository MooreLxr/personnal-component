<template>
  <div class="add-form-button" :class="{'disabled': maxNum && curNum === maxNum}" @click="addRow">
    <van-icon name="plus" />
    <span style="vertical-align: middle;">添加({{maxNum ? curNum+'/'+maxNum : curNum}})</span>
  </div>
</template>

<script>
/**
* author lxr
* @Date: 2021-10-29 17:38:21
* @description
*/
export default {
  name: 'add-form-button',
  props: {
    maxNum: Number,
    curNum: Number
  },
  data () {
    return {}
  },
  created () {},
  mounted () {},
  methods: {
    addRow () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.add-form-button {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 32px;
  border: 1px dashed rgba(121, 90, 90, 0.12);
  background: rgba(0, 0, 0, 0.04);
  border-radius: 2px;
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
  line-height: 32px;
  text-align: center;
}
</style>
