<template>
  <div class="demo">
    <el-button type="primary" @click="saveFile">数据导出到excel</el-button>
  </div>
</template>

<script>
/**
* author lxr
* since 
* @description 
*/
import http from '@/api/httpInstance'

export default {
  name: 'demo',
  data () {
    return {
      townArr: []
    }
  },
  created () {
    this.getData()
  },
  mounted () {},
  methods: {
    getData () {
      let geoJSON = new hmap.format.GeoJSON()
      http({
        method: 'get',
        url: 'http://10.193.20.209:8080/fjfbdataaccess/static/data/bhd.json'
      }).then(res => {
        const features = geoJSON.read(res.data)
        features.forEach(feature => {
          this.addAreaText(feature) // 区域名称
        })
      })
    },
    addAreaText (feature) {
      let LonLat = feature.getExtent().getCenter() // 通过面区域获取中心点经纬度
      this.townArr.push({
        lng: LonLat._x,
        lat: LonLat._y,
        name: feature._attributes.BHFQ
      })
    },
    saveFile () {
      var urlObject = window.URL || window.webkitURL || window
      var export_blob = new Blob([JSON.stringify(this.townArr)])
      var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
      save_link.href = urlObject.createObjectURL(export_blob)
      save_link.download = 'townText.json'
      var ev = document.createEvent("MouseEvents")
      ev.initMouseEvent(
          "click", true, false, window, 0, 0, 0, 0, 0
          , false, false, false, false, 0, null
      )
      save_link.dispatchEvent(ev)
    }
  },
}
</script>

<style lang="scss">
.demo{}
</style>