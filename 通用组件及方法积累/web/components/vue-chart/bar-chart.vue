<template>
  <div class="bar-chart"
       ref="container">
    <div class="echarts"
         ref="chartDom"
         v-if="dataProvider && dataProvider.length"
         :style="`height: ${height ? height+'px' : '100%'}`"></div>
    <no-data :text="noDataText"
             :icon="imgPath"
             v-if="dataProvider && dataProvider.length===0"></no-data>
  </div>
</template>

<script>
/**
 * @since created by lxr at 2019-10-09 
 * @description 柱状图
 * @example 调用示例
 * <bar-chart :dataProvider="datas" :chartConfig="chartConfig" :noDataText="'暂无数据' style="height:300px"></bar-chart>
 *  chartConfig: {
 *    type: 'horizontal',//水平(horizontal)或垂直(vertical)，默认是垂直vertical
 *    //坐标轴，最多两个，一左一右
      y: [
        {
          name: '个数（个）', type: "bar",
          column: [
            { name: '应巡查', field: 'total_number', color: "#25c379" }, //itemStyle: {color:["#4296fe","#396de2"]}设置渐变色 stack: '个数'设置堆叠
            { name: '已巡查', field: 'real_number', color: "#0faeff" }
          ],
          format: { type: 'fixed', value: '1',unit:'个' },
          label:{},
          max:100
        }
      ],
      x: { field: 'area_name', format: { type: 'substring', value: '1' } },
      grid: { top: '30', left: '20', right: '15', bottom: '0', containLabel: true }
      //可以自定义series的其他属性
    },
 */
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/grid'
import noData from '@/components/noData'
import moment from 'moment'

