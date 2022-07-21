<template>
  <div class="i-upload">
    <van-field
      :label="label"
      :required="required"
      :rules="rules"
      readonly
      :input-align="inputAlign"
      name="uploader"
    >
      <template #input>
        <van-uploader
          v-model="fileList"
          :accept="accept"
          :max-size="maxSize"
          :max-count="maxCount"
          :multiple="multiple"
          :disabled="disabled"
          :readonly="readonly"
          :before-read="beforeRead"
          :after-read="afterRead"
        />
      </template>
    </van-field>
  </div>
</template>

<script>
/**
* author lxr
* @Date: 2021-10-28 10:20:10
* @description
*/
import http from '@/config/http.js'

export default {
  name: 'i-upload',
  props: {
    label: {
      type: String,
      required: true
    },
    required: Boolean, // 是否必填
    rules: Array, // 表单校验规则
    action: String, // 上传的地址
    params: Object, // 可选参数, 上传时附带的额外参数
    /**
     * 允许上传的文件类型
    */
    accept: {
      type: String,
      default: 'image/*'
    },
    /**
     * 文件大小限制
    */
    maxSize: [Number, String],
    /**
     * 文件上传数量限制
    */
    maxCount: [Number, String],
    /**
     * 是否开启图片多选，部分安卓机型不支持
    */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * 是否将上传区域设置为只读状态
    */
    readonly: {
      type: Boolean,
      default: false
    },
    /**
     * 是否将上传区域设置为只读状态
    */
    disabled: {
      type: Boolean,
      default: false
    },
    beforeRead: Function,
    /**
     * 已上传的值, 格式：[{ url: 'https://img01.yzcdn.cn/vant/leaf.jpg' }]
    */
    value: Array,
    /**
     * 输入框对齐方式，可选值为 center right
    */
    inputAlign: {
      type: String,
      default: 'right'
    }
  },
  data () {
    return {
      fileList: []
    }
  },
  model: {
    prop: 'value',
    event: 'afterUpload'
  },
  watch: {
    value (val) {
      this.fileList = val || []
    }
  },
  created () {
    this.fileList = this.value || []
  },
  mounted () {},
  methods: {
    // 上传图片
    afterRead (file) {
      const sendData = new FormData()
      sendData.append('file', file.file)
      // 设置上传时附带的参数
      if (this.params) {
        for (const key in this.params) {
          sendData.append(key, this.params[key])
        }
      }
      http({
        method: 'post',
        url: this.action,
        data: sendData
      }).then(res => {
        if (res.code === '0') {
          this.$toast({
            type: 'success',
            message: '上传成功!',
            duration: 1000
          })
          this.$emit('afterUpload', this.fileList, res.data)
        }
      }).catch((e) => {
        this.$toast({
          type: 'fail',
          message: '上传失败!',
          duration: 1000
        })
        this.$emit('afterUpload', this.fileList)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.i-upload {
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
