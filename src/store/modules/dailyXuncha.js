import * as types from '../mutation-types'
import cloneDeep from 'lodash/cloneDeep'
import api from 'api'

const state = {
    /*
     * 任务状态 1: 待执行，2: 执行中，3: 已完成，未上传 4: 已上传，处理中  5: 处理完成，待审核，6: 通过审核（已完成） 7: 已超期
     */
    startTime: 0,
    usedTime: 0,
    endTime: 0,
    actualStartTime: 0,
    actualEndTime: 0,
    status: 1,
    currentTask: {},
    builds: [],
    checkPointPhotos: [],
    CheckedPointPositionDevices: [],
    lastCheckPointPositionId: '',
    lastDailyXunChaTaskId: '',
    checkPoints: {},
    totalUsedTime: 0,
    deviceDatas: []
}

const getters = {
    dailyXunchaUsedTimer: (state) => {
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
    dailyXunchaStatusInfo: (state) => {
        let result = {
            status: state.status,
            name: state.currentTask.name,
            startTime: new Date(state.startTime),
            endTime: new Date(state.endTime)
        }
        return result;
    },
    dailXunchaTaskStatus: (state) => {
        return state.status;
    },
    daliyXunchaCurrentTask: (state) => {
        return state.currentTask;
    }
}
var startedTimer = false;
var dailyXunchaInterval = null;
const actions = {
    initDailyXunchaTimer({commit, state}) {
        if (startedTimer) return;
        dailyXunchaInterval = setInterval(() => {
            commit(types.DAILYXUNCHA_TIME_COUNTDOWN);
        }, 1000);
        startedTimer = true;
    },
    clearDailyXunchaTimer({commit, state}) {
        if (dailyXunchaInterval) {
            clearInterval(dailyXunchaInterval);
            startedTimer = false;
            commit(types.DAILYXUNCHA_ACTION_CELARTIMERR);
        }
    },
    //初始化日常巡查的所有巡更点
    initDailyXunchaBuildsByTaskId({commit, state}, taskId) {
        let lastDailyXunChaTaskId = localStorage.getItem('lastDailyXunChaTaskId')
        let CacheKey = `CACHE_DAILYXUNCHA_TASK_INFO_${window.mkoVue.$store.getters.userName}_${taskId}`;
        if (localStorage.getItem(CacheKey) && state.status > 1) {
            let builds = JSON.parse(localStorage.getItem(CacheKey)).builds;
            let totalUsedTime = JSON.parse(localStorage.getItem(CacheKey)).totalUsedTime;
            commit(types.DAILYXUNCHA_INIT_POSITION_DATA, builds);
            commit(types.DAILYXUNCHA_INIT_USED_TIME, totalUsedTime)
            commit(types.DAILYXUNCHA_INIT_TIMER); //初始化倒计时模块
            return false;
        }
        var getPositionsByRule = function (id) {
            api.getPositionsByRule({
                ruleId: taskId
            }).then(result => {
                if (!result) return false;
                if (result.code == 0) {
                    let CheckPointPositions = result.response;
                    let builds = [];
                    let jzIDs = [];
                    CheckPointPositions.forEach((item) => {
                        let deviceCounts = [];
                        jzIDs.push(item.jzId);
                        item['show'] = false;
                        item['status'] = 1;
                        item.positions.forEach(position => {
                            position['status'] = 1;
                            deviceCounts.push(position.deviceCount);
                        });
                        item['positionsDeviceCount'] = eval(deviceCounts.join('+'))
                    })
                    jzIDs = Array.from(new Set(jzIDs))
                    for (let item of jzIDs) {
                        let deviceCounts = [];
                        let positionCounts = [];
                        let floors = CheckPointPositions.filter((subItem) => {
                            return subItem.jzId == item
                        });
                        floors.forEach(floor => {
                            deviceCounts.push(floor.positionsDeviceCount);
                            positionCounts.push(floor.positions.length);
                        });
                        floors.sort(function (a, b) {
                            return a.level - b.level
                        });
                        builds.push({
                            jzId: item,
                            jzName: floors[0].jzName ? floors[0].jzName : '',
                            status: 1,
                            floors: floors,
                            totalDeviceCount: eval(deviceCounts.join('+')),
                            totalPositionCounts: eval(positionCounts.join('+'))
                        })
                    }
                    commit(types.DAILYXUNCHA_INIT_POSITION_DATA, builds)
                }
            })
        }
        getPositionsByRule(taskId);

    },
    //下载所有的巡查点设备
    downloadAllDevicesByPositionId({commit, state}, builds) {
        //获取所有设备
        var CACHE_DAILYXUNCHA_DevicesByPositionId = function ({floor, buildIndex, floorIndex}) {
            for (let [positionIndex, item] of floor.positions.entries()) {
                let cacheDevicesByPositionIdKey = `CACHE_DAILYXUNCHA_DevicesByPositionId_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}_${buildIndex}_${floorIndex}_${item.positionId}`;
                let jzPosition = item.name;
                let jzId = floor.jzId;
                let jzLevel = floor.level;
                let CheckedPointPositionDevices = {
                    notChecked: [],
                    hasChecked: [],
                    checkPointPhotos: [],
                    deviceUnits: []
                }
                api.deviceByPostionId({
                    positionId: item.positionId
                }).then(result => {
                    if (!result) return false;
                    if (result.response && result.code == 0) {
                        let datas = result.response;
                        if (datas.devices) {
                            datas.devices = JSON.parse(datas.devices)
                        }
                        if (datas.deviceRules) {
                            datas.deviceRules = JSON.parse(datas.deviceRules)
                        }
                        if (datas.deviceUnits) {
                            datas.deviceUnits = JSON.parse(datas.deviceUnits)
                        }
                        let deviceCheckRules = {}
                        for (let item of datas.devices) {
                            item.deviceId = item.id;
                            deviceCheckRules[item.deviceId.toString()] = [];
                            deviceCheckRules[item.deviceId.toString()].push(datas.deviceRules.filter(subItem => {
                                return subItem.unitId == item.unitId
                            }))
                        }
                        datas.deviceRules = deviceCheckRules;
                        if (datas.devices.length > 0) {
                            CheckedPointPositionDevices.deviceUnits = datas.deviceUnits
                            datas.devices.forEach(device => {
                                let deviceCheckRules = datas.deviceRules[device.deviceId.toString()][0];
                                let deviceCheckRulesDatas = [];
                                for (let rule of deviceCheckRules) {
                                    let params = {
                                        conclusionType: rule.conclusionType,
                                        ruleType: rule.ruleType,
                                        unitId: rule.unitId,
                                        deviceId: rule.deviceId,
                                        status: 1,
                                        show: false,
                                        value: true,
                                        description: '',
                                        dataValue: '',
                                        images: [],
                                        content: rule.content,
                                        conclusionYes: rule.conclusionYes,
                                        conclusionNo: rule.conclusionNo,
                                        needInputData: rule.needInputData,
                                        dataName: rule.dataName
                                    }
                                    deviceCheckRulesDatas.push(params)
                                }
                                let cacheDeviceResultKey = `CACHE_DALIYXUNCHA_DeviceResult_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}_${item.positionId}_${device.deviceId}`
                                localStorage.setItem(cacheDeviceResultKey, JSON.stringify(deviceCheckRulesDatas))
                                device.checked = false;
                                device.checkedHistory = [];
                                device.hasCheckedCount = 0;
                                device.problemCount = 0;
                                device.patrolFrequency = device.patrolFrequency.split('/');
                                device.checkCount = device.checkCount ? device.checkCount : 0;
                                device.needInputData = deviceCheckRules.filter(subItem => {
                                    return subItem.needInputData == 1
                                }).length > 0 ? 1 : 0
                                if (device.checkCount < parseInt(device.patrolFrequency[2])) { //区分设备巡查按照次数显示
                                    CheckedPointPositionDevices.notChecked.push(device)
                                } else {
                                    CheckedPointPositionDevices.hasChecked.push(device)
                                }
                            })
                        } else {
                            //...
                        }
                        commit(types.UPDATE_BUILDS_ID, {datas, buildIndex, floorIndex, positionIndex})
                        localStorage.setItem(cacheDevicesByPositionIdKey, JSON.stringify(CheckedPointPositionDevices))
                    } else {
                        let datas = null;
                        commit(types.UPDATE_BUILDS_ID, {datas, buildIndex, floorIndex, positionIndex})
                        localStorage.setItem(cacheDevicesByPositionIdKey, JSON.stringify(CheckedPointPositionDevices))
                    }
                })
            }
        }
        for (let [buildIndex, build] of builds.entries()) {
            for (let [floorIndex, floor] of build.floors.entries()) {
                CACHE_DAILYXUNCHA_DevicesByPositionId({floor, buildIndex, floorIndex})
            }
        }
    },
    //根据postionsId获取该巡查点的所有设备
    initDailyXunchaDevices({commit, state}, params) {
        let taskId = state.lastDailyXunChaTaskId;
        let CacheKey = `CACHE_DAILYXUNCHA_DevicesByPositionId_${window.mkoVue.$store.getters.userName}_${taskId}_${params.buildIndex}_${params.floorIndex}_${params.positionId}`
        commit(types.DAILYXUNCHA_DEVICES_BY_POSITIONID, JSON.parse(localStorage.getItem(CacheKey)))
        commit(types.DAILYXUNCHA_CHECKPOINPHOTOS, JSON.parse(localStorage.getItem(CacheKey)))
    },
    //根据postionid获取设备巡查的结果
    initDailyXunchaDevicesResults({commit, state}, params) {
        let cacheDeviceResultKey = `CACHE_DALIYXUNCHA_DeviceResult_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}_${params.positionId}_${params.deviceId}`
        let value = JSON.parse(localStorage.getItem(cacheDeviceResultKey));
        commit(types.DAILYXUNCHA_DEVICESRESULTS, value);
    },
    //清除cache
    cleanDailyXunchaCache({commit, state}) {
        let CacheKey = `CACHE_DAILYXUNCHA_TASK_INFO_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}`
        localStorage.removeItem(CacheKey);
        let allKeys = Object.keys(localStorage);
        let regex1 = new RegExp(`^CACHE_DAILYXUNCHA_DevicesByPositionId_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}`);
        let regex2 = new RegExp(`^CACHE_DALIYXUNCHA_DeviceResult_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}`);
        let findKeys = allKeys.filter(item => {
            return item.match(regex1) || item.match(regex2);
        })
        for (let key of findKeys) {
            localStorage.removeItem(key);
        }
    }
}

const mutations = {
    [types.DAILYXUNCHA_TIME_COUNTDOWN](state) {
        if (state.status == 2) {
            state.usedTime += 1;
        }
    },
    //初始化日常巡查任务的数据
    [types.DAILYXUNCHA_INIT_TASK_DATA](state, taskInfo) {
        localStorage.setItem('lastDailyXunChaTaskId', taskInfo.taskId);
        state.startTime = taskInfo.startTime;
        state.lastDailyXunChaTaskId = taskInfo.taskId;
        if (!taskInfo.startTime || taskInfo.startTime == 0) {
            state.startTime = 0;
        } else {
            if (taskInfo.endTime > 0) {
                state.endTime = taskInfo.endTime;
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
    [types.DAILYXUNCHA_ACTION_START](state, actualStartTime) {
        state.status = 2;
        state.actualStartTime = actualStartTime;
        state.usedTime = 0;
        serialization_CACHE_DAILYXUNCHA_actualStartTime(actualStartTime);
    },
    [types.DAILYXUNCHA_ACTION_END](state, time) {
        let CacheKey = `CACHE_DAILYXUNCHA_TASK_INFO_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}`;
        let json = JSON.parse(localStorage.getItem(CacheKey));
        let actualStartTime = json.actualStartTime ? json.actualStartTime : 0;
        let s = parseInt((time - actualStartTime) / 1000);
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
        let getProblemDeviceCount = function (floor) {
            let counts = []
            for (let item of floor.positions) {
                counts.push(item.problemDeviceCount ? item.problemDeviceCount : 0)
            }
            return eval(counts.join('+'))
        }
        for (let build of state.builds) {
            for (let floor of build.floors) {
                floor['problemDeviceCount'] = getProblemDeviceCount(floor);
            }
        }
        state.status = 3;
        state.actualEndTime = time;
        state.totalUsedTime = `${hour}小时${min}分${s}秒`;
        serialization_CACHE_DAILYXUNCHA_actualEndTime();
        serialization_CACHE_DAILYXUNCHA_totalUsedTime();
        serialization_UPDATE_CACHE_DAILYXUNCHA_INFO();
    },
    [types.DAILYXUNCHA_INIT_POSITION_DATA](state, builds) {
        state.builds = builds;
        serialization_UPDATE_CACHE_DAILYXUNCHA_INFO()
    },
    [types.OPEN_DAILYXUNCHA_POSITION_DATA](state, {buildIndex, floorIndex, show}) {
        state.builds[buildIndex].floors[floorIndex].show = !show;
    },
    [types.DAILYXUNCHA_ACTION_CELARTIMERR](state) {
        state.usedTime = 0;
    },
    [types.DAILYXUNCHA_INIT_CHECKPOINT_DATA](state, data) {
        state.CheckedPointPositionDevices = data;
    },
    [types.DAILYXUNCHA_ACTION_ADD_PHOTO](state, params) {
        state.checkPointPhotos.push(params.url);
        state.CheckedPointPositionDevices.checkPointPhotos.push(params.url)
        serialization_CACHE_DAILYXUNCHA_CheckPoint(params);
    },
    [types.DAILYXUNCHA_ACTION_REMOVE_PHOTO](state, params) {
        state.checkPointPhotos.splice(params.photoIndex, 1)
        state.CheckedPointPositionDevices.checkPointPhotos.splice(params.photoIndex, 1)
        serialization_CACHE_DAILYXUNCHA_CheckPoint(params);
    },
    [types.DAILYXUNCHA_TASK_STATUS](state, taskStatus) {
        state.status = taskStatus;
    },
    [types.DAILYXUNCHA_DEVICES_BY_POSITIONID](state, datas) {
        state.CheckedPointPositionDevices = datas;
    },
    [types.DAILYXUNCHA_CHECKPOINPHOTOS](state, datas) {
        if (datas.checkPointPhotos) {
            state.checkPointPhotos = datas.checkPointPhotos;
        } else {
            state.checkPointPhotos = [];
        }
    },
    [types.DAILYXUNCHA_CHECKED_DEVICE](state, params) {
        state.CheckedPointPositionDevices.notChecked[params.index].checked = !params.checked;
        state.CheckedPointPositionDevices.notChecked[params.index].status = params.checked ? 0 : 1;
    },
    [types.DAILYXUNCHA_CONFIRM_DEVICES](state, params) {
        let hasChecked = state.CheckedPointPositionDevices.hasChecked
        let notChecked = state.CheckedPointPositionDevices.notChecked
        let positions = state.builds[params.buildIndex].floors[params.floorIndex].positions;
        let completedTime = new Date().getTime();
        for (let [index, item] of notChecked.entries()) {
            if (item.checked === true) {
                item.isTodayChecked = true;
                item['lastCheckTime'] = completedTime
                state.CheckedPointPositionDevices.hasChecked.push(item)
            }
        }
        state.CheckedPointPositionDevices.notChecked = notChecked.filter(subItem => {
            return subItem.checked == false
        })
        for (let position of positions) {
            if (position.positionId == params.positionId) {
                position['completedTime'] = completedTime
            }
        }
        state.builds[params.buildIndex].floors[params.floorIndex].positions = positions;
        serialization_UPDATE_CACHE_DAILYXUNCHA_INFO();
        serialization_CheckedPointPositionDevices_CheckedBox(params);
    },
    [types.DAILYXUNCHA_ALL_CHECKED_DEVICE](state, params) {
        for (let item of state.CheckedPointPositionDevices.notChecked) {
            item.checked = params.isAllChecked;
            item.status = params.isAllChecked ? 1 : 0;
        }
    },
    [types.DAILYXUNCHA_DEVICESRESULTS](state, datas) {
        state.deviceDatas = datas;
    },
    [types.DAILYXUNCHA_CHANGE_DEVICERESULT_STATUS](state, {item, index}) {
        let deviceData = state.deviceDatas[index];

        deviceData.show = !deviceData.show;
        deviceData.status = item.status == 1 ? 2 : 1;
        // state.deviceDatas[index].value = !item.value;
        // state.deviceDatas[index].status = item.status == 1 ? 2 : 1;
        // state.deviceDatas[index].show = !item.show;
        deviceData.value = deviceData.show == true ? false : true;
    },
    [types.DAILYXUNCHA_DEVICERESULT_ADD_PHOTOS](state, {index, url}) {
        state.deviceDatas[index].images.push(url);
    },
    [types.DAILYXUNCHA_DEVICERESULT_REMOVE_PHOTOS](state, {deviceDatasIndex, index}) {
        state.deviceDatas[deviceDatasIndex].images.splice(index, 1);
    },
    [types.DAILYXUNCHA_DEVICERESULT_ADD_DESC](state, {index, description}) {
        state.deviceDatas[index].description = description;
    },
    [types.DAILYXUNCHA_DEVICERESULT_ADD_DATAVALUE](state, {index, dataValue}) {
        state.deviceDatas[index].dataValue = dataValue;
    },
    [types.DAILYXUNCHA_CONFIRM_DEVICERESULT](state, params) {
        let problemCount = 0
        for (let item of state.deviceDatas) {
            if (item.status == 2) {
                problemCount += 1
            }
        }
        for (let [index, item] of state.CheckedPointPositionDevices.notChecked.entries()) {
            if (item.deviceId === params.deviceId) {
                item.checkedHistory.push({
                    lastCheckTime: new Date().getTime(),
                    datas: state.deviceDatas
                })
                item.problemCount = problemCount;
                item.isTodayChecked = true;
                item.lastCheckTime = new Date().getTime();
                item.status = problemCount == 0 ? 1 : 0;
                state.CheckedPointPositionDevices.hasChecked.push(item)
                state.CheckedPointPositionDevices.notChecked.splice(index, 1)
            }
        }
        serialization_CheckedPointPositionDevices_CheckedBox(params)
        serialization_CACHE_DAILYXUNCHA_DEVICERESULT(params)
        // serialization_InitDeviceResultCache(params)
    },
    [types.DAILYXUNCHA_DEVICE_HISTORY](state, {index}) {
        let checkedHistory = state.CheckedPointPositionDevices.hasChecked[index].checkedHistory
        if (checkedHistory.length > 0) {
            state.deviceDatas = checkedHistory[checkedHistory.length - 1].datas;
        }
    },
    [types.DAILYXUNCHA_DEVICEHISTORYRESULTS](state, params) {
        let CacheKey = `CACHE_DALIYXUNCHA_DeviceResult_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}_${params.positionId}_${params.deviceId}`
        let json = JSON.parse(localStorage.getItem(CacheKey))
        state.deviceDatas = json
    },
    [types.DAILYXUNCHA_CONFIRM_HISTORY_DEVICERESULT](state, params) {
        let problemCount = 0
        for (let item of state.deviceDatas) {
            if (item.status == 2) {
                problemCount += 1
            }
        }
        for (let [index, item] of state.CheckedPointPositionDevices.hasChecked.entries()) {
            if (item.deviceId === params.deviceId) {
                item.checkedHistory = [{
                    checkTime: new Date().getTime(),
                    datas: state.deviceDatas
                }]
                item.problemCount = problemCount;
            }
        }
        serialization_CheckedPointPositionDevices_CheckedBox(params)
        serialization_CACHE_DAILYXUNCHA_DEVICERESULT(params);
    },
    [types.DAILYXUNCHA_CANCEL_CHANGE_DEVICERESULT_STATUS](state, {item, index}) {
        state.deviceDatas[index].description = ''
        state.deviceDatas[index].images = []
        state.deviceDatas[index].dataValue = ''
        state.deviceDatas[index].status = 1
        state.deviceDatas[index].show = false
    },
    [types.DAILYXUNCHA_UPDATE_PROBLEMDEVICECOUNT](state, params) {
        for (let position of state.builds[params.buildIndex].floors[params.floorIndex].positions) {
            if (position.positionId === params.positionId) {
                position['problemDeviceCount'] = params.problemDeviceCount ? params.problemDeviceCount : 0;
                position.status = 2; //1：未检查 2：已检查
            }
        }
        serialization_UPDATE_CACHE_DAILYXUNCHA_INFO()
    },
    [types.DAILYXUNCHA_UPLOAD_TASK](state, callback) {
        let taskInfo = serialization_TASKCACHEDETAIL();
        callback(taskInfo);
        state.status = 4;
    },
    [types.DAILYXUNCHA_ACTION_UPLOADED](state) {
        state.status = 4;
    },
    [types.UPDATE_BUILDS_ID](state, {datas, buildIndex, floorIndex, positionIndex}) {
        if (datas) {
            state.builds[buildIndex].floors[floorIndex].positions[positionIndex]['id'] = datas.id;
        }
        serialization_UPDATE_CACHE_DAILYXUNCHA_INFO();
    },
    [types.DAILYXUNCHA_INIT_TIMER](state) {
        if (state.status == 2) {
            let CacheKey = `CACHE_DAILYXUNCHA_TASK_INFO_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}`;
            let json = JSON.parse(localStorage.getItem(CacheKey))
            let dateNow = new Date();
            if (json.actualStartTime && json.actualStartTime != 0) {
                state.usedTime = parseInt((dateNow.getTime() - json.actualStartTime) / 1000);
                state.actualStartTime = json.actualStartTime;
            } else {
                state.usedTime = 0;
            }
        }
    },
    [types.DAILYXUNCHA_INIT_USED_TIME](state, time) {
        state.totalUsedTime = time;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}


//序列化
const serialization_CACHE_DAILYXUNCHA_CheckPoint = function (params) {
    let CacheKey = `CACHE_DAILYXUNCHA_DevicesByPositionId_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}_${params.buildIndex}_${params.floorIndex}_${params.positionId}`;
    let value = JSON.parse(localStorage.getItem(CacheKey));
    value['checkPointPhotos'] = state.checkPointPhotos;
    let cacheData = cloneDeep(value);
    let json = JSON.stringify(cacheData);
    localStorage.setItem(CacheKey, json);
}

const serialization_CACHE_DAILYXUNCHA_actualStartTime = function (actualStartTime) {
    let CacheKey = `CACHE_DAILYXUNCHA_TASK_INFO_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}`
    let task = JSON.parse(localStorage.getItem(CacheKey));
    task.status = state.status;
    task.actualStartTime = actualStartTime;
    localStorage.setItem(CacheKey, JSON.stringify(task));
}

const serialization_CACHE_DAILYXUNCHA_actualEndTime = function () {
    let CacheKey = `CACHE_DAILYXUNCHA_TASK_INFO_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}`
    let task = JSON.parse(localStorage.getItem(CacheKey));
    task.status = state.status;
    task.actualEndTime = state.actualEndTime;
    localStorage.setItem(CacheKey, JSON.stringify(task));
}

const serialization_CheckedPointPositionDevices_CheckedBox = function (params) {
    let CacheKey = `CACHE_DAILYXUNCHA_DevicesByPositionId_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}_${params.buildIndex}_${params.floorIndex}_${params.positionId}`;
    let value = JSON.parse(localStorage.getItem(CacheKey));
    value = state.CheckedPointPositionDevices;
    localStorage.setItem(CacheKey, JSON.stringify(value))
}

const serialization_CACHE_DAILYXUNCHA_DEVICERESULT = function (params) {
    let CacheKey = `CACHE_DALIYXUNCHA_DeviceResult_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}_${params.positionId}_${params.deviceId}`
    localStorage.setItem(CacheKey, JSON.stringify(state.deviceDatas))
}

const serialization_InitDeviceResultCache = function (params) {
    let CacheKey = `CACHE_DALIYXUNCHA_DeviceResult_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}_${params.positionId}_${params.deviceId}`
    let json = JSON.parse(localStorage.getItem(CacheKey));
    for (let item of json) {
        item.status = 1
        item.description = ''
        item.dataValue = ''
        item.show = false
        item.images = []
    }
    localStorage.setItem(CacheKey, JSON.stringify(json))
}

const serialization_UPDATE_CACHE_DAILYXUNCHA_INFO = function () {
    let CacheKey = `CACHE_DAILYXUNCHA_TASK_INFO_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}`
    let task = {}
    if (localStorage.getItem(CacheKey)) {
        task = JSON.parse(localStorage.getItem(CacheKey));
    } else {
        task = state.currentTask;
    }
    task['builds'] = state.builds;
    localStorage.setItem(CacheKey, JSON.stringify(task));
}

const serialization_TASKCACHEDETAIL = function () {
    let positions = [];
    let getAttribute = function (json) {
        let attribute = [];
        for (let item of json) {
            attribute.push({
                value: !item.show,
                content: item.content,
                conclusionYes: item.conclusionYes,
                conclusionNo: item.conclusionNo,
                needInputData: item.needInputData,
                dataName: item.dataName,
                description: item.description,
                dataValue: item.dataValue,
                images: item.images
            })
        }
        return attribute;
    }
    let getAllDevices = function ({data, positionId}) {
        let devices = [];
        let allDevices = data.hasChecked.concat(data.notChecked);
        let datas = allDevices.filter(subItem => {
            return subItem.isTodayChecked == true
        }); //只上传今天巡查了的设备哦
        if (datas.length <= 0) return [];
        let deviceUnitsFilter = function (id) {
            let unitName = null;
            for (let unit of data.deviceUnits) {
                unitName = unit.unitID == id ? unit.unitName : null
            }
            ;
            return unitName;
        }
        for (let device of datas) {
            let cacheKey = `CACHE_DALIYXUNCHA_DeviceResult_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}_${positionId}_${device.deviceId}`
            let json = JSON.parse(localStorage.getItem(cacheKey));
            devices.push({
                attribute: getAttribute(json),
                deviceId: device.deviceId,
                unitId: device.unitId,
                lastCheckTime: device.lastCheckTime,
                name: deviceUnitsFilter(device.unitId),
                status: device.status
            })
        }
        return devices;
    }
    let getAllPositions = function ({buildIndex, floorIndex, floor}) {
        for (let position of floor.positions) {
            let cacheKey = `CACHE_DAILYXUNCHA_DevicesByPositionId_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}_${buildIndex}_${floorIndex}_${position.positionId}`
            let data = JSON.parse(localStorage.getItem(cacheKey));
            let positionId = position.positionId;
            if (position.status === 2) {
                positions.push({
                    positionId: position.positionId,
                    fixedPositionId: position.positionId,
                    id: position.id,
                    problemCount: position.problemDeviceCount ? position.problemDeviceCount : 0,
                    deviceCount: position.deviceCount,
                    completedTime: position.completedTime,
                    status: position.status === 2 ? 1 : 0,
                    name: position.name,
                    images: data.checkPointPhotos,
                    devices: getAllDevices({data, positionId})
                })
            }
        }
    }
    for (let [buildIndex, build] of state.builds.entries()) {
        for (let [floorIndex, floor] of build.floors.entries()) {
            getAllPositions({buildIndex, floorIndex, floor})
        }
    }
    let taskInfo = {
        ruleId: state.lastDailyXunChaTaskId,
        actualStartTime: state.actualStartTime,
        actualEndTime: state.actualEndTime,
        executorName: window.mkoVue.$store.getters.executorAndEmployeeName,
        positions: positions
    }
    return taskInfo;
}

const serialization_CACHE_DAILYXUNCHA_totalUsedTime = function () {
    let CacheKey = `CACHE_DAILYXUNCHA_TASK_INFO_${window.mkoVue.$store.getters.userName}_${state.lastDailyXunChaTaskId}`
    let task = JSON.parse(localStorage.getItem(CacheKey));
    task.totalUsedTime = state.totalUsedTime;
    localStorage.setItem(CacheKey, JSON.stringify(task));
}
