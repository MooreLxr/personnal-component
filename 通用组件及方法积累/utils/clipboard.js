import Clipboard from 'clipboard'
import { Message } from 'element-ui'

const clipboardSuccess = (message) => {
  Message.success(message)
}
const clipboardError = (message) => {
  Message.error(message)
}
/**
 * 
 * @param text 复制的内容
 * @param event 复制事件对象
 * @param options 事件提示文案 { successTip: string, errorTip: string }
 */
export function handleClipboard(text, event, options) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess(options?.successTip ?? '复制成功')
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError(options?.errorTip ?? '复制失败')
    clipboard.destroy()
  })
}
