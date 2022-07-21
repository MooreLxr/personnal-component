<template>
  <div class="pie-chart"
       ref="container">
    <div class="echarts"
         ref="chartDom"
         v-if="dataProvider && dataProvider.length"></div>
    <no-data :text="noDataText"
             :icon="imgPath"
             v-if="dataProvider && dataProvider.length==0"></no-data>
  </div>
</template>

<script>
/**
 * @since created by lxr at 2019-10-09 
 * @description 饼图
 * @example 调用示例
 * <pie-chart :dataProvider="datas" :chartConfig="chartConfig" :noDataText="'暂无数据'" style="height:300px"></pie-chart>
 * chartConfig:{
    series:{
      radius: ['40%','60%'],
      label: {
        normal: {
          formatter: '{b}: {c} ({d}%)'
        }
      },
      //center: ['40%','50%']
    },
    legend: {
      orient: 'vertical',
      top: '30%',
      right: 5
    },
    tooltip: {
      formatter: '{b}:{c}'
    },
    field: { name: 'type',value: 'count' }// 报图展示的字段名称
  },
 */
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legend'
import noData from '@/components/noData'

export default {
  components: { noData },
  props: {
    dataProvider: {
      type: Array,
      required: true
    },
    chartConfig: Object,
    noDataText: String,
    imgPath: String
  },
  data () {
    return {
      xAxisData: [],
      myChart: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.drawChart()
    })
    window.addEventListener('resize',() => {
      this.resize()
    })
  },
  methods: {
    // 报图初始配置
    drawChart () {
      if (this.myChart) this.myChart.dispose() // 每次重绘一定要销毁
      if (!this.dataProvider || !this.dataProvider.length) return
      let $chartDom = this.$refs.chartDom
      let myEcharts = (this.myChart = echarts.init($chartDom))
      let { dataProvider, chartConfig } = this
      let tooltip = chartConfig && chartConfig.tooltip && chartConfig.tooltip
      let series = chartConfig && chartConfig.series || {}//用该属性替换chartsY
      let legendConf = chartConfig && chartConfig.legend
      let field = chartConfig && chartConfig.field// 报图读取的字段
      if (!field) return

      myEcharts.setOption({
        color: dataProvider.map(item => { return item.color }),
        tooltip: { ...{
          trigger: 'item',
          axisPointer: { type: 'shadow' },
          position: null, // 设置tooltip的位置:'inside'在内部
          formatter: '{b}: {c} ({d}%)'
        }, ...tooltip },
        legend: { ...{
          show: true,
          orient: 'horizontal',
          top: 'auto',
          right: 'auto',
          data: dataProvider.map(item => { return item[chartConfig.field.name] })
        }, ...legendConf },
        series: [
          {
            type: 'pie',
            radius: (series && series.radius) || [0, '50%'],
            center: (series && series.center) || ['50%', '50%'],
            avoidLabelOverlap: (series && series.avoidLabelOverlap) || true,
            // 每块饼图的label展示
            label: (series && series.label) || {
              normal: {
                show: true, // 是否显示视觉引导线
                position: 'outside', // 标签的位置（outside饼图扇区外侧，通过视觉引导线连到相应的扇区、inside:扇形区内部，center:饼图中心位置）
                formatter: '{b}: {c} ({d}%)'
              }
            },
            // 设置牵引线样式
            labelLine: (series && series.labelLine) || {
              normal: {
                length: 10
              }
            },
            itemStyle: (series && series.itemStyle) || {
              emphasis: {
                shadowBlur: 5,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: dataProvider.map(item => {
              return { name: item[chartConfig.field.name],value: item[chartConfig.field.value] }
            })
          }
        ]
      })
    },
    resize () {
      if (this.myChart) {
        let container = this.$refs.container
        let conWidth = container && container.clientWidth - 10
        let conHeight = container && container.clientHeight - 10
        this.myChart.resize({
          width: conWidth + 'px',
          height: conHeight + 'px'
        })
      }
    }
  },
  watch: {
    dataProvider () {
      this.$nextTick(() => {
        this.drawChart()
      })
    }
  }
}
</script>

<style lang="scss">
.pie-chart {
  width: 100%;
  height: 100%;
  .echarts {
    width: 100%;
    height: 100%;
  }
}
</style>
