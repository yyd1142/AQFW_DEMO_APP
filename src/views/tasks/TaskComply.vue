<template>
    <div class="taskComply">
        <div class="placeholder-item"></div>
        <mko-header title="任务执行" left-icon="icon-back" right-icon-text="执行记录"
                    @handleRightClick="linkPath('/taskHistory')" @handleLeftClick="back" v-if="isAdmin"></mko-header>
        <mko-header title="任务执行" right-icon-text="执行记录" @handleRightClick="linkPath('/taskHistory')"
                    v-else></mko-header>
        <div class="page-wrap">
            <ul class="tasks-table-view">
                <li class="tasks-table-cell" v-if="xunchaTasks.length > 0">
                    <div class="title">巡查任务</div>
                    <div class="padding">
                        <div class="tasks-item" v-for="cell, index in xunchaTasks" @click="viewXunchaTask(cell)">
                            <span class="name">{{cell.name ? cell.name : cell.description}}
                                <span v-if="cell.deviceCount">({{cell.deviceCount}})</span>
                            </span>
                            <span class="task-type">
                                <span class="item" v-text="cell.isRoutine == 1 ? '临时任务' : '日常任务'"></span>
                                <span class="time" v-if="cell.isRoutine == 1">{{cell.endTime | formatDate('YYYY-MM-DD')}} 截止</span>
                            </span>
                            <div class="account">
                                <div class="item" v-if="cell.isRoutine && cell.isRoutine == 1">
                                    <span style="color: #3399FF"
                                          v-if="cell.executedName">{{cell.executedName}}正在进行中</span>
                                    <span :style="{color: xcTaskStyleFilter(cell.status)}"
                                          v-else>{{cell.status | taskStatusFilter}}</span>
                                </div>
                                <span class="item" v-else>{{cell.needCheckDeviceCount || 0}}</span>
                                <i class="icon icon-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="tasks-table-cell" v-if="zhibanTasks.length > 0">
                    <div class="title">值班任务</div>
                    <div class="padding">
                        <div class="tasks-item" v-for="cell, index in zhibanTasks" @click="viewZhibanTask(cell)">
                            <span class="name">{{cell.name ? cell.name : cell.description}}
                            </span>
                            <span class="task-type">
                                <span class="item" v-text="cell.type == 0 ? '临时任务' : '日常任务'"></span>
                                <span class="time"
                                      v-if="cell.type == 0">{{cell.endTime | formatDate('YYYY-MM-DD')}} 截止</span>
                            </span>
                            <div class="account">
                                <div class="item">
                                    <span
                                        :style="{color: zbTaskStyleFilter(cell.status)}">{{cell.status | taskStatusFilter}}</span>
                                </div>
                                <i class="icon icon-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <tabs actived="tasks" v-if="!isAdmin"></tabs>
    </div>
</template>

