<template>
    <div class="ReviewDailyXunchaDevice">
        <div class="placeholder-item"></div>
        <mko-header :title="$route.query.name" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <div class="review-task-info">
                <div class="padding">
                    <div class="item">
                        <span class="key">巡查人员</span>
                        <span class="value">{{statusInfo.name}}</span>
                    </div>
                    <div class="item">
                        <span class="key">巡查日期</span>
                        <span class="value">{{statusInfo.startTime | formatDate('YYYY-MM-DD')}}</span>
                    </div>
                    <div class="item">
                        <span class="key">巡查时间</span>
                        <span class="value">{{statusInfo.startTime | formatDate('HH:mm:ss')}}</span>
                    </div>
                </div>
            </div>
            <ul class="device-table-view">
                <li class="device-table-cell" :class="!item.value ? 'device-table-border' : null" v-for="(item, index) in checkRules">
                    <div class="padding">
                        <div class="device-item" :class="item.value ? 'border-bottom' : null">
                            <div class="dingding-icon" :class="!item.value ? 'yellow-icon' : 'green-icon'">
                                <span></span>
                            </div>
                            <span class="title" v-text="item.content"></span>
                            <span class="value" :class="!item.value ? 'red-font' : null">{{item.needInputData == 1 ? item.dataValue : (item.value ? '正常' : '风险')}}</span>
                        </div>
                    </div>
                    <div class="desc-wrap jiantou" v-if="!item.value">
                        <div class="text">
                            <div class="desc">{{item.description || '暂无描述'}}</div>
                        </div>
                        <photo-box max="8" :read-only="true" :photo-list="images && images.length > 0 ? images[index] : []" @onPopup="setBackButton()" v-if="images && images.length > 0 && images[index].length > 0"></photo-box>
                    </div>
                </li>
            </ul>
            <div class="review-bottom-btn" v-if="statusInfo.status == 5 && isAdmin == true">
                <mko-button size="large" @click="excludeYH()">排除故障</mko-button>
                <mko-button class="paichu" size="large" @click="confirmYH()" plain>上报故障</mko-button>
            </div>
        </div>
    </div>
</template>

<script>
import { PhotoBox } from 'components'
import api from 'api'
import apiconf from 'apiconf'
var statusInfo = {
    status: '',
    name: '',
    startTime: '',
    endTime: ''
}
export default {
    data() {
        return {
            images: [],
            checkRules: '',
            status: '',
            statusInfo: {}
        }
    },
    computed: {
        isAdmin() {
            return this.$store.state.user.isAdmin;
        }
    },
    activated() {
        statusInfo = sessionStorage.getItem('lastReviewDailyXunChaData') ? JSON.parse(sessionStorage.getItem('lastReviewDailyXunChaData')) : statusInfo;
        this.statusInfo = {
            status: statusInfo.status,
            name: statusInfo.name,
            startTime: statusInfo.startTime,
            endTime: statusInfo.endTime
        }
        this.status = this.$route.query.status;
        let rules = sessionStorage.getItem('lastReviewDailyXunChaDeviceRules') ? JSON.parse(sessionStorage.getItem('lastReviewDailyXunChaDeviceRules')) : [];
        if (rules && rules.length > 0) {
            let self = this;
            try {
                this.checkRules = rules;
                for (let i = 0; i < this.checkRules.length; i++) {
                    this.images.push([]);
                }
                for (let i = 0; i < this.checkRules.length; i++) {
                    let rule = this.checkRules[i];
                    if (rule.imageId && rule.imageId.length > 0) {
                        api.getByPath(`/info/${rule.imageId}`)({

                        }).then(res => {
                            if (res.code != 0)
                                return;
                            if (res.response && res.response.length > 0) {
                                for (let image of res.response) {
                                    self.images[i].push(`${apiconf.resourcesDomain}/${image.resouceId}`);
                                }
                            }
                        });
                    }
                }

            } catch (e) { }
        }
    },
    deactivated() {
        this.images = [];
        sessionStorage.removeItem('lastReviewDailyXunChaData');
        sessionStorage.removeItem('lastReviewDailyXunChaDeviceRules')
    },
    methods: {
        back() {
            this.$MKOPop()
        },
        confirmYH() {
            let self = this;
            this.$MKODialog({
                title: '提示',
                msg: '<div class="center">故障处置完成后请在PC端修改设备状态，确认上报吗？</div>',
                cancelBtn: true,
                cancelText: '取消'
            }).then(msg => {
                if (msg == 'confirm') {
                    api.getXCTaskChangeDeviceStatus({
                        positionId: this.$route.query.positionId,
                        deviceId: this.$route.query.deviceId,
                        status: 7
                    }).then(res => {
                        self.$MKOPop();
                    })
                }
            })
        },
        excludeYH() {
            let self = this;
            this.$MKODialog({
                title: '提示',
                msg: '<div class="center">排除故障后设备状态将标为正常，确认排除吗？</div>',
                cancelBtn: true,
                cancelText: '取消'
            }).then(msg => {
                if (msg == 'confirm') {
                    api.getXCTaskChangeDeviceStatus({
                        positionId: this.$route.query.positionId,
                        deviceId: this.$route.query.deviceId,
                        status: 6
                    }).then(res => {
                        self.$MKOPop();
                    })
                }
            })
        },
        setBackButton() {
            let self = this
            window.mkoBackButton = {}
            window.mkoBackButton.bInputData = true
            window.mkoBackButton.callback = function() {
                try {
                    window.MKODialogShow = false
                } catch (err) {
                    alert(err)
                }
                window.mkoBackButton.bInputData = false;
                self.$MKOPop();
            }
        }
    },
    components: {
        PhotoBox
    }
}
</script>

<style lang="less">
@import "../../../../config.less";
.ReviewDailyXunchaDevice {
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
            .icon-small-right-arrow {
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
                        width: 100%;
                        padding-right: 60px;
                        box-sizing: border-box;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        float: left;
                        height: 44px;
                        line-height: 44px;
                    }
                    .value {
                        font-size: 14px;
                        color: #666666;
                        letter-spacing: 0px;
                        position: absolute;
                        padding-right: 14px;
                        top: 0;
                        bottom: 0;
                        right: 0;
                        &.yellow-font {
                            color: #FFAA44;
                        }
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
                        width: 14px;
                        height: 14px;
                        background-color: #f8f8f8;
                        position: absolute;
                        right: 22px;
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
                    margin-bottom: 14px;
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
                        background: #f2f2f2;
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
                    .border-btm(@borderGray);
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
    .border-bottom {
        .border-btm(@borderGray);
    }
    .device-table-border {
        border-bottom: 1px solid rgba(211, 211, 211, 0.17);
    }
    .review-bottom-btn {
        width: 100%;
        margin-top: 14px;
        .paichu {
            margin-top: 10px;
        }
    }
    .review-task-info {
        width: 100%;
        padding: 14px;
        .padding {
            width: 100%;
            background: #FFFFFF;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
            border-radius: 4px;
            padding: 14px;
            .item {
                width: 100%;
                margin-bottom: 12px;
                &:last-child {
                    margin-bottom: 0;
                }
                .key {
                    font-size: 14px;
                    color: #999999;
                    letter-spacing: 0;
                    margin-right: 14px;
                }
                .value {
                    font-size: 14px;
                    color: #666666;
                    letter-spacing: 0;
                    line-height: 14px;
                }
            }
        }
    }
}
</style>
