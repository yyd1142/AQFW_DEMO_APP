<template>
    <div class="qiandaoXuncha">
        <loading v-show="loading"></loading>
        <div class="placeholder-item"></div>
        <mko-header :title="qiaoDaoXunChaTitle" left-icon="icon-back" @handleLeftClick="back" @handleRightClick="history" right-icon="icon-history"></mko-header>
        <div class="page-wrap">
            <timer :status="taskStatus" :used-timer="usedTimeString"></timer>
            <div class="camera-wrap" :style="{marginTop: (taskStatus == 2 ? '44px' : 0)}">
                <div class="padding">
                    <div class="xuncha-item">
                        <span class="key">拍照签到</span>
                    </div>
                </div>
                <photo-box max="8" :photo-list="checkPointPhotos" :user-camera="true" @removePhotoEvent="removePhoto" @addPhotoEvent="takePhoto" :read-only="taskStatus == 3 ? true : false"></photo-box>
            </div>
            <div class="xuncha-type" v-if="qiaoDaoXunChaData.length > 0">
                <div class="left">
                    <div class="title">巡查设备</div>
                </div>
                <div class="end-time">设备状态</div>
            </div>
            <ul class="xuncha-device-table-view" v-for="(group, gIndex) in qiaoDaoXunChaData">
                <li class="xuncha-device-table-cell" v-for="(device, deviceIndex) in group" @click="checkDevice(device)">
                    <div class="dingding-icon" :class="device | xunchaDeviceStatusStyle">
                        <span></span>
                    </div>
                    <div class="main">
                        <span class="device-name">{{device.unitName}}-{{device.code || '无设备号'}}</span>
                        <span class="end-time">{{device.status | xunchaDeviceStatusFilter}}</span>
                        <i class="icon icon-link-arrow"></i>
                    </div>
                </li>
            </ul>
            <div class="not-qiaoDaoXunChaData" v-if="qiaoDaoXunChaData.length <= 0">暂无检查设备</div>
            <div class="qiandao-submit-btn" @click.stop="submit()" v-if="taskStatus != 5 && taskStatus != 3">
                <span>确认</span>
            </div>
        </div>
    </div>
</template>

