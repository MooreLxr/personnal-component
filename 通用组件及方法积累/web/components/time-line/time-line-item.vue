<template>
  <div class="time-line-item"
       @mouseenter="hoverActive"
       @mouseleave="hoverClose">
    <div class="time-line-item-date" v-if="$slots.date">
      <slot name="date"></slot>
    </div>
    <div class="time-line-item-dot">
      <!-- 自定义点 -->
      <slot name="dot" v-if="$slots.dot"></slot>
      <!-- 默认点样式 -->
      <div v-else style="width:100%;height:100%;">
        <span class="dot"></span>
        <img :src="`${assets}/img/common/error.png`"
            alt=""
            class="del-icon"
            v-if="deleteEnable"
            v-show="delIconVisible"
            @click="emitDel">
      </div>
    </div>

    <div class="time-line-item-tooltip">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
/** 
 * created by lxr at 2019-10-30 10:47
 * @description 时间轴的每项
 */
export default {
  props: {
    permissions: Array,//权限['Delete']
    default:[]
  },
  data () {
    return {
      deleteEnable: false,//是否可删除
      delIconVisible: false,//删除按钮显示标志位
    }
  },
  created () {
    this.deleteEnable = this.permissions && this.permissions.indexOf('Delete') >= 0 ? true : false
  },
  methods: {
    hoverActive () {
      this.delIconVisible = true
    },
    hoverClose () {
      this.delIconVisible = false
    },
    emitDel () {
      this.$emit("del")
    }
  }
}

</script>

<style lang="scss">
.time-line-item {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  .time-line-item-date {
    width: 60px;
    flex: 0 0 60px;
    text-align: right;
    font-size: 14px;
    color: #000;
  }
  .time-line-item-dot {
    height: 12px;
    width: 12px;
    margin: 0 5px;
    flex: 0 0 12px;
    position: relative;
    .dot {
      width: 100%;
      height: 100%;
      display: inline-block;
      border-radius: 50%;
      background-color: #666;
    }
    .del-icon {
      width: 16px;
      height: 16px;
      position: absolute;
      top: -2px;
      left: -2px;
      background-color: #fff;
    }
  }
  .time-line-item-tooltip {
    flex: 1;
    padding: 12px;
    box-sizing: border-box;
    border-radius: 5px;
    background: #fff;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    position: relative;
    margin-left: 12px;
    &:after {
      content: "";
      position: absolute;
      left: -20px;
      top: 50%;
      width: 0;
      height: 0;
      border: 10px solid #fff;
      border-top-color: transparent;
      border-bottom-color: transparent;
      border-left-color: transparent;
      transform: translateY(-50%);
    }
  }
}
</style>