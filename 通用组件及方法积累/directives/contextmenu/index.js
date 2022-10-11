import Vue from 'vue'
import './contextmenu.css'

let opt
Vue.directive('contextmenu', {
  inserted(el, binding, vnode) {
    const contextMenu = document.createElement('div')
    contextMenu.className = 'contextmenu'
    opt = { contextMenu, el, binding, vnode }
    el.addEventListener('contextmenu', handleContext.bind(opt))
  },
  unbind(el, binding) {
    el.removeEventListener('contextmenu', handleContext.bind(opt))
  }
})

function handleContext(e) {
  const { contextMenu, binding, vnode } = this
  if (!binding.value) return
  const target = e.target
  
  if (contextMenu.children.length) {
    contextMenu.removeChild(contextMenu.childNodes[0])
  }
  const ul = document.createElement('ul')
  binding.value.forEach(option => {
    const li = document.createElement('li')
    li.innerText = option.text
    li.className = 'contextmenu-item'
    li.onclick = option && option.handler && option.handler.bind(vnode && vnode.context, option, target)
    ul.appendChild(li)
  })
  contextMenu.appendChild(ul)
  e.preventDefault()

  const menuWidth = +window.getComputedStyle(contextMenu)['width'].replace(/px/, '')
  const menuHeight = +window.getComputedStyle(contextMenu)['height'].replace(/px/, '')
  if (e.clientX + menuWidth >= window.innerWidth) { // 鼠标点击的位置+菜单width超出边界
    contextMenu.style.left = `${e.clientX - menuWidth}px`
  } else {
    contextMenu.style.left = `${e.clientX}px`
  }

  if (e.clientY + menuHeight >= window.innerHeight) { // 鼠标点击的位置+菜单height超出边界
    contextMenu.style.top = `${e.clientY - menuHeight}px`
  } else {
    contextMenu.style.top = `${e.clientY}px`
  }
  contextMenu.style.visibility = 'visible'
  // 移除已存在的contextmenu,保证body中始终只有一个contextmenu
  const exisNode = document.getElementsByClassName('contextmenu')[0]
  if (exisNode) {
    document.body.removeChild(exisNode)
  }
  document.body.appendChild(contextMenu)
  // 设置监听事件，点击空白处移除右键菜单
  window.addEventListener('click', cb)
  
  function cb(e) {
    const is_inner = contextMenu.contains(e.target)
    const is_menu_child = e.target.className === 'contextmenu-item'
    const has_child = contextMenu.childNodes[0]
    // 点击外部空白区域或者子元素，移除右键菜单
    if ((!is_inner || is_menu_child) && has_child) {
      contextMenu.removeChild(contextMenu.childNodes[0])
      document.body.removeChild(contextMenu)
      contextMenu.style.visibility = 'hidden'
      window.removeEventListener('click', cb)
    }
  }
}