<script>
    import api from 'api'
    import moment from 'moment'
    import zhiban from 'store/modules/zhiban'
    import xuncha from 'store/modules/xuncha'
    import dailyXuncha from 'store/modules/dailyXuncha'
    import * as types from 'store/mutation-types'
    import cloneDeep from 'lodash/cloneDeep'
    import {Tabs} from 'components'
    import {Indicator} from 'mint-ui'
    var Promise = require("bluebird");
    export default {
        data() {
            return {
                xunchaTasks: [],
                zhibanTasks: []
            }
        },
        activated() {
            this.getTaskList();
            if (this.$store.state.dailyXuncha) {
                this.$store.dispatch('clearDailyXunchaTimer');
                this.$store.unregisterModule('dailyXuncha');
            }
            if (this.$store.state.zhiban) {
                this.$store.dispatch('clearZhiBanTimer');
                this.$store.unregisterModule('zhiban', zhiban);
            }
            if (this.$store.state.xuncha) {
                this.$store.dispatch('clearXunChaTimer');
                this.$store.unregisterModule('xuncha');
            }
        },
        deactivated() {
            Indicator.close();
        },
        computed: {
            isAdmin() {
                return this.$store.state.user.isAdmin;
            }
        },
        methods: {
            back() {
                this.$MKOPop()
            },
            linkPath(path) {
                this.$MKOPush(path)
            },
            getTaskList() {
                let self = this;
                let fetchAll = {
                    routineXunchaTask: api.getRoutineMyList(),
                    myTask: api.getMyTask({
                        date: moment(new Date()).format("YYYY-MM-DD")
                    })
                }
                Promise.props(fetchAll).then(result => {
                    let routineXunchaTask = result.routineXunchaTask;
                    let myTask = result.myTask;
                    let xunchaTasks = [];
                    let zhibanTasks = [];
                    if (routineXunchaTask.code == 0) {
                        if (routineXunchaTask.response && routineXunchaTask.response.length > 0) {
                            for(let item of routineXunchaTask.response) {
                                if(item.ruleId === 0) item.name = `${item.name}（默认）`;
                            }
                            xunchaTasks = routineXunchaTask.response;
                        }
                    }
                    if (myTask.code == 0) {
                        for (let task of myTask.response) {
                            task['isRoutine'] = 1;
                            if (task.taskType == 2) {
                                xunchaTasks.push(task);
                            } else {
                                zhibanTasks.push(task)
                            }
                        }
                    }
                    self.xunchaTasks = xunchaTasks;
                    self.zhibanTasks = zhibanTasks;
                })
            },
            getTaskComplyList() {
                api.getTaskComplyList({}).then(result => {
                    if (!result) return false;
                    if (result.code == 0) {
                        this.tasks = result.response.datas;
                    } else {
                        this.tasks = []
                    }
                })
            },
            viewXunchaTask(task) {
                if (task.status == 1 && task.executedName) {
                    this.$MKODialog({title: '提示', msg: `${task.executedName}正在执行中...`})
                    return false;
                }
                // Indicator.open({ spinnerType: 'fading-circle' });
                if (task.isRoutine && task.isRoutine == 1) {
                    //临时任务执行
                    if (task.status == 5 || task.status == 6) {
                        let name = 'xuncha'
                        localStorage.setItem('lastReviewXunChaData', JSON.stringify(task));
                        localStorage.setItem('lastXunChaTaskId', task.taskId);
                        Indicator.close();
                        this.$MKOPush({
                            name: name,
                            params: {
                                taskId: task.taskId
                            },
                            query: {
                                from: 'taskComply',
                                fromQuery: this.$route.query,
                                isReview: true
                            }
                        })
                        return;
                    }
                    if (task.status == 4) {
                        this.$MKODialog({title: '提示', msg: '数据正在处理中，请稍后查看...'})
                        Indicator.close();
                        return;
                    }
                    let routerPath = {};
                    let taskData = cloneDeep(task);
                    this.$store.registerModule('xuncha', xuncha);
                    this.$store.commit(types.XUNCHA_INIT_TASK_DATA, taskData);
                    localStorage.setItem('lastXunChaTaskId', task.taskId);
                    routerPath = {
                        name: 'xuncha',
                        params: {
                            taskId: task.taskId
                        },
                        query: {
                            from: 'taskComply',
                            fromPath: this.$route.fullPath,
                            name: task.description,
                            taskDescribe: task.taskDescribe ? task.taskDescribe : task.description
                        }
                    }
                    Indicator.close();
                    this.$MKOPush(routerPath, {
                        path: '/taskComply'
                    });
                } else {
                    //日常任务
                    let CacheKey = `CACHE_DAILYXUNCHA_TASK_INFO_${this.$store.getters.userName}_${task.ruleId}`;
                    if (localStorage.getItem(CacheKey)) this.initClearDailyXunchaCache(task.ruleId); //判断是否已经过期，清除旧的cache
                    if (!localStorage.getItem(CacheKey)) {
                        task['status'] = 1;
                        task['taskId'] = task.ruleId
                        task['endTime'] = new Date().getTime();
                        task['startTime'] = new Date().getTime();
                    } else {
                        let json = JSON.parse(localStorage.getItem(CacheKey))
                        task['status'] = json.status;
                        task['taskId'] = json.ruleId
                        task['endTime'] = json.endTime;
                        task['startTime'] = json.startTime;
                    }
                    let taskData = cloneDeep(task);
                    this.$nextTick(() => {
                        this.$store.registerModule('dailyXuncha', dailyXuncha);
                        this.$store.commit(types.DAILYXUNCHA_INIT_TASK_DATA, taskData);
                    })
                    Indicator.close();
                    this.$MKOPush({
                        name: 'StartDailyXuncha',
                        params: {
                            id: task.taskId
                        },
                        query: {
                            name: encodeURI(task.name)
                        }
                    });
                }
            },
            viewZhibanTask(task) {
                if (task.status == 8) {
                    this.$MKODialog({title: '提示', msg: '其他值班人员未执行完此任务'})
                    return false;
                }
                if (task.status == 5 || task.status == 6) {
                    let name = 'zhiban'
                    localStorage.setItem('lastReviewZhiBanData', JSON.stringify(task));
                    localStorage.setItem('lastZhiBanTaskId', task.taskId);
                    Indicator.close();
                    this.$MKOPush({
                        name: name,
                        params: {
                            taskId: task.taskId
                        },
                        query: {
                            from: 'taskComply',
                            fromQuery: this.$route.query,
                            fromPath: this.$route.fullPath,
                            isReview: true,
                            needReview: false,
                            name: task.description,
                            taskDescribe: task.taskDescribe ? task.taskDescribe : '暂无'
                        }
                    })
                    return;
                }
                if (task.status == 4) {
                    this.$MKODialog({title: '提示', msg: '数据正在处理中，请稍后查看...'})
                    Indicator.close();
                    return;
                }
                let routerPath = {};
                let taskData = cloneDeep(task);
                this.$store.registerModule('zhiban', zhiban);
                this.$store.commit(types.ZHIBAN_INIT_DATA, taskData);
                localStorage.setItem('lastZhiBanTaskId', task.taskId);
                routerPath = {
                    name: 'zhiban',
                    params: {
                        taskId: task.taskId
                    },
                    query: {
                        from: 'taskComply',
                        fromPath: this.$route.fullPath,
                        name: task.description,
                        taskDescribe: task.taskDescribe ? task.taskDescribe : '暂无'
                    }
                }
                Indicator.close();
                this.$MKOPush(routerPath, {
                    path: `/taskComply`
                });
            },
            xcTaskStyleFilter(status) {
                let classNames = ['#ccc', '#ccc', '#3399FF', '#FFBB00', '#FF6666', '#FFBB00', '#57DA6D', '#FF6666'];
                return classNames[status];
            },
            zbTaskStyleFilter(status) {
                //  [1: 待执行，2: 执行中，3: 已完成，未上传 4: 已上传，处理中  5: 处理完成，待审核，6: 通过审核（已完成） 7: 已超期 8: 等待队友]
                let classNames = ['#ccc', '#ccc', '#57DA6D', '#FFBB00', '#FF6666', '#FFBB00', '#57DA6D', '#FF6666', '#57DA6D'];
                return classNames[status];
            },
            initClearDailyXunchaCache(lastDailyXunChaTaskId) {
                let CacheKey = `CACHE_DAILYXUNCHA_TASK_INFO_${window.mkoVue.$store.getters.userName}_${lastDailyXunChaTaskId}`
                let date = new Date();
                date.setHours(0, 0, 0, 0);
                let json = JSON.parse(localStorage.getItem(CacheKey));
                if (json.actualStartTime && date.getTime() >= json.actualStartTime) {
                    localStorage.removeItem(CacheKey);
                    let allKeys = Object.keys(localStorage);
                    let regex1 = new RegExp(`^CACHE_DAILYXUNCHA_DevicesByPositionId_${window.mkoVue.$store.getters.userName}_${lastDailyXunChaTaskId}`);
                    let regex2 = new RegExp(`^CACHE_DALIYXUNCHA_DeviceResult_${window.mkoVue.$store.getters.userName}_${lastDailyXunChaTaskId}`);
                    let findKeys = allKeys.filter(item => {
                        return item.match(regex1) || item.match(regex2);
                    })
                    for (let key of findKeys) {
                        localStorage.removeItem(key);
                    }
                }
            }
        },
        components: {
            Tabs
        }
    }
