// 节流（达到mustRun时间后才会触发事件）
function throttle (func, wait, mustRun) {
  var timeout
  var startTime = new Date()

  return function () {
    const context = this
    const args = arguments
    const curTime = new Date()
    clearTimeout(timeout)
    if (curTime - startTime >= mustRun) {
      // 如果达到了规定的触发时间间隔，触发 handler
      func.apply(context, args)
      startTime = curTime
    } else {
      // 没达到触发间隔，重新设定定时器
      timeout = setTimeout(func, wait)
    }
  }
}
function realFunc () {
  console.log('节流触发了')
}
// 采用了节流函数
window.addEventListener('scroll', throttle(realFunc, 500, 1000))
