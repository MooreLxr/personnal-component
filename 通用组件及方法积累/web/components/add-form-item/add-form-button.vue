<template>
  <div class="add-form-button" :class="{'disabled': maxNum && curNum === maxNum}" @click="addRow">
    <i class="h-icon-add icon"></i>
    <span style="vertical-align: middle;">添加({{maxNum ? curNum+'/'+maxNum : curNum}})</span>
  </div>
</template>

<script>
/**
* author lxr
* @Date: 2021-08-06 17:01:31
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
  },
}
</script>

<style lang="scss">
.add-form-button{
  width: calc(100% - 32px);
  height: 32px;
  border: 1px dashed rgba(0,0,0,.12);
  background-color: rgba(0,0,0,.04);
  border-radius: 2px;
  color: rgba(0,0,0,.4);
  font-size: 14px;
  text-align: center;
  line-height: 28px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  font-weight: 500;
  box-sizing: border-box;
  .icon{
    vertical-align: middle;
    font-size: 24px;
  }
  &:not(.disabled):hover{
    background-color: rgba(0,0,0,.1);
  }
  &.disabled{
    cursor: not-allowed;
    opacity: .4;
  }
}
</style>