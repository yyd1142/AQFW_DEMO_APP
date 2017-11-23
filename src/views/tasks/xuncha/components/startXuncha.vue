<template>
    <div class="StartXuncha">
        <div class="placeholder-item"></div>
        <mko-header :title="$route.query.name" left-icon="icon-back" @handleLeftClick="back">
            <div class="header-right" slot="custom" @click="QRCode" v-if="status == 2">
                <i class="icon-qr-code"></i>
            </div>
        </mko-header>
        <div class="page-wrap">
            <timer :status="status" :used-timer="usedTimeString"></timer>
            <div class="xuncha-top-wrap" :style="{marginTop: (status == 2 ? '30px' : 0)}" v-if="status != 3">
                <div class="padding">
                    <div class="xuncha-item">
                        <span class="key">执行人员</span>
                        <span class="value" v-text="statusInfo.name"></span>
                    </div>
                    <div class="xuncha-item">
                        <span class="key">执行日期</span>
                        <span class="value">{{statusInfo.startTime | formatDate}}</span>
                    </div>
                    <div class="xuncha-item">
                        <span class="key">截止日期</span>
                        <span class="value">{{statusInfo.endTime | formatDate}}</span>
                    </div>
                    <div class="xuncha-item desc">
                        <div class="key">任务描述</div>
                        <div class="value">{{$route.query.taskDescribe || '暂无'}}</div>
                    </div>
                </div>
            </div>
            <transition name="fade">
                <div class="upload-task-wrap" v-if="status == 3">
                    <div class="padding">
                        <div class="upload-task">
                            <div>
                                <i class="icon icon-upload-task"></i>
                                <span class="item">未上传</span>
                            </div>
                        </div>
                        <div class="task-item">
                            <div class="item">
                                <span class="key">执行人员</span>
                                <span class="value" v-text="statusInfo.name"></span>
                            </div>
                            <div class="item">
                                <span class="key">执行日期</span>
                                <span class="value">{{statusInfo.startTime | formatDate}}</span>
                            </div>
                            <div class="item">
                                <span class="key">截止日期</span>
                                <span class="value">{{statusInfo.endTime | formatDate}}</span>
                            </div>
                            <div class="item">
                                <span class="key">执行用时</span>
                                <span class="value">{{totalUsedTimeString}}</span>
                            </div>
                            <div class="item">
                                <span class="key">执行情况</span>
                                <span class="value">巡查点{{taskSurvey.total}}个，已巡查{{taskSurvey.total - taskSurvey.undo}}个，发现风险{{taskSurvey.problemNumber}}个</span>
                            </div>
                            <div class="item-btn blue" @click.stop="upload">
                                <span>立即上传</span>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="check-point-wrap" v-for="build, buildIndex  in builds">
                <div class="build-name" v-text="build.title"></div>
                <div class="build-device-count" v-if="build.totalPositionCounts != 0">共{{build.positions.length}}个巡查点</div>
                <div class="floor" v-for="position, positionIndex in build.positions"
                     @click="startQianDao(build, position)">
                    <div class="padding floor-wrap">
                        <div class="floor-name">
                            <span class="item">{{position.name}}</span>
                            <span class="device-account yellow-font"
                                  v-if="position.yh_amount && position.yh_amount > 0">{{position.yh_amount}}个风险</span>
                            <span class="device-account"
                                  v-else>{{position.status | CheckPointPositionStatusFilter}}</span>
                            <i class="icon icon-link-arrow"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="xuncha-btn" @click.stop="startXunCha" v-if="status == 1">
                <span>开始巡查</span>
            </div>
            <div class="xuncha-btn end" @click.stop="startXunCha" v-if="status == 2">
                <span>结束巡查</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {Timer} from 'components'
    import {Toast, Indicator} from 'mint-ui';
    import {taskStatusFilter, xunchaStatusColor} from 'filters';
    import api from 'api'
    import {mapGetters} from 'vuex'
    import * as types from 'store/mutation-types'
    import apiconf from 'apiconf'
    var timer = null
    var i = 0;
    export default {
        data() {
            return {
                xunchaStart: true,
                active: 'tab-container1',
                hasDownload: true,
                netError: false
            }
        },
        computed: {
            status() {
                return this.$store.state.xuncha ? this.$store.state.xuncha.status : null;
            },
            isOvertime() {
                return this.status == 3;
            },
            btnXunCha() {
                if (this.status == 2)
                    return {
                        text: '结束<br>巡查',
                        class: 'to-do-item'
                    };
                return {
                    text: '开始<br>巡查'
                };
            },
            builds() {
                return this.$store.state.xuncha ? this.$store.state.xuncha.builds : [];
            },
            usedTimeString() {
                return this.$store.state.xuncha ? this.$store.getters.usedTimeString : null;
            },
            totalUsedTimeString() {
                return this.$store.state.xuncha ? this.$store.getters.totalUsedTimeString : null;
            },
            statusInfo() {
                return this.$store.state.xuncha ? this.$store.getters.statusInfo : {
                    endTime: 0, name: null, startTime: 0, status: null
                };
            },
            taskId() {
                return this.$store.state.xuncha ? this.$store.getters.currentTaskId : null;
            },
            taskSurvey() {
                return this.$store.state.xuncha ? this.$store.getters.taskSurvey : null;
            }
        },
        beforeMount() {
            let lastXunChaTaskId = localStorage.getItem('lastXunChaTaskId');
            this.$store.dispatch('initBuildsByTaskId', lastXunChaTaskId);
            this.$store.dispatch('initXunChaTimer');
        },
        mounted() {
            if (this.$route.query.to && this.$route.query.to === 'qiandao') {
                this.startQianDao(this.builds[0], this.builds[0].positions[0], true);
            }
        },
        activated() {
            let lastXunChaTaskId = localStorage.getItem('lastXunChaTaskId');
            this.$store.dispatch('initBuildsByTaskId', lastXunChaTaskId);
            this.$store.dispatch('initXunChaTimer');
        },
        methods: {
            startXunCha() {
                if (this.status == 1) {
                    this.$MKODialog({
                        title: '确定开始巡查吗？',
                        cancelBtn: true,
                        cancelText: '取消'
                    }).then(msg => {
                        if (msg == 'confirm') {
                            api.changeTaskStatusByTaskId({
                                taskId: this.taskId,
                                status: 2
                            }).then(res => {
                                if (!res)
                                    return;
                                if (res.code != 0) {
                                    this.$MKODialog({msg: res.msg});
                                    return;
                                }
                                this.downloadTask(res.response)
                            })
                        }
                    })
                } else if (this.status == 2) {
                    this.$MKODialog({
                        title: '确定结束巡查吗？',
                        cancelBtn: true,
                        cancelText: '取消'
                    }).then(msg => {
                        if (msg == 'confirm') {
                            api.changeTaskStatusByTaskId({
                                taskId: this.taskId,
                                status: 3
                            }).then(res => {
                                if (!res)
                                    return;
                                if (res.code != 0) {
                                    Toast({message: res.msg, duration: 2000})
                                    return;
                                }
                                this.$store.commit(types.XUNCHA_ACTION_END, res.response)
                            })
                        }
                    })
                }
            },
            startQianDao(build, position, fromQRCode) {
                if (this.status == 1) {
                    Toast({message: '请先开始巡查任务', duration: 2000})
                    return;
                }
                let lastXunChaTaskId = localStorage.getItem('lastXunChaTaskId');
                let nextPath = `/xuncha/${lastXunChaTaskId}/qiandao`;
                let query = {
                    jzId: build.jzId,
                    jzLevel: position.level,
                    jzPosition: position.name,
                    title: build.title + position.name,
                    positionId: position.positionId,
                    status: position.status,
                    fixedPositionId: position.fixedPositionId
                }
                if(fromQRCode) {
                    this.$MKOPush({
                        path: nextPath,
                        query: query
                    }, '/enter/home', true)
                } else {
                    this.$MKOPush({
                        path: nextPath,
                        query: query
                    })
                }
            },
            upload() {
                let self = this;
                let doUploadSuccess = function (resourceId) {
                    api.changeTaskStatusByTaskId({
                        taskId: self.taskId,
                        status: 4
                    }).then(res => {
                        if (!res)
                            return;
                        if (res.code != 0) {
                            Toast({message: res.msg, duration: 2000})
                            return;
                        }

                        api.disposeXunChaTask({
                            taskId: self.taskId,
                            resourceId: resourceId
                        }).then(res => {

                        })
                        self.$MKODialog({
                            title: '提示',
                            msg: '上传成功，数据正在处理审核中，请稍后查看',
                            cancelBtn: true,
                            cancelText: '取消'
                        }).then(msg => {
                            self.$store.dispatch('cleanCache');
                            self.$store.commit(types.XUNCHA_ACTION_UPLOADED, res.response);
                            setTimeout(() => {
                                self.$MKOPop()
                            }, 1500);
                        })
                    })
                }

                let doDumpTaskData = function () {
                    self.$store.dispatch('dumpTaskData', function (data) {
                        let uploadURL = `${apiconf.resourcesDomain}/upload`;
                        self.$uploadXunChaData(data, uploadURL, function (result) {
                            if (result.error && result.error.length > 0)
                                return;
                            if (result.resourceId && result.resourceId.length > 0) {
                                doUploadSuccess(result.resourceId);
                            }
                        })
                    })
                }
//            doDumpTaskData()
                this.$getMobileNetworkType(function (result) {
                    if (result == "unknown") {
                        Toast({message: '当前网络不可用，请确保网络正常', duration: 2000})
                        return;
                    } else if (result == "3G/4G") {
                        let opts = {
                            title: '提示',
                            msg: '当前3G/4G网络，上传报告会消耗流量，建议WIFI环境下上传',
                            cancelBtn: true,
                            confirmText: '立即上传',
                            cancelText: '稍后上传'
                        }
                        self.$MKODialog(opts).then(msg => {
                            if (msg == 'confirm') {
                                doDumpTaskData();
                            }
                        })
                    } else if (result == "wifi") {
                        doDumpTaskData();
                    }
                });
            },
            back() {
                this.$MKOPop();
            },
            downloadTask(data) {
                let builds = this.builds;
                builds.forEach((item) => {
                    item.positions.forEach((subItem) => {
                        this.deviceListByPostion(item, subItem);
                    })
                })

                let self = this;
                this.$MKODialog({
                    title: '下载数据',
                    msg: `<div class="download-dialog-box"><div class="title">正在下载任务执行离线数据，请稍后</div><div class="progress-bar"><div class="loading-circle value" id="downloadProgressWrapper"></div></div></div>`,
                    confirmBtn: false
                })
                this.$nextTick(() => {
                    timer = setInterval(() => {
                        i = i + 1;
                        document.getElementById("downloadProgressWrapper").style.transform = `rotate(${i}deg)`;
                        document.getElementById("downloadProgressWrapper").style.webkitTransform = `rotate(${i}deg)`;
                        if (i == 360) {
                            clearInterval(timer);
                            i = 0;
                            setTimeout(() => {
                                Toast({message: '下载完毕', duration: 1500});
                                window.MKODialogShow.show = false
                                self.$store.commit(types.XUNCHA_ACTION_START, data)
                            }, 1500);
                        }
                    }, 2)
                })
            },
            deviceListByPostion(build, position) {
                let positionId = position.positionId;
                let jzInfo = {
                    jzId: build.jzId,
                    jzLevel: position.level,
                    jzPosition: position.name
                }
                this.$store.dispatch('initDevicesByPositionInfo', {
                    positionId,
                    jzInfo,
                    fixedPositionId: position.fixedPositionId
                });
            },
            QRCode() {
                if (this.status == 2) {
                    this.$ScanQRCode(result => {
                        let data = result.response;
                        if (data.length === 17) {
                            this.readerQRCode(data);
                        } else {
                            this.$MKODialog({msg: '无效二维码'});
                        }
                    })
                } else {
                    Toast({message: "请先开始巡查任务!", duration: 2000});
                }
            },
            readerQRCode(data) {
                let area = data.substring(0, 2);
                let deviceType = data.substring(2, 4);
                let supplier = data.substring(4, 6);
                let installDate = data.substring(6, 11);
                let expandCode = data.substring(11, 14);
                let code = data.substring(14, 17);
                if (code === 'Y07') {
                    if (this.status == 1) {
                        Toast({message: '请先开始巡查任务', duration: 2000})
                        return;
                    }
                    let lastXunChaTaskId = localStorage.getItem('lastXunChaTaskId');
                    let nextPath = `/xuncha/${lastXunChaTaskId}/qiandao`;
                    let query = {
                        jzId: this.builds[0].jzId,
                        jzLevel: this.builds[0].positions[0].level,
                        jzPosition: this.builds[0].positions[0].name,
                        title: this.builds[0].title + this.builds[0].positions[0].name,
                        positionId: this.builds[0].positions[0].positionId,
                        status: this.builds[0].positions[0].status,
                        fixedPositionId: this.builds[0].positions[0].fixedPositionId
                    }
                    this.$MKOPush({
                        path: nextPath,
                        query: query
                    })
                } else {

                }
            }
        },
        components: {
            Timer
        }
    }
