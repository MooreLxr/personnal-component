
/**
 * 数组转树
 * @param list 列表
 * @param idField id属性名
 * @param pidField pid属性名
 * @param childrenField children属性名
 * @returns 树结构数据
 */
export function list2Tree(list, idField, pidField, childrenField) {
  let treeData = []
  let hash = {}
  let len = list.length
  // store in hash
  for(let i = 0; i < len; i++) {
    const item = list[i]
    hash[item[idField]] = item
  }
  for(let i = 0; i < len; i++) {
    const item = list[i]
    const hasVp = hash[item[pidField]]
    if (hasVp) {
      // parent exist in hash, then push item in it's children
      !hasVp[childrenField] && (hasVp[childrenField] = [])
      hasVp[childrenField].push(item)
    } else {
      treeData.push(item)
    }
  }
  return treeData
}
/**
 * 比较目标数组相对于源数组的改变
 * @param {*} source 
 * @param {*} target 
 * @returns 
 */
export function compareArray(source, target) {
  const addArray = []
  const delArray = []
  const remainArray = []
  for (const item of source) {
    if (target.indexOf(item) < 0) {
      delArray.push(item)
    } else {
      remainArray.push(item)
    }
  }
  for (const item of target) {
    if (source.indexOf(item) < 0) {
      addArray.push(item)
    }
  }
  return {
    addArray: addArray,
    delArray: delArray,
    remainArray: remainArray
  }
}

/**
 * 设置cookie
 * @param {string} name
 * @param {any} value
 * @param {any} expiredays
 */
export function setCookie(name, value, expiredays) {
  const exdate = new Date()
  if (expiredays) {
    exdate.setDate(exdate.getDate() + expiredays)
  }
  document.cookie =
    name +
    '=' +
    escape(value) +
    (expiredays === null ? '' : ';expires=' + exdate.toGMTString()) +
    ';path=/;'
}

/**
 * 获取cookie
 * @param {any} name
 * @returns
 */
export function getCookie(name) {
  if (document.cookie.length > 0) {
    let start = document.cookie.indexOf(name + '=')
    let end = 0
    if (start !== -1) {
      start = start + name.length + 1
      end = document.cookie.indexOf(';', start)
      if (end === -1) {
        end = document.cookie.length
      }
      return unescape(document.cookie.substring(start, end))
    }
  }
  return ''
}

/**
 * localStorage 设置
 * @param {*} key 
 * @param {*} data 
 */
export function setStorage(key, data) {
  const storageData = getStorage(key)
  if (storageData) {
    localStorage.setItem(key, JSON.stringify(Object.assign({}, storageData, data)))
  } else {
    localStorage.setItem(key, JSON.stringify(Object.assign({}, data)))
  }
}

/**
 * localStorage 获取
 * @param key 
 * @returns 
 */
export function getStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || {}
}

/**
 * 隐藏敏感信息
 * @param str 需要处理的字符串
 * @param start 替换的起始位置
 * @param end 替换的截止位置
 * @param replaceStr 替换的字符串
 * @return 处理之后的字符串
 */
export function hideSensitiveText(str, start, end, replaceStr = '*') {
  const subStrArr = str.split('')
  return [
    ...subStrArr.slice(0, start - 1),
    ...subStrArr.slice(start - 1, end).fill(replaceStr),
    ...subStrArr.slice(end)
  ].join('')
}
/**
 * @desc 将对象格式的字符串转成对象
 * @param string 对象格式的字符串
 * @return 转换后的对象
 */
export function _string2object(string) {
  // 传入的不是字符串则直接返回
  if (typeof string !== 'string') return string
  const object = {}
  const array = string.split('&')
  for (const item of array) {
    const arr = item.split('=')
    const value = arr.slice(1).join('=') // 过滤掉第一个等号前的值，那是key，后面的都是参数值
    object[arr[0]] = value ? decodeURIComponent(value) : ''
  }
  return object
}

/**
 * @desc 将对象转成对象格式的字符串
 * @param object 对象
 * @return 转换后的字符串
 */
export function _object2string(object) {
  // 传入的不是对象则直接返回
  if (Object.prototype.toString.call(object) !== '[object Object]') {
    return object
  }
  const array = []
  for (const key of Object.keys(object)) {
    array.push(`${key}=${encodeURIComponent(object[key])}`)
  }
  return array.join('&')
}

/**
 * 生成0-9随机数
 * @return
 */
export function getRandomNum0to9() {
  return Math.floor(10 * Math.random()).toString()
}

/**
 * 生成n位随机数
 * @param  {Number} x 随机数位数
 * @return {String} x位随机数
 */
export function getIndexCode(x = 16) {
  const d = new Date().getTime().toString()
  let r = ''
  if (x <= 13) {
    return d.substr(0, x)
  }
  do {
    x--
    r += getRandomNum0to9()
  } while (x > 13)
  return d + r
}


export function downloadFile(blob, fileName) {
  if ('download' in document.createElement('a')) {
    const downloadElement = document.createElement('a')
    let href = ''
    if (window.URL) {
      href = window.URL.createObjectURL(blob)
    } else {
      href = window.webkitURL.createObjectURL(blob)
    }
    downloadElement.href = href
    downloadElement.download = fileName
    document.body.appendChild(downloadElement)
    downloadElement.click()
    if (window.URL) {
      window.URL.revokeObjectURL(href)
    } else {
      document.body.removeChild(downloadElement)
    }
  } else {
    navigator.msSaveBlob(blob, fileName)
  }
}
/**
 * 下载文件（验证过可以使用！！！）
 * @param {*} file  文件流
 * @param {*} headers 请求头
 * @param {*} fileName 下载的文件名
 */
export function dealDownloadFile(file, headers, fileName=new Date().getTime()) {
  try {
    const blob = new Blob([file], { type: headers['content-type'] })
    
    let url = window.URL.createObjectURL(blob)
    let a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.parentNode.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (e) {
    console.log("download error : ", e)
  }
}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    let imgResult = ''
    reader.readAsDataURL(file)
    reader.onload = () => {
      imgResult = reader.result
    }
    reader.onerror = error => {
      reject(error)
    }
    // 完成时
    reader.onloadend = () => {
      resolve(imgResult)
    }
  })
}
// 文件单位格式化
export function formatSizeUnits(kb) {
    let units = ['KB', 'MB', 'GB', 'TB', 'PB'];
    let unitIndex = 0;

    while (kb >= 1024 && unitIndex < units.length - 1) {
        kb /= 1024;
        unitIndex++;
    }

    return `${kb.toFixed(2)} ${units[unitIndex]}`;
}
