<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="$route.query.name ? $route.query.name : '消防设施日常巡查'" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <task-summary :task-info="taskInfo" :status="status">
                <div class="xuncha-review-btn blue" @click.stop="submit" v-if="statusInfo.status == 5 && isAdmin == true && !isFormTask && solvedProblemCount >=  problemCount">
                    <span>审核报告</span>
                </div>
                <div class="xuncha-review-btn yellow" @click.stop="handleYHK" v-if="statusInfo.status == 5 && isAdmin == true && !isFormTask && solvedProblemCount <  problemCount">处理风险</div>
            </task-summary>
            <div class="check-point-wrap" v-for="build in builds">
                <div class="build-name" v-text="build.title"></div>
                <div class="floor" v-for="(position, index) in build.positions" @click="startQianDao(build, position)">
                    <div class="padding floor-wrap">
                        <div class="floor-name">
                            <span class="floor-item">{{position.name}}</span>
                            <span class="device-account yellow-font not-device-data" v-if="position.unsolvedProblemCount > 0">
                                <i class="dingding-yh"></i>{{position.unsolvedProblemCount}}个风险</span>
                            <span class="device-account not-device-data" v-if="position.status == 0">无记录</span>
                            <span class="device-account not-device-data" v-if="position.status == 1 && position.unsolvedProblemCount <= 0">已检查</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { XunChaStatus, TaskSummary } from 'components'
