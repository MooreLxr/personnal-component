/**
 * 设置每日定时任务
 * @param {*} hour 小时
 * @param {*} minute 分钟
 * @param {*} callTask 任务函数
 */
export function setScheduledTask(hour, minute, callTask) {
  let taskTime = new Date()
  taskTime.setHours(hour)
  taskTime.setMinutes(minute)
  const curSecond = new Date().getSeconds() * 1000
  let timeDiff = taskTime.getTime() - new Date().getTime() // 获取时间差
  timeDiff = timeDiff-curSecond > 0 ? timeDiff-curSecond : (timeDiff-curSecond + 24 * 60 * 60 * 1000) // 调整延迟时间，控制整点执行
  // console.log('timeDiff', timeDiff)
  this.timer1 = setTimeout(function() {
    callTask() // 首次执行
    this.timer2 = setInterval(callTask, 24 * 60 * 60 * 1000) // 24小时为循环周期
  }, timeDiff)
}