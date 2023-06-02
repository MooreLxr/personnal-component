<template>
  <ul class="fan-ip-addr" ref="ipAddr">
    <li v-for="(item, index) in ip" :key="index" class="fan-ip-item">
      <a-input
        size="small"
        v-model.number="item.value"
        class="fan-ip-input"
        ref="ipInput"
        :maxLength="3"
        @focus.native="focusInput"
        @blur.native="blurInput($event, index)"
        @keyup.native="keyup($event, index, item)"
        @keydown.native="keydown($event, index)"
        @paste.native="handlePaste($event)"
        @copy.native="handleCopy($event)"
        @compositionstart="compositionstart($event, index)"
        @compositionend="compositionend($event, index)"
        @change="changeIp($event, index)"
      ></a-input>
      <span class="fan-ip-dot" v-if="index < 3">.</span>
    </li>
    <div class="error-tootip" v-if="showErrorTooltip">
      <div class="error-tootip-text">格式错误的IP地址</div>
      <div class="error-tootip-tip">你正在尝试将格式错误的IP地址粘贴到改字段</div>
      <div class="popper-arrow"></div>
    </div>
  </ul>
</template>

<script>
/**
 * ip地址输入组件（分段式）
 * 调用示例：
 * <fan-ip-input v-model="colonyIp"></fan-ip-input>
 * colonyIp: '14.1.4.212'或者''
 */
import { Input } from 'ant-design-vue'