import { Toast } from 'mint-ui';
import { taskStatusFilter, xunchaStatusColor, formatDate } from 'filters';
import api from 'api'
import { mapGetters } from 'vuex'
import * as types from 'store/mutation-types'
import moment from 'moment'
var _taskId = ''
export default {
    data() {
        return {
            active: 'tab-container1',
            builds: '',
            taskSurvey: '',
            actualUploadTime: '',
            statusInfo: {
                status: '',
                name: '',
                startTime: '',
                endTime: ''
            },
            solvedProblemCount: 0,
            problemCount: 0,
            taskInfo: {}
        }
    },
    computed: {
        status() {
            return this.statusInfo.status;
        },
        totalUsedTimeString() {
            if (this.$route.query.isRoutineTask) {
                return this.timeFormatFilter(this.statusInfo.endTime - this.statusInfo.startTime);
            } else {
                return this.timeFormatFilter(this.statusInfo.actualEndTime - this.statusInfo.actualStartTime);
            }
        },
        isAdmin() {
            return this.$store.state.user.isAdmin;
        },
        isFormTask() {
            let isFormTask = null;
            if (this.$route.query.formTask) isFormTask = JSON.parse(this.$route.query.formTask);
            return isFormTask
        },
        isRoutineTask() {
            let isRoutineTask = null;
            if (this.$route.query.isRoutineTask) isRoutineTask = JSON.parse(this.$route.query.isRoutineTask);
            return isRoutineTask
        }
    },
    mounted() {
        if (this.$route.query.isRoutineTask)
            this.initReviewRoutineXuncha();
        else
            this.initReviewXuncha();
    },
    activated() {
        if (this.$route.query.isRoutineTask)
            this.initReviewRoutineXuncha();
        else
            this.initReviewXuncha();
    },
    deactivated() {
        try {
            window.MKODialogShow = false
        }
        catch (err) {
            alert(err);
        }
    },
    methods: {
        startQianDao(build, position) {
            if (position.status == 0) {
                Toast({ message: '未检查，无检查数据！', duration: 2000 })
                return;
            }
            let lastXunChaTaskId = localStorage.getItem('lastXunChaTaskId');
            let nextPath = `/xuncha/${lastXunChaTaskId}/reviewQiaoDaoXuncha`;
            let query = {
                jzId: build.jzId,
                jzLevel: position.level,
                jzPosition: position.name,
                title: build.title + position.name,
                positionId: position.positionId,
                imageId: position.imageId
            }
            this.$MKOPush({
                path: nextPath,
                query: query
            })
        },
        submit() {
            if (this.solvedProblemCount < this.problemCount) {
                this.$MKODialog({
                    title: '提示',
                    msg: `该报告有${this.problemCount - this.solvedProblemCount}个风险未处理，请处理后再确认报告。`
                })
                return false;
            }
            this.$MKODialog({
                title: '提示',
                msg: `<div class="center">确认完成审核该报告吗？</div>`,
                cancelBtn: true,
                cancelText: '取消'
            }).then(msg => {
                if (msg == 'confirm') {
                    let lastXunChaTaskId = localStorage.getItem('lastXunChaTaskId');
                    if (this.isRoutineTask) {
                        api.changeRoutineTaskStatusByTaskId({
                            taskId: lastXunChaTaskId
                        }).then(res => {
                            if (!res) return;
                            if (res.code != 0) {
                                Toast({ message: res.msg, duration: 2000 });
                                return;
                            }
                            Toast({ message: '审核完成', duration: 2000 });
                            sessionStorage.setItem('repoInfoIsUpdate', true);
                            this.$MKOPop();
                        })
                    } else {
                        api.changeTaskStatusByTaskId({
                            taskId: lastXunChaTaskId,
                            status: 6
                        }).then(res => {
                            if (!res) return;
                            if (res.code != 0) {
                                Toast({ message: res.msg, duration: 2000 });
                                return;
                            }
                            Toast({ message: '审核完成', duration: 2000 });
                            sessionStorage.setItem('repoInfoIsUpdate', true);
                            this.$MKOPop();
                        })
                    }
                }
            })
        },
        initReviewXuncha() {
            _taskId = this.$route.params.taskId;
            let statusInfo = JSON.parse(localStorage.getItem('lastReviewXunChaData'));
            this.statusInfo = {
                status: statusInfo.status,
                name: statusInfo.executorName,
                startTime: statusInfo.startTime,
                endTime: statusInfo.endTime,
                actualEndTime: statusInfo.actualEndTime,
                actualStartTime: statusInfo.actualStartTime
            }
            this.actualUploadTime = statusInfo.actualUploadTime;
            this.$nextTick(() => {
                let lastXunChaTaskId = localStorage.getItem('lastXunChaTaskId');
                let fetchCount = 2;
                let builds = [];
                let checkPointResult = {};
                let self = this;
                let fetchDone = function() {
                    if (fetchCount > 0)
                        return;
                    let problemCount = 0;
                    let undoCount = 0;
                    let buildCount = 0;
                    let solvedProblemCount = 0;
                    for (let build of builds) {
                        for (let position of build.positions) {
                            buildCount += 1;
                            for (let checkPoint of checkPointResult) {
                                if (checkPoint.positionId == position.positionId) {
                                    position.imageId = checkPoint.imageId;
                                    let checkValue = checkPoint.checkValue;
                                    // position.checkPointItem = JSON.parse(checkValue);
                                    try {
                                        checkValue = JSON.parse(checkValue);
                                        position.status = checkValue.status;
                                        if (position.status == 0) {
                                            undoCount += 1;
                                        }
                                        let tmpProblemCount = checkValue.problemCount ? checkValue.problemCount : 0;
                                        problemCount += tmpProblemCount;

                                        let tmpSolvedProblemCount = checkPoint.solvedProblemCount;
                                        if (tmpSolvedProblemCount > tmpProblemCount)
                                            tmpSolvedProblemCount = tmpProblemCount;
                                        solvedProblemCount += tmpSolvedProblemCount;

                                        position.unsolvedProblemCount = tmpProblemCount - tmpSolvedProblemCount;
                                    } catch (e) {

                                    }
                                    break;
                                }
                            }
                        }
                    }
                    self.taskSurvey = {
                        total: buildCount,
                        undo: undoCount,
                        problemNumber: problemCount
                    }
                    self.problemCount = problemCount;
                    self.solvedProblemCount = solvedProblemCount;
                    self.builds = builds;
                    self.taskInfo = [{
                        key: '执行人员', value: statusInfo.executorName
                    }, {
                        key: '执行日期', value: moment(statusInfo.startTime).format('YYYY-MM-DD')
                    }, {
                        key: '执行用时', value: self.totalUsedTimeString
                    }, {
                        key: '执行情况', value: `巡查点${buildCount}个，已巡查${buildCount - undoCount}个，发现风险${problemCount}个`
                    }]
                }
                api.getXCTaskPosition({
                    taskId: lastXunChaTaskId
                }).then(res => {
                    if (!res)
                        return;
                    let positions = res.response;
                    let checkPoints = {};
                    for (let p of positions) {
                        let v = p.positionName.split('|');
                        let v2 = p.positionValue.split('|');
                        let k = `${v[0]}${v[1]}`
                        let obj = checkPoints[k];
                        if (obj) {
                            obj.positions.push({
                                positionId: p.positionId,
                                name: v[2],
                                status: p.status,
                                level: parseInt(v2[1])
                            });
                        } else {
                            obj = {
                                jzId: parseInt(v2[0]),
                                title: k,
                                positions: [{
                                    positionId: p.positionId,
                                    name: v[2],
                                    status: p.status,
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
                    fetchCount--;
                    fetchDone();
                });

                api.getXCTaskPositionCheckResult({
                    taskId: lastXunChaTaskId
                }).then(res => {
                    if (!res) return;
                    checkPointResult = res.response;
                    fetchCount--;
                    fetchDone();
                })
            })
        },
        initReviewRoutineXuncha() {
            _taskId = this.$route.params.taskId;
            let xunchaData = JSON.parse(localStorage.getItem('lastReviewXunChaData'));
            this.statusInfo = {
                status: xunchaData.status,
                name: xunchaData.executorName,
                startTime: xunchaData.actualStartTime,
                endTime: xunchaData.actualEndTime
            }
            this.actualUploadTime = xunchaData.actualUploadTime;
            this.$nextTick(() => {
                let lastXunChaTaskId = localStorage.getItem('lastXunChaTaskId');
                let fetchCount = 1;
                let builds = [];
                let checkPointResult = {};
                let self = this;
                let fetchDone = function() {
                    if (fetchCount > 0)
                        return;
                    let problemCount = 0;
                    let undoCount = 0;
                    let buildCount = 0;
                    let solvedProblemCount = 0;
                    for (let build of builds) {
                        for (let position of build.positions) {
                            buildCount += 1;
                            for (let checkPoint of checkPointResult) {
                                if (checkPoint.positionId == position.positionId) {
                                    position.imageId = checkPoint.imageId;
                                    let checkValue = checkPoint.checkValue;
                                    // position.checkPointItem = JSON.parse(checkValue);
                                    try {
                                        checkValue = JSON.parse(checkValue);
                                        position.status = checkValue.status;
                                        if (position.status == 0) {
                                            undoCount += 1;
                                        }
                                        let tmpProblemCount = checkValue.problemCount ? checkValue.problemCount : 0;
                                        problemCount += tmpProblemCount;

                                        let tmpSolvedProblemCount = checkPoint.solvedProblemCount;
                                        if (tmpSolvedProblemCount > tmpProblemCount)
                                            tmpSolvedProblemCount = tmpProblemCount;
                                        solvedProblemCount += tmpSolvedProblemCount;

                                        position.unsolvedProblemCount = tmpProblemCount - tmpSolvedProblemCount;
                                    } catch (e) {

                                    }
                                    break;
                                }
                            }
                        }
                    }
                    self.taskSurvey = {
                        total: buildCount,
                        undo: undoCount,
                        problemNumber: problemCount
                    }
                    self.problemCount = problemCount;
                    self.solvedProblemCount = solvedProblemCount;
                    self.builds = builds;
                    self.taskInfo = [{
                        key: '执行人员', value: xunchaData.executorName
                    }, {
                        key: '执行日期', value: moment(xunchaData.startTime).format('YYYY-MM-DD')
                    }, {
                        key: '执行用时', value: self.totalUsedTimeString
                    }, {
                        key: '执行情况', value: `巡查点${buildCount}个，已巡查${buildCount - undoCount}个，发现风险${problemCount}个`
                    }]
                }

                for (let checkPoint of xunchaData.checkPoints) {
                    builds.push({
                        title: `${checkPoint.jzName}-${checkPoint.level}楼`,
                        jdId: checkPoint.jzId,
                        name: checkPoint.jzName,
                        status: 1,
                        level: checkPoint.level,
                        positions: checkPoint.positions
                    })
                }

                api.getXCTaskPositionCheckResult({
                    taskId: lastXunChaTaskId
                }).then(res => {
                    if (!res) return;
                    checkPointResult = res.response;
                    fetchCount--;
                    fetchDone();
                })
            })
        },
        back() {
            this.$MKOPop();
        },
        timeFormatFilter(value) {
            var theTime = parseInt(value / 3600);// 秒
            var theTime1 = 0;// 分
            var theTime2 = 0;// 小时
            // alert(theTime);
            if (theTime > 60) {
                theTime1 = parseInt(theTime / 60);
                theTime = parseInt(theTime % 60);
                // alert(theTime1+"-"+theTime);
                if (theTime1 > 60) {
                    theTime2 = parseInt(theTime1 / 60);
                    theTime1 = parseInt(theTime1 % 60);
                }
            }
            var result = "" + parseInt(theTime) + "秒";
            if (theTime1 > 0) {
                result = "" + parseInt(theTime1) + "分" + result;
            }
            if (theTime2 > 0) {
                result = "" + parseInt(theTime2) + "小时" + result;
            }
            return result;
        },
        handleYHK() {
            this.$MKOPush({
                name: 'HandleYHK',
                params: {
                    taskId: this.$route.params.taskId
                },
                query: {
                    statusInfo: this.statusInfo
                }
            })
        }
    },
    components: {
        XunChaStatus,
        TaskSummary
    }
}
</script>

<style lang="less" src="./../xuncha.less" scoped>

</style>
