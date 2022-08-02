export function trim(string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}
export function hasClass(ele, cls) {
  if (!ele || !cls) return
  if (cls.indexOf(' ') !== -1) {
    throw new Error('className should not contain space')
  }
  if (ele.classList) {
    return ele.classList.contains(cls)
  } else {
    return (' ' + ele.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}
export function addClass(ele, cls) {
  if (!ele || !cls) return
  var curClass = ele.className
  var classes = cls.split(' ')
  for (let i = 0; i< classes.length; i++) {
    const clsName = classes[i]
    if (!clsName) continue
    if (ele.classList) {
      ele.classList.add(clsName)
    } else {
      curClass += ' ' + clsName
    }
  }
  if (!ele.classList) {
    ele.className = curClass
  }
}
export function removeClass(ele, cls) {
  if (!ele || !cls) return
  var curClass = ' ' + ele.className + ' '
  var classes = cls.split(' ')
  for (let i = 0; i < classes.length; i++) {
    const clsName = classes[i]
    if (!clsName) continue
    if (ele.classList) {
      ele.classList.remove(clsName)
    } else {
      if (hasClass(ele, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', '')
      }
    }
  }
  if (!ele.classList) {
    ele.className = trim(curClass)
  }
}

export function computedStyle(eleDom) {
  if (window.getComputedStyle) {
    return getComputedStyle(eleDom, null)
  } else {
    return eleDom.currentStyle // 兼容IE的写法
  }
}
