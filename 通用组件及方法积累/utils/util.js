/*
 * @Author: xiangxiao3
 * @Desc: 海豚项目中一些通用方法汇总
 * @Date: 2017-12-18 19:40:24
 * @Last Modified by: liumeng6
 * @Last Modified time: 2018-01-26 20:11:10
 */

// const JSEncrypt = require('jsencrypt')
/**
 * 树的简单数据转成树结构数据
 * @param {Array} list 树的简单数据结构
 * @param {Object} rootNode 根节点对象
 * @param {String} pId pId字段，默认为parentIndexCode
 * @param {String} id id字段，默认为indexCode
 * @author zhangxin14
 * @date 2017-8-21
 *
 * [{name:'a',id:'1',pId:null},{name:'a',id:'2',pId:'1'}] ==>
 * ==>[{name:'a',id:'1',pId:null,children:[{name:'a',id:'2',pId:'1'}]}]
 */

export function listToTreeWithRootObj(
  list,
  rootNode,
  pId = 'parentIndexCode',
  id = 'indexCode',
  children = 'children'
) {
  for (const childrenNode of list) {
    if (rootNode[id] === childrenNode[pId]) {
      rootNode[children] = rootNode[children] ? rootNode[children] : []
      rootNode[children].push(childrenNode)
      listToTreeWithRootObj(list, childrenNode, pId, id)
    }
  }
  return [rootNode]
}

/**
 * @author liumeng6
 * @date 2017-8-21
 * @param lists
 * @param selfkey
 * @param pKey
 * @returns {Array}
 * [{name:'a',id:'1',pId:null},{name:'a',id:'2',pId:'1'}] ==>
 * ==>[{name:'a',id:'1',pId:null,children:[{name:'a',id:'2',pId:'1'}]}]
 */
export function listTotreeWithOutRootObj(
  lists,
  selfkey = 'indexCode',
  pKey = 'parentIndexCode',
  children = 'children'
) {
  const treeData = {}
  const temp = []
  for (const i in lists) {
    treeData[lists[i][selfkey]] = lists[i]
  }
  for (const j in lists) {
    const treeVp = treeData[lists[j][pKey]]
    if (treeVp) {
      if (!treeVp[children]) {
        treeVp[children] = []
      }
      treeVp[children].push(lists[j])
    } else {
      if (!lists[j][children]) {
        lists[j][children] = []
      }
      temp.push(lists[j])
    }
  }
  return temp
}

/**
 * javascript 将树型数据转化为列表
 * @Author: xiangxiao3
 * @Date: 2017-12-12 15:23:42
 * @Desc:
 */
export function treeTolist(lists, removeChild = true, children = 'children') {
  let temp = []
  for (const item of lists) {
    const arr = item[children]
    if (Array.isArray(arr) && arr.length > 0) {
      temp = temp.concat(treeTolist(arr, removeChild, children))
    }
    if (removeChild) {
      item[children] = []
    }
    temp.push(item)
  }
  return temp
}

/**
 * 挑出checkArray中为叶子的id，并返回
 * @export
 * @param {obj} nodesMap (例如：this.refs.tree.store.nodesMap)
 * @param {any} checkArray  (例如: ['0001','00002'])
 */
export function getLeafKeys(nodesMap, checkArray) {
  const leafArray = []
  for (const checkId of checkArray) {
    if (nodesMap[checkId].isLeaf) {
      leafArray.push(checkId)
    }
  }
  return leafArray
}

/*
 * @Author: liumeng6
 * @Date: 2017-08-22 11:14:53
 * @Last Modified by: liumeng6
 * @Last Modified time: 2017-08-23 15:54:33
 * @remark: 比较目标数组相对于源数组的改变
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
 * @export
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
 * @export
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
 * javascript rsa加密
 * https://github.com/travist/jsencrypt
 * @Author: xiangxiao3
 * @Date: 2017-12-12 17:11:27
 * @Desc:  需要后端给一个秘钥publicKey
 */
