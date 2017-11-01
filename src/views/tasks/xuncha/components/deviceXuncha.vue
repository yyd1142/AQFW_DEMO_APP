<template>
    <div class="DeviceXuncha">
        <div class="placeholder-item"></div>
        <mko-header :title="$route.query.qiaoDaoXunChaTitle" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <timer :status="taskStatus" :used-timer="usedTimeString"></timer>
            <ul class="device-table-view">
                <li class="device-table-cell" v-for="(item, index) in checkRules">
                    <div class="padding">
                        <div class="device-item" :class="!item.value ? null : 'border-bottom'">
                            <div class="dingding-icon" :class="item.value ? 'green-icon' : 'red-icon'">
                                <span></span>
                            </div>
                            <span class="title" v-text="item.content"></span>
                            <span class="value" v-if="item.value && taskStatus != 3" @click.stop="switchOpen(index, item)">{{item.needInputData == 1 ? (item.dataValue ? item.dataValue : '填写数值') : '上报风险'}}</span>
                            <i class="icon icon-arrow-right" @click.stop="switchOpen(index, item)" v-if="item.needInputData == 0 && item.value && taskStatus != 3"></i>
                            <span class="cancel-btn" v-if="item.needInputData == 0 && !item.value && taskStatus != 3" @click.stop="cancelChange(item, index)">取消</span>
                            <i class="icon icon-arrow-right" @click.stop="updateInputValue(item, index)" v-if="item.needInputData == 1 && taskStatus != 3"></i>
                            <span class="device-status" :class="item.status == 2 ? 'red-font' : ''" v-if="taskStatus == 3">{{deviceStatusFilter(item.status)}}</span>
                        </div>
                    </div>
                    <div class="desc-wrap" :class="taskStatus == 3 ? 'jiantou' : null" v-if="!item.value">
                        <div class="text">
                            <textarea :id="`dailyXcInput${index}`" placeholder="填写隐患描述" :value="item.description" @input="updateDescription" v-if="taskStatus != 3"></textarea>
                            <span class="word-number" v-if="taskStatus != 3">{{wordNumber}}/140个字</span>
                            <div class="desc" v-if="taskStatus == 3">{{item.description}}</div>
                        </div>
                        <photo-box :max="8" :photo-list="deviceRulesPhotos[index].images" :user-camera="true" :read-only="taskStatus == 3 ? true : false" @removePhotoEvent="removePhoto(index)" @addPhotoEvent="takePhoto(index)"></photo-box>
                    </div>
                </li>
            </ul>
            <div class="device-submit-btn" @click.stop="submit()" v-if="taskStatus != 3">
                <span>确认</span>
            </div>
        </div>
    </div>
</template>

<script>
import { Timer, PhotoBox } from 'components'
import api from 'api'
import { mapGetters } from 'vuex'
import * as types from 'store/mutation-types'
import moment from 'moment'
import { Toast } from 'mint-ui'

