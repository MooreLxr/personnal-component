<template>
  <div class="line-bar-chart"
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
 * @description 柱状图+折线图混合
 * @example 调用示例
 * <line-bar-chart :dataProvider="datas" :chartConfig="chartConfig" :noDataText="'暂无数据'" style="height:300px"></line-bar-chart>
 * chartConfig: {
    y: [
      {
        name: '个数（个）', type: "bar",
        column: [
          { name: '应巡查', field: 'total_number', color: "#25c379", stack: '个数' },
          { name: '已巡查', field: 'real_number', color: "#0faeff", stack: '个数' }
        ],
        format: { type: 'fixed', value: 1 },
        // 可以自定义type=bar 的series的其他属性
      },
      {
        name: '比率（%）', type: "line", max: 100,
        column: [{ name: '巡河率', field: 'rate_value', itemStyle:{color:"#00f6ff"}, areaStyle: { color:["#03697f","transparent"] }}],
        format: { type: 'fixed', value: 1,unit:'%' },
        // 可以自定义type=line 的series的其他属性
      }
    ],
    x: { field: "area_name",format: { type: 'substring', value: 4 } },
    grid: { top: "30", left: "20", right: "15", bottom: "0", containLabel: true }
  },
 */
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'
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
    //是否自动轮播tooltip
    tooltipAnimate: {
      type: Boolean,
      default: false
    },
    noDataText: String,
    imgPath: String
  },
  data () {
    return {
      xAxisData: [],
      myChart: null,
      tooltipTimer: null
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.drawChart()
      let container = this.$refs.container
      container.addEventListener('mouseover', () => {
        this.tooltipTimer && clearInterval(this.tooltipTimer)
      }),
        addEventListener('mouseout', () => {
          if (this.tooltipAnimate) this.autoPlayTooltip(this.curIndex)
        })
    })
    window.addEventListener('resize', () => {
      this.resize()
    })
  },
  methods: {
    // 报图初始配置
    drawChart () {
      if (this.myChart) this.myChart.dispose() // 每次重绘一定要销毁
      if (!this.dataProvider || !this.dataProvider.length) return
      let $chartDom = this.$refs.chartDom,
        myEcharts = (this.myChart = echarts.init($chartDom)),
        { dataProvider, chartConfig } = this,
        conWidth = $chartDom.clientWidth,
        conHeight = $chartDom.clientHeight,
        backgroundColor = chartConfig.backgroundColor,
        yAxis = chartConfig.yAxis,
        xAxis = chartConfig.xAxis,
        grid = chartConfig.grid,
        dataZoom = chartConfig.dataZoom,
        tooltip = chartConfig.tooltip,
        series = chartConfig.series,
        legendConf = chartConfig.legend,
        chartsY = chartConfig.y,
        chartsX = chartConfig.x,
        seriesData = [],
        color = [],
        legendData = []

      //添加点击事件
      const _this = this
      myEcharts.on('click', function (params) {
        _this.$emit('chartClick', dataProvider[params.dataIndex])
      })
      if (chartsY && chartsY.length) {
        chartsY.forEach((ele, i) => {
          ele.column && ele.column.forEach((item, index) => {
            if (ele.type === 'bar') {
              seriesData.push({...{
                name: item.name,
                symbolSize: 6, // 小圆点尺寸
                symbol: 'circle',
                cursor: 'pointer',
                type: 'bar',
                yAxisIndex: i,
                barGap: '10%',
                barMaxWidth: '10px',
                smooth: true,
                label: {
                  show: true,
                  color: '#3c4f62',
                  fontSize: 14,
                  position: 'top'
                },
                data: dataProvider.map(d => {
                  return [d[chartsX.field], d[item.field]]
                }),
                itemStyle: {
                  color: item.itemStyle && item.itemStyle.color ? new echarts.graphic.LinearGradient(
                    0,0,0,1,
                    // 三种由深及浅的颜色
                    [
                      { offset: 0, color: item.itemStyle.color[0] },
                      { offset: 1, color: item.itemStyle.color[1] }
                    ]
                  ) : null,
                  barBorderRadius: (ele.itemStyle && ele.itemStyle.barBorderRadius) || [0,0,0,0]
                }
              }, ...ele.series})
            } else {
              seriesData.push({...{
                name: item.name,
                cursor: 'pointer',
                type: 'line',
                smooth: true,
                yAxisIndex: i,
                label: {
                  show: false,
                  color: '#3c4f62',
                  fontSize: 14,
                  position: 'top'
                },
                data: dataProvider.map(d => {
                  return [d[chartsX.field], d[item.field]]
                }),
                itemStyle: item.itemStyle,
                areaStyle: item.areaStyle && item.areaStyle.color ? {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: item.areaStyle.color[0]
                    },
                    {
                      offset: 1,
                      color: item.areaStyle.color[1]
                    }
                  ])
                } : null
              }, ...ele.series})
            }
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
        //hover时的提示
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
                    if(ele.format){ 
                      let { type,value,unit } = ele.format
                      unit = unit || ''
                      switch (type) {
                        case "fixed":
                          formatValue = (p.data[1]||p.data[1]==0) ? Number(p.data[1]).toFixed(value) + unit : '-'+unit
                          break;
                        case "date":
                          return moment(p.data[1]).format(value)
                          break;
                        //枚举
                        case "enum":
                          return value[p.data[1]]
                          break;
                      }
                    } else formatValue = p.data[1] ? p.data[1] : '-'
                    newText += p.marker + p.seriesName+'：' + formatValue + '<br/>'
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
        xAxis: { ...{
          type: 'category',
          //x轴字体颜色
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: '#666'
            },
            formatter: function (data, index) {
              if (chartsX && chartsX.format) _this.formatData(data, chartsX.format)
              else return (data || data == 0) ? data : '-'
            }
          },
          //坐标轴颜色
          axisLine: {
            lineStyle: {
              color: '#666'
            }
          },
          //网格线
          splitLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              color: '#dfe1e8'
            }
          },
          //便签与刻度线居中
          axisTick: { alignWithLabel: true }
        }, ...xAxis },
        yAxis: chartsY.map(item => {
          return {
            name: item.name,
            type: 'value',
            nameLocation: (yAxis && yAxis.nameLocation) || 'end',
            nameTextStyle: (yAxis && yAxis.nameTextStyle) || {
              color: '#666',
              fontSize: 12
            },
            //y轴字体颜色
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
            //坐标轴颜色
            axisLine: (yAxis && yAxis.axisLine) || {
              lineStyle: {
                color: '#666'
              }
            },
            //网格线
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
      if (this.tooltipAnimate) this.autoPlayTooltip()
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
    //自动轮播tooltip
    autoPlayTooltip (index) {
      this.curIndex = index || 0
      let { dataProvider, myChart } = this
      if (myChart) {
        this.tooltipTimer && clearInterval(this.tooltipTimer)

        this.tooltipTimer = setInterval(() => {
          myChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: this.curIndex
          })
          if (this.curIndex < dataProvider[0].length) this.curIndex++
          else this.curIndex = 0
        }, 1000)
      }
    },
    resize () {
      if (this.myChart) {
        let container = this.$refs.container,
          conWidth = container && container.clientWidth,
          conHeight = container && container.clientHeight
        this.myChart.resize({
          width: conWidth + 'px',
          height: conHeight + 'px'
        })
      }
    }
  },
  beforeDestroy () {
    this.tooltipTimer && clearInterval(this.tooltipTimer)
  },
  watch: {
    chartConfig () {
      this.$nextTick(() => {
        this.drawChart()
      })
    },
    dataProvider () {
      this.$nextTick(() => {
        this.drawChart()
      })
    }
  }
}
</script>

<style lang="scss">
.line-bar-chart {
  width: 100%;
  .echarts {
    width: 100%;
    height: 100%;
  }
}
</style>
