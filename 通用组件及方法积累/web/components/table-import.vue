<template>
  <div class="table-import">
    <div style="text-align:center">
      <a
        target="_blank"
        :href="tempUrl"
        class="model-text"
      >点击下载导入模板</a>
    </div>
    <div class="tip">提示：点击浏览文件后选择需要导入的excel文件进行数据导入。</div>

    <el-upload
      ref="upload"
      class="upload-btn"
      :action="importUrl"
      :data="customData"
      accept=".xls,.xlsx"
      :show-file-list="false"
      single-file
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :on-progress="handleProgress"
      :before-upload="beforeUpload"
    >
      <el-button type="primary" :loading="loading" icon="el-icon-upload">点击上传</el-button>
    </el-upload>

    <div class="progress" v-show="progressPercent>0">
      当前进度：<el-progress :percentage="progressPercent" :status="progressStatus" :stroke-width="12"></el-progress>
    </div>
  </div>
</template>

<script>
/**
 * @author lxr
 * @since created by lxr 2021-06-16 13:44
 * @description 导入组件
 */

export default {
  props: ['tempUrl', 'importUrl','customData'],
  data() {
    return {
      loading: false,
      progressPercent: 0,
      progressStatus: '',
      percentTotal: 60 // 文件上传占用百分比
    }
  },
  created () {
    this.loading = false
    this.progressPercent = 0
    this.progressStatus = ''
  },
  methods: {
    /**
     * @description 文件上传前
     */
     beforeUpload(file) {
      this.loading = true
      this.progressStatus = ''
      this.progressPercent = 0
      return true
    },
    uploadSuccess(res, file, fileList) {
      if (res.code === '0') {
        this.$message({
          message: '导入成功:' + res.data,
          type: 'success',
          duration: 1500
        })
        this.updateStatus('success')
        this.$emit('importSuccess')
      } else {
        this.$message({
          message: res.data,
          type: 'error',
          duration: 1500
        })
        this.updateStatus('exception')
      }
    },
    uploadError(err, file, fileList) {
      console.log('失败', err)
      this.$message({
        message: '导入失败!',
        type: 'error',
        duration: 1500
      })
      this.updateStatus('exception')
    },
    updateStatus (ststus) {
      this.loading = false
      this.progressStatus = ststus
      this.progressPercent = 100
      clearTimeout(this.timeoutID)
    },
    /**
     * @description 文件上传进度
     */
    handleProgress(event, file, fileList) {
      let { percentTotal } = this
      let percent = Math.floor(event.percent)
      if (percent < 100) {
        this.progressPercent = percent*percentTotal/100
      } else {
        this.progressPercent = percentTotal
        let process = () => {
          let rand = Math.random() // 随机数
          this.progressPercent = Math.floor((this.progressPercent + rand)*100)/100
          if(this.progressPercent >= 99){
            this.progressPercent = 99
          }
          this.timeoutID = setTimeout(process, 1000)
        }
        process()
      }
    },
  }
};
</script>

<style lang="scss">
.table-import {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 12px;
  .upload-btn {
    text-align: center;
    margin: 10px 0;
  }
  .model-text {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
  .tip {
    color: red;
    text-align: center;
    margin-top: 20px;
  }
  .progress{
    margin-top:25px;padding:0 50px;
    .el-progress{
      display: inline-block;
      width: calc(100% - 65px);
      vertical-align: middle;
      .el-progress__text{
        font-size: 14px !important;
      }
    }
  }
}
</style>
