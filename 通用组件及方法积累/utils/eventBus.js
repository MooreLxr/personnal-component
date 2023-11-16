/**
 * 事件总线
 * 使用：
 * import { eventBus } from '@/utils/eventBus.js'
 * eventBus.$emit('updateCount', 1)
 * const updateCountEvent = (val) => this.count = val
 * eventBus.$on('updateCount', updateCountEvent)
 * eventBus.$off('updateCount', updateCountEvent)
 */

class EventBus {
  constructor() {
    this.events = {};
  }

  // 订阅事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  // 发布事件
  emit(eventName, eventData) {
    const eventCallbacks = this.events[eventName];
    if (eventCallbacks) {
      eventCallbacks.forEach(callback => {
        callback(eventData);
      });
    }
  }

  // 取消订阅事件
  off(eventName, callback) {
    const eventCallbacks = this.events[eventName];
    if (eventCallbacks) {
      this.events[eventName] = eventCallbacks.filter(cb => cb !== callback);
    }
  }
}

export const eventBus = new EventBus()