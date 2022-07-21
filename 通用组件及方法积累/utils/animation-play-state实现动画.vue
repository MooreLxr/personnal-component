<template>
  <div class="monitor-warning">
    <module-title title="监测预警">
      <div class="statistic">
        今日共<span class="number color-yellow">8</span>条,
        已解除<span class="number color-green">3</span>条
      </div>
    </module-title>
    <div class="monitor-warning-detail">
      <div class="monitor-warning-detail-wrap">
        <div
          v-for="(item, i) in warningData"
          :key="i"
          :class="['warning-item',`warning-item-${warnType(item)}`]"
        >
          <div class="type">{{item.type}}</div>
          <div style="padding-left: 25px;">
            <div class="content">{{item.des}}</div>
            <div class="time">{{item.time}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
* author lxr
* @Date: 2022-03-09 14:36:03
* @description 监测预警
*/
import moduleTitle from '@/components/module-title'
export default {
  name: 'monitor-warning',
  components: { moduleTitle },
  data () {
    return {
      warningData: []
    }
  },
  created () {
    this.getData()
  },
  mounted () {},
  methods: {
    getData () {
      this.warningData = [
        { type: '水质', des: '冯洋w - 电导率浓度达1860us/cm，超标准值360us/cm', time: '2022-02-22  18:28:50' },
        { type: '大气', des: '下洋q - CO浓度达0.598PPM，超标准值0.529PPM', time: '2022-02-22  18:28:50' },
        { type: '水质', des: '冯洋w - 电导率浓度达1860us/cm，超标准值360us/cm', time: '2022-02-22  18:28:50' },
        { type: '森林', des: '热成像U0298 - 产生高温报警', time: '2022-02-22  18:28:50' },
        { type: '水质', des: '冯洋w - 电导率浓度达1860us/cm，超标准值360us/cm', time: '2022-02-22  18:28:50' },
        { type: '大气', des: '下洋q - CO浓度达0.598PPM，超标准值0.529PPM', time: '2022-02-22  18:28:50' },
        { type: '水质', des: '冯洋w - 电导率浓度达1860us/cm，超标准值360us/cm', time: '2022-02-22  18:28:50' },
        { type: '森林', des: '热成像U0298 - 产生高温报警', time: '2022-02-22  18:28:50' },
        { type: '水质', des: '冯洋w - 电导率浓度达1860us/cm，超标准值360us/cm', time: '2022-02-22  18:28:50' },
        { type: '大气', des: '下洋q - CO浓度达0.598PPM，超标准值0.529PPM', time: '2022-02-22  18:28:50' },
        { type: '水质', des: '冯洋w - 电导率浓度达1860us/cm，超标准值360us/cm', time: '2022-02-22  18:28:50' },
        { type: '森林', des: '热成像U0298 - 产生高温报警', time: '2022-02-22  18:28:50' }
      ]
      // api.getMonitorWarning().then(res => {
      //   this.warningData = res.data
      // })
    },
    warnType (item) {
      let type
      switch (item.type) {
        case '水质':
          type = 'green'
          break
        case '大气':
          type = 'yellow'
          break
        case '森林':
          type = 'red'
          break
        default:
          type = 'green'
          break
      }
      return type
    }
  }
}
</script>

<style lang="scss" scoped>
.monitor-warning {
  width: 100%;
  height: calc(100% - 445px);
  .statistic {
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #fff;
    font-weight: 400;
    line-height: 32px;
    .number {
      font-family: DINAlternate-Bold;
      font-size: 24px;
      font-weight: 700;
      margin: 0 5px;
    }
    .color-yellow {
      color: #FFD400;
    }
    .color-green {
      color: #00CC81;
    }
  }
  .monitor-warning-detail {
    width: 100%;
    height: calc(100% - 56px);
    padding: 33px 0 28px 0;
    box-sizing: border-box;
    overflow: hidden;
    .monitor-warning-detail-wrap {
      animation: move 10s linear 2s infinite normal;
      animation-play-state: running;
      &:hover {
        animation-play-state: paused;
      }
    }
    .warning-item {
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      .type {
        width: 24px;
        height: 50px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 14px;
        color: #fff;
        line-height: 18px;
        font-weight: 700;
        text-align: center;
        padding: 5px 0;
      }
      .content {
        font-family: MicrosoftYaHei;
        font-size: 16px;
        color: #fff;
        font-weight: 400;
        line-height: 22px;
      }
      .time {
        opacity: 0.7;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #fff;
        font-weight: 400;
        line-height: 22px;
      }
      &.warning-item-yellow {
        background: linear-gradient(to right, rgba(255,212,0,0.1), rgba(255,212,0,0.01));
        .type {
          border: 1px solid #FFD400;
          background: linear-gradient(180deg, rgba(255,212,0,0.1) 0%, rgba(255,212,0,0.01) 100%);
        }
      }
      &.warning-item-green {
        background: linear-gradient(to right, rgba(0,204,129,0.1), rgba(0,204,129,0.01));
        .type {
          border: 1px solid #00CC81;
          background: linear-gradient(180deg, rgba(0,204,129,0.1) 0%, rgba(0,204,129,0.01) 100%);
        }
      }
      &.warning-item-red {
        background: linear-gradient(to right, rgba(255,25,0,0.1), rgba(255,25,0,0.01));
        .type {
          border: 1px solid #FF1900;
          background: linear-gradient(180deg, rgba(255,25,0,0.1) 0%, rgba(255,25,0,0.01) 100%);
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
@keyframes move {
  from { transform: translateY(0); }
  to { transform: translateY(calc(-100% + 520px)); }
}
@-webkit-keyframes move {
  from { transform: translateY(0); }
  to { transform: translateY(calc(-100% + 520px)); }
}
</style>