/* encrypt (publicKey, password, keySize = 2048) {
    const encrypt = new JSEncrypt.JSEncrypt({ default_key_size: keySize })
    encrypt.setPublicKey(publicKey)
    return encrypt.encrypt(password)
  }, */

/**
 * javascript comment
 * @Author: xiangxiao3
 * @Date: 2018-01-12 19:14:53
 * @Desc: localStorage 设置
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
 * javascript comment
 * @Author: xiangxiao3
 * @Date: 2018-01-12 19:15:39
 * @Desc:  localStorage 获取
 */
export function getStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || {}
}

/**
 * @Author: xiangxiao3
 * @Date: 2017-12-12 16:43:39
 * @Desc: 对比2个数组larr,rarr，得到重复数组repeatArr，再传入第三个数组将carr和它合并
 * 将第一个数组去除repeatArr， 第二个数组加上repeatArr（并集）
 */
export function arrDataCompare(larr, rarr, carr = [], key = 'id') {
  // 获取larr和rarr重复数据
  let repeatArr = combineArr(larr, rarr, key)

  // 判断repeatArr和carr重复数据, 取交集
  repeatArr = repeatArr.concat(combineArr(repeatArr, carr, key))

  // 第一个数组去除 repeatArr
  const larrChange = combineArr(larr, repeatArr, key, false)

  // 第二个数组与 repeatArr 取交集
  const rarrChange = combineArr(rarr, repeatArr, key)

  return [larrChange, rarrChange]
}

/**
 * @Author: xiangxiao3
 * @Date: 2017-12-21 18:28:01
 * @Desc:  合并数据
 * @params: boo== true 取交集； false, arr + 交集
 */
export function combineArr(arr1, arr2, key = 'id', boo = true) {
  let arr = []
  // 判断arr1和arr2重复数据
  for (const arr1Obj of arr1) {
    let isReapet = false
    for (const arr2Obj of arr2) {
      if (arr1Obj[key] === arr2Obj[key]) {
        isReapet = true
        break
      }
    }
    // 这里的判断很恶心，待优化
    if (!isReapet && !boo) {
      arr.push(Object.assign({}, arr1Obj))
    }
  }
  if (boo) {
    arr = arr.concat(arr2)
  }
  return arr
}

/**
 * @Author: liumeng6
 * @Date: 2018-01-26 17:05:00
 * @Desc: 获取所有子节点的id
 * @param {Array} data (当前节点数据)
 * @param {Object} options (配置数据)
 */
export function getChildrenkeys(data, key = 'id', children = 'children') {
  let keys = []
  if (data[children] && data[children].length > 0) {
    for (const child of data[children]) {
      keys.push(child[key])
      if (child[children] && child[children].length > 0) {
        keys = [...keys, ...getChildrenkeys(child, key, children)]
      }
    }
  }
  return keys
}

/**
 * @Author: liumeng6
 * @Date: 2018-01-26 19:23:07
 * @Desc: 选中（或取消）本身及其下级节点
 * @param {Object} tree (树的实体，例如：this.$refs.areatree)
 * @param {Array} data (当前节点数据)
 * @param {Object} options (配置数据)
 * @param {Boolean} flag (true为全选，false为取消选择)
 */
export function setChildrenChecked(tree, data, { key = 'id', children = 'children' }, flag = true) {
  const checkedKeys = tree.getCheckedKeys()
  const childrenKeys = getChildrenkeys(data, key, children)
  if (flag) {
    tree.setCheckedKeys(Array.from(new Set([...childrenKeys, ...checkedKeys])))
  } else {
    tree.setCheckedKeys(checkedKeys.filter(key => !childrenKeys.includes(key)))
  }
}

