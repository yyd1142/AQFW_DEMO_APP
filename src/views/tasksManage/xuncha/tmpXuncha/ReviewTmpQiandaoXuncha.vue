<template>
    <div class="ReviewTmpQiandaoXuncha">
        <div class="placeholder-item"></div>
        <mko-header :title="$route.query.name" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <task-summary :task-info="taskInfo" :status="status"></task-summary>
            <div class="camera-wrap" v-if="checkPointPhotos.length > 0">
                <div class="padding">
                    <div class="xuncha-item">
                        <span class="key">签到照片</span>
                    </div>
                </div>
                <photo-box max="8" :photo-list="checkPointPhotos" :read-only="true"></photo-box>
            </div>
            <div class="xuncha-type" v-if="CheckedPointPositionDevices.length > 0">
                <div class="left">
                    <div class="title">巡查设备</div>
                </div>
                <div class="end-time">创建日期</div>
            </div>
            <ul class="xuncha-device-table-view" v-if="CheckedPointPositionDevices.length > 0">
                <li class="xuncha-device-table-cell" v-for="item, index in CheckedPointPositionDevices"
                    @click="goDeviceInfo(item)">
                    <div class="dingding-icon" :class="item.status | xunchaDeviceStatusStyleFilter">
                        <span></span>
                    </div>
                    <div class="main">
                        <span class="device-name">{{item.unitName}}</span>
                        <span class="end-time disabled">{{item.createDate | formatDate('YYYY-MM-DD')}}</span>
                        <i class="icon icon-link-arrow"></i>
                    </div>
                </li>
            </ul>
            <div class="not-qiaoDaoXunChaData" v-if="CheckedPointPositionDevices.length <= 0">暂无检查设备</div>
            <div class="load-more-btn" v-if="false">
                <span class="item">查看更多
                    <i class="icon icon-link-arrow-up"></i>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import { TaskSummary, PhotoBox } from 'components'
    import apiconf from 'apiconf'
    export default {
        data() {
            return {
                CheckedPointPositionDevices: [],
                checkPointPhotos: []
            }
        },
        computed: {
            status() {
                return this.$route.query.status;
            },
            taskInfo() {
                return this.$route.query.taskInfo;
            }
        },
        activated() {
            this.setBackButton();
            this.getTaskCheckPointDeviceResult();
        },
        deactivated() {
            this.checkPointPhotos = [];
        },
        methods: {
            back() {
                this.$MKOPop()
            },
            getTaskCheckPointDeviceResult() {
                let self = this;
                let positionId = this.$route.query.positionId;
                api.getXCTaskCheckPointDeviceResult({
                    positionId: positionId
                }).then(res => {
                    if (!res) return;
                    let groups = new Map();
                    for (let device of res.response) {
                        let devices = groups.get(device.unitId);
                        if (!devices) {
                            devices = [device];
                            groups.set(device.unitId, devices);
                        } else {
                            devices.push(device);
                        }
                    }
                    let g = [];
                    for (let k of groups.keys()) {
                        g.push(groups.get(k));
                    }
                    this.CheckedPointPositionDevices = g;
                });
                let imageId = this.$route.query.imageId;
                if (imageId && imageId.length > 0) {
                    api.getByPath(`/info/${imageId}`)({}).then(res => {
                        if (res.code != 0)
                            return;
                        if (res.response && res.response.length > 0) {
                            for (let image of res.response) {
                                self.checkPointPhotos.push(`${apiconf.resourcesDomain}/${image.resouceId}`);
                            }
                        }
                    });
                }
            },
            setBackButton() {
                let self = this
                window.mkoBackButton = {}
                window.mkoBackButton.bInputData = true
                window.mkoBackButton.callback = function () {
                    try {
                        window.MKODialogShow = false
                    } catch (err) {
                        alert(err)
                    }
                    window.mkoBackButton.bInputData = false;
                    self.$MKOPop();
                }
            },
            goDeviceInfo(item) {
                sessionStorage.setItem('lastReviewTaskSummary', JSON.stringify(this.taskInfo));
                this.$MKOPush({
                    name: 'ReviewTmpDeviceXunch',
                    params: {
                        id: this.$route.params.id
                    },
                    query: {
                        attribute: item.attribute,
                        status: this.status,
                        name: item.unitName
                    }
                })
            }
        },
        components: {
            TaskSummary,
            PhotoBox
        }
    }
</script>

