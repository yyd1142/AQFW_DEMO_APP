import * as types from '../mutation-types'
import cloneDeep from 'lodash/cloneDeep';
import api from 'api'

const state = {
    /*
    * 任务状态 1: 待执行，2: 执行中，3: 已完成，未上传 4: 已上传，处理中
              5: 处理完成，待审核，6: 通过审核（已完成） 7: 已超期
    */
    status: 1,
    usedTime: 0, // 已经用时时间
    startTime: 0, // 开始时间，这个时间可能存在作弊，以后优化成使用服务器时间
    endTime: 0, //结束时间，这个时间可能存在作弊，以后优化成使用服务器时间
    currentTask: {}, // 当前执行任务
    builds: [], // 建筑楼层数据
    checkPoints: {}, // 所有巡查点数据（巡查点照片，设备信息）
    deviceResults: {}, // 设备检查后数据模型
    lastDevices: [], // 最后选择的设备列表 [[]]
    lastDevice: {}, // 最后选择的具体设备
    lastCheckPointPhotos: [], // 最后选择的巡查点照片
    lastDeviceRules: [], // 最后选择的设备规则 
    lastCheckPointPositionId: '', // 最后选择的巡查点
    lastCheckPointPosition: {}
}

function compare(property) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}

const getters = {
    usedTimeString: (state) => {
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
        hour = hour <= 9 ? `0${hour}` : hour;
        min = min <= 9 ? `0${min}` : min;
        s = s <= 9 ? `0${s}` : s;
        return `${hour}: ${min}: ${s}`;
    },
    totalUsedTimeString: (state) => {
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
    statusInfo: (state) => {
        let result = {
            status: state.status,
            name: state.currentTask.executorName,
            startTime: new Date(state.currentTask.startTime),
            endTime: new Date(state.currentTask.endTime)
        }
        return result;
    },
    getXCCheckPointHasFinished: (state) => {
        for (let g of state.lastDevices) {
            for (let device of g) {
                if (device.status == 0) {
                    return false;
                }
            }
        }
        return true;
    },
    currentTaskId: (state) => {
        return state.currentTask.taskId;
    },
    taskSurvey: (state) => {
        let total = state.builds.reduce((lastValue, item) => {
            return lastValue + item.positions.length;
        }, 0);
        let undo = 0;
        let problem = 0;
        state.builds.forEach((build) => {
            for (let p of build.positions) {
                if (p.status == 0) {
                    undo += 1
                }
                let key = `CACHE_XUNCHA_CheckPoint_${p.positionId}`;
                let pValue = localStorage.getItem(key);
                if (pValue && pValue.length > 0) {
                    pValue = JSON.parse(pValue);
                    for (let g of pValue.devices) {
                        for (let d of g) {
                            if (d.status == 5) {
                                problem += 1;
                            }
                        }
                    }
                }
            }
        })
        return {
            total: total,
            undo: undo,
            problemNumber: problem
        }
    },
    taskStatus: (state) => {
        return state.status;
    }
}

var startedTimer = false;
var xunchaInterval = null;

const actions = {
    initXunChaTimer({ commit, state }) {
        if (startedTimer)
            return;
        xunchaInterval = setInterval(() => {
            commit(types.XUNCAH_TIME_COUNTDOWN);
        }, 1000);
        startedTimer = true;
    },
    initBuildsByTaskId({ commit, state }, taskId) {
        // 待审核后，强制数据从网络获取
        let cacheKey = `CACHE_XUNCHA_TaskId_${taskId}`;
        let offlineMode = state.status > 0 && state.status < 5;
        if (offlineMode) {
            let value = localStorage.getItem(cacheKey);
            if (value && value.length > 0) {
                let pValue = JSON.parse(value);
                commit(types.XUNCAH_INIT_POSITION_DATA, { taskId: taskId, builds: pValue });
                return;
            }
        }
        api.getXCTaskPosition({
            taskId: taskId
        }).then(res => {
            let positions = res.response;
            let checkPoints = {};
            let builds = [];
            let status = 0;
            for (let p of positions) {
                let v = p.positionName.split('|');
                let v2 = p.positionValue.split('|');
                let k = `${v[0]}${v[1]}`
                let obj = checkPoints[k];
                if (!p.status) {
                    status = 0;
                } else {
                    status = state.status == 6 ? p.status : 0;
                }
                if (obj) {
                    obj.positions.push({
                        positionId: p.positionId,
                        fixedPositionId: p.fixedPositionId,
                        name: v[2],
                        status: status,
                        level: parseInt(v2[1])
                    });
                } else {
                    obj = {
                        jzId: parseInt(v2[0]),
                        title: k,
                        level: parseInt(v2[1]),
                        positions: [{
                            positionId: p.positionId,
                            fixedPositionId: p.fixedPositionId,
                            name: v[2],
                            status: status,
                            level: parseInt(v2[1])
                        }],
                        status: 0
                    };
                    checkPoints[k] = obj;
                }
            }
            for (let k of Object.keys(checkPoints)) {
                builds.push(checkPoints[k]);
            }
            builds.forEach((item) => {
                let level = item.positions[0].level;
                item['level'] = level;
            })
            builds.sort(compare('level'))
            if (offlineMode) {
                localStorage.setItem(cacheKey, JSON.stringify(builds));
            }
            console.log(builds)
            commit(types.XUNCAH_INIT_POSITION_DATA, { taskId: taskId, builds: builds });
        })
    },
    initDevicesByPositionInfo({ commit, state }, params) {
        let cacheKey = `CACHE_XUNCHA_CheckPoint_${params.positionId}`;
        let offlineMode = state.status > 0 && state.status < 5;
        if (offlineMode) {
            let cacheKey = `CACHE_XUNCHA_CheckPoint_${params.positionId}`;
            let value = localStorage.getItem(cacheKey);
            if (value && value.length > 0) {
                let pValue = JSON.parse(value);
                commit(types.XUNCHA_INIT_CHECKPOINT_DATA, { positionId: params.positionId, checkPointData: pValue });
                return;
            }
        }

        api.getXCTaskDeviceByPosition({
            positionId: params.fixedPositionId
        }).then(res => {
            let sourceDevices = res.response.devices;
            let deviceCheckRules = res.response.deviceCheckRules;
            let writeDeviceCheckRulesData = function (device) {
                let cacheKey = `CACHE_XUNCHA_DeviceResult_${params.positionId}_${device.id}`;
                let checkRules = deviceCheckRules[device.unitId.toString()];
                let newCheckRules = [];
                for (let v of checkRules) {
                    newCheckRules.push({
                        value: true,
                        content: v.content,
                        conclusionYes: v.conclusionYes,
                        conclusionNo: v.conclusionNo,
                        needInputData: v.needInputData,
                        dataName: v.dataName ? v.dataName : '',
                        description: '',
                        dataValue: '',
                        images: []
                    })
                }
                localStorage.setItem(cacheKey, JSON.stringify(newCheckRules));
            }

            let groups = new Map();
            for (let device of sourceDevices) {
                let devices = groups.get(device.unitId);
                if (!devices) {
                    devices = [device];
                    groups.set(device.unitId, devices);
                } else {
                    devices.push(device);
                }
                if (device.needInputData == 1)
                    device.status = 0;
                writeDeviceCheckRulesData(device);
            }
            let g = [];
            for (let k of groups.keys()) {
                g.push(groups.get(k));
            }
            let checkPointData = {
                photos: [],
                devices: g
            }
            if (offlineMode) {
                localStorage.setItem(cacheKey, JSON.stringify(checkPointData));
            }
            commit(types.XUNCHA_INIT_CHECKPOINT_DATA, { positionId: params.positionId, checkPointData: checkPointData });
        })
    },
    initDeviceCheckRulesByUnitId({ commit, state }, deviceInfo) {
        let cacheKey = `CACHE_XUNCHA_DeviceResult_${state.lastCheckPointPositionId}_${deviceInfo.deviceId}`;
        let offlineMode = state.status > 0 && state.status < 5;
        if (offlineMode) {
            let value = localStorage.getItem(cacheKey);
            if (value && value.length > 0) {
                let pValue = JSON.parse(value);
                commit(types.XUNCHA_INIT_DEVICE_CHECKRULES, { deviceId: deviceInfo.deviceId, checkRules: pValue });
                return;
            }
        }

        api.getXCTaskDeviceCheckRulesByUnitId({
            unitId: deviceInfo.unitId
        }).then(res => {
            let checkRules = [];
            for (let v of res.response) {
                checkRules.push({
                    value: true,
                    content: v.content,
                    conclusionYes: v.conclusionYes,
                    conclusionNo: v.conclusionNo,
                    needInputData: v.needInputData,
                    dataName: v.dataName ? v.dataName : '',
                    description: '',
                    dataValue: '',
                    images: []
                })
            }
            if (offlineMode) {
                localStorage.setItem(cacheKey, JSON.stringify(checkRules));
            }
            commit(types.XUNCHA_INIT_DEVICE_CHECKRULES, { deviceId: deviceInfo.deviceId, checkRules: checkRules });
        })
    },
    commitXCDeviceCheckResult({ commit, state }) {
        let hasProblem = false;
        for (let rule of state.lastDeviceRules) {
            if (rule.value == false) {
                hasProblem = true;
                break;
            }
        }
        serialization_CACHE_XUNCHA_DeviceResult();
        // 发现问题，将有问题的设备状态改变
        if (hasProblem) {
            commit(types.XUNCHA_ACTION_CHANGE_LASTDEVICE_STATUS, {
                status: 5
            });
            serialization_CACHE_XUNCHA_CheckPoint();
        } else {
            let inputDatas = state.lastDeviceRules.filter((rule) => {
                return rule.needInputData == 1 && (rule.dataValue == undefined || rule.dataValue.length == 0);
            })
            if (inputDatas.length == 0) {
                commit(types.XUNCHA_ACTION_CHANGE_LASTDEVICE_STATUS, {
                    status: 1
                });
            } else {
                commit(types.XUNCHA_ACTION_CHANGE_LASTDEVICE_STATUS, {
                    status: 0
                });
                // 将当前这个巡查点又改回来
                commit(types.XUNCHA_ACTION_CHANGE_POSITION_STATUS, 0);
            }
            serialization_CACHE_XUNCHA_CheckPoint();
        }
    },
    commitXCCheckPoint({ commit, state }) {
        commit(types.XUNCHA_ACTION_CHANGE_POSITION_STATUS, 1);
    },
    dumpTaskData({ commit, state }, callback) {
        let result = {};
        result.taskId = state.currentTask.taskId;
        result.executorName = window.mkoVue.$store.getters.executorAndEmployeeName;
        let positions = [];

        let parsePositionValue = function (positionId) {
            let key = `CACHE_XUNCHA_CheckPoint_${positionId}`;
            let pValue = localStorage.getItem(key);
            if (pValue && pValue.length > 0) {
                pValue = JSON.parse(pValue);
                return pValue;
            }
            return null;
        }

        let parseDeivceResultValue = function (positionId, deviceId) {
            let key = `CACHE_XUNCHA_DeviceResult_${positionId}_${deviceId}`
            let pValue = localStorage.getItem(key);
            if (pValue && pValue.length > 0) {
                pValue = JSON.parse(pValue);
                return pValue;
            }
            return null;
        }

        state.builds.forEach((build) => {
            for (let p of build.positions) {
                let pData = {};
                pData.positionId = p.positionId;
                pData.fixedPositionId = p.fixedPositionId;
                pData.status = p.status;
                pData.completedTime = p.completedTime;
                let pValue = parsePositionValue(p.positionId);
                if (pValue) {
                    pData.images = pValue.photos;
                    pData.devices = [];
                    let problemCount = 0;
                    let deviceCount = 0;
                    for (let g of pValue.devices) {
                        deviceCount += g.length;
                        for (let d of g) {
                            let dData = parseDeivceResultValue(p.positionId, d.id);
                            pData.devices.push({
                                deviceId: d.id,
                                unitId: d.unitId,
                                name: d.unitName,
                                status: d.status,
                                attribute: dData
                            })
                            if (d.status == 5) {
                                problemCount += 1;
                            }
                        }
                    }
                    pData.problemCount = problemCount;
                    pData.deviceCount = deviceCount;
                }
                positions.push(pData);
            }
        })
        result.positions = positions;
        callback(result);
    },
    cleanCache({ commit, state }) {
        let cacheKey = `CACHE_XUNCHA_TaskId_${state.currentTask.taskId}`;
        localStorage.removeItem(cacheKey);
        let allKeys = Object.keys(localStorage);
        state.builds.forEach((build) => {
            for (let p of build.positions) {
                let regex1 = new RegExp(`^CACHE_XUNCHA_DeviceResult_${p.positionId}`);
                let regex2 = new RegExp(`^CACHE_XUNCHA_CheckPoint_${p.positionId}`);
                let findKeys = allKeys.filter(item => {
                    return item.match(regex1) || item.match(regex2);
                })
                for (let key of findKeys) {
                    localStorage.removeItem(key);
                }
            }
        })
    },
    clearXunChaTimer({ commit, state }) {
        if (xunchaInterval) {
            clearInterval(xunchaInterval);
            startedTimer = false;
            commit(types.XUNCHA_ACTION_CELARTIMERR);
        }
    }
}

const mutations = {
    [types.XUNCAH_TIME_COUNTDOWN](state) {
        if (state.status == 2) {
            state.usedTime += 1;
        }
    },
    [types.XUNCHA_ACTION_START](state, { actualStartTime }) {
        state.status = 2;
        state.startTime = actualStartTime;

        if (localStorage.getItem('CacheTasks')) {
            let cacheTasks = JSON.parse(localStorage.getItem('CacheTasks'));
            let bFound = false;
            for (let task of cacheTasks) {
                if (task.taskId === state.currentTask.taskId) {
                    bFound = true;
                    task.actualStartTime = actualStartTime;
                    task.status = 2;
                    break;
                }
            }
            if (bFound) {
                localStorage.setItem('CacheTasks', JSON.stringify(cacheTasks));
            }
        }
    },
    [types.XUNCHA_ACTION_END](state, { actualEndTime }) {
        state.status = 3;
        state.endTime = actualEndTime
    },
    [types.XUNCHA_ACTION_UPLOADED](state) {
        state.status = 4;
    },
    [types.XUNCAH_INIT_POSITION_DATA](state, { taskId, builds }) {
        state.builds = builds;
    },
    [types.XUNCHA_INIT_CHECKPOINT_DATA](state, { positionId, checkPointData }) {
        let key = `${positionId}`;
        state.lastCheckPointPositionId = key;
        state.checkPoints[key] = checkPointData;
        state.lastDevices = checkPointData.devices;
        state.lastCheckPointPhotos = checkPointData.photos;

        for (let build of state.builds) {
            for (let p of build.positions) {
                if (positionId == p.positionId) {
                    state.lastCheckPointPosition = p;
                    return;
                }
            }
        }
    },
    [types.XUNCHA_INIT_DEVICE_CHECKRULES](state, { deviceId, checkRules }) {
        let key = `${deviceId}`;
        state.deviceResults[key] = checkRules;
        state.lastDeviceRules = checkRules;

        for (let g of state.lastDevices) {
            for (let device of g) {
                if (key === device.id.toString()) {
                    state.lastDevice = device;
                    return;
                }
            }
        }
    },
    [types.XUNCHA_ACTION_SWITCH_DEVCIE_STATUS](state, { deviceId, ruleIndex }) {
        state.lastDeviceRules[ruleIndex].value = !state.lastDeviceRules[ruleIndex].value;
    },
    [types.XUNCHA_ACTION_CHANGE_LASTDEVICE_STATUS](state, { status }) {
        state.lastDevice.status = status;
    },
    [types.XUNCHA_INIT_TASK_DATA](state, taskInfo) {
        let cacheKey = `CACHE_XUNCHA_TASKDATA_${taskInfo.taskId}`;
        state.startTime = taskInfo.actualStartTime;
        if (!taskInfo.actualStartTime || taskInfo.actualStartTime == 0) {
            state.startTime = 0;
        } else {
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
    [types.XUNCHA_ACTION_ADD_DEVCIE_COMMENT](state, { index, description }) {
        state.lastDeviceRules[index].description = description;
    },
    [types.XUNCHA_ACTION_ADD_DEVICE_DATAVALUE](state, { index, dataValue }) {
        state.lastDeviceRules[index].dataValue = dataValue;
    },
    [types.XUNCHA_ACTION_ADD_DEVICE_PHOTO](state, { index, url }) {
        state.lastDeviceRules[index].images.push(url);
    },
    [types.XUNCHA_ACTION_REMOVE_DEVICE_PHOTO](state, { index, photoIndex }) {
        state.lastDeviceRules[index].images.splice(photoIndex, 1);
    },
    [types.XUNCHA_ACTION_ADD_PHOTO](state, url) {
        state.lastCheckPointPhotos.push(url);
        serialization_CACHE_XUNCHA_CheckPoint();
    },
    [types.XUNCHA_ACTION_REMOVE_PHOTO](state, photoIndex) {
        state.lastCheckPointPhotos.splice(photoIndex, 1);
        serialization_CACHE_XUNCHA_CheckPoint();
    },
    [types.XUNCHA_ACTION_CHANGE_POSITION_STATUS](state, status) {
        state.lastCheckPointPosition.status = status;
        if (status == 1) {
            state.lastCheckPointPosition.completedTime = Date.now();
        }
        serialization_CACHE_XUNCHA_TaskId();
    },
    [types.XUNCHA_ACTION_UPDATE_CHECKPOINTS_PROBLEM](state, data) {
        let builds = state.builds
        let checkPointsDatas = data.datas
        let yh_amount = 0;
        checkPointsDatas.forEach((checkPointsData) => {
            checkPointsData.forEach((checkPoints) => {
                if (checkPoints.status == 5) {
                    yh_amount++;
                }
            })
        })
        builds.forEach((build) => {
            for (let i = 0; i < build.positions.length; i++) {
                let position = build.positions[i];
                if (position.positionId == data.positionId) {
                    position['yh_amount'] = yh_amount;
                    break;
                }
            }
        })
    },
    [types.XUNCHA_ACTION_CELARTIMERR](state) {
        state.usedTime = 0;
    },
    [types.XUNCHA_ACTION_UPDATE_DEVCIE_ITEM](state, { deviceId, item, index }) {
        let key = `${deviceId}`;
        if(!item.value) {
            state.deviceResults[key][index].description = '';
            state.deviceResults[key][index].images = [];
        }
        state.deviceResults[key][index].value = !item.value;
    }
}

/*  
    序列化到LocalStorge
*/

const serialization_CACHE_XUNCHA_DeviceResult = function () {
    let time1 = new Date();
    let cacheKey = `CACHE_XUNCHA_DeviceResult_${state.lastCheckPointPositionId}_${state.lastDevice.id}`;
    let cacheData = cloneDeep(state.lastDeviceRules);
    let json = JSON.stringify(cacheData);
    localStorage.setItem(cacheKey, json);
    let time2 = new Date();
    console.info(`serialization_CACHE_XUNCHA_DeviceResult 时间: ${(time2.getTime() - time1.getTime()) / 1000} 秒`);
}

const serialization_CACHE_XUNCHA_CheckPoint = function () {
    let time1 = new Date();
    let cacheKey = `CACHE_XUNCHA_CheckPoint_${state.lastCheckPointPositionId}`;
    let cacheData = cloneDeep(state.checkPoints[state.lastCheckPointPositionId]);
    let json = JSON.stringify(cacheData);
    localStorage.setItem(cacheKey, json);
    let time2 = new Date();
    console.info(`serialization_CACHE_XUNCHA_CheckPoint 时间: ${(time2.getTime() - time1.getTime()) / 1000} 秒`);
}

const serialization_CACHE_XUNCHA_TaskId = function () {
    let time1 = new Date();
    let cacheKey = `CACHE_XUNCHA_TaskId_${state.currentTask.taskId}`;
    let cacheData = cloneDeep(state.builds);
    let json = JSON.stringify(cacheData);
    localStorage.setItem(cacheKey, json);
    let time2 = new Date();
    console.info(`serialization_CACHE_XUNCHA_TaskId 时间: ${(time2.getTime() - time1.getTime()) / 1000} 秒`);
}

export default {
    state,
    getters,
    actions,
    mutations
}