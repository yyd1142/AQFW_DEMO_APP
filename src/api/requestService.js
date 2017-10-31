/**
 * Created by enjoyzhou on 17-2-16.
 * https://github.com/mzabriskie/axios#request-config
 */
import { Toast } from 'mint-ui'
import Axios from 'axios'
import Conf from '../apiconf'

const Http = (path, method, domain, bHandleError) => {
    return (data, params) => {
        return Axios({
            method: method,
            url: (domain || Conf.domain) + '' + path,
            data: method === 'post' ? data : null,
            params: method === 'get' ? data : params,
            timeout: 10000,
            headers: {'MKOTEAM-ACCESS-TOKEN': localStorage.getItem('qy_token'), 'MKOTEAM-USER-ENVIRONMENT': 'TEST'}
        }).then(function (response) {
            if (response.data.code == 0) {
                return response.data
            } else {
                if (response.data.code == 5) {
                    localStorage.removeItem('qy_token');
                    window.mkoVue.$store.dispatch('logout');
                    Toast('用户会话状态已过期，请重新登录!');
                    let timer = setTimeout(() => {
                        clearTimeout(timer);
                        window.mkoVue.$MKOJump('/login');
                    }, 1500);
                    return response.data;
                }
                if (response.data.code == 1000) {
                    Toast(`系统维护中，预计维护完成时间${response.data.msg}`);
                    let timer = setTimeout(() => {
                        clearTimeout(timer);
                        window.mkoVue.$MKOJump({
                            path: '/login',
                            query: {
                                appState: 1,
                                time: response.data.msg
                            }
                        });
                    }, 1500);
                    return response.data;
                }
                if (bHandleError == true) {
                    return response.data;
                } else if (response.data.code == 12) {
                    Toast(`${response.data.msg}`);
                    return null;
                } else {
                    Toast(`请求数据错误[code:${response.data.code}],${response.data.msg}`)
                    return null;
                }
            }
        }).catch(function (error) {
            let errorString = error.toString();
            if (error.code == "ECONNABORTED") {
                Toast(`请求数据超时，请检查网络连接是否正常!`);
            } else if (errorString.match('^Error: Network Error')) {
                if (path === '/changeTaskStatus') {
                    Toast(`请在网络环境下进行操作`)
                } else {
                    Toast(`网络异常，请检查网络连接是否正常!`)
                }
            } else {
                Toast(`网络异常[${errorString}]，请检查网络是否正常!`)
            }
            return null;
        })
    }
}

export function httpGet(path, domain, bHandleError) {
    return Http(path, 'get', domain, bHandleError)
}

export function httpPost(path, domain, bHandleError) {
    return Http(path, 'post', domain, bHandleError)
}

export function httpPath(path, domain) {
    return (paths) => {
        return Axios({
            method: 'get',
            url: (domain || Conf.domain) + '' + path + '' + paths
        }).then(function (response) {
            let res = response.data
            if (res.code != 0) {
                // bus.$message.error('错误代码:' + res.code + ', ' + res.msg)
            }
            return res
        }).catch(function (error) {
            // bus.$message.error('请求数据失败,请检查网络是否正常!')
            return error
        })
    }
}

export function readFile(path) {
    return (paths) => {
        return Axios.get('/version.json')
            .then(function (response) {
                let res = response.data
                return res
            })
            .catch(function (error) {
                return error
            });
    }
}
