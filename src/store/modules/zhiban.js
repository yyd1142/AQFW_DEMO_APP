import * as types from '../mutation-types'
import api from 'api'
import moment from 'moment'
import { Toast } from 'mint-ui'
const state = {
    startTime: 0, // 开始时间，这个时间可能存在作弊，以后优化成使用服务器时间
    endTime: 0, //结束时间，这个时间可能存在作弊，以后优化成使用服务器时间
    status: 1, // 状态 0: 时间未到，不许开始 1: 未开始 2: 已经开始  3: 已经完成 4: 待审核 5: 已经超时 
    usedTime: 0, // 已经用时时间
    taskId: '',
    formData: {},
    currentTask: {}
}

const getters = {
    zhibanUsedTimer: (state) => {
        let hour = 0;
        let s = state.usedTime;
        if (s > 3600) {
            hour = parseInt(s / 3600);
            s = s - (hour * 3600);
        }
        let min = 0;
        if (s >= 60) {
            min = parseInt(s / 60);
            s = s - (min * 60);
        }
        return `已用时${hour}小时${min}分${s}秒`;
    },
    zhibanTotalUsedTimeString: (state) => {
        let s = state.usedTime;
        let hour = 0;
        if (s > 3600) {
            hour = parseInt(s / 3600);
            s = s - (hour * 3600);
        }
        let min = 0;
        if (s >= 60) {
            min = parseInt(s / 60);
            s = s - (min * 60);
        }
        return `${hour}小时${min}分${s}秒`;
    },
    zhibanStatusInfo: (state) => {
        let result = {
            status: state.status,
            name: state.currentTask.executorName,
            startTime: moment(state.currentTask.startTime).format("YYYY-MM-DD HH:mm"),
            endTime: moment(state.currentTask.endTime).format("YYYY-MM-DD HH:mm")
        }
        return result;
    },
    currentZhiBanTaskId: (state) => {
        return state.currentTask.taskId;
    }
}

var startedTimer = false;
var zhiBanInterval = null;

const actions = {
    initZhiBanTimer({ commit, state }) {
        if (startedTimer)
            return;
        zhiBanInterval = setInterval(() => {
            commit(types.ZHIBAN_TIME_COUNTDOWN);
        }, 1000);
        startedTimer = true;
    },
    clearZhiBanTimer( {commit, state} ){
        if (zhiBanInterval){
            clearInterval(zhiBanInterval);
            startedTimer = false;
            commit(types.ZHIBAN_ACTION_CELARTIMERR);
        }
    }
}

const mutations = {
    [types.ZHIBAN_INIT_DATA](state, taskInfo) {
        let cacheKey = `CACHE_ZHIBAN_TASKDATA_${taskInfo.taskId}`;
        state.startTime = taskInfo.actualStartTime;
        if (!taskInfo.actualStartTime || taskInfo.actualStartTime == 0){
            state.startTime = 0;
        }else {
            if (taskInfo.actualEndTime > 0) {
                state.endTime = taskInfo.actualEndTime;
                state.usedTime = parseInt((state.endTime - state.startTime) / 1000);
            } else {
                // 这个时间可能导致问题，因为取的是本地的时间
                let dateNow = new Date();
                state.usedTime = parseInt((dateNow.getTime() - state.startTime) / 1000);
            }
        }
        state.status = taskInfo.status;
        state.currentTask = taskInfo;
    },
    [types.ZHIBAN_TIME_COUNTDOWN](state) {
        if (state.status == 2) {
            state.usedTime += 1;
        }
    },
    [types.ZHIBAN_ACTION_START](state) {
        state.status = 2;
        state.currentTask.status = 2;
    },
    [types.ZHIBAN_ACTION_END](state) {
        state.status = 8;
        state.currentTask.status = 8;
    },
    [types.ZHIBAN_INIT_TASK_DATA](state, taskInfo) {
        state.startTime = taskInfo.actualStartTime;
        if (!taskInfo.actualStartTime)
            state.startTime = 0;
        if (taskInfo.actualEndTime > 0) {
            state.endTime = taskInfo.actualEndTime;
            state.usedTime = parseInt((state.endTime - state.startTime) / 1000);
        } else {
            // 这个时间可能导致问题，因为取的是本地的时间
            let dateNow = new Date();
            state.usedTime = parseInt((dateNow.getTime() - state.startTime) / 1000);
        }
        state.status = taskInfo.status;
        state.currentTask = taskInfo;
    },
    [types.ZHIBAN_ACTION_CELARTIMERR](state) {
        state.usedTime = 0;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}