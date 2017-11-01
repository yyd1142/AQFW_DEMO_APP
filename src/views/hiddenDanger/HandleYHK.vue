<template>
    <div class="HandleYHK">
        <div class="placeholder-item"></div>
        <mko-header title="处理风险" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <div class="yh-list" v-for="item in positions">
                <div class="title">{{item.name}}</div>
                <ul class="xuncha-device-table-view">
                    <li class="xuncha-device-table-cell" v-for="(device, deviceIndex) in item.devices" @click.stop="goInfo(device)">
                        <div class="dingding-icon yellow-icon">
                            <span></span>
                        </div>
                        <span class="device-name">{{device.unitName || '暂无'}}</span>
                        <span class="end-time">{{device.status | xunchaDeviceStatusFilter}}</span>
                        <!-- <i class="yellow-d"></i> -->
                        <i class="icon icon-link-arrow"></i>
                    </li>
                </ul>
            </div>
            <no-data v-if="positions.length <= 0"></no-data>
        </div>
    </div>
</template>

<script>
import api from 'api'
import { NoData } from 'components'
import { Toast } from 'mint-ui'
export default {
    data() {
        return {
            positions: []
        }
    },
    computed: {
        taskId() {
            return this.$route.params.taskId;
        }
    },
    activated() {
        this.checkPointDeviceResultByHasRisk()
    },
    methods: {
        checkPointDeviceResultByHasRisk() {
            api.checkPointDeviceResultByHasRisk({
                taskId: this.taskId
            }).then(result => {
                if (!result) return false;
                if (result.response && result.code == 0) {
                    let devices = result.response;
                    let cacheMap = {};
                    for (let device of devices) {
                        let levelName = `${device.jzLevel}层`;
                        if (device.jzLevel == 0)
                            levelName = "特殊位置";
                        let key = `${device.jzName},${levelName},${device.jzPosition}`;
                        let tmpDevices = cacheMap[key];
                        if (!tmpDevices) {
                            tmpDevices = [];
                            cacheMap[key] = tmpDevices;
                        }
                        tmpDevices.push(device);
                    }

                    let positions = [];
                    let allKeys = Object.keys(cacheMap);
                    for (let key of allKeys) {
                        positions.push({
                            name: key,
                            devices: cacheMap[key]
                        })
                    }
                    this.positions = positions;
                } else {
                    this.positions = [];
                }
            })
        },
        back() {
            this.$MKOPop();
        },
        goInfo(device) {
            if (device.status == 7) {
                Toast({ message: '设备处置中', position: 'middle', duration: 1500 });
                return false;
            }
            sessionStorage.setItem('lastReviewDailyXunChaData', JSON.stringify(this.$route.query.statusInfo));
            sessionStorage.setItem('lastReviewDailyXunChaDeviceRules', device.attribute);
            this.$MKOPush({
                name: 'ReviewDailyXunchaDevice',
                params: {
                    id: this.taskId
                },
                query: {
                    deviceId: device.deviceId,
                    status: device.status,
                    positionId: device.positionId,
                    name: device.unitName || '暂无'
                }
            })
        }
    },
    components: {
        NoData
    }
}
</script>

<style lang="less">
@import "../../config.less";
.HandleYHK {
    .yh-list {
        width: 100%;
        .title {
            font-size: 12px;
            color: #666666;
            letter-spacing: 0;
            line-height: 12px;
            width: 100%;
            padding-left: 14px;
            margin: 14px 0 8px 0;
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
                .device-name {
                    font-size: 16px;
                    color: #333333;
                    letter-spacing: 0px;
                    line-height: 16px;
                }
                .end-time {
                    font-size: 14px;
                    color: #666666;
                    letter-spacing: 0px;
                    float: right;
                    padding-right: 34px;
                    &.yellow {
                        color: #FFAA44;
                    }
                }
                .yellow-d {
                    border-radius: 50%;
                    height: 12px;
                    width: 12px;
                    background: #FFBB00;
                    position: absolute;
                    right: 66px;
                    margin: auto;
                    top: 0;
                    bottom: 0;
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
}
</style>
