import Vue from "vue";
import MessageBoxVue from './main.vue';

let MessageBoxConstructor = Vue.extend(MessageBoxVue);
let instance, currentMsg;

let defaultCallback = action => {
    if (currentMsg) {
        let callback = currentMsg.callback;
        if (typeof callback === 'function') {
            callback(action);
        }
        if (currentMsg.resolve) {
            if (action === 'confirm') {
                currentMsg.resolve(action);
            } else if (currentMsg.reject && (action === 'cancel' || action === 'close')) {
                currentMsg.reject(action);
            }
        }
    }
}
let initInstance = () => {
    let options = currentMsg.options;
    if (options === undefined || options === null) {
        currentMsg = {
            options: {
                type: 'primary',
                title: '请设置标题',
                content: '请设置内容',
                contentTip:"",
                cancelButtonText: '取消',
                confirmButtonText: '确定'
            }
        }
    }
    instance = new MessageBoxConstructor({
        el: document.createElement('div'),
        data: currentMsg.options
    })
    instance.callback = defaultCallback;
}
let showNextMsg = () => {
    initInstance();
    instance.action = "";
    if (!instance.visible) {
        instance.visible = true;
        document.body.appendChild(instance.$el);
    }
}
let MessageBox = function (options, callback) {
    if (!callback && options.callback) {
        callback = options.callback;
    }

    return new Promise((resolve, reject) => {
        currentMsg = {
            options: options,
            callback: callback,
            resolve: resolve,
            reject: reject
        }
        showNextMsg();
        // instance.$slots.default = [instance.message];
    })
}

MessageBox.openMessageBox = (options) => {
    return MessageBox(options);
}

export default MessageBox;