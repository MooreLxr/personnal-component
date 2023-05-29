import Vue from 'vue'

Vue.directive('resize', {
  inserted(el, binding) {
    let width = ''
    let height = ''
    function resize() {
      const style = document.defaultView.getComputedStyle(el)
      if (width != style.width || height != style.height) {
        binding.value()
      }
      width = style.width
      height = style.height
    }
    el.__vueSetInterval__ = setInterval(resize, 300)
  },
  unbind(el) {
    clearInterval(el.__vueSetInterval__)
  }
})
