/**
 * 创建websocket
 * 1.支持失败重连
 * 2.心跳包检测
 * 3.断网重连
 * @param {*} opts 
 * 使用说明：
 * import WS from '@/utils/websocket'
 * const wsOpts = {
    wsUrl: `${serverWS}/show`-ability/ws/${mac}`,
    heartBeatData: { type: 'heartbeat', data: 'ping' },// 心跳包
    onopen: () => {},
    onmessage: (result) => this.wsMessage(result),
    onclose: () => {},
    onerror: () => {}
  }
  this.ws = new WS(wsOpts)
 */
import { Message } from 'element-ui'

export default class WS {
  constructor(options) {
    this.wsUrl = options.wsUrl // websocket连接地址
    this.heartBeatData = options.heartBeatData // 心跳数据
    this.onopen = options.onopen
    this.onmessage = options.onmessage
    this.onclose = options.onclose
    this.onerror = options.onerror
    this.ws = null // websocket实例
    this.connectTimer = null // 重连定时器
    this.heartTimer = null // 发送心跳包定时器
    this.serverTimer = null // 服务端回复消息定时器
    this.heartBeatInterval = 15000 // 发送心跳包时间间隔
    this.reconnectInterval = 10000 // 重连时间间隔
    this.reconnectAccout = 0 // 重连次数
    this.autoCloseFlag = false // 是否是用户主动断开（true:主动断开则不重连 false:因报错或其他原因断开，需要重连）
    window.addEventListener('offline', () => this.detectNetWork(false))
    window.addEventListener('online', () => this.detectNetWork(true))
    this.initWebsocket()
  }
  initWebsocket() {
    try {
      this.ws = new WebSocket(this.wsUrl)
      this.ws.onopen = () => this.wsOpen()
      this.ws.onmessage = (e) => this.wsMessage(e)
      this.ws.onclose = (e) => this.wsClose(e)
      this.ws.onerror = (e) => this.wsError(e)
      // 监听窗口关闭事件，窗口关闭时主动关闭websocket连接
      window.onbeforeunload = () => {
        if(this.ws.readState === WebSocket.OPEN) {
          this.ws.close()
        }
      }
    } catch(e) {
      // console.log(e)
    }
  }
  wsOpen() {
    console.log('服务连接成功...')
    this.reconnectAccout = 0 // 连上后重置连接次数
    this.connectTimer && clearTimeout(this.connectTimer) // 连接上后取消重连定时器
    this.sendHeartBeat() // 连接后不断心跳检测
    this.onopen && this.onopen()
  }
  wsMessage(e) {
    // 接收到任何消息，心跳检测重置
    this.sendHeartBeat()
    try {
      const result = JSON.parse(e.data)
      this.onmessage && this.onmessage(result)
    } catch (err) {
      this.onmessage && this.onmessage(e.data)
    }
  }
  wsClose(e) {
    console.log('websocket connect close...', e)
    this.onclose && this.onclose(e)
    this.closeHeartBeat()
    this.reconnect()
  }
  wsError(e) {
    Message.error('服务连接失败，请检查网关')
    this.onerror && this.onerror(e)
    this.closeHeartBeat()
    this.reconnect()
  }
  // 重连(没连接上会一直重连，设置延迟避免频繁连接)
  reconnect() {
    if(this.autoCloseFlag) return
    this.connectTimer && clearTimeout(this.connectTimer)
    this.connectTimer = setTimeout(() => {
      Message.warning('正在尝试重新建立连接...')
      this.reconnectAccout++
      this.initWebsocket()
    }, this.reconnectInterval)
  }
  // 5s发送一次心跳包，保持连接
  sendHeartBeat() {
    const data = this.heartBeatData
    this.serverTimer && clearTimeout(this.serverTimer)
    this.heartTimer && this.closeHeartBeat()
    this.heartTimer = setInterval(() => {
      this.ws.send(typeof data === 'string' ? data : JSON.stringify(data))
      // 服务端过2s没回消息则关闭websocket重连
      this.serverTimer = setTimeout(() => {
        this.ws.close()
      }, 10000)
    }, this.heartBeatInterval)
  }
   // 停止发送心跳包
   closeHeartBeat() {
    this.heartTimer && clearInterval(this.heartTimer)
    this.heartTimer = null
  }
  /**
   * 发送数据
   * @param {*} data 
   */
  sendData(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data)
    } else {
      console.log('websocket connection is not open.')
    }
  }
  /**
   * 检测网络变化
   */
  detectNetWork(isConnect) {
    if (isConnect) {
      Message.success('网络连接恢复，服务正在重连中')
      this.initWebsocket()
    } else {
      Message.error('网络连接断开')
      //linux系统网络断开时无法自动检测wsError，需要手动调用重连
      if (String(navigator.platform).indexOf('Linux') > -1) {
        this.reconnect()
      }
    }
  }
  /**
   * 断开webSocket连接
   */
  close() {
    this.autoCloseFlag = true
    this.ws && this.ws.close()
    this.closeHeartBeat()
    this.connectTimer && clearTimeout(this.connectTimer)
    this.serverTimer && clearTimeout(this.serverTimer)
    window.removeEventListener('offline', () => this.detectNetWork(false))
    window.removeEventListener('online', () => this.detectNetWork(true))
  }
}