</script>

<style lang="less">
    @import "../../../../config.less";

    .StartXuncha {
        .xuncha-top-wrap {
            width: 100%;
            padding: 14px;
            .padding {
                background: #FFFFFF;
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
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
                background: #FFFFFF;
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
                border-radius: 4px;
                .upload-task {
                    width: 100%;
                    height: 30px;
                    background: #3399FF;
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
                            color: #FFFFFF;
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
                        box-shadow: inset 0px 0px 0px 1px #299FFF;
                        border-radius: 4px;
                        margin-top: 10px;
                        color: #3399FF;
                        &.blue {
                            font-size: 16px;
                            letter-spacing: 0px;
                            line-height: 18px;
                            background-color: #3399FF;
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
                            color: #3399FF;
                            letter-spacing: 0px;
                            float: right;
                            text-align: right;
                            padding-right: 20px;
                            position: absolute;
                            right: 10px;
                            &.yellow-font {
                                color: #FFBB00;
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
                                color: #3399FF;
                                letter-spacing: 0px;
                                right: 0;
                                text-align: right;
                                padding-right: 20px;
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
            background: #3399FF;
            position: fixed;
            bottom: 0;
            z-index: 22;
            &.end {
                background: #ff6666;
                width: 100%;
                left: 0;
            }
            &.disabled {
                background: #cccccc;
            }
            &.qrcode {
                width: 50%;
                right: 0;
            }
            span {
                font-size: 16px;
                color: #FFFFFF;
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
                color: #FFFFFF;
                letter-spacing: 0px;
                background: #FF6666;
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
        .header-right {
            .icon-qr-code {
                position: absolute;
                right: 14px;
                margin: auto;
                top: 0;
                bottom: 0;
            }
        }
    }
</style>
