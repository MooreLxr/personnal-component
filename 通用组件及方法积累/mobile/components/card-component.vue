<template>
  <div class="card-component">
    <div class="card-item" :style="cardStyle" :class="shadow==='always'||isHover?'shadowActive':''" @mouseover="toggleShadow(1)" @mouseleave="toggleShadow(-1)" @click.stop="cardClick">
      <div class="card-title" v-if="$slots.title">
        <slot name="title"></slot>
      </div>
      <div class="card-content" v-if="$slots.content">
        <slot name="content"></slot>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
/**
 * @author lxr
 * @description 卡片组件
 * @module /components/card-component 组件地址
 * @param {String} [cardStyle] - 卡片自定义样式(可选)
 * @param {String} [shadow] - 卡片阴影显示（always / hover / never）
 * @example 调用示例
 * <card-component :shadow="'hover'" @cardClick="selectCard" :cardStyle="{padding: '7px',marginBottom: '10px'}">
			<div slot="title">{{测试测试}}</div>
			<div slot="content">{{测试内容测试内容}}</div>
	</card-component>
 */
export default {
  props: {
    //卡片阴影显示（always / hover / never）
    shadow: {
      type: String,
      default: "always"
    },
    //卡片自定义样式
    cardStyle: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isHover: false
    };
  },
  methods: {
    //鼠标移入移出显示阴影
    toggleShadow(sign) {
      let { shadow } = this;

      if (shadow === "hover") {
        if (sign === 1) {
          this.isHover = true;
        } else {
          this.isHover = false;
        }
      }
    },
    cardClick() {
      this.$emit("cardClick");
    }
  }
};
</script>

<style lang="scss">
.card-component {
  width: 100%;
  // height: 100%;
  .card-item {
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 5px;
    padding: 8px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.3s;
    .card-title {
      font-size: 17px;
      color: #333;
      border-bottom: 1px solid #ddd;
      padding: 6px 12px;
    }
    &.shadowActive {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    }
    .card-content {
      padding: 8px 12px;
    }
  }
}
</style>



