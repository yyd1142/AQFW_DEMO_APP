<template>
    <div class="StartDailyXuncha">
        <div class="placeholder-item"></div>
        <mko-header :title="decodeURI($route.query.name)" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <timer :status="status" :used-timer="dailyXunchaUsedTimer"></timer>
            <task-summary :task-info="taskInfo" :style="{marginTop: (status == 2 ? '30px' : 0)}"
                          v-if="status != 3"></task-summary>
            <transition name="fade">
                <task-summary :task-info="taskCheckedInfo" :status="status" v-if="status == 3">
                    <div class="xuncha-review-btn blue" @click.stop="uploadTask">
                        <span>立即上传</span>
                    </div>
                </task-summary>
            </transition>
            <div class="check-point-wrap" v-for="build, buildIndex  in builds">
                <div class="build-name" v-text="build.jzName || '暂无建筑名称'"></div>
                <div class="build-device-count" v-if="build.totalPositionCounts != 0">共{{build.totalPositionCounts}}个巡查点</div>
                <div class="floor" v-for="floor, floorIndex in build.floors">
                    <div class="padding floor-wrap" @click.stop="open(buildIndex, floorIndex, floor.show)">
                        <div class="floor-name">
                            <span class="item">{{floor.level}}层</span>
                            <span class="device-account yellow-font"
                                  v-if="floor.problemDeviceCount && status == 3">{{floor.problemDeviceCount}}个风险</span>
                            <span class="device-account"
                                  v-if="status <= 2">{{floor.positions ? `${floor.positions.length}个巡查点` : ''}}</span>
                            <i class="icon icon-link-arrow-up"></i>
                        </div>
                    </div>
                    <transition name="fade">
                        <div class="padding" v-if="floor.show">
                            <ul class="check-point-table">
                                <li class="check-point-cell" v-for="checkPoint in floor.positions"
                                    @click.stop="viewQiandao(checkPoint, buildIndex, floorIndex)">
                                    <i class="icon icon-police-uncle"></i>
                                    <span class="name" v-text="checkPoint.name"></span>
                                    <span class="device-account"
                                          v-if="checkPoint.needCheckDeviceCount > 0">{{checkPoint.needCheckDeviceCount}}个设备必须巡查</span>
                                    <span class="device-account" v-else>{{checkPoint.deviceCount == 0 ? '暂无设备需巡查' : `${checkPoint.deviceCount}个设备可巡查`}}</span>
                                    <i :class="checkPoint.status == 1 ? 'icon-not-qiandao' : 'icon-is-qiandao'"></i>
                                    <i class="icon icon-link-arrow"></i>
                                </li>
                            </ul>
                        </div>
                    </transition>
                </div>
            </div>
            <div class="not-qiaoDaoXunChaData" v-if="builds.length <= 0">新创建的日常巡查将在第二天零点生效</div>
            <div class="xuncha-btn" :class="builds.length <= 0 ? 'disabled' : ''" @click.stop="actionTask"
                 v-if="status == 1">
                <span>开始巡查</span>
            </div>
            <div class="xuncha-btn end" @click.stop="actionTask" v-if="status == 2">
                <span>结束巡查</span>
            </div>
        </div>
    </div>
</template>

