const computedStyle = (eleDom) => {
  if (window.getComputedStyle) {
    return getComputedStyle(eleDom, null)
  } else {
    return eleDom.currentStyle // 兼容IE的写法
  }
}
export default computedStyle