export default {
  components: { noData },
  props: {
    dataProvider: {
      type: Array,
      required: true
    },
    chartConfig: {
      type: Object,
      required: true
    },
    height: Number,
    noDataText: String,
    imgPath: String
  },
  data () {
    return {
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
      let yAxis = chartConfig.yAxis
      let xAxis = chartConfig.xAxis
      let grid = chartConfig.grid
      let dataZoom = chartConfig.dataZoom
      let backgroundColor = chartConfig.backgroundColor
      let tooltip = chartConfig.tooltip || {}
      let legendConf = chartConfig.legend || {}
      let series = chartConfig.series || {}
      let chartsY = chartConfig.y
      let chartsX = chartConfig.x
      let type = chartConfig.type || 'vertical'
      let seriesData = []
      let color = []
      let legendData = []

      //添加点击事件
      let _this = this
      myEcharts.on('click', function (params) {
        _this.$emit('chartClick', dataProvider[params.dataIndex])
      })

      if (chartsY && chartsY.length) {
        chartsY.forEach((ele,i) => {
          ele.column && ele.column.forEach((item, index) => {
            seriesData.push({ ...{
              name: item.name,
              stack: item.stack, // 若设置了stack并全部一致时则为堆叠柱状图（默认为非堆叠柱状图）
              symbolSize: 6, // 小圆点尺寸
              symbol: 'circle',
              cursor: 'pointer',
              type: 'bar',
              yAxisIndex: i,
              barWidth: '40%',
              barMaxWidth: '',
              barMinHeight: 0, // 设置当数值为0时柱子也有高度
              barGap: '30%',
              smooth: true,
              label: {
                show: true,
                color: '#3c4f62',
                fontSize: 12,
                position: 'top'
              },
              data: dataProvider.map(d => {
                return d[item.field]
              }),
              itemStyle: {
                color: item.itemStyle && item.itemStyle.color ? (type === 'horizontal' ? new echarts.graphic.LinearGradient(
                  1,0,0,0,
                  [
                    { offset: 0, color: item.itemStyle.color[0] },
                    { offset: 1, color: item.itemStyle.color[1] }
                  ]
                ): new echarts.graphic.LinearGradient(
                  0,0,0,1,
                  [
                    { offset: 0, color: item.itemStyle.color[0] },
                    { offset: 1, color: item.itemStyle.color[1] }
                  ]
                )) : null,
                barBorderRadius: [0,0,0,0]
              }
            }, ...series })
            color.push(item.color)
            legendData.push(item.name)
          })
        })
      }

      myEcharts.setOption({
        color: color,
        backgroundColor: backgroundColor || '#fff',
        legend: { ...{
          show: true,
          top: '2',
          itemWidth: 15,
          itemHeight: 12,
          textStyle: { color: '#666', fontSize: 12 },
          data: legendData
        }, ...legendConf },
        // hover时的提示
        tooltip: { ...{
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 1)', // tooltip的背景颜色
          axisPointer: { type: 'shadow' },
          position: 'inside', // 设置tooltip的位置
          alwaysShowContent: false, // 是否一直显示tooltip，默认是一段时间后自动隐藏
          formatter: function (params) {
            let newText
            if (chartsX.format && chartsX.format.type === 'date') {
              newText = moment(params[0].axisValue).format(chartsX.format.value) + '<br/>' 
            } else newText = params[0].axisValue + '<br/>'

            params.forEach(p => {
              chartsY.forEach((ele, i) => {
                ele.column && ele.column.forEach((col, index) => {
                  if(p.seriesName === col.name) {
                    let formatValue
                    if (ele.format) {
                      let { type, value, unit } = ele.format
                      unit = unit || ''
                      switch (type) {
                        case 'fixed':
                          formatValue = (p.data || p.data === 0) ? Number(p.data).toFixed(value) + unit : '-' + unit
                          break
                        case 'date':
                          formatValue = moment(p.data).format(value)
                          break
                        case 'enum':
                          formatValue = value[p.data]
                          break
                      }
                    } else formatValue = p.data || p.data===0 ? p.data : '-'
                    newText += p.marker + p.seriesName + '：' + formatValue + '<br/>'
                  }
                })
              })
            })
            return newText
          }
        }, ...tooltip },
        // 折线图边距
        grid: grid || {
          top: '30',
          left: '15',
          right: '15',
          bottom: '0',
          containLabel: true
        },
        //数据区域缩放组件
        dataZoom: dataZoom || [],
        // dataZoom: [
        //   {
        //     type: 'slider', //滑动条型
        //     startValue: 0, //数据窗口范围的起始数值
        //     endValue: 5, //数据窗口范围的结束数值
        //     zoomLock: true, //锁定大小,不可缩放
        //     throttle: 50, //触发视图刷新的频率
        //     height: 15,
        //     bottom: 0,
        //     showDetail: true //不显示详细数值
        //   }
        // ],
        xAxis: [
          type === 'horizontal'
            ? {
                type: 'value',
                name: (xAxis && xAxis.name) || '',
                nameLocation: (xAxis && xAxis.nameLocation) || 'end',
                nameTextStyle: (xAxis && xAxis.nameTextStyle) || {
                  color: '#666',
                  fontSize: 12
                },
                // y轴字体颜色
                axisLabel: {
                  textStyle: (xAxis && xAxis.axisLabel && xAxis.axisLabel.textStyle) || {
                    fontSize: 12,
                    color: '#666'
                  },
                  formatter: function (data,index) {
                    if (chartsY && chartsY[0].format) _this.formatData(data, chartsY[0].format)
                    else return (data || data == 0) ? data : '-'
                  }
                },
                // 坐标轴颜色
                axisLine: (xAxis && yAxis.axisLine) || {
                  lineStyle: { color: '#666' }
                },
                // 网格线
                splitLine: (yAxis && yAxis.splitLine) || {
                  show: true,
                  lineStyle: {
                    type: 'solid',
                    color: '#dfe1e8'
                  }
                },
                max: function (value) {
                  return chartsY[0].max || Math.ceil(value.max + (value.max - value.min) / 20)
                }
              } : {
                type: 'category',
                // x轴字体颜色
                axisLabel: {
                  textStyle: (xAxis && xAxis.axisLabel && xAxis.axisLabel.textStyle) || {
                    fontSize: 12,
                    color: '#666'
                  },
                  formatter: function (data, index) {
                    if (chartsX && chartsX.format) _this.formatData(data, chartsX.format)
                    else return (data || data == 0) ? data : '-'
                  }
                },
                // 坐标轴颜色
                axisLine: (xAxis && xAxis.axisLine) || {
                  lineStyle: {
                    color: '#666',
                    width: 1
                  }
                },
                // 网格线
                splitLine: (xAxis && xAxis.splitLine) || {
                  show: true,
                  lineStyle: {
                    type: 'solid',
                    color: '#dfe1e8'
                  }
                },
                // 便签与刻度线居中
                axisTick: { alignWithLabel: true },
                data: dataProvider.map(d => {
                  return d[chartsX.field]
                })
              }
        ],
        yAxis: chartsY.map(item => {
          return type === 'horizontal'
            ? {
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              name: (yAxis && yAxis.name) || '',
              axisLabel: {
                textStyle: (yAxis && yAxis.axisLabel && yAxis.axisLabel.textStyle) || {
                  fontSize: 12,
                  color: '#666'
                },
                formatter: function (data,index) {
                  if (chartsX && chartsX.format) _this.formatData(data, chartsX.format)
                  else return (data || data == 0) ? data : '-'
                }
              },
              data: dataProvider.map(d => {
                return d[chartsX.field]
              })
            } : {
              name: item.name,
              type: 'value',
              nameLocation: (yAxis && yAxis.nameLocation) || 'end',
              nameTextStyle: (yAxis && yAxis.nameTextStyle) || {
                color: '#666',
                fontSize: 12
              },
              // y轴字体颜色
              axisLabel: {
                textStyle: (yAxis && yAxis.axisLabel && yAxis.axisLabel.textStyle) || {
                  fontSize: 12,
                  color: '#666'
                },
                formatter: function (data,index) {
                  if (item.format) _this.formatData(data, item.format)
                  else return (data || data == 0) ? data : '-'
                }
              },
              // 坐标轴颜色
              axisLine: (yAxis && yAxis.axisLine) || {
                lineStyle: {
                  color: '#666'
                }
              },
              // 网格线
              splitLine: (yAxis && yAxis.splitLine) || {
                show: true,
                lineStyle: {
                  type: 'solid',
                  color: '#dfe1e8'
                }
              },
              max: function (value) {
                return item.max || Math.ceil(value.max + (value.max - value.min) / 20)
              }
            }
        }),
        series: seriesData
      })
    },
    formatData (data, format) {
      let { type, value, unit } = format
      unit = unit || ''
      let result
      switch (type) {
        case 'fixed':
          result = Number(data).toFixed(value) + unit
          break
        case 'date':
          result = moment(data).format(value)
          break
        //截取字符串
        case 'substring':
          result = data ? (data.length > value ? data.substring(0, value) + '...' : data) : '未知'
          break
        //超出换行
        case 'lineBreak':
          result = data.slice(0,value).split("").join('\n')
          break
        //枚举
        case 'enum':
          result = value[data]
          break
      }
      return result
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
.bar-chart {
  width: 100%;
  height: 100%;
  .echarts {
    width: 100%;
  }
}
</style>
