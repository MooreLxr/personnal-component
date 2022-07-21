<template>
  <div class="message-box"
       v-show="visible">
    <div class="messageBox-wrap"
         :class="modal?'messageBox-modal':fullscreen?'messageBox-fullscreen':'messageBox-common'"
         :style="fullscreen?fullScreenStyle:(x&&y)?selfPosStyle:modalStyle">
      <!-- 头部 -->
      <div class="messageBox-header"
           v-if="showTitle"
           :style="`background-color:${headBgColor};color:${headFontColor};`">
        <span class="title">{{title}}</span>
        <i class="el-icon-close close-icon"
           @click="handdleAction('close')"></i>
      </div>

      <!-- 无头部时的关闭按钮 -->
      <div class="close-wrap"
           v-else
           @click="handdleAction('close')"
           :style="`top: ${fullscreen?'5px':'-14px'};right: ${fullscreen?'5px':'-14px'};`">
        <i class="el-icon-error close-icon"></i>
      </div>

      <div class="messageBox-main"
           :style="`height:${showTitle?`calc(100% - 45px)`:`100%`};`">
        <!-- 内容 -->
        <div class="messageBox-content">
          <img :src="`${assets}/${icon}`"
               alt=""
               v-if="icon"
               class="icon">
          <div class="content">
            <p v-if="content && content !==''"
               class="content-text">{{content}}</p>
            <!-- contentTip支持字符串和数组 -->
            <div v-if="contentTip && contentTip.length" class="content-tip">
              <p v-if="typeof contentTip === 'string' && contentTip !==''">{{contentTip}}</p>
              <div v-else>
                <p v-for="(tip,i) in contentTip" :key="i">{{tip}}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 按钮 -->
        <div class="messageBox-footer">
          <button class="btn cancel"
                  @click="handdleAction('cancel')"
                  :class="cancelButtonClass"
                  v-if="cancelButtonText!==''">{{cancelButtonText}}</button>
          <button class="btn confirm"
                  @click="handdleAction('confirm')"
                  :class="confirmButtonClass"
                  v-if="confirmButtonText !== ''">{{confirmButtonText}}</button>
        </div>
      </div>
    </div>

    <!-- 遮罩层 -->
    <div class="messageBox-mask"
         v-if="modal"
         @click="clickMask"></div>
  </div>
</template>

<script>
/**
 * @author lxr
 * @description 对话框组件(参考伙伴云弹窗样式)
 * @module /components/message-box 组件地址
 * @param {Boolean} [visible] - 是否显示对话框(必填)
 * @param {Boolean} [showTitle] - 是否显示头部
 * @param {String} [title] - 标题文本
 * @param {Boolean} [showBorder] - 是否显示边框
 * @param {String} [headBgColor] - 头部背景颜色
 * @param {String} [headFontColor] - 头部字体颜色
 * @param {Number} [borderWidth] - 边框宽度
 * @param {Boolean} [modal] - 是否需要遮罩
 * @param {Number} [width] - 对话框宽度
 * @param {Number} [height] - 对话框高度
 * @param {object} [x] - 对话框显示坐标
 * @param {object} [y] - 对话框显示坐标
 * @param {Boolean} [fullscreen] - 是否全屏
 * @param {Boolean} [closeOnClickModal] - 是否可以通过点击 modal 关闭 Dialog
 * @param {String} [cancelButtonText] - 取消按钮的文本内容
 * @param {String} [cancelButtonClass] -取消按钮的自定义类名
 * @param {String} [confirmButtonText] - 确定按钮的文本内容
 * @param {String} [confirmButtonClass] -确定按钮的自定义类名
 * @example 调用示例
 * import MessageBox from "@/components/message-box";
 * Vue.prototype.$openMessageBox = MessageBox.openMessageBox;
 *  this.$openMessageBox({
      title: "错误信息",
      icon: "img/common/warning.png",
      content: "确定删除表格行？",
      contentTip: "删除后，当前表格及其所有数据都将被删除，并且无法恢复。",
      cancelButtonText: "取消",
      confirmButtonText: "确定"
    })
    .then(() => {})
    .catch(() => {})
 */
import Vue from "vue";
import { Icon } from "element-ui";
Vue.use(Icon);