export default {
    data() {
        return {
            bInputData: false,
            wordNumber: 0
        }
    },
    computed: {
        checkRules() {
            return this.$store.state.xuncha.lastDeviceRules;
        },
        deviceRulesPhotos() {
            return this.$store.state.xuncha.lastDeviceRules;
        },
        ...mapGetters({
            usedTimeString: 'usedTimeString',
            statusInfo: 'statusInfo',
            taskStatus: 'taskStatus'
        })
    },
    beforeMount() {
        let deviceInfo = {
            deviceId: this.$route.query.deviceId,
            unitId: this.$route.query.unitId
        }
        this.$store.dispatch('initDeviceCheckRulesByUnitId', deviceInfo);
    },
    activated() {
        let deviceInfo = {
            deviceId: this.$route.query.deviceId,
            unitId: this.$route.query.unitId
        }
        this.$store.dispatch('initDeviceCheckRulesByUnitId', deviceInfo);
    },
    deactivated() {
        window.mkoBackButton.bInputData = false;
    },
    methods: {
        back() {
            if (this.bInputData == false) {
                this.$MKOPop();
                return;
            }
            this.$MKODialog({ title: '提示', msg: '返回上一级将不会保存当前操作，确认要返回吗？', cancelBtn: true }).then(action => {
                if (action == 'confirm') {
                    window.mkoBackButton.bInputData = false;
                    this.$MKOPop();
                }
            });
        },
        switchOpen(index, item) {
            if (this.taskStatus != 2) return;
            let value = item.content;
            this.onInputData()
            this.$store.commit(types.XUNCHA_ACTION_SWITCH_DEVCIE_STATUS, {
                deviceId: this.$route.query.deviceId,
                ruleIndex: index
            });
        },
        updateDescription(e) {
            if (this.taskStatus != 2) return;
            let index = parseInt(e.target.id.slice(12));
            let description = e.target.value;
            this.wordNumber = description.length;
            if (description.length <= 140) {
                this.$store.commit(types.XUNCHA_ACTION_ADD_DEVCIE_COMMENT, {
                    index: index,
                    description: e.target.value
                })
                this.onInputData()
            } else {
                this.wordNumber = 140;
                Toast({ message: '最多只能输入140个字', duration: 2000 })
            }
        },
        updateInputValue(item, index) {
            if (this.taskStatus != 2) return;
            this.onInputData();
            let lastXunChaTaskId = this.$route.params.taskId;
            this.$MKOPush({
                name: `/xuncha/${lastXunChaTaskId}/inputDataXuncha`,
                query: {
                    deviceId: this.$route.query.deviceId,
                    index: index
                }
            })
        },
        upload(index) {
            if (this.taskStatus != 2)
                return;
            this.checkRules[index].url = [1, 2, 3];
            this.onInputData()
        },
        submit() {
            let error = false
            for (let item of this.checkRules) {
                if (item.value == false && (item.description == '' || item.images.length <= 0)) {
                    error = true
                }
            }
            if (error) {
                Toast({ message: '请完善信息', duration: 2000 })
                return false;
            }
            this.$store.dispatch('commitXCDeviceCheckResult');
            window.mkoBackButton.bInputData = false;
            this.$MKOPop();
        },
        takePhoto(index) {
            if (this.taskStatus != 2)
                return;
            let self = this;
            let dateNow = new Date();
            let dateTime = moment(dateNow).format("YYYY年MM月DD日 HH点mm分");
            let watermark = `巡查位置: ${this.$route.query.qiaoDaoXunChaTitle}\n时间: ${dateTime}\n执行人: ${this.$store.getters.employeeName}`;
            this.$takePhotoAndAddWatermark(watermark, function(photo) {
                self.$store.commit(types.XUNCHA_ACTION_ADD_DEVICE_PHOTO, {
                    index: index,
                    url: photo.url
                });
            })
        },
        removePhoto(index) {
            this.$store.commit(types.XUNCHA_ACTION_REMOVE_PHOTO, index)
        },
        onInputData() {
            let self = this;
            this.bInputData = true;
            window.mkoBackButton = {};
            window.mkoBackButton.bInputData = true;
            window.mkoBackButton.callback = function(action) {
                self.$MKODialog({ title: '提示', msg: '返回上一级将不会保存当前操作，确认要返回吗？', cancelBtn: true }).then(action => {
                    if (action == 'confirm') {
                        window.mkoBackButton.bInputData = false;
                        self.$MKOPop();
                    }
                });
            }
        },
        cancelChange(item, index) {
            let deviceId = this.$route.query.deviceId;
            if (item.description == '' && this.deviceRulesPhotos[index].images.length <= 0) {
                this.bInputData = false;
                this.$store.commit(types.XUNCHA_ACTION_UPDATE_DEVCIE_ITEM, { deviceId, item, index });
                return false;
            }
            this.$MKODialog({
                title: '确定取消上报风险吗？',
                msg: '<div class="center">填写的信息将被清空</div>',
                cancelBtn: true,
                cancelText: '取消'
            }).then(msg => {
                if (msg == 'confirm') {
                    this.bInputData = false;
                    this.$store.commit(types.XUNCHA_ACTION_UPDATE_DEVCIE_ITEM, { deviceId, item, index });
                }
            })
        }
    },
    components: {
        Timer,
        PhotoBox
    }
}
</script>