<script>
import { Timer, PhotoBox, Loading } from 'components'
import { Toast } from 'mint-ui';
import { mapGetters } from 'vuex'
import { xunchaStatusICON, xunchaDeviceStatusFilter } from 'filters'
import api from 'api'
import * as types from 'store/mutation-types'
import moment from 'moment'
var _positionId = ''
export default {
    data() {
        return {
            notUpload: true,
            qiandaoXuncha: false,
            loading: true,
            qiaoDaoXunChaTitle: ''
        }
    },
    computed: {
        qiaoDaoXunChaData() {
            return this.$store.state.xuncha.lastDevices;
        },
        checkPointPhotos() {
            return this.$store.state.xuncha.lastCheckPointPhotos;
        },
        bInputData() {
            let bInputData = false;
            let checkPointDatas = this.$store.state.xuncha.lastDevices;
            checkPointDatas.forEach((checkPoint) => {
                checkPoint.forEach((item) => {
                    if (item.status == 5) {
                        bInputData = true;
                    }
                })
            })
            return bInputData;
        },
        isChecked() {
            let isChecked = false;
            if (this.$route.query.status == 1) {
                isChecked = true
            }
            return isChecked;
        },
        ...mapGetters({
            usedTimeString: 'usedTimeString',
            statusInfo: 'statusInfo',
            hasFinished: 'getXCCheckPointHasFinished',
            taskStatus: 'taskStatus'
        })
    },
    beforeMount() {
        this.qiaoDaoXunChaTitle = this.$route.query.title;
        let positionId = this.$route.query.positionId;
        let fixedPositionId = this.$route.query.fixedPositionId;
        let jzInfo = {
            jzId: parseInt(this.$route.query.jzId),
            jzLevel: parseInt(this.$route.query.jzLevel),
            jzPosition: this.$route.query.jzPosition
        }
        this.$store.dispatch('initDevicesByPositionInfo', {
            positionId,
            jzInfo,
            fixedPositionId
        });
    },
    mounted() {
        this.onInputData()
        this.$nextTick(() => {
            this.loading = false;
            if (_positionId != this.$route.query.positionId) {
                setTimeout(() => {
                    this.qiandaoXuncha = true
                }, 300);
            } else {
                this.qiandaoXuncha = true
            }
            _positionId = this.$route.query.positionId;
        });
    },
    deactivated() {
    },
    methods: {
        checkDevice(device) {
            let status = device.status;
            if (status == 2 || status == 3 || status == 4 || status == 7) {
                Toast({
                    message: '设备处置中',
                    position: 'middle',
                    duration: 1500
                });
                return false;
            }
            let lastXunChaTaskId = localStorage.getItem('lastXunChaTaskId');
            let nextPath = `/xuncha/${lastXunChaTaskId}/device`;
            this.$MKOPush({
                path: nextPath,
                query: {
                    unitId: device.unitId,
                    deviceId: device.id,
                    qiaoDaoXunChaTitle: this.qiaoDaoXunChaTitle
                }
            })
        },
        takePhoto() {
            if (this.taskStatus != 2)
                return;

//            this.$store.commit(types.XUNCHA_ACTION_ADD_PHOTO, 'http://resources.aqfwy.com/303eb2d592b94d0dafea92354867000906000000');

            let self = this;
            let dateNow = new Date();
            let dateTime = moment(dateNow).format("YYYY年MM月DD日 HH点mm分");
            let watermark = `巡查位置: ${this.qiaoDaoXunChaTitle}\n时间: ${dateTime}\n执行人: ${this.$store.getters.employeeName}`;
            this.$takePhotoAndAddWatermark(watermark, function(photo) {
                self.$store.commit(types.XUNCHA_ACTION_ADD_PHOTO, photo.url);
            })
        },
        removePhoto(index) {
            this.$store.commit(types.XUNCHA_ACTION_REMOVE_PHOTO, index)
        },
        back() {
            if (!this.isChecked && this.bInputData) {
                this.$MKODialog({ msg: '你已修改设备状态，请及时确认' });
            } else {
                window.mkoBackButton.bInputData = false;
                this.$MKOPop()
            }
        },
        submit() {
            if (this.checkPointPhotos.length <= 0 && this.statusInfo.status != 3) {
                Toast({
                    message: '请拍照签到',
                    position: 'middle',
                    duration: 1500
                });
                return false;
            }
            if (this.hasFinished) {
                let qiaoDaoXunChaDatas = {};
                qiaoDaoXunChaDatas['datas'] = this.qiaoDaoXunChaData
                qiaoDaoXunChaDatas['positionId'] = this.$route.query.positionId
                this.$store.commit(types.XUNCHA_ACTION_UPDATE_CHECKPOINTS_PROBLEM, qiaoDaoXunChaDatas)
                this.$store.dispatch('commitXCCheckPoint');
                window.mkoBackButton.bInputData = false;
                this.$MKOPop();
            } else {
                this.$MKODialog({ msg: '有巡查点未录入数据，无法完成该点位巡查' });
            }
        },
        onInputData() {
            let self = this;
            if (!this.isChecked && this.bInputData) {
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                window.mkoBackButton.callback = function(action) {
                    self.$MKODialog({ msg: '你已修改设备状态，请及时确认' });
                }
            }
        },
        history() {
            let nextPath = `/xuncha/${this.$route.params.taskId}/checkPorintLogList`;
            this.$MKOPush({
                path: nextPath,
                query: {
                    qiaoDaoXunChaTitle: this.qiaoDaoXunChaTitle,
                    fixedPositionId: this.$route.query.fixedPositionId,
                    formTmpTask: true
                }
            })
        }
    },
    components: {
        Timer,
        PhotoBox,
        Loading
    }
}
</script>

<style lang="less">
@import "../../../../config.less";
.qiandaoXuncha {
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
