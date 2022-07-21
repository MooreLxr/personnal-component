<template>
  <div class="uEditor" ref="container">
    <script :id="id" type="text/plain"></script>
  </div>
</template>

<script>
/* eslint-disable */
import '../../public/static/ueditor/ueditor.config.js'
import '../../public/static/ueditor/ueditor.all.js'
import '../../public/static/ueditor/lang/zh-cn/zh-cn.js'
import '../../public/static/ueditor/ueditor.parse.min.js'
import * as configs from '../../public/static/ueditor/config.editor'
export default {
  name: 'Editor',
  props: {
    id: {
      type: String,
      default: 'editor'
    },
    value: String
  },
  model: {
    prop: 'value',
    event: 'editorBlur'
  },
  data () {
    return {
      editor: null
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      const _this = this
      const container = this.$refs.container
      const width = container.clientWidth
      const height = container.clientHeight
      try {
        let toolbarConfig = configs
        toolbarConfig = {...toolbarConfig, ...{
          initialFrameWidth: width,
          initialFrameHeight: height
        }}
        this.editor = UE.getEditor(this.id, toolbarConfig)
        this.editor.addListener('focus', (editor) => {
          _this.$emit('editorFocus')
        })
        this.editor.addListener('blur', (editor) => {
          _this.$emit('editorBlur', _this.editor.getContent())
        })
        this.editor.addListener('ready', function () {
          _this.editor.setContent(_this.value) // 确保UE加载完成后，放入内容。
        })
      } catch (error) {
        throw new Error('初始化富文本编辑器错误， ', error)
      }
    },
    getUEContent() { // 获取内容方法
      return this.editor.getContent()
    },
    getUEContentTxt() { // 获取纯文本内容方法
      return this.editor.getContentTxt()
    }
  },
  destroyed () {
    this.editor.destroy()
  }
}
</script>

<style lang="scss">
.uEditor {
  width: 100%;
  height: 100%;
}
</style>
