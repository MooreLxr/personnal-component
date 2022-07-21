import Vue from 'vue'

Vue.prototype.$globalEventBus = new Vue()

// 触发事件
this.$globalEventBus.$emit('custom-event1', 111)
this.$globalEventBus.$emit('custom-event2', 222)

// 监听事件
this.$globalEventBus.$on('custom-event1', val => {
  console.log(val)
})
this.$globalEventBus.$on('custom-event2', val => {
  console.log(val)
})

// 解除监听 （beforeDestroy时需要移除监听事件）
this.$globalEventBus.$off('custom-event1')
this.$globalEventBus.$off('custom-event2')

