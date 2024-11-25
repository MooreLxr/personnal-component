
// 生成正则规则数据
export function createRule(fieldList, pKey = '') {
  let rules = {}
  fieldList.forEach(item => {
    let fieldRules = []
    if (item.required) {
      fieldRules.push({ required: true, message: `请输入${item.name}`, trigger: ['blur','change'] })
    }
    if (item.valueType === 2) { // 数值
      fieldRules.push({ validator: numberValidate, trigger: ['blur','change'] })
    }
    if (item.valueType === 32) { // 手机
      fieldRules.push({ validator: phoneValidate, trigger: ['blur','change'] })
    }
    if (item.valueType === 64) { // 邮箱
      fieldRules.push({ validator: emailValidate, trigger: ['blur','change'] })
    }
    if (item.valueType === 16) { // 域名
      fieldRules.push({ validator: domainValidate, trigger: ['blur','change'] })
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
      rules[pKey + item.fieldName] = fieldRules
    }
  })
  return rules
}
// number类型校验
export function numberValidate(rule, value, callback) {
  const reg = /^(\-|\+)?\d+$/
  if (value && !reg.test(value)) {
    callback('请输入数字值')
  } else {
    callback()
  }
}
// 电话号码正则校验
export function phoneValidate(rule, value, callback) {
  const reg = /^1[3578][01379]\d{8}|(134[012345678]\d{7}|1[34578][012356789]\d{8})$/g
  if (value && !reg.test(value)) {
    callback('电话格式输入有误')
  } else {
    callback()
  }
}
// 邮箱正则校验
export function emailValidate(rule, value, callback) {
  const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (value && !reg.test(value)) {
    callback('邮箱格式输入有误')
  } else {
    callback()
  }
}
// 域名正则校验
export function domainValidate(rule, value, callback) {
  const reg = /^([0-9a-zA-Z-]{1,}\.)+([a-zA-Z]{2,})$/
  if (value && !reg.test(value)) {
    callback('域名格式输入有误')
  } else {
    callback()
  }
}
// 身份证正则校验
export function identityCardValidate(rule, value, callback) {
  const reg = /^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/
  if (value && !reg.test(value)) {
    callback('身份证号格式输入有误')
  } else {
    callback()
  }
}
