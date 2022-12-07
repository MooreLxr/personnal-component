/**
 * 创建websocket
 * @param {*} opts 
 * 使用说明：
 * import CreateWebsocket from '@/utils/websocket'
 * const wsOpts = {
    wsUrl: `${serverWS}/show-ability/ws/${mac}`,
    heartBeatData: {},// 心跳包
    onopen: () => {},
    onmessage: (result) => this.wsMessage(result),
    onclose: () => {},
    onerror: () => {}
  }
  this.ws = new CreateWebsocket(wsOpts)
 */

const CreateWebsocket = function(opts) {
  this.wsUrl = opts.wsUrl // websocket连接地址
  this.heartBeatData = opts.heartBeatData // 心跳数据
  this.onopen = opts.onopen
  this.onmessage = opts.onmessage
  this.onclose = opts.onclose
  this.onerror = opts.onerror
  this.ws = null // websocket实例
  this.connectTimer = null // 重连定时器
  this.heartTimer = null // 发送心跳包定时器
  this.serverTimer = null // 服务端回复消息定时器
  this.count = 0 // 重连次数
  this.initWebsocket()
}
CreateWebsocket.prototype = {
  initWebsocket() {
    const _this = this
    try {
      this.ws = new WebSocket(this.wsUrl)
      this.ws.onopen = wsOpen
      this.ws.onmessage = wsMessage
      this.ws.onclose = wsClose
      this.ws.onerror = wsError
      // 监听窗口关闭事件，窗口关闭时主动关闭websocket连接
      window.onbeforeunload = () => {
        if(this.ws.readState === WebSocket.OPEN) {
          this.ws.close()
        }
      }
    } catch(e) {
      console.log(e)
    }
    function wsOpen() {
      console.log('websocket connect success...')
      _this.count = 0 // 连上后重置连接次数
      sendHeartBeat() // 连接后不断心跳检测
      _this.onopen && _this.onopen()
    }
    function wsMessage(e) {
      // 接收到任何消息，心跳检测重置
      sendHeartBeat()
      try {
        const result = JSON.parse(e.data)
        _this.onmessage && _this.onmessage(result)
      } catch (e) {
        console.log(e)
      }
    }
    function wsClose(e) {
      console.log('websocket connect close...', e)
      _this.onclose && _this.onclose(e)
      reconnect()
    }
    function wsError(e) {
      console.log('websocket connect error...', e)
      _this.onerror && _this.onerror(e)
      reconnect()
    }
    // 重连(没连接上会一直重连，设置延迟避免频繁连接)
    function reconnect() {
      _this.connectTimer && clearTimeout(_this.connectTimer)
      _this.connectTimer = setTimeout(() => {
        _this.count++
        console.log(`第${_this.count}次尝试重连！`)
        _this.initWebsocket()
      }, 2000)
    }
    // 5s发送一次心跳包，保持连接
    function sendHeartBeat() {
      const data = _this.heartBeatData
      _this.serverTimer && clearTimeout(_this.serverTimer)
      _this.heartTimer && clearInterval(_this.heartTimer)
      _this.heartTimer = setInterval(() => {
        console.log('send heart beat')
        _this.ws.send(JSON.stringify(data))
        // 服务端过2s没回消息则关闭websocket重连
        _this.serverTimer = setTimeout(() => {
          _this.ws.close()
        }, 2000)
      }, 5000)
    }
  },
  /**
   * 发送数据
   * @param {*} data 
   */
  sendData(data) {
    this.ws.send(data)
  },
  close() {
    this.ws.close()
  }
}

export default CreateWebsocket
