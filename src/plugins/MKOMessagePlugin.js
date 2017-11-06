class MKOMessagePlugin {
    constructor() {
    }
}

MKOMessagePlugin.installed = false;

MKOMessagePlugin.install = function (Vue, options) {
    if (MKOMessagePlugin.installed) {
        warn('MKOMessagePlugin already installed!');
        return;
    }
    let _send = function (success, fail, key, params) {
        return window.cordova.exec(success, fail, 'MKOMessagePlugin', 'message', [key, params]);
    }

    let createCallbackFunction = function (cb) {
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid = [], i;
        let len = 16;
        let radix = chars.length;
        for (i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random() * radix];
        }
        let fName = `F` + uuid.join('');
        window[fName] = function (opts) {
            let value = null;
            try {
                value = JSON.parse(opts);
            } catch (e) {
                console.error('parseCallback JSON fail');
                console.error(`[CALLBACK DATA]: ${opts}`);
            }
            cb(value);
            delete window[fName];
        }
        return `window.${fName}`;
    }

    let _sendMessage = function (key, params) {
        _send((result) => {
            console.info(result);
        }, (error) => {
            console.error(error);
        }, key, params);
    }

    Vue.prototype.$takePhoto = function (callback) {
        let command = {
            type: 'Camera',
            subType: 'TakePhoto',
            callback: createCallbackFunction(callback)
        }
        _sendMessage('notification', command);
    }

    Vue.prototype.$choosePhoto = function (callback) {
        let command = {
            type: 'Camera',
            subType: 'ChoosePhoto',
            callback: createCallbackFunction(callback)
        }
        _sendMessage('notification', command);
    }

    Vue.prototype.$takePhotoAndAddWatermark = function (watermark, callback) {
        let command = {
            type: 'Camera',
            subType: 'TakePhoto',
            watermark: watermark,
            callback: createCallbackFunction(callback)
        }
        _sendMessage('notification', command);
    }

    Vue.prototype.$choosePhotoAndAddWatermark = function (watermark, callback) {
        let command = {
            type: 'Camera',
            subType: 'ChoosePhoto',
            watermark: watermark,
            callback: createCallbackFunction(callback)
        }
        _sendMessage('notification', command);
    }

    Vue.prototype.$uploadXunChaData = function (data, uploadURL, callback) {
        let token = localStorage.getItem('qy_token');
        let command = {
            type: 'Upload',
            subType: 'UploadXunChaData',
            callback: createCallbackFunction(callback),
            uploadURL: uploadURL,
            data: JSON.stringify(data),
            token: token
        }
        _sendMessage('notification', command);
    }

    Vue.prototype.$uploadImages = function (data, uploadURL, callback) {
        let token = localStorage.getItem('qy_token');
        let command = {
            type: 'Upload',
            subType: 'uploadImages',
            callback: createCallbackFunction(callback),
            uploadURL: uploadURL,
            data: JSON.stringify(data),
            token: token
        }
        _sendMessage('notification', command);
    }

    Vue.prototype.$getMobileNetworkType = function (callback) {
        let command = {
            command: 'NetworkType'
        }
        _send((result) => {
            callback(result);
        }, (error) => {
            console.error(error);
        }, 'request', command);
    }

    Vue.prototype.$registerPUSHService = function (tags, userName) {
        let command = {
            type: 'Register',
            subType: 'PushService',
            tags: tags,
            userName: userName
        }
        _sendMessage('notification', command);
    }

    Vue.prototype.$getAppVersion = function (callback) {
        let command = {
            command: 'getAppVersion'
        }
        _send((result) => {
            callback(result);
        }, (error) => {
            console.error(error);
        }, 'request', command);
    }

    Vue.prototype.$MKOJumpOutsideURL = function (url) {
        let command = {
            type: 'JumpOutsideURL',
            url: url
        }
        _sendMessage('notification', command);
    }

    //关闭APP
    Vue.prototype.$MKOShutDownApp = function () {
        let command = {
            type: 'exitApp'
        }
        _sendMessage('notification', command);
    }
    //清理APP储存空间
    Vue.prototype.$MKOClearApp = function (callback) {
        let command = {
            type: 'clearApp'
        }
        _send((result) => {
            callback(result);
        }, (error) => {
            console.error(error);
        }, 'request', command);
    }

    //set app storage.
    Vue.prototype.$setMKOAppStorage = function (key, value) {
        let command = {
            type: 'setAppStorage',
            key: key,
            value: value
        }
        _sendMessage('notification', command);
    }

    //get app storage.
    Vue.prototype.$getMKOAppStorage = function (key) {
        let command = {
            type: 'getAppStorage',
            key: key
        }
        _send((result) => {
            return result;
        }, (error) => {
            console.error(error);
        }, 'request', command);
    }

    //注销账号
    Vue.prototype.$Logout = function () {
        let command = {
            type: 'Logout'
        }
        _sendMessage('notification', command);
    }

    Vue.prototype.$Login = function (userName, groupId) {
        let command = {
            type: 'Login',
            userName: userName,
            groupId: groupId
        }
        _sendMessage('notification', command);
    }
    Vue.prototype.$uploadRoutineXunChaData = function (data, uploadURL, callback) {
        let token = localStorage.getItem('qy_token');
        let command = {
            type: 'Upload',
            subType: 'UploadRoutineTaskData',
            callback: createCallbackFunction(callback),
            uploadURL: uploadURL,
            data: JSON.stringify(data),
            token: token
        }
        _sendMessage('notification', command);
    }

    Vue.prototype.$setUpdateServerUrl = function (url, mode) {
        let command = {
            type: 'setUpdateServerUrl',
            data: url,
            mode: mode
        }
        _sendMessage('notification', command);
    }
    //扫码功能
    Vue.prototype.$ScanQRCode = function (callback) {
        let command = {
            type: 'ScanQRCode'
        }
        _send(result => {
            callback(result);
        }, (error) => {
            console.error(error);
        }, 'request', command);
    }
    MKOMessagePlugin.installed = true;
}


// auto install
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MKOMessagePlugin)
}

export default MKOMessagePlugin;
