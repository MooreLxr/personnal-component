<template>
  <div class="school-schedule">
    <div class="school-schedule-date">
      <div
        class="date-item"
        v-for="(col,i) in columns"
        :key="i"
        :class="{'sm-date-item': col.isFull}">{{col.date | dateFormat}}/{{col.weekText}}
      </div>
    </div>
    <div class="school-schedule-detail">
      <div class="school-schedule-detail-col">
        <div
          class="daySection-item"
          v-for="(item,i) in daySections"
          :key="i"
          :style="`height:calc(${item.rowSpan/5*100}%);`">{{item.label}}</div>
      </div>
      <div class="school-schedule-detail-col">
        <div
          class="scheduleSection-item"
          v-for="(item,i) in scheduleSections"
          :key="i"
          :style="`height:calc(${1/scheduleSections.length*100}%);`">{{item.label}}</div>
      </div>
      <div
        class="detailSection-col"
        v-for="(col,colIndex) in columns"
        :key="colIndex"
        :class="{'sm-detailSection-col': col.isFull}">
        <template v-if="col.isFull">
          <div>报道</div>
        </template>
        <template v-else>
          <div
            v-for="(row, rowIndex) in col.children"
            :key="rowIndex"
            :class="['detailSection-item', `${scheduleSections[rowIndex].key}`,`${row.isNUll ? 'wpk':''}`]"
            :style="`height:calc(${1/scheduleSections.length*100}%);background-color:${colorEnum[Math.floor(Math.random()*4)]}`">
            <slot name="detail" :params="row"></slot>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
/**
* author lxr
* @Date: 2021-08-13 11:53:29
* @description 课程表
* <school-schedule :source="source" v-if="source">
    <div slot="detail" slot-scope="props">
      <div class="detail">{{props.params.describe}}</div>
      <div style="position:absolute;bottom:10px;left:10px;">
        <img src="../assets/images/teacher.png" alt="" class="icon">
        <span class="name">{{props.params.teacher}}</span>
      </div>
    </div>
  </school-schedule>

  this.source = [
    { date: '2021-08-09', describe: '报道', isFull: true }, // isFull=true则为全天事件
    {
      date: '2021-08-10',
      children: [
        { time: '08:30:00', teacher: '大雄', describe: '加强后勤安全知识认知' },
        { time: '10:30:00', teacher: '小叮当', describe: '贯彻落实中央八项规定细则的实施方案' },
        { time: '14:00:00', teacher: '', describe: '未排课', isNUll: true }, // isNUll=true未排课
        { time: '16:30:00', teacher: '静香', describe: '招标知识讲解' },
        { time: '18:00:00', teacher: '班主任', describe: '自学' }
      ]
    },
    {
      date: '2021-08-11',
      children: [
        { time: '08:30:00', teacher: '班主任', describe: '日常交通安全知识普及' },
        { time: '10:30:00', teacher: '小叮当', describe: '贯彻落实中央八项规定细则的实施方案' },
        { time: '14:00:00', teacher: '财务', describe: '报销学习' },
        { time: '16:30:00', teacher: '静香', describe: '招标知识讲解' },
        { time: '18:00:00', teacher: '班主任', describe: '自学' }
      ]
    },
    {
      date: '2021-08-12',
      children: [
        { time: '08:30:00', teacher: '陈小小', describe: '学习交流会' },
        { time: '10:30:00', teacher: '余力浩', describe: '贯彻落实中央八项规定细则的实施方案' },
        { time: '14:00:00', teacher: '班主任', describe: '报销学习' },
        { time: '16:30:00', teacher: '班主任', describe: '招标知识讲解' },
        { time: '18:00:00', teacher: '班主任', describe: '自学' }
      ]
    },
    {
      date: '2021-08-13',
      children: [
        { time: '08:30:00', teacher: '余力浩', describe: '加强后勤安全知识认知' },
        { time: '10:30:00', teacher: '小叮当', describe: '贯彻落实中央八项规定细则的实施方案' },
        { time: '14:00:00', teacher: '', describe: '未排课', isNUll: true },
        { time: '16:30:00', teacher: '余力浩', describe: '招标知识讲解' },
        { time: '18:00:00', teacher: '班主任', describe: '考试' }
      ]
    },
    {
      date: '2021-08-14',
      children: [
        { time: '08:30:00', teacher: '班主任', describe: '日常交通安全知识普及' },
        { time: '10:30:00', teacher: '小叮当', describe: '贯彻落实中央八项规定细则的实施方案' },
        { time: '14:00:00', teacher: '班主任', describe: '报销学习' },
        { time: '16:30:00', teacher: '余力浩', describe: '招标知识讲解' },
        { time: '18:00:00', teacher: '班主任', describe: '自学' }
      ]
    }
  ]
*/
import moment from 'moment'

