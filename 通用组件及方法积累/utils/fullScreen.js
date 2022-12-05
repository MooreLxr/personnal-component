export function toggleFullScreen(ele) {
  if (isFullScreen()) {
    exitFullScreen()
  } else {
    requestFullScreen(ele)
  }
}

function requestFullScreen(ele) {
  const requestFullScreen = ele.requestFullScreen ||
    ele.webkitRequestFullScreen ||
    ele.mozRequestFullScreen ||
    ele.msRequestFullScreen
  if (requestFullScreen) {
    requestFullScreen.call(ele)
  }
}
function exitFullScreen() {
  const exitFullScreen = document.exitFullScreen ||
    document.mozCancelFullScreen ||
    document.webkitExitFullScreen ||
    document.msExitFullScreen
  if (exitFullScreen) {
    exitFullScreen.call(document)
  }
}
function isFullScreen() {
  return document.fullscreenElement ||
     document.msFullscreenElement ||
     document.mozFullscreenElement || 
     document.webkitFullscreenElement ||
     false
}
