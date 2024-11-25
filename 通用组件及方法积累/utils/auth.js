import Cookies from "js-cookie"
const MIXUSERINFO = "MIX_A789_USER" // 二合一TOKEN存的KEY
const TIME_OUT = 3 // 3天过期

export function setLocalStorage(key, value) {
  localStorage.setItem(key, value)
}
export function getLocalStorage(key) {
  return localStorage.getItem(key)
}

export function setCookieUserInfo(info) {
  return Cookies.set(MIXUSERINFO, JSON.stringify(info), { expires: TIME_OUT })
}
export function getCookieUserInfo() {
  return Cookies.get(MIXUSERINFO)
}
// 清除指定cookie
export function removeCookie() {
  return Cookies.remove(MIXUSERINFO)
}
// 清除所有cookie
export function removeAllCookie() {
  const  allCookies = Cookies.get()
  for(const name in allCookies) {
    Cookies.remove(name, { path: '/' })
  }
}
