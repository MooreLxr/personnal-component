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
    console.log('websocket connect success...')
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
    } catch (e) {
      // console.log(e)
    }
  }
  wsClose(e) {
    console.log('websocket connect close...', e)
    this.onclose && this.onclose(e)
    this.reconnect()
  }
  wsError(e) {
    console.log('websocket connect error...', e)
    this.onerror && this.onerror(e)
    this.reconnect()
  }
  // 重连(没连接上会一直重连，设置延迟避免频繁连接)
  reconnect() {
    this.connectTimer && clearTimeout(this.connectTimer)
    this.connectTimer = setTimeout(() => {
      this.count++
      console.log(`第${this.count}次尝试重连！`)
      this.initWebsocket()
    }, 2000)
  }
  // 5s发送一次心跳包，保持连接
  sendHeartBeat() {
    const data = this.heartBeatData
    this.serverTimer && clearTimeout(this.serverTimer)
    this.heartTimer && clearInterval(this.heartTimer)
    this.heartTimer = setInterval(() => {
      console.log('send heart beat')
      this.ws.send(JSON.stringify(data))
      // 服务端过2s没回消息则关闭websocket重连
      this.serverTimer = setTimeout(() => {
        this.ws.close()
      }, 2000)
    }, 5000)
  }
  /**
   * 发送数据
   * @param {*} data 
   */
  sendData(data) {
    this.ws.send(data)
  }
  /**
   * 断开webSocket连接
   */
  close() {
    this.ws.close()
    this.heartTimer && clearInterval(this.heartTimer)
    this.connectTimer && clearTimeout(this.connectTimer)
    this.serverTimer && clearTimeout(this.serverTimer)
  }
}
  