<script>
    import api from "api";
    import {Toast} from "mint-ui";
    import {mapGetters} from "vuex";
    import * as types from "store/mutation-types";
    import {Timer, TaskSummary} from "components";
    import apiconf from "apiconf";
    import moment from "moment";
    var timer = null;
    var i = 0;
    export default {
        data() {
            return {};
        },
        computed: {
            status() {
                return this.$store.state.dailyXuncha ? this.$store.state.dailyXuncha.status : 0;
            },
            builds() {
                return this.$store.state.dailyXuncha ? this.$store.state.dailyXuncha.builds : [];
            },
            dailyXunchaUsedTimer() {
                return this.$store.state.dailyXuncha ? this.$store.getters.dailyXunchaUsedTimer : null;
            },
            dailyXunchaTotalUsedTime() {
                return this.$store.state.dailyXuncha ? this.$store.state.dailyXuncha.totalUsedTime : null;
            },
            daliyXunchaCurrentTask() {
                return this.$store.state.dailyXuncha ? this.$store.getters.daliyXunchaCurrentTask : {};
            },
            dailyXunchaStatusInfo() {
                return this.$store.state.dailyXuncha ? this.$store.getters.dailyXunchaStatusInfo : {};
            },
            totalDevices() {
                let devices = {
                    totalPositionsCount: 0,
                    totalDeviceCount: 0,
                    problemDeviceCount: 0,
                    hasCheckedDeviceCount: 0
                };
                let totalPositionsCount = []
                let totalDeviceCount = [];
                let problemDeviceCount = [];
                let hasCheckedDeviceCount = [];
                let builds = this.builds;
                let getHasCheckedDeviceCount = function (positions) {
                    for (let position of positions) {
                        if (position.status == 2) {
                            hasCheckedDeviceCount.push(position);
                        }
                    }
                    return hasCheckedDeviceCount.length;
                };
                for (let build of builds) {
                    totalDeviceCount.push(build.totalDeviceCount);
                    devices.totalDeviceCount = eval(totalDeviceCount.join("+"));
                    for (let floor of build.floors) {
                        problemDeviceCount.push(floor.problemDeviceCount);
                        totalPositionsCount.push(floor.positions.length);
                        devices.hasCheckedDeviceCount = getHasCheckedDeviceCount(floor.positions);
                        devices.problemDeviceCount = eval(problemDeviceCount.join("+"));
                        devices.totalPositionsCount = eval(totalPositionsCount.join("+"));
                    }
                }
                return devices;
            },
            taskInfo() {
                let taskInfo = [
                    {
                        key: "执行人员",
                        value: this.$store.getters.employeeName || "暂无"
                    },
                    {
                        key: "执行日期",
                        value: moment(this.dailyXunchaStatusInfo.startTime).format("YYYY-MM-DD HH:mm")
                    },
                    {
                        key: "任务描述",
                        value: this.daliyXunchaCurrentTask.requireDesc || "暂无"
                    }
                ];
                return taskInfo;
            },
            taskCheckedInfo() {
                let taskInfo = [
                    {
                        key: "执行人员",
                        value: this.$store.getters.employeeName || "暂无"
                    },
                    {
                        key: "执行日期",
                        value: moment(this.dailyXunchaStatusInfo.startTime).format("YYYY-MM-DD HH:mm")
                    }, {
                        key: "执行用时",
                        value: this.dailyXunchaTotalUsedTime
                    },
                    {
                        key: "执行情况",
                        value: `巡查点${this.totalDevices.totalPositionsCount}个，已巡查${this.totalDevices.hasCheckedDeviceCount}个，发现风险${this.totalDevices.problemDeviceCount}个`
                    }
                ];
                return taskInfo;
            }
        },
        activated() {
            this.$store.dispatch("initDailyXunchaBuildsByTaskId", parseInt(this.$route.params.id));
            this.$store.dispatch("initDailyXunchaTimer");
        },
        methods: {
            back() {
                this.$MKOPop();
            },
            open(buildIndex, floorIndex, show) {
                this.$store.commit(types.OPEN_DAILYXUNCHA_POSITION_DATA, {
                    buildIndex: buildIndex,
                    floorIndex: floorIndex,
                    show: show
                });
            },
            actionTask() {
                if (this.builds.length <= 0) return false;
                if (this.status == 1) {
                    let dateNow = Date.now();
                    if (dateNow < this.$store.state.dailyXuncha.currentTask.startTime) {
                        Toast({message: "任务时间还未到，不能开始", duration: 2000});
                        return;
                    }
                    this.$MKODialog({
                        title: "确定开始巡查吗？",
                        cancelBtn: true,
                        cancelText: "取消"
                    }).then(msg => {
                        if (msg == "confirm") {
                            this.downLoadTask();
                        }
                    });
                } else if (this.status == 2) {
                    this.$MKODialog({
                        title: "确定结束巡查吗？",
                        cancelBtn: true,
                        cancelText: "取消"
                    }).then(msg => {
                        if (msg == "confirm") {
                            this.endTask();
                        }
                    });
                } else {
                }
            },
            startTask() {
                let actualStartTime = new Date().getTime(); //test data
                this.$store.commit(types.DAILYXUNCHA_ACTION_START, actualStartTime);
            },
            endTask() {
                let actualEndTime = new Date().getTime(); //test data
                this.$store.commit(types.DAILYXUNCHA_ACTION_END, actualEndTime);
            },
            viewQiandao(item, buildIndex, floorIndex) {
                if (this.status == 1) {
                    Toast({message: "请先开始巡查任务!", duration: 2000});
                    return false;
                }
                if (item.status == 1 && this.status == 3) {
                    Toast({message: "未巡查，无巡查数据!", duration: 2000});
                    return false;
                }
                this.$MKOPush({
                    path: `/qiandaoDailyXuncha/${this.$route.params.id}`,
                    query: {
                        positionId: item.positionId,
                        buildIndex: buildIndex,
                        floorIndex: floorIndex,
                        name: item.name
                    }
                });
            },
            downLoadTask() {
                let self = this;
                this.$store.dispatch("downloadAllDevicesByPositionId", this.builds);
                this.$MKODialog({
                    title: "下载数据",
                    msg: `<div class="download-dialog-box"><div class="title">正在下载任务执行离线数据，请稍后</div><div class="progress-bar"><div class="loading-circle value" id="downloadProgressWrapper"></div></div></div>`,
                    confirmBtn: false
                });
                this.$nextTick(() => {
                    timer = setInterval(() => {
                        i = i + 1;
                        document.getElementById("downloadProgressWrapper").style.transform = `rotate(${i}deg)`;
                        document.getElementById("downloadProgressWrapper").style.webkitTransform = `rotate(${i}deg)`;
                        if (i == 360) {
                            clearInterval(timer);
                            i = 0;
                            setTimeout(() => {
                                Toast({message: "下载完毕", duration: 1500});
                                window.MKODialogShow.show = false;
                                self.startTask();
                            }, 1500);
                        }
                    }, 2);
                });
            },
            uploadTask() {
                this.$MKODialog({
                    title: "立即上传吗？",
                    msg: '<div class="center">立即上传：立即完成任务<br/>稍后上传：连接wifi后再上传</div>',
                    cancelBtn: true,
                    cancelText: "取消"
                }).then(msg => {
                    if (msg == "confirm") {
                        this.doUploadTask();
                    }
                });
            },
            cancelUploadTask() {
                this.$MKODialog({
                    title: "放弃上传吗？",
                    msg: '<div class="center">放弃上传后，当前巡查记录将被清除，确定要放弃吗？</div>',
                    cancelBtn: true,
                    cancelText: "取消"
                }).then(msg => {
                    if (msg == "confirm") {
                        //..
                    }
                });
            },
            doUploadTask() {
                let self = this;
                let doUploadSuccess = function (taskData, resourceId) {
                    api.uploadTaskData(taskData, {
                        ruleId: parseInt(self.$route.params.id),
                        resourceId: resourceId
                    }).then(res => {
                        if (!res) return;
                        if (res.code != 0) {
                            Toast({message: res.msg, duration: 2000});
                            return;
                        }
                        self.$MKODialog({
                            title: "提示",
                            msg: '<div class="center">上传成功，数据正在处理审核中，请稍后查看</div>',
                            cancelBtn: false
                        }).then(msg => {
                            if (msg == "confirm") {
                                Toast({message: "上传完毕", duration: 1500});
                                self.$store.dispatch("cleanDailyXunchaCache");
                                self.$store.commit(types.DAILYXUNCHA_ACTION_UPLOADED);
                                self.$MKOPop();
                            }
                        });
                    });
                };

                let doDumpTaskData = function () {
                    self.$store.commit(types.DAILYXUNCHA_UPLOAD_TASK, data => {
//                        console.log(data);
                        let uploadURL = `${apiconf.resourcesDomain}/upload`;
                        self.$uploadRoutineXunChaData(data, uploadURL, function (result) {
                            if (result.error && result.error.length > 0) return;
                            if (result.resourceId && result.resourceId.length > 0) {
                                doUploadSuccess(data, result.resourceId);
                            }
                        });
                    });
                };
//                doDumpTaskData()
                this.$getMobileNetworkType(function (result) {
                    if (result == "unknown") {
                        Toast({message: "当前网络不可用，请确保网络正常", duration: 2000});
                        return;
                    } else if (result == "3G/4G") {
                        self.$MKODialog({
                            title: "提示",
                            msg: '<div class="center">当前3G/4G网络，上传报告会消耗流量，建议WIFI环境下上传。</div>',
                            cancelBtn: true,
                            cancelText: "稍后上传",
                            confirmText: "立即上传"
                        }).then(msg => {
                            if (msg == "confirm") doDumpTaskData();
                        });
                    } else if (result == "wifi") {
                        doDumpTaskData();
                    }
                });
            }
        },
        components: {
            Timer,
            TaskSummary
        }
    };
