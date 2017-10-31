import * as types from 'store/mutation-types'
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import xuncha from 'store/modules/xuncha'
import zhiban from 'store/modules/zhiban'

class MKOAPPState {
    constructor() {
    }
}

var viewTaskDetail = function (task) {
    let self = window.mkoVue;
    if (task.status == 4) {
        self.$MKODialog({
            msg: '数据正在处理中，请稍后查看...'
        });
        return;
    }
    let routerPath = {};
    let taskData = cloneDeep(task);
    if (task.taskType == 2) {
        if (task.status == 5 || task.status == 6) {
            localStorage.setItem('lastReviewXunChaData', JSON.stringify(task));
            localStorage.setItem('lastXunChaTaskId', task.taskId);
            self.$MKOJump(`/xuncha/${task.taskId}?from=tasks&isReview=${true}`)
            return;
        }

        self.$store.registerModule('xuncha', xuncha);
        self.$store.commit(types.XUNCHA_INIT_TASK_DATA, taskData);
        localStorage.setItem('lastXunChaTaskId', task.taskId);
        routerPath = {
            name: 'xuncha',
            params: {
                taskId: task.taskId
            },
            query: {
                from: 'tasks'
            }
        }
    } else if (task.taskType == 1) {
        if (task.status == 5 || task.status == 6) {
            localStorage.setItem('lastReviewZhiBanData', JSON.stringify(task));
            localStorage.setItem('lastZhiBanTaskId', task.taskId);
            self.$MKOJump({
                name: 'zhiban',
                params: {
                    taskId: task.taskId
                },
                query: {
                    from: 'tasks',
                    isReview: true
                }
            })
            return;
        }
        self.$store.registerModule('zhiban', zhiban);
        self.$store.commit(types.ZHIBAN_INIT_DATA, taskData);
        localStorage.setItem('lastZhiBanTaskId', task.taskId);

        routerPath = {
            name: 'zhiban',
            params: {
                taskId: task.taskId
            },
            query: {
                from: 'tasks'
            }
        }
    }
    self.$MKOPush(routerPath, {
        path: `/enter/tasks?listType=1`
    });
}

MKOAPPState.installed = false;

MKOAPPState.install = function (Vue, options) {
    if (MKOAPPState.installed) {
        warn('MKOAPPState already installed!');
        return;
    }
    Vue.prototype.$APPUpdateTime = function (name) {
        name = name === undefined ? 'default' : name;
        var t = new Date()
        var t_s = t.getTime()
        var nt = new Date()
        nt.setTime(t_s + 1000 * 60)   //设置keep-alive状态保持为1分钟
        console.log(`下次${name}_keepalive更新时间为：${moment(nt).format("YYYY-MM-DD HH:mm:ss")}`)
        sessionStorage.setItem(`KEEP_ALIVE_RESET_TIME_${name}`, nt)
    }
    //外部推送消息点击跳转APP页面
    Vue.prototype.$APPLinkPath = function (data, type) {
        // types = ['safeActivity', 'task', 'notice', 'exam', 'hiddenDanger']
        if (type == 'task') {
            viewTaskDetail(data.task);
        } else {
            window.mkoVue.$MKOJump(data.path)
        }
    }
    MKOAPPState.installed = true;
}


// auto install
/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MKOAPPState)
}

export default MKOAPPState;
