/**
 * 创建websocket
 * @param {*} opts 
 * 使用说明：
 * import WS from '@/utils/websocket'
 * const wsOpts = {
    wsUrl: `${serverWS}/show`-ability/ws/${mac}`,
    heartBeatData: {},// 心跳包
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
    this.count = 0 // 重连次数
    this.autoCloseFlag = false // 是否是用户主动断开（true:主动断开则不重连 false:因报错或其他原因断开，需要重连）
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
      window.addEventListener('beforeunload', () => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.close()
        }
      })
    } catch(e) {
      // console.log(e)
    }
  }
  wsOpen() {
    // Message.success('服务连接成功')
    this.count = 0 // 连上后重置连接次数
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
    this.reconnect()
  }
  wsError(e) {
    Message.error('服务连接失败，请检查网关')
    this.onerror && this.onerror(e)
    this.reconnect()
  }
  // 重连(没连接上会一直重连，设置延迟避免频繁连接)
  reconnect() {
    if(this.autoCloseFlag) return
    this.connectTimer && clearTimeout(this.connectTimer)
    this.connectTimer = setTimeout(() => {
      Message.warning('正在尝试重新建立连接...')
      this.count++
      this.initWebsocket()
    }, 2000)
  }
  // 5s发送一次心跳包，保持连接
  sendHeartBeat() {
    const data = this.heartBeatData
    this.serverTimer && clearTimeout(this.serverTimer)
    this.heartTimer && clearInterval(this.heartTimer)
    this.heartTimer = setInterval(() => {
      this.ws.send(typeof data === 'string' ? data : JSON.stringify(data))
      // 服务端过2s没回消息则关闭websocket重连
      this.serverTimer = setTimeout(() => {
        this.ws.close()
      }, 10000)
    }, 15000)
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
   * 断开webSocket连接
   */
  close() {
    this.autoCloseFlag = true
    this.ws && this.ws.close()
    this.heartTimer && clearInterval(this.heartTimer)
    this.connectTimer && clearTimeout(this.connectTimer)
    this.serverTimer && clearTimeout(this.serverTimer)
  }
}
