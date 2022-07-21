// 防抖（动作停止后才会触发事件）
function debounce (func, wait, immediate) {
  var timeout
  return function () {
    var context = this
    var args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

function realFunc () {
  console.log('防抖触发了')
}
window.addEventListener('resize', debounce(realFunc, 250))
