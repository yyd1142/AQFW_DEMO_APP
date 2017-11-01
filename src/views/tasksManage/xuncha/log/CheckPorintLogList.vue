<template>
    <div class="CheckPorintLogList">
        <div class="placeholder-item"></div>
        <mko-header title="巡查点日志" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <mko-double-cell :title="timeFilter(item.checkValue.completedTime)" :label="solvedProblemCountFilter(item)"
                             :val="executorNameFilter(item.executorName)" v-for="(item, index) in logs"
                             @click="getTaskInfo(item)" is-link></mko-double-cell>
            <no-data v-if="logs.length <= 0"></no-data>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import {NoData} from 'components'
    import moment from 'moment'
    export default {
        data() {
            return {
                logs: [],
                logItem: {}
            }
        },
        mounted() {
            this.xunChaRecordsByPosition()
        },
        activated() {
            this.xunChaRecordsByPosition()
        },
        methods: {
            back() {
                this.$MKOPop()
            },
            xunChaRecordsByPosition() {
                api.xunChaRecordsByPosition({
                    positionId: this.$route.query.fixedPositionId
                }).then(result => {
                    if (!result) return false;
                    if (result.response && result.code == 0) {
                        if (result.response.length <= 0) {
                            this.logs = [];
                        } else {
                            let records = result.response.records;
                            let _records = [];
                            for (let log of records) {
                                log.checkValue = JSON.parse(log.checkValue);
                                if (log.checkValue.completedTime) _records.push(log)
                            }
                            _records.sort((a, b) => {
                                return b.checkValue.completedTime - a.checkValue.completedTime;
                            });
                            this.logs = _records;
                        }
                    } else {
                        this.logs = [];
                    }
                })
            },
            timeFilter(time) {
                if (time) {
                    return moment(time).format('YYYY年MM月DD日 HH:mm')
                } else {
                    return '暂无日期信息'
                }
            },
            solvedProblemCountFilter(item) {
                return `已解决${item.solvedProblemCount}设备<font class="red-font">${item.checkValue.problemCount || 0}个风险</font>`
            },
            getTaskInfo(item) {
                if (this.$route.query.formTmpTask) return false;
                this.logItem = item;
                if (item.checkPointType == 0) {
                    api.getTaskInfo({
                        taskId: item.taskId
                    }).then(res => {
                        if (!res) return false;
                        if (res.code == 0) {
                            this.reViewTask(res.response)
                        } else {
                            this.$MKODialog({msg: '无法查看该日志'});
                        }
                    })
                } else {
                    api.getRoutineTaskInfo({
                        taskId: item.taskId
                    }).then(res => {
                        if (!res) return false;
                        if (res.code == 0) {
                            this.reViewTask(res.response)
                        } else {
                            this.$MKODialog({msg: '无法查看该日志'});
                        }
                    })
                }
            },
            reViewTask(task) {
                if (task.status == 1 || task.status == 2 || task.status == 3 || task.status == 4 || task.status == 7) {
                    this.$MKODialog({msg: '无法查看该日志'});
                    return;
                }
                let taskInfo = [{
                    key: '执行人员', value: task.executorName
                }, {
                    key: '执行日期',
                    value: `${moment(task.startTime).format('YYYY-MM-DD')}-${moment(task.endTime).format('YYYY-MM-DD')}`
                }, {
                    key: '任务描述', value: task.taskDescribe ? task.taskDescribe : task.description
                }]
                this.$MKOPush({
                    name: 'ReviewTmpQiandaoXuncha',
                    params: {
                        id: task.taskId
                    },
                    query: {
                        positionId: this.logItem.positionId,
                        taskInfo: taskInfo,
                        name: task.description,
                        fromPath: this.$route.fullPath,
                        imageId: this.logItem.imageId
                    }
                })
            },
            executorNameFilter(name) {
                if (name.indexOf('|') < 0) return name;
                name = name.split('|');
                return name[1];
            }
        },
        components: {
            NoData
        }
    }
</script>

<style lang="less">
    .CheckPorintLogList {
        .red-font {
            color: #ff4949;
            margin-left: 8px;
        }
    }
</style>
