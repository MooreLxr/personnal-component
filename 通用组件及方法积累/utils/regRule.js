// 生成正则规则数据
export function createRule(fieldList) {
  let rules = {}
  fieldList.forEach(item => {
    let fieldRules = []
    if (item.required) {
      fieldRules.push({ required: true, message: `请输入${item.name}`, trigger: ['blur','change'] })
    }
    if (item.valueType === 2) { // 数值
      fieldRules.push({ type: 'number', required: true, message: `请输入${item.name}`, trigger: ['blur','change'] })
    }
    if (item.valueType === 32) { // 手机
      fieldRules.push({ validator: phoneValidate, trigger: ['blur','change'] })
    }
    if (item.valueType === 64) { // 邮箱
      fieldRules.push({ validator: emailValidate, trigger: ['blur','change'] })
    }
    // 正则表达式
    if (item.regular) {
      item.regular = item.regular.replace(/\//g,'')
      fieldRules.push({
        validator: (rule, value, callback) => {
          if (value && !new RegExp(item.regular).test(value)) {
            callback(new Error(`${item.name}格式输入有误`))
          }
          callback()
        }, trigger: ['blur','change']
      })
    }
    if (fieldRules.length) {
      rules[item.fieldName] = fieldRules
    }
  })
  return rules
}

// 电话号码正则校验
export function phoneValidate(rule, value, callback) {
  var reg = /^1[3578][01379]\d{8}|(134[012345678]\d{7}|1[34578][012356789]\d{8})$/g
  if (value && !reg.test(value)) {
    callback('电话格式输入有误')
  } else {
    callback()
  }
}
// 邮箱正则校验
export function emailValidate(rule, value, callback) {
  var reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (value && !reg.test(value)) {
    callback('邮箱格式输入有误')
  } else {
    callback()
  }
}