/**
 * @description: 隐藏敏感信息
 * @author: zhangxin14
 * @since: 2018-05-30 11:29:10
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
 * @desc 根据页面高度，返回表格默认每页显示行数
 * @author chenguanbin
 * @since 2018-08-16 11:53:10
 * @param {Number} breakpoint 屏幕高度阈值
 * @return 表格默认每页显示行数
 */
export function getDefaultPageSize(breakpoint = 536) {
  // 页面高度小于阈值则默认显示10条数据，否则显示20条数据
  return document.body.offsetHeight < breakpoint ? 10 : 20
}

/**
 * @desc 当请求参数中只有空格时，将其替换成空字符串
 * @author chenguanbin
 * @param {Object} config 请求拦截器的config对象
 * @return 处理后的请求参数
 */
export function trimOnlySpace(config) {
  if (config.method === 'get' && config.params) {
    config.params = _trimOnlySpace(config.params)
  }
  if (config.method === 'post' && config.data) {
    const data = config.data
    // 是对象则直接处理，否则转成对象再处理
    if (Object.prototype.toString.call(data) === '[object Object]') {
      config.data = _trimOnlySpace(data)
    } else {
      let params = _string2object(config.data)
      params = _trimOnlySpace(params)
      config.data = _object2string(params)
    }
  }
  return config
}

/**
 * @desc 参数只有空格时，将其替换成空字符串
 * @author chenguanbin
 * @param {Object} params 请求参数
 * @return 处理有的参数
 */
export function _trimOnlySpace(params) {
  for (const key of Object.keys(params)) {
    const value = params[key]
    if (!value || typeof value !== 'string') continue
    if (value.trim() === '') params[key] = ''
  }
  return params
}

/**
 * @desc 将对象格式的字符串转成对象
 * @author chenguanbin
 * @param {String} string 对象格式的字符串
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
 * @author chenguanbin
 * @param {Object} object 对象
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
 * [getRandomNum0to9 生成0-9随机数]
 * @author Pengfei Lei
 * @date   2018-11-29T19:32:36+0800
 * @return {[type]}                 [description]
 */
export function getRandomNum0to9() {
  return Math.floor(10 * Math.random()).toString()
}

/**
 * [getIndexCode 生成n位随机数]
 * @author Pengfei Lei
 * @date   2018-11-29T19:31:30+0800
 * @param  {Number}                 x [随机数位数]
 * @return {String}                   [x位随机数]
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

/**
 * [getCSTime China Standard Time 获得中国标准时]
 * @author Pengfei Lei
 * @date   2019-01-09T19:36:32+0800
 * @param  {Object}                 date [时间对象new Date()]
 * @return {String}                      [中国标准时]
 */
export function getCSTime(date) {
  const arr = date.toString().split(' ')
  return arr[0] + ' ' + arr[1] + ' ' + arr[2] + ' ' + arr[4] + ' CST ' + arr[3]
}

/**
 * [getGMTime 获得GMT时间]
 * @author Pengfei Lei
 * @date   2019-03-19T10:39:05+0800
 * @param  {Object}                 date [时间对象new Date()]
 * @return {String}                      [GMTime]
 */
export function getGMTime(val) {
  if (val) {
    val = val.toString()
    const arr = val.split(' ')
    arr.splice(6, 1)
    const result = arr.join(' ')
    return result
  }
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
 * [getDefaultTreeNodeData 获得数组织初始化可选节点数据]
 * @author Pengfei Lei
 * @date   2019-01-31T19:52:36+0800
 * @param  {Array}                 treeData [树形原始数据]
 * @param  {String}                 key      [关键字]
 * @param  {String or Boolean}                 value    [关键字的值]
 * @return {Object}                          [返回数组织任意一可选节点，才有BFS策略]
 */
export function getDefaultTreeNodeData(treeData, key, value) {
  let flag
  treeData.forEach(node => {
    if (node[key] === value) {
      flag = node
      return
    }
    flag = getDefaultTreeNodeData(node.children, key, value)
  })
  return flag
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
