<template>
  <div class="card-list">
    <template v-if="source && source.length">
      <div v-for="(item, i) in source" :key="i" class="card-item">
        <div v-for="(f,j) in fields" :key="j">
          <img
            :src="item[f.field]"
            alt=""
            v-if="f.type === 'image'"
            class="card-item-image"
            @click="previewImage(item[f.field])">
          <div class="card-item-row" v-else>
            <span class="card-item-row-label">{{f.label}}：</span>
            <span class="card-item-row-value" :title="item[f.field]">{{item[f.field]}}</span>
          </div>
        </div>
        <slot :rowData="{ ...item, ...{ index:i } }"></slot>
      </div>
    </template>
    <div v-else class="noData">
      <!-- <img src="../assets/images/noData.png" alt=""> -->
      <span>暂无数据</span>
    </div>

    <v-viewer :source="previewUrl" v-if="visible"></v-viewer>
    <!-- <h-img-preview
      ref="single"
      :data="previewUrl"
      :visible.sync="visible"
      mask-closable
    /> -->
  </div>
</template>

<script>
/**
* author lxr
* @Date: 2021-07-26 14:10:14
* @description 卡片展示方式
* <card-list
        :source="tableData"
        :fields="fields"
        v-if="tableData"
  />
  fields: [
    { field: 'snapPicUrl', label: '抓拍图片', type: 'image' },
    { field: 'deviceName', label: '卡口名称' },
    { field: 'cameraName', label: '监控点名称' },
    { field: 'areaName', label: '地理位置' }
  ],
*/
import vViewer from '@/components/v-viewer'
export default {
  name: 'card-list',
  props: ['source', 'fields'],
  components: { vViewer },
  data () {
    return {
      visible: false,
      previewUrl: null
    }
  },
  created () {
    console.log(this.source, this.fields)
  },
  mounted () {},
  methods: {
    previewImage (url) {
      this.visible = true
      this.previewUrl = [url]
    }
  }
}
</script>

<style lang="scss">
.card-list{
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-flow: wrap;
  .card-item{
    padding: 10px;
    width: 350px;
    height: fit-content;
    border: 1px solid #e4e4e4;
    margin: 10px;
    .card-item-image{
      width: 100%;
      height: 200px;
    }
    .card-item-row{
      font-size: 14px;
      line-height: 30px;
      display: flex;
      .card-item-row-label{
        color: #333;
        font-weight: bold;
      }
      .card-item-row-value{
        flex: 1;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .noData{
    width: 100%;
    height: 100%;
    color: #999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      margin-bottom: 10px;
    }
  }
}
</style>