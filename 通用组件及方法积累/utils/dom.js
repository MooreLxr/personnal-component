export function trim(string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}
export function camelCase(name) {
  return name
    .replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1');
}
// @function create(tagName: String, className?: String, container?: HTMLElement): HTMLElement
// create HTML element and set its className, and optionally appends it to `container` element.
export function create(tagName, className, container) {
  let el = document.createElement(tagName)
  el.className = className || ''

  container && container.appendChild(el)
  return el
}

// @function remove(el: HTMLElement)
// remove HTML element from its parent
export function remove(el) {
  let parent = el.parentNode
  parent && parent.removeChild(el)
}

export function hasClass(el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) {
    throw new Error('className should not contain space.')
  }
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

export function addClass(el, cls) {
  if (!el || !cls) return
  const clsArr = cls.split(' ')
  const tempClass = el.className
  for (let i = 0, len = clsArr.length; i<len; i++) {
    const clsItem = clsArr[i]
    if (el.classList) {
      el.classList.add(clsItem)
    } else {
      if (!hasClass(el, clsItem)) {
        tempClass += ' ' + clsItem
      }
    }
  }
  if (!el.classList) el.className = tempClass
}

export function removeClass(el, cls) {
  if (!el || !cls) return
  const clsArr = cls.split(' ')
  const tempClass = ' ' + cls.className + ' '
  for (let i = 0, len = clsArr.length; i< len; i++) {
    const clsItem = clsArr[i]
    if (el.classList) {
      el.classList.remove(clsItem)
    } else {
      if (hasClass(el, clsItem)) {
        tempClass = tempClass.replace(' ' + clsItem + ' ', ' ')
      }
    }
  }
  if (!el.classList) {
    el.className = trim(tempClass) // 去除首尾的空格
  }
}

export const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

export const off = (function() {
  if (document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

export function once(el, event, fn) {
  var listener = function() {
    if (fn) {
      fn.apply(this, arguments)
    }
    off(el, event, listener)
  }
  on(el, event, listener)
}

/**
 * @desc 返回当前元素相对于窗口左上角的X,Y
 * @param {} el 
 * @param {*} container 
 */
export function getOffset(el, container) {
  container = container || document.body
  const elRect = el.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  const clientTop = el.clientTop || container.clientTop || 0
  const clientLeft = el.clientLeft || container.clientLeft || 0
  let top, left

  if (container === document.body) {
    top = getScroll(true)
    left = getScroll()
  } else {
    top = container.scrollTop - containerRect.top
    left = container.scrollLeft - containerRect.left
  }
  
  return {
    top: elRect.top + top - clientTop,
    left: elRect.left + left - clientLeft,
    right: elRect.right + left - clientLeft,
    bottom: elRect.bottom + top - clientTop
  }
}
/**
 * @desc 返回滚动条的滚动高度
 * @param {Boolean} top 是否是获取顶部的左上角的Y坐标
 */
 export function getScroll(top) {
  var ret = window['page' + (top ? 'Y' : 'X') + 'Offset']
  var method = 'scroll' + (top ? 'Top' : 'Left')
  if (typeof ret !== 'number') {
    var d = window.document
    // ie6,7,8 standard mode  window.pageXOffset
    ret = d.documentElement[method]
    if (typeof ret !== 'number') {
      // quirks mode
      ret = d.body[method]
    }
  }
  return ret
}

export function computedStyle(eleDom) {
  if (window.getComputedStyle) {
    return getComputedStyle(eleDom, null)
  } else {
    return eleDom.currentStyle // 兼容IE的写法
  }
}

export const getStyle =
  ieVersion < 9
    ? function(element, styleName) {
        if (isServer) return;
        if (!element || !styleName) return null;
        styleName = camelCase(styleName);
        if (styleName === 'float') {
          styleName = 'styleFloat';
        }
        try {
          switch (styleName) {
            case 'opacity':
              try {
                return element.filters.item('alpha').opacity / 100;
              } catch (e) {
                return 1.0;
              }
            default:
              return element.style[styleName] || element.currentStyle
                ? element.currentStyle[styleName]
                : null;
          }
        } catch (e) {
          return element.style[styleName];
        }
      }
    : function(element, styleName) {
        if (isServer) return;
        if (!element || !styleName) return null;
        styleName = camelCase(styleName);
        if (styleName === 'float') {
          styleName = 'cssFloat';
        }
        try {
          var computed = document.defaultView.getComputedStyle(element, '');
          return element.style[styleName] || computed
            ? computed[styleName]
            : null;
        } catch (e) {
          return element.style[styleName];
        }
      };

/* istanbul ignore next */
export function setStyle(element, styleName, value) {
  if (!element || !styleName) return;

  if (typeof styleName === 'object') {
    for (var prop in styleName) {
      if (hasOwn(styleName, prop)) {
        setStyle(element, prop, styleName[prop]);
      }
    }
  } else {
    styleName = camelCase(styleName);
    if (styleName === 'opacity' && ieVersion < 9) {
      element.style.filter = isNaN(value)
        ? ''
        : 'alpha(opacity=' + value * 100 + ')';
    } else {
      element.style[styleName] = value;
    }
  }
}

/**
 * 查找最近的符合条件的祖先元素
 * @param {被查询的元素} element
 * @param {选择器} selector
 */
export function closest(element, selector) {
  if (!element || !selector) return;

  let targetNode = null;
  const traverse = function(element) {
    if (element === document) {
      return;
    }
    const nodes = element.parentNode.querySelectorAll(selector);
    if (nodes && nodes.length) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i] === element) {
          targetNode = element;
          return;
        }
      }
    }
    traverse(element.parentNode);
  };
  traverse(element);
  return targetNode;
}