</script>

<style lang="less" scoped>
    @import "../../config.less";

    .taskComply {
        .tasks-table-view {
            width: 100%;
            .tasks-table-cell {
                width: 100%;
                .title {
                    width: 100%;
                    font-size: 12px;
                    color: #666666;
                    letter-spacing: 0px;
                    line-height: 12px;
                    height: 34px;
                    padding: 14px 0 6px 14px;
                }
                .padding {
                    width: 100%;
                    padding: 0 0 0 14px;
                    background-color: #ffffff;
                    .tasks-item {
                        width: 100%;
                        .border-btm(@borderGray);
                        height: 60px;
                        &:last-child::after {
                            content: none;
                        }
                        .name {
                            font-size: 14px;
                            color: #333333;
                            letter-spacing: 0px;
                            line-height: 14px;
                            width: 100%;
                            display: block;
                            padding-top: 11px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            padding-right: 130px;
                            box-sizing: border-box;
                        }
                        .task-type {
                            width: 100%;
                            display: block;
                            position: relative;
                            margin-top: 4px;
                            .item {
                                background: #F8F8F8;
                                border: 1px solid #CCCCCC;
                                border-radius: 4px;
                                font-size: 11px;
                                color: #666666;
                                letter-spacing: 0px;
                                line-height: 18px;
                                width: 54px;
                                height: 20px;
                                display: block;
                                text-align: center;
                            }
                            .time {
                                font-size: 12px;
                                color: #999999;
                                letter-spacing: 0px;
                                position: absolute;
                                top: 0;
                                left: 60px;
                                bottom: 0;
                                height: 12px;
                                line-height: 12px;
                                margin: auto;
                            }
                        }
                        .account {
                            .icon {
                                position: absolute;
                                right: 14px;
                                bottom: 23px;
                            }
                            .item {
                                color: #3399FF;
                                font-size: 14px;
                                position: absolute;
                                right: 30px;
                                top: 0;
                                height: 14px;
                                bottom: 0;
                                margin: auto;
                                line-height: 14px;
                                &.is-no-upload {
                                    color: #FFAA44;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>