<style lang="less">
@import "../../../../config.less";
.DeviceXuncha {
    .top-header-wrap {
        width: 100%;
        box-sizing: border-box;
        padding: 12px 8px;
        height: 60px;
        background-color: #ffffff;
        .border-btm(@borderGray);
        .padding {
            width: 100%;
            height: 36px;
            background: #FFFFFF;
            border: 1px solid #DDDDDD;
            box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.05);
            border-radius: 100px;
            text-align: center;
            line-height: 30px;
            position: relative;
            span {
                font-size: 12px;
                color: #999999;
                letter-spacing: 0px;
            }
            .icon {
                position: absolute;
                right: 14px;
                top: 0;
                bottom: 0;
                margin: auto;
            }
        }
    }
    .device-table-view {
        width: 100%;
        margin-top: 44px;
        .device-table-cell {
            width: 100%;
            background-color: #f8f8f8;
            .padding {
                width: 100%;
                padding: 0 0 0 50px;
                background-color: #fff;
                .device-item {
                    width: 100%;
                    height: 44px;
                    line-height: 44px;
                    position: relative;
                    &.border-bottom {
                        .border-btm(@borderGray);
                    }
                    .dingding-icon {
                        width: 22px;
                        height: 22px;
                        border-radius: 50%;
                        position: absolute;
                        left: -36px;
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
                        position: absolute;
                        padding-right: 35px;
                        right: 0;
                        z-index: 20;
                    }
                    .icon {
                        position: absolute;
                        right: 14px;
                        bottom: 16px;
                        z-index: 20;
                    }
                    .cancel-btn {
                        font-size: 14px;
                        color: #3399FF;
                        letter-spacing: 0px;
                        position: absolute;
                        z-index: 22;
                        right: 14px;
                        width: 40px;
                        text-align: right;
                    }
                    .device-status {
                        font-size: 14px;
                        color: #666666;
                        letter-spacing: 0px;
                        position: ABSOLUTE;
                        right: 14px;
                        &.red-font {
                            color: #FF6666;
                        }
                    }
                }
            }
            .desc-wrap {
                width: 100%;
                &.jiantou {
                    position: relative;
                    &::before {
                        content: "";
                        width: 18px;
                        height: 18px;
                        background-color: #f2f2f2;
                        position: absolute;
                        right: 18px;
                        top: -7px;
                        transform: rotate(45deg);
                        -ms-transform: rotate(45deg);
                        /* IE 9 */
                        -moz-transform: rotate(45deg);
                        /* Firefox */
                        -webkit-transform: rotate(45deg);
                        /* Safari 和 Chrome */
                        -o-transform: rotate(45deg);
                    }
                }
                .text {
                    width: 100%;
                    padding: 14px 14px 0 14px;
                    position: relative;
                    height: 94px;
                    textarea {
                        width: 100%;
                        height: 80px;
                        background: #F2F2F2;
                        border: 1px solid #EEEEEE;
                        border-radius: 4px;
                        padding: 8px;
                        box-sizing: border-box;
                    }
                    .word-number {
                        font-size: 12px;
                        color: #999999;
                        letter-spacing: 0px;
                        position: absolute;
                        bottom: 6px;
                        right: 24px;
                        .red-font {
                            color: #ff4949;
                        }
                    }
                    .desc {
                        opacity: 0.72;
                        background: #FFFFFF;
                        border: 1px solid #CCCCCC;
                        border-radius: 4px;
                        height: 80px;
                        font-size: 14px;
                        color: #666666;
                        letter-spacing: 0px;
                        line-height: 18px;
                        padding: 8px
                    }
                }
                .photo-wrap {
                    background: none;
                }
            }
        }
    }
    .device-submit-btn {
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
}
</style>