export default {
  name: 'school-schedule',
  props: {
    source: Array,
    nodeKey: {
      type: String,
      default: 'date'
    }
  },
  data () {
    return {
      curTime: null,
      daySections: [
        { label: '早上', rowSpan: 2 },
        { label: '下午', rowSpan: 2 },
        { label: '晚上', rowSpan: 1 }
      ],
      scheduleSections: [
        { label: '1-2节', timeRange: '08:30:00' }, // timeRange暂未使用
        { label: '3-4节', timeRange: '10:30:00' },
        { label: '5-6节', timeRange: '14:00:00' },
        { label: '7-8节', timeRange: '16:30:00' },
        { label: '9-11节', timeRange: '18:00:00', key: 'wzx' }
      ],
      columns: [],
      colorEnum: ['#D8ECFA', '#FBEDD6', '#EAE8FD']
    }
  },
  created () {
    this.curTime = new Date()
    this.createWeekColumn()
  },
  mounted () {},
  methods: {
    // 创建一周课程表(不含周日)
    createWeekColumn () {
      const columns = []
      const weekEnum = { 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六', 0: '周日' }
      const { curTime, nodeKey, source } = this
      const day = curTime.getDay() // 获取今天的日期是周几(周日=0)
      const mondayDate = curTime.setDate(curTime.getDate() - (day === 0 ? 6 : day - 1))// 获取周一的日期
      let tempDate = new Date(mondayDate)
      for (let i = 0; i < 6; i++) {
        columns.push({
          date: moment(tempDate).format('YYYY-MM-DD'),
          weekText: weekEnum[tempDate.getDay()]
        })
        tempDate = new Date(tempDate.setDate(tempDate.getDate() + 1))
      }
      // 外部传入source和日历合并数据，根据date和nodeKey值来合并
      columns.forEach(col => {
        source.forEach(item => {
          if (col.date === item[nodeKey]) {
            col = Object.assign(col, item)
          }
        })
      })
      this.columns = columns
    }
  },
  filters: {
    dateFormat (val) {
      val = val.replace(/-/g, '/')
      return new Date(val).getMonth() + 1 + '-' + new Date(val).getDate()
    }
  },
  watch: {
    source () {
      this.createWeekColumn()
    }
  }
}
</script>

<style lang="scss">
.school-schedule{
  width: 100%;
  height: 100%;
  .school-schedule-date{
    padding-left: 150px;
    box-sizing: border-box;
    display: flex;
    .date-item{
      text-align: center;
      line-height: 50px;
      font-size: 18px;
      color: #333;
      flex: 1;
      &.sm-date-item{
        width: 120px;
        flex: 0 0 120px;
      }
    }
  }
  .school-schedule-detail{
    width: 100%;
    height: calc(100% - 50px);
    display: flex;
    padding: 0 10px;
    .school-schedule-detail-col{
      margin-right: 10px;
      display: flex;
      flex-direction: column;
      .daySection-item{
        width: 50px;
        text-align: center;
        margin-bottom: 10px;
        background-color: #F3F3F7;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        &:last-child{
          margin-bottom: 0;
        }
      }
      .scheduleSection-item{
        width: 80px;
        text-align: center;
        margin-bottom: 10px;
        background-color: #F3F3F7;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: center;
        &:last-child{
          margin-bottom: 0;
        }
      }
    }
    .detailSection-col{
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-right: 10px;
      &.sm-detailSection-col{
        width: 120px;
        flex: 0 0 120px;
        text-align: center;
        background-color: #D8ECFA;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .detailSection-item{
        margin-bottom: 10px;
        padding: 10px;
        box-sizing: border-box;
        font-size: 14px;
        position: relative;
        background-color: #EAE8FD;
        &:last-child{
          margin-bottom: 0;
        }
      }
      .wzx, .wpk{
        background-color: #F5F2F5 !important;
      }
      &:last-child{
        margin-right: 0;
      }
    }
  }
}
</style>
