import MessageBox from './src/main';
MessageBox.install = function (Vue) {
    Vue.component(MessageBox.name, MessageBox)
}
export default MessageBox;