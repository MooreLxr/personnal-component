<template>
  <div class="infinateScroll">
    <div style="background-color:#000">
      <div class="table-thead">
        <div class="table-th-column" v-for="(item,i) in columns" :key="i" :style="`width:calc(100%/${columns.length});`">{{item.label}}</div>
      </div>
      <div class="table-tbody" ref="parentDOM"  @mouseover="mouseOver" @mouseleave="mouseLeave">
        <div ref="container" style="width: 100%;height: 100%;">
          <div class="table-row" v-for="(row,i) in tableData" :key="i">
            <div class="table-td-column" v-for="(item,j) in columns" :key="j" :style="`width:calc(100%/${columns.length});`">
              <span v-if="item.field=='index'">{{i+1}}</span>
              <span v-else :title="`${item.showTooltip?row[item.field] : ''}`">{{row[item.field]}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
* author lxr
* since 2021-07-15 20:02:00
* @description 无缝滚动
*/
import '@/utils/animationFrame'

export default {
  name: 'infinateScroll',
  data () {
    return {
      townArr: [],
      columns: [
        { label:'序号', field: 'index' },
        { label:'区域', field: 'regionName', showTooltip:true },
        { label:'监控点总数', field: 'totalcount' },
        { label:'在线率', field: 'onlinerateBeautify' }
      ],
      tableData: null,
      distance: 0
    }
  },
  created () {
    this.getData()
  },
  mounted () {
    this.getTable()
  },
  methods: {
    getTable () {
      this.tableData = [
        { regionName:'福州', totalcount:100, onlinerateBeautify: '50%' },
        { regionName:'厦门', totalcount:100, onlinerateBeautify: '50%' },
        { regionName:'漳州', totalcount:100, onlinerateBeautify: '50%' },
        { regionName:'泉州', totalcount:100, onlinerateBeautify: '50%' },
        { regionName:'三明', totalcount:100, onlinerateBeautify: '50%' },
        { regionName:'莆田', totalcount:100, onlinerateBeautify: '50%' },
        { regionName:'平潭', totalcount:100, onlinerateBeautify: '50%' },
        { regionName:'南平', totalcount:100, onlinerateBeautify: '50%' },
        { regionName:'宁德', totalcount:100, onlinerateBeautify: '50%' }
      ]
      this.$nextTick(() => {
        this.textAutoScroll()
      })
    },
    // 无缝滚动
    textAutoScroll () {
      const parentDOM = this.$refs.parentDOM
      const eleDom = this.$refs.container
      this.timer && window.cancelAFrame(this.timer)
      const totalHeight = eleDom.scrollHeight
      // 数据量少不需要滚动
      if (eleDom.offsetHeight < parentDOM.offsetHeight) return

      // 无缝滚动
      const len = eleDom.childNodes.length
      eleDom.innerHTML += eleDom.innerHTML // 构造两个首尾相接一模一样的数据
      
      const scroll = () => {
        if(this.distance === totalHeight) {
          this.distance = 0
        } else this.distance += 1
        eleDom.style.transform = `translateY(-${this.distance}px)`
        this.timer = window.requestAFrame(scroll)
      }
      scroll()
    },
    mouseOver () {
      this.timer && window.cancelAFrame(this.timer)
    },
    mouseLeave () {
      this.textAutoScroll()
    },
    // 非无缝滚动
    textAutoScroll1 () {
      const eleDom = this.$refs.container
      this.timer && window.cancelAFrame(this.timer)
      const total = eleDom.scrollHeight - eleDom.clientHeight // 可滚动的距离
      let distance = 0
      const scroll = () => {
        distance = distance < total ? distance + 1 : 0
        eleDom.style.transform = `translateY(-${distance}px)`
        this.timer = window.requestAFrame(scroll)
      }
      scroll()
    }
  },
}
</script>

<style lang="scss">
.infinateScroll{
  $thFont:#D6F6FF;
  $tdFont:#fff;
  $trBg: rgba(0,213,255,0.02);

  width: 100%;
  height: 100%;

  .table-thead{
    width: calc(100% + 3px);
    background: url(../assets/images/table_th_bg.png) no-repeat;
    background-size: 100% 100%;
    .table-th-column{
      height: 58px;
      line-height: 52px;
      font-size: 20px;
      color: $thFont;
      display: inline-block;
      text-align: center;
    }
  }
  .table-tbody{
    height:300px;
    overflow:hidden;
    .table-row{
      background-color: $trBg;
      border: 1px solid rgba(0,213,255,0.1);
      margin-bottom: 5px;
      height: 42px;
      line-height: 42px;
    }
    .table-td-column{
      display: inline-block;
      color: $tdFont;
      font-size: 20px;
      text-align: center;
      span{
        width: 100%;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>