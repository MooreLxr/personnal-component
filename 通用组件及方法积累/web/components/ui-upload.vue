<template>
  <div class="ui-upload" :class="{ hide: isHide, readonly: disabled }">
    <el-upload
      action="#"
      :name="name"
      :data="data"
      :multiple="multiple"
      :drag="drag"
      :accept="accept"
      :show-file-list="showFileList"
      :file-list="fileList"
      :list-type="listType"
      :limit="limit"
      :disabled="disabled"
      :autoUpload="autoUpload"
      :before-upload="onBeforeUpload"
      :on-success="handleSuccess"
      :on-error="onError"
      :on-preview="handlePreview"
      :before-remove="beforeRemove"
      :on-progress="onProgress"
      :on-remove="onRemove"
      :on-exceed="handleExceed"
      :on-change="onChange"
      :http-request="httpRequest"
      v-bind="$attrs"
    >
      <slot name="default"></slot>
      <div slot="tip" class="el-upload__tip" v-if="tip">{{ tip }}</div>
    </el-upload>

    <el-dialog :visible.sync="showDialog">
      <img :src="previewImgUrl" alt="" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request.js'

export default {
  name: 'bsUpload',
  props: {
    action: String,
    // 文件预览的下载地址
    downloadUrl: String,
    // 上传的文件字段名
    name: {
      type: String,
      default: 'file'
    },
    // 上传时附带的额外参数
    data: Object,
    // 接收上传的文件类型
    accept: String,
    // 最大允许上传个数
    limit: Number,
    // 单个文件上传大小限制（单位：MB）
    limitSize: Number,
    // 是否支持多选文件
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 提示说明文字
    tip: String,
    // 是否拖拽上传
    drag: {
      type: Boolean,
      default: false
    },
    // 文件列表展示方式：text/picture/picture-card
    listType: {
      type: String,
      default: 'text'
    },
    // 是否显示已上传的文件列表
    showFileList: {
      type: Boolean,
      default: true
    },
    // 上传的文件列表，例如[{name: '*****', url: '*****'}]
    fileList: {
      type: Array,
      default: () => []
    },
    // 是否在选取文件后自动上传
    autoUpload: {
      type: Boolean,
      default: true
    },
    // 文件上传前的钩子
    beforeUpload: {
      type: Function,
      default: () => true
    },
    onSuccess: Function,
    onError: Function,
    onProgress: Function,
    beforeRemove: Function,
    onRemove: Function,
    onChange: Function,
  },
  data() {
    return {
      uploadList: [],
      showDialog: false,
      previewImgUrl: ''
    }
  },
  computed: {
    isHide() {
      return this.uploadList.length >= this.limit
    }
  },
  watch: {
    uploadList: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    },
    fileList: {
      handler(val) {
        this.uploadList = val || []
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 自定义上传
    httpRequest(data) {
      var formData = new FormData()
      formData.append(this.name, data.file)
      for (let key in this.data) {
        formData.append(key, this.data[key])
      }
      request({
        url: this.action,
        method: 'post',
        data: formData
      })
        .then((res) => {
          data.onSuccess && data.onSuccess(res)
        })
        .catch((err) => {
          this.$message.error('上传失败')
          data.onError && data.onError(err)
        })
    },
    onBeforeUpload(file) {
      const cbRes = this.beforeUpload(file)
      // 文件是否超过大小限制
      if (!this.limitSize) return cbRes
      const isLtSize = file.size / 1024 / 1024 < this.limitSize
      if (!isLtSize) {
        this.$message.error(`上传文件大小不能超过${this.limitSize}MB!`)
      }
      return isLtSize && cbRes
    },
    handleSuccess(response, file, fileList) {
      this.$message.success('上传成功')
      this.uploadList = fileList
      this.onSuccess && this.onSuccess(response, file, fileList)
    },
    // 文件预览(暂时去掉，目前只能预览图片，其他类型应该做成下载)
    handlePreview(file) {
      console.log('file', file)
      // this.showDialog = true
      // this.previewImgUrl = file.url
      const id = file.id || file.response.data.id
      window.open(`${this.downloadUrl}/${id}`)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制上传 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length +
        fileList.length} 个文件`
      )
    }
  }
}
</script>

<style lang="scss">
.ui-upload {
  &.hide .el-upload--picture-card,
  &.hide .el-upload--text,
  &.hide .el-upload--picture,
  &.hide .el-upload__tip {
    display: none;
  }
  &.readonly .el-upload-list__item-actions {
    display: none;
  }
  &.readonly .el-upload{
    display: none;
  }
}
</style>