<style lang="less">
    @import "../../../../config.less";

    .ReviewTmpQiandaoXuncha {
        .camera-wrap {
            width: 100%;
            .padding {
                padding: 0 0 0 14px;
                .xuncha-item {
                    min-height: 12px;
                    display: table;
                    width: 100%;
                    margin: 12px 0 8px 0;
                    .key {
                        font-size: 12px;
                        color: #666666;
                        letter-spacing: 0;
                        line-height: 12px;
                        height: 12px;
                        display: table-cell;
                        &.full-width {
                            width: 100%;
                        }
                    }
                }
            }
        }
        .xuncha-type {
            width: 100%;
            height: 44px;
            padding: 0 14px;
            .left {
                width: 200px;
                float: left;
                .title,
                .all-checked {
                    display: inline;
                    font-size: 12px;
                    letter-spacing: 0px;
                    line-height: 44px;
                    height: 44px;
                }
                .title {
                    margin-right: 14px;
                    color: #999999;
                }
                .all-checked {
                    color: #3399FF;
                }
            }
            .end-time {
                float: right;
                font-size: 12px;
                color: #999999;
                letter-spacing: 0px;
                line-height: 44px;
                height: 44px;
            }
        }
        .xuncha-device-table-view {
            width: 100%;
            padding: 0 0 0 14px;
            background: #ffffff;
            box-sizing: border-box;
            .xuncha-device-table-cell {
                width: 100%;
                height: 44px;
                line-height: 44px;
                position: relative;
                box-sizing: border-box;
                padding-left: 36px;
                .border-btm(@borderGray);

                .dingding-icon {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    margin: AUTO;
                    span {
                        width: 14px;
                        height: 14px;
                        border-radius: 50%;
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        margin: auto;
                        left: 0;
                        right: 0;
                    }
                }
                .yellow-icon {
                    background: rgba(255, 170, 68, 0.2);
                    span {
                        background: #FFAA44;
                    }
                }
                .green-icon {
                    background: rgba(85, 204, 51, 0.2);
                    span {
                        background: #55CC33;
                    }
                }
                .red-icon {
                    background: rgba(255, 102, 102, 0.2);
                    span {
                        background: #FF6666;
                    }
                }
                .title {
                    font-size: 16px;
                    color: #333333;
                    letter-spacing: 0px;
                    line-height: 16px;
                }
                .value {
                    font-size: 14px;
                    color: #666666;
                    letter-spacing: 0px;
                    float: right;
                    padding-right: 35px;
                }
                .icon {
                    position: absolute;
                    right: 14px;
                    bottom: 16px;
                    z-index: 20;
                }

                &:last-child:after {
                    content: none;
                }
                .icon-no-checked,
                .icon-is-checked,
                .icon-green-checked,
                .icon-yellow-checked {
                    position: absolute;
                    margin: auto;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    z-index: 22;
                }
                .icon-arrow-right,
                .icon-link-arrow {
                    position: absolute;
                    right: 14px;
                    bottom: 16px;
                    z-index: 22;
                }
                .main {
                    position: absolute;
                    width: 100%;
                    left: 0;
                    padding-left: 32px;
                    .device-name {
                        font-size: 16px;
                        color: #333333;
                        letter-spacing: 0px;
                        line-height: 16px;
                    }
                    .end-time {
                        font-size: 14px;
                        color: #3399FF;
                        letter-spacing: 0px;
                        float: right;
                        padding-right: 34px;
                        &.disabled {
                            color: #999999;
                        }
                    }
                    .xuncha-times {
                        width: 63px;
                        height: 44px;
                        float: right;
                        margin-right: 14px;
                        padding: 20px 0 0 0;
                        .item {
                            width: 20px;
                            height: 4px;
                            background-color: #eeeeee;
                            float: left;
                            margin-right: 1px;
                            &.activied {
                                background-color: #3399FF;
                            }
                        }
                    }
                }
            }
        }
        .load-more-btn {
            width: 100%;
            position: relative;
            height: 30px;
            text-align: center;
            background-color: #ffffff;
            .border-top(@borderGray);
            display: table;
            .item {
                width: 100%;
                font-size: 12px;
                color: #333333;
                letter-spacing: 0px;
                line-height: 30px;
                display: table-cell;
                vertical-align: middle;
                .icon {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    margin: auto 0 auto 6px;
                }
            }
        }
        .qiandao-submit-btn {
            height: 40px;
            width: 100%;
            display: table;
            padding: 0 14px;
            margin: 14px 0;
            span {
                font-size: 16px;
                color: #FFFFFF;
                letter-spacing: 0px;
                background: #3399FF;
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
    }
</style>