export default {
  name: 'fanIpInput',
  data() {
    return {
      shouldRemoveText: '',
      ip: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
      prenentKeycode: '',
      beforePosition: 0,
      showErrorTooltip: false
    };
  },
  components: {
    aInput: Input
  },
  props: {
    value: String
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    value: {
      immediate: true,
      handler: function (newIp, oldIp) {
        if (!newIp) return this.ip = [{ value: '' }, { value: '' }, { value: '' }, { value: '' }]
        this.ip = newIp.split('.').map(e => { return { value: e  } })
      }
    }
  },
  methods: {
    changeIp(e, index) {
      if (this.shouldRemoveText) {
        const { value } = e.currentTarget
        if (value.indexOf(this.shouldRemoveText) >= 0) {
          this.ip[index].value = value.replace(
            new RegExp(this.shouldRemoveText, 'g'),
            ''
          )
          this.shouldRemoveText = ''
          this.$nextTick(() => {
            let currentEvent = this.$refs.ipInput[index].$el
            currentEvent.selectionStart = this.beforePosition
            currentEvent.selectionEnd = this.beforePosition
          })
        }
      } else {
        // 当输入框输入三位数字后自动定位到下一个输入框
        if (e.currentTarget.selectionStart === 3) {
          this.$refs.ipInput[Math.min(index + 1, 3)].focus()
        }
        const resultIp = this.ip.map(ip => ip.value).join('.')
        this.$emit('change', resultIp)
      }
    },
    focusInput() {
      this.showErrorTooltip = false
    },
    blurInput(e, index) {
      const { value } = e.currentTarget
      // 第一个IP段必须小于223
      if (index === 0 && +value === 0) {
        this.$message.error('0不是有效项，请指定一个介于1~233间的值')
        this.ip[index].value = 1
      }
      if (index === 0 && +value > 223) {
        this.ip[index].value = 223
      }
      // 其他IP段小于255
      if (index > 0 && +value > 255) {
        this.ip[index].value = 255
      }
    },
    keydown(e, index) {
      const allowKey = [
        'Backspace',
        'ArrowRight',
        'ArrowLeft',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0'
      ]
      this.prenentKeycode = e.key === 'Process' ? e.code : ''
      // ctrl+c、ctrl+v
      const ctrlCommand = ['v', 'c']
      const isCtrlCmd = e.ctrlKey && ctrlCommand.includes(e.key)
      if (!allowKey.includes(e.key) && !isCtrlCmd) {
        e.preventDefault()
      }
    },
    // 当用户使用拼音输入法输入汉字时
    compositionstart(e, index) {
      this.beforePosition = e.currentTarget.selectionStart
      this.shouldLockKeyupEvent = true
    },
    // 当中文输入完成或取消时
    compositionend(e, index) {
      let len = this.ip[index].value.toString().length
      this.shouldRemoveText = e.data.substring(0, 3 - len)
      if (!this.shouldRemoveText) {
        e.currentTarget.selectionStart = this.beforePosition
        e.currentTarget.selectionEnd = this.beforePosition
      }
    },
    keyup(e, index, item) {
      if (this.prenentKeycode === e.code) return
      switch (e.key) {
        case 'Backspace':
          if (e.currentTarget.selectionStart === 0) {
            this.$refs.ipInput[Math.max(index - 1, 0)].focus()
          }
          break
        case '.':
          if (e.currentTarget.selectionStart === 0) {
            break
          }
        case 'ArrowRight':
          // focus下一个输入框
          if (item.value.toString().length === e.currentTarget.selectionStart) {
            this.$refs.ipInput[Math.min(index + 1, 3)].focus()
          }
          break
        case 'ArrowLeft':
          // focus前一个输入框
          if (e.currentTarget.selectionStart === 0) {
            this.$refs.ipInput[Math.max(index - 1, 0)].focus()
          }
          break
        case 'Tab':
          // 聚焦到下一个fan-ip-addr
          const fanIpAddrs = document.getElementsByClassName('fan-ip-addr')
          const curIpAddr = this.$refs.ipAddr
          for (let i = 0; i < fanIpAddrs.length; i++) {
            if (fanIpAddrs[i] === curIpAddr) {
              const nIndex = Math.min(i + 1, fanIpAddrs.length - 1)
              fanIpAddrs[nIndex].getElementsByTagName('input')[0].focus()
              break
            }
          }
          break
      }
    },
    // ctrl + v
    handlePaste(e) {
      e.preventDefault()
      const clipboard = e.clipboardData || window.clipboardData
      let text = clipboard.getData('text/plain')
      // 验证ip合法性
      // 第一个IP段0-223，第2-4个IP段0-255
      const rule = /^([1-9]?\d|1\d{2}|2[0-1]\d|22[0-3])(\.([1-9]?\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/
      if (!rule.test(text)) {
        this.showErrorTooltip = true
        return
      }
      this.ip = text.split('.').map(e => { return { value: +e } })
    },
    // ctrl + c
    handleCopy(e) {
      const content = this.ip.map(e => e.value).join('.')
      let inputDom = document.createElement('input')
      inputDom.setAttribute('readonly', 'readonly')
      inputDom.value = content
      document.body.appendChild(inputDom)
      inputDom.select()
      document.execCommand('Copy')
      inputDom.style.display = 'none'
      inputDom.remove()
    }
  }
}
</script>

<style scoped lang="scss">
.fan-ip-addr {
  width: 300px;
  display: inline-flex;
  list-style: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 0px 10px;
  justify-content: space-around;
  position: relative;
  .fan-ip-item {
    line-height: 32px;
    flex: 1;
    .fan-ip-dot {
      color: #9b8d8d;
      line-height: 32px;
      display: inline-block;
      vertical-align: middle;
    }
    .fan-ip-input {
      border: none;
      width: calc(100% - 4px);
      text-align: center;
      position: relative;
      padding: 3px 8px;
      vertical-align: middle;
      color: rgba(0,0,0,.65);
      -webkit-appearance: none;
      &:focus, &:focus-visible {
        box-shadow: none;
        border: none;
        outline: none;
      }
    }
  }
  .error-tootip {
    position: absolute;
    bottom: -70px;
    left: 50px;
    z-index: 999;
    min-width: 10px;
    line-height: 1.2;
    word-wrap: break-word;
    font-size: 13px;
    padding: 5px 10px;
    border-radius: 4px;
    background: #F1FFFF;
    color: #5B8FF9;
    border: 1px solid rgba(1, 188, 190, 0.2);
    box-shadow: 1px 1px 10px rgba(1, 188, 190, 0.4);
    line-height: 25px;
    .error-tootip-text {
      font-size: 16px;
      color: #5B8FF9;
    }
    .error-tootip-tip {
      color: #333;
    }
    .popper-arrow {
      position: absolute;
      top: -18px;
      height: 0;
      border: 10px solid #F1FFFF;
      border-left-color: transparent;
      border-top-color: transparent;
      border-right-color: transparent;
    }
  }
}
</style>