</script>

<style lang="less">
    @import "../../../../config.less";

    .StartDailyXuncha {
        .hidden {
            padding-bottom: 100px;
            margin-top: 44px;
        }
        .xuncha-top-wrap {
            width: 100%;
            padding: 14px;
            .padding {
                background: #ffffff;
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                padding: 14px;
                .xuncha-item {
                    min-height: 14px;
                    display: table;
                    width: 100%;
                    margin-bottom: 12px;
                    &.desc {
                        padding-bottom: 0;
                        .key {
                            // display: block;
                        }
                    }
                    .key,
                    .value {
                        vertical-align: middle;
                        display: table-cell;
                        line-height: 14px;
                        height: 14px;
                    }
                    .key {
                        font-size: 14px;
                        color: #999999;
                        letter-spacing: 0;
                        width: 56px + 14px;
                        &.full-width {
                            width: 100%;
                        }
                    }
                    .value {
                        font-size: 14px;
                        color: #666666;
                        letter-spacing: 0;
                        line-height: 14px;
                        white-space: normal;
                        word-break: break-all;
                        &.desc {
                            color: #666666;
                        }
                    }
                }
            }
        }
        .upload-task-wrap {
            width: 100%;
            padding: 14px;
            .padding {
                background: #ffffff;
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                .upload-task {
                    width: 100%;
                    height: 30px;
                    background: #3399ff;
                    text-align: center;
                    line-height: 30px;
                    border-radius: 4px 4px 0 0;
                    div {
                        width: 85px;
                        margin: 0 auto;
                        position: relative;
                        padding-left: 14px;
                        .icon {
                            position: absolute;
                            left: 0;
                            margin: auto;
                            top: 0;
                            bottom: 0;
                        }
                        .item {
                            font-size: 16px;
                            color: #ffffff;
                            letter-spacing: 0;
                            line-height: 16px;
                        }
                    }
                }
                .task-item {
                    padding: 14px;
                    .item {
                        width: 100%;
                        min-height: 14px;
                        line-height: 14px;
                        margin-bottom: 12px;
                        .key {
                            font-size: 14px;
                            color: #999999;
                            letter-spacing: 0px;
                            margin-right: 14px;
                        }
                        .value {
                            font-size: 14px;
                            color: #666666;
                            letter-spacing: 0px;
                            line-height: 14px;
                        }
                    }
                    .item-btn {
                        width: 100%;
                        height: 40px;
                        text-align: center;
                        display: table;
                        box-shadow: inset 0px 0px 0px 1px #299fff;
                        border-radius: 4px;
                        margin-top: 10px;
                        color: #3399ff;
                        &.blue {
                            font-size: 16px;
                            letter-spacing: 0px;
                            line-height: 18px;
                            background-color: #3399ff;
                            color: #ffffff;
                            margin-top: 18px;
                        }
                        span {
                            font-size: 16px;
                            letter-spacing: 0px;
                            height: 40px;
                            line-height: 40px;
                            display: table-cell;
                            vertical-align: middle;
                        }
                    }
                }
            }
        }
        .check-point-wrap {
            width: 100%;
            .build-name {
                font-size: 12px;
                color: #999999;
                letter-spacing: 0px;
                line-height: 12px;
                width: 100%;
                margin: 14px auto 10px 0;
                padding: 0 0 0 14px;
            }
            .build-device-count {
                font-size: 12px;
                color: #999999;
                letter-spacing: 0;
                line-height: 12px;
                float: right;
                margin: -22px 0 0 0;
                padding-right: 14px;
            }
            .floor {
                width: 100%;
                &:last-child > .padding > .floor-name:after {
                    content: none;
                }
                .padding {
                    padding-left: 14px;
                    background-color: #f8f8f8;
                    &.floor-wrap {
                        background-color: #ffffff;
                    }
                    .floor-name {
                        width: 100%;
                        height: 44px;
                        position: relative;
                        line-height: 44px;
                        .border-btm(@borderGray);
                        .item {
                            width: 100%;
                            font-size: 16px;
                            color: #333333;
                            letter-spacing: 0px;
                            padding-right: 97px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            float: left;
                            box-sizing: border-box;
                        }
                        .device-account {
                            width: 50%;
                            font-size: 14px;
                            color: #3399ff;
                            letter-spacing: 0px;
                            float: right;
                            text-align: right;
                            padding-right: 20px;
                            position: absolute;
                            right: 10px;
                            &.yellow-font {
                                color: #ffbb00;
                            }
                        }
                        i {
                            position: absolute;
                            right: 14px;
                            bottom: 0;
                            z-index: 20;
                            top: 0;
                            margin: auto;
                        }
                    }
                    .check-point-table {
                        width: 100%;
                        .check-point-cell {
                            width: 100%;
                            height: 44px;
                            position: relative;
                            line-height: 44px;
                            padding-left: 22px;
                            box-sizing: border-box;
                            .border-btm(@borderGray);
                            &:last-child:after {
                                content: none;
                            }
                            .name {
                                width: 100%;
                                font-size: 16px;
                                color: #333333;
                                letter-spacing: 0px;
                                float: left;
                                padding-right: 133px;
                                box-sizing: border-box;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .status {
                                display: table-cell;
                            }
                            .icon-link-arrow {
                                position: absolute;
                                right: 14px;
                                bottom: 16px;
                                z-index: 20;
                            }
                            .icon-police-uncle {
                                position: absolute;
                                margin: auto;
                                bottom: 0;
                                top: 0;
                                left: 0;
                            }
                            .device-account {
                                position: absolute;
                                font-size: 14px;
                                color: #3399ff;
                                letter-spacing: 0px;
                                right: 28px;
                                text-align: right;
                                padding-right: 30px;
                            }
                            .icon-is-qiandao, .icon-not-qiandao {
                                position: absolute;
                                right: 28px;
                                margin: auto;
                                top: 0;
                                bottom: 0;
                            }
                        }
                    }
                }
            }
        }
        .xuncha-btn {
            height: 50px;
            width: 100%;
            display: table;
            background: #3399ff;
            position: fixed;
            bottom: 0;
            z-index: 24;
            &.end {
                background: #ff6666;
            }
            &.disabled {
                background: #cccccc;
            }
            span {
                font-size: 16px;
                color: #ffffff;
                letter-spacing: 0px;
                width: 100%;
                height: 50px;
                line-height: 50px;
                vertical-align: middle;
                display: table-cell;
                text-align: center;
            }
        }
        .xuncha-end-btn {
            height: 40px;
            width: 100%;
            display: table;
            padding: 0 14px;
            margin: 14px 0;
            span {
                font-size: 16px;
                color: #ffffff;
                letter-spacing: 0px;
                background: #ff6666;
                border-radius: 4px;
                width: 100%;
                height: 40px;
                line-height: 40px;
                vertical-align: middle;
                display: table-cell;
                text-align: center;
                box-sizing: border-box;
            }
        }
        .not-qiaoDaoXunChaData {
            text-align: center;
            width: 100%;
            font-size: 12px;
            color: #a0a0a0;
            margin-top: 44px;
        }
        .xuncha-review-btn {
            width: 100%;
            height: 40px;
            text-align: center;
            display: table;
            border-radius: 4px;
            margin-top: 10px;
            &.blue {
                font-size: 16px;
                letter-spacing: 0px;
                line-height: 18px;
                background-color: #3399ff;
                color: #ffffff;
                margin-top: 30px;
            }
            &.yellow {
                font-size: 16px;
                letter-spacing: 0px;
                line-height: 40px;
                background-color: #ffbb00;
                color: #ffffff;
                margin-top: 30px;
            }
            span {
                font-size: 16px;
                letter-spacing: 0px;
                height: 40px;
                line-height: 40px;
                display: table-cell;
                vertical-align: middle;
            }
        }
    }
</style>
