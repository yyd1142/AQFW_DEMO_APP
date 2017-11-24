<template>
    <div class="QiandaoDailyXuncha">
        <div class="placeholder-item"></div>
        <mko-header :title="$route.query.name" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <timer :status="dailXunchaTaskStatus" :used-timer="dailyXunchaUsedTimer"></timer>
            <div class="camera-wrap" :style="{marginTop: (dailXunchaTaskStatus == 2 ? '44px' : 0)}">
                <div class="padding">
                    <div class="xuncha-item">
                        <span class="key">拍照签到</span>
                    </div>
                </div>
                <photo-box max="8" :photo-list="checkPointPhotos" :user-camera="true" @removePhotoEvent="removePhoto"
                           @addPhotoEvent="takePhoto" :read-only="dailXunchaTaskStatus == 3 ? true : false"></photo-box>
            </div>
            <transition name="fade">
                <div class="xuncha-type" v-if="devices.notChecked && devices.notChecked.length > 0">
                    <div class="left">
                        <div class="title">未巡查设备</div>
                        <div class="all-checked" @click.stop="allChecked" v-text="isAllChecked ? '取消全选' : '全选'"></div>
                    </div>
                    <div class="end-time">截止日期</div>
                </div>
            </transition>
            <transition name="fade">
                <ul class="xuncha-device-table-view" v-if="devices.notChecked && devices.notChecked.length > 0">
                    <li class="xuncha-device-table-cell" v-for="item, index in devices.notChecked">
                        <i :class="item.checked ? (item.needInputData == 1 ? 'icon-yellow-checked' : 'icon-green-checked') : 'icon-no-checked'"
                           @click.stop="checkeDevice(index, item.checked)"></i>
                        <div class="main" @click.stop="viewDevice(item, index)">
                            <span class="device-name">{{deviceNameFilter(item.unitId)}}</span>
                            <span class="end-time">{{dateFilter(item.nextCheckTime)}}</span>
                            <div class="xuncha-times" v-if="parseInt(item.patrolFrequency[2]) > 1">
                                <span class="item" :class="countIndex < item.checkCount ? 'activied' : null"
                                      v-for="count, countIndex in parseInt(item.patrolFrequency[2])"></span>
                            </div>
                            <i class="icon icon-arrow-right"></i>
                        </div>
                    </li>
                </ul>
            </transition>
            <div class="xuncha-type" v-if="devices.hasChecked && devices.hasChecked.length > 0">
                <div class="left">
                    <div class="title">已巡查设备</div>
                </div>
                <div class="end-time">上次巡查</div>
            </div>
            <ul class="xuncha-device-table-view" v-if="devices.hasChecked && devices.hasChecked.length > 0">
                <li class="xuncha-device-table-cell" v-for="item, index in devices.hasChecked">
                    <div class="dingding-icon" :class="item.problemCount === 0 ? 'green-icon' : 'red-icon'">
                        <span></span>
                    </div>
                    <div class="main">
                        <span class="device-name">{{deviceNameFilter(item.unitId)}}</span>
                        <span
                            class="end-time disabled">{{lastCheckTimeFilter(item.lastCheckTime) | formatDate('YYYY-MM-DD')}}</span>
                        <!-- <i class="icon icon-link-arrow"></i> -->
                    </div>
                </li>
            </ul>
            <div class="load-more-btn" v-if="false">
                <span class="item">查看更多
                    <i class="icon icon-link-arrow-up"></i>
                </span>
            </div>
            <div class="qiandao-submit-btn" @click.stop="confirm()" v-if="dailXunchaTaskStatus != 3">
                <span>确认</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {PhotoBox, Timer} from 'components'
    import api from 'api'
    import {Toast, Indicator} from 'mint-ui'
    import {mapGetters} from 'vuex'
    import * as types from 'store/mutation-types'
    import {formatDate} from 'filters'
    import moment from 'moment'
    export default {
        data() {
            return {
                isAllChecked: false,
                bInputData: false
            }
        },
        computed: {
            devices() {
                let CheckedPointPositionDevices = {
                    checkPointPhotos: [],
                    deviceUnits: [],
                    hasChecked: [],
                    notChecked: []
                };
                if (this.$store.state.dailyXuncha) {
                    CheckedPointPositionDevices = this.$store.state.dailyXuncha.CheckedPointPositionDevices ? this.$store.state.dailyXuncha.CheckedPointPositionDevices : CheckedPointPositionDevices;
                }
                return CheckedPointPositionDevices;
            },
            checkPointPhotos() {
                return this.$store.state.dailyXuncha ? this.$store.state.dailyXuncha.checkPointPhotos : [];
            },
            dailyXunchaUsedTimer() {
                return this.$store.state.dailyXuncha ? this.$store.getters.dailyXunchaUsedTimer : null;
            },
            dailXunchaTaskStatus() {
                return this.$store.state.dailyXuncha ? this.$store.state.dailyXuncha.status : 0;
            }
        },
        activated() {
            this.$store.dispatch('initDailyXunchaDevices', this.$route.query)
            this.setBackButton();
        },
        deactivated() {
            window.mkoBackButton.bInputData = false;
            this.isAllChecked = false;
            this.bInputData = false;
        },
        methods: {
            back() {
                if (this.checkPointPhotos.length > 0) {
                    this.confirm();
                    return false;
                }
                this.$MKOPop();
            },
            setBackButton() {
                let self = this;
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                window.mkoBackButton.callback = function () {
                    window.mkoBackButton.bInputData = false;
                    if (self.checkPointPhotos.length <= 0) {
                        self.$MKOPop();
                        return false;
                    }
                    self.confirm();
                }
            },
            removePhoto(index) {
                let params = this.$route.query
                params['photoIndex'] = index
                this.$store.commit(types.DAILYXUNCHA_ACTION_REMOVE_PHOTO, params);
            },
            takePhoto() {
                if (this.dailXunchaTaskStatus != 2) return false;
                this.bInputData = true;
                let self = this;

//                let params = self.$route.query
//                params['url'] = 'http://resources.aqfwy.com/303eb2d592b94d0dafea92354867000906000000'
//                self.$store.commit(types.DAILYXUNCHA_ACTION_ADD_PHOTO, params);

                let dateNow = new Date();
                let dateTime = moment(dateNow).format("YYYY年MM月DD日 HH点mm分");
                let watermark = `巡查位置: ${this.$route.query.name}\n时间: ${dateTime}\n执行人: ${this.$store.getters.employeeName}`;
                this.$takePhotoAndAddWatermark(watermark, function (photo) {
                    let params = self.$route.query
                    params['url'] = photo.url
                    self.$store.commit(types.DAILYXUNCHA_ACTION_ADD_PHOTO, params);
                })
            },
            allChecked() {
                this.isAllChecked = !this.isAllChecked;
                let params = this.$route.query
                params['isAllChecked'] = this.isAllChecked;
                this.$store.commit(types.DAILYXUNCHA_ALL_CHECKED_DEVICE, params);
            },
            checkeDevice(index, checked) {
                let params = this.$route.query
                params['index'] = index;
                params['checked'] = checked;
                this.$store.commit(types.DAILYXUNCHA_CHECKED_DEVICE, params);
            },
            viewDevice(item, index) {
                if (this.checkPointPhotos.length <= 0) {
                    Toast({message: '请先拍照签到', position: 'middle', duration: 1500});
                    return false;
                }
                this.$MKOPush({
                    path: `/deviceDailyXuncha/${this.$route.params.id}`,
                    query: {
                        positionId: this.$route.query.positionId,
                        deviceId: item.id,
                        buildIndex: this.$route.query.buildIndex,
                        floorIndex: this.$route.query.floorIndex,
                        name: this.$route.query.name,
                        patrolFrequency: item.patrolFrequency
                    }
                })
            },
            viewDeviceHistory(item, index) {
                this.$store.commit(types.DAILYXUNCHA_DEVICE_HISTORY, {index});
                this.$MKOPush({
                    path: `/deviceDailyXuncha/${this.$route.params.id}`,
                    query: {
                        positionId: this.$route.query.positionId,
                        deviceId: item.deviceId,
                        buildIndex: this.$route.query.buildIndex,
                        floorIndex: this.$route.query.floorIndex,
                        isHistory: true
                    }
                })
            },
            confirm() {
                let isWrongNumber = false
                let isNotChecked = true
                let isNotInputData = false
                if (this.checkPointPhotos.length <= 0) {
                    Toast({message: '请先拍照签到', position: 'middle', duration: 1500});
                    return false;
                }
                for (let item of this.devices.notChecked) {
                    if (item.checked && item.checkCount > 1 && item.hasCheckedCount != item.checkCount) isWrongNumber = true;
                    if (item.checked && item.needInputData == 1) isNotInputData = true
                }
                if (isWrongNumber) {
                    Toast({message: '执行次数不正确', position: 'middle', duration: 1500});
                    return false;
                }
                if (isNotInputData) {
                    Toast({message: '设备未输入数值', position: 'middle', duration: 1500});
                    return false;
                }
                Indicator.open({spinnerType: 'fading-circle'});
                let params = this.$route.query;
                let counts = [];
                for (let item of this.devices.hasChecked) {
                    counts.push(item.problemCount ? item.problemCount : 0)
                }
                ;
                params['problemDeviceCount'] = eval(counts.join('+'))
                this.$store.commit(types.DAILYXUNCHA_UPDATE_PROBLEMDEVICECOUNT, params)
                this.$store.commit(types.DAILYXUNCHA_CONFIRM_DEVICES, this.$route.query)
                setTimeout(() => {
                    Indicator.close();
                    this.$MKOPop();
                }, 1000);
            },
            deviceNameFilter(id) {
                let deviceUnits = this.devices.deviceUnits;
                let deviceUnitItem = deviceUnits.filter(item => {
                    return item.unitID == id
                });
                return deviceUnitItem[0].unitName;
            },
            dateFilter(date) {
                let today = new Date();
                let tomorrow = new Date().setDate(new Date().getDate() + 1);
                let text = '';
                date = date.toString()
                let year = date.substring(0, 4)
                let month = date.substring(4, 6)
                let day = date.substring(6)
                let d = new Date(year, month, day, 0, 0, 0)
                d.setDate(d.getDate() - 1)
                if (moment(today).format('YYYY-MM-DD') === moment(d).format('YYYY-MM-DD')) {
                    text = '今天'
                } else if (moment(tomorrow).format('YYYY-MM-DD') === moment(d).format('YYYY-MM-DD')) {
                    text = '明天'
                } else {
                    text = moment(d).format('YYYY-MM-DD')
                }
                return text
            },
            lastCheckTimeFilter(date) {
                date = date.toString()
                if (date.length == 8) {
                    let year = date.substring(0, 4)
                    let month = date.substring(4, 6)
                    let day = date.substring(6)
                    date = new Date(year, month, day, 0, 0, 0)
                } else {
                    date = parseInt(date)
                }
                return date;
            }
        },
        components: {
            PhotoBox,
            Timer
        }
    }
</script>

<style lang="less">
    @import "../../../../config.less";

    .QiandaoDailyXuncha {
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
                    z-index: 23;
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
                    z-index: 22;
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
                            padding-right: 14px;
                        }
                    }
                    .xuncha-times {
                        min-width: 22px;
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
    }
</style>