export default {
  data () {
    return {
      showTitle: true, //是否显示标题
      type: "",
      headBgColor: this.headBgColor || "#fff", //头部背景颜色
      headFontColor: this.headFontColor || "#333", // 头部字体颜色
      showBorder: this.showBorder || false, // 是否显示边框
      borderWidth: this.borderWidth || 1, //边框宽度
      modal: this.modal || true, //是否需要遮罩
      fullscreen: this.fullscreen || false, //是否全屏
      closeOnClickModal: this.closeOnClickModal || true, //是否通过点击遮罩层关闭对话框
      width: this.width || 450,
      height: this.height || 250,
      x: this.x || 0, //弹出框显示的坐标
      y: this.y || 0, //弹出框显示的坐标
      fullScreenStyle: null,
      modalStyle: null,
      selfPosStyle: null,
      visible: false,
      action: "",
      callback: null
    };
  },
  created () {
    this.fullScreenStyle = {
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      border: this.showBorder
        ? `${this.borderWidth}px solid ${this.headBgColor}`
        : "none"
    };
    this.modalStyle = {
      width: this.width + "px",
      height: this.height + "px",
      left: `calc(50% - ${this.width / 2}px)`,
      top: `calc(50% - ${this.height / 2}px)`,
      border: this.showBorder
        ? `${this.borderWidth}px solid ${this.headBgColor}`
        : "none"
    };
    this.selfPosStyle = {
      width: this.width + "px",
      height: this.height + "px",
      left: this.x + "px" || "",
      top: this.y + "px" || "",
      border: this.showBorder
        ? `${this.borderWidth}px solid ${this.headBgColor}`
        : "none"
    };
  },
  mounted () {
    // T(this.$el).addTo(document.body);
  },
  methods: {
    handdleAction (action) {
      this.action = action;
      if (this.action) this.callback(this.action,this);

      this.visible = false;
    },
    clickMask () {
      let { closeOnClickModal } = this;
      if (closeOnClickModal) {
        this.visible = false;
      }
    }
  }
};
</script>

<style scoped>
button:focus {
  border: none;
  background: #fff;
  outline: none;
}
</style>

<style lang="scss">
.message-box {
  p {
    margin: 0;
    padding: 0;
  }
  .messageBox-wrap {
    z-index: 10000;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    position: absolute;
    .messageBox-header {
      height: 45px;
      line-height: 45px;
      padding: 0 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #ddd;
      .title {
        font-size: 16px;
      }
      .close-icon {
        font-size: 24px;
        margin-top: 10px;
        float: right;
        cursor: pointer;
      }
    }
    .close-wrap {
      position: absolute;
      cursor: pointer;
      .close-icon {
        color: #cf5c60;
        font-size: 28px;
      }
    }
    .messageBox-main {
      padding: 15px;
      box-sizing: border-box;
      background-color: #fff;
      .messageBox-content {
        height: calc(100% - 38px);
        padding-bottom: 10px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: middle;
        .icon {
          width: 80px;
          height: 80px;
          flex: 0 0 80px;
          margin-right: 10px;
        }
        .content {
          flex: 1;
          font-size: 14px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .content-text {
            color: #333;
            line-height: 30px;
          }
          .content-tip {
            color: #909399;
            max-height: 100%;
            overflow: auto;
          }
          div {
            line-height: 20px;
            margin-bottom: 5px;
          }
        }
      }
      .messageBox-footer {
        text-align: right;
        .btn {
          width: 100px;
          border-radius: 5px;
          padding: 10px 0;
          border: none;
          font-size: 16px;
          cursor: pointer;
        }
        .cancel {
          background-color: #e5e5e5;
          color: #9f9f9f;
        }
        .confirm {
          background-color: #cf5c60;
          color: #fff;
          margin-right: 10px;
        }
      }
    }
  }
  //遮罩层
  .messageBox-mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    bottom: 0;
    background-color: rgba($color: #000000, $alpha: 0.5);
    z-index: 1000;
  }
   ::-webkit-scrollbar {
    width: 3px;
    z-index: 2;
  }
  /*滚动条里面轨道*/
  ::-webkit-scrollbar-track {
    background: transparent !important;
  }
  /*滚动条里面小方块*/
  ::-webkit-scrollbar-thumb {
    background-color: #909399;
  }
}
</style>


