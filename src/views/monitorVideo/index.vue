<template>
    <div class="VideoSurveillance">
        <div class="placeholder-item"></div>
        <mko-header title="视频监控" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <mko-nav-bar>
                <mko-tab-item :label="item " :activied="tabI==i" @handleTabClick="tab"
                              v-for="(item,i) in tabItems"></mko-tab-item>
            </mko-nav-bar>
            <div class="title-wrap-a">
                <div class="left">
                    <div class="title">{{tabI == 0 ? '实时报警信息' : '设备列表'}}</div>
                </div>
                <div class="right">
                    {{tabI == 0 ? '共' + deviceAlarmDatas.length + '条记录' : '共' + deviceMonitorDatas.length + '个设备'}}
                </div>
            </div>
            <div class="video-table-view" v-if="tabI == 0">
                <mko-double-cell :title="titleFilter(item)" :label="item.address" @click="goInfo(item)" is-link
                                 v-for="item in deviceAlarmDatas">
                    <span :class="item.status == 2 ? 'blue' : null">{{item.status == 2 ? '未处理' : '正常'}}</span>
                </mko-double-cell>
            </div>
            <ul class="surveillance-table-view" v-show="tabI == 1">
                <li class="surveillance-table-cell" v-for="item in deviceMonitorDatas" @click="goLiveViedo(item)">
                    <div class="padding">
                        <!--<video-player class="vjs-custom-skin" :options="item.playerOptions"></video-player>-->
                        <img src="/static/video_default.png"/>
                        <div class="item">
                            <span class="dingding"></span>
                            <div class="name">{{item.name}}</div>
                            <div class="address">{{item.address}}</div>
                            <div class="time">{{item.status == 2 ? '未处理' : '正常'}}</div>
                            <i class="icon icon-link-arrow"></i>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import 'videojs-contrib-hls/dist/videojs-contrib-hls'
    export default {
        data() {
            return {
                tabI: 0,
                tabs: [{name: '设备报警', actived: true, labelName: 'alarm'}, {
                    name: '监控设备',
                    actived: false,
                    labelName: 'surveillance'
                }],
                datas: [],
                deviceAlarmDatas: [{
                    address: 'A栋|B1|131（应急出口）',
                    count: 0,
                    name: '应急出口堵塞监测',
                    status: 1
                }, {
                    address: 'A栋|B1|122（电压房）',
                    count: 5,
                    name: '电压房堵塞监测',
                    status: 2
                }, {
                    address: 'A栋|B1|89（安全出口）',
                    count: 6,
                    name: '安全出口堵塞监测',
                    status: 2
                }],
                deviceMonitorDatas: [{
                    id: 1,
                    address: 'A栋|B1|131（办公室）',
                    count: 1,
                    name: '办公室安全监测',
                    status: 2,
                    url: 'https://as-all1.secdn.net/steftest-channel/play/scaleengine-promo/chunklist_w1460433603.m3u8',
                    liveVideoType: 'application/x-mpegURL'
                }, {
                    id: 2,
                    address: 'A栋|B2|131（消防通道）',
                    count: 4,
                    name: '消防通道堵塞监测',
                    status: 2,
                    url: 'https://as-all1.secdn.net/steftest-channel/play/scaleengine-promo/chunklist_w1460433603.m3u8',
                    liveVideoType: 'application/x-mpegURL'
                }, {
                    id: 3,
                    address: 'A栋|B3|131（泵房）',
                    count: 3,
                    name: '泵房安全监测',
                    status: 2,
                    url: 'https://as-all1.secdn.net/steftest-channel/play/scaleengine-promo/chunklist_w1460433603.m3u8',
                    liveVideoType: 'application/x-mpegURL'
                }]
            }
        },
        computed: {
            tabItems() {
                let deviceAlarmProblemCount = 0;
                let deviceAlarmProblemCounts = [];
                let deviceMonitorProblemCount = 0;
                let deviceMonitorProblemCounts = [];
                for (let item of this.deviceAlarmDatas) {
                    deviceAlarmProblemCounts.push(item.count);
                    deviceAlarmProblemCount = eval(deviceAlarmProblemCounts.join("+"));
                }
                for (let item of this.deviceMonitorDatas) {
                    deviceMonitorProblemCounts.push(item.count);
                    deviceMonitorProblemCount = eval(deviceMonitorProblemCounts.join("+"));
                }
                return [`设备报警${deviceAlarmProblemCount}`, `监控设备${deviceMonitorProblemCount}`];
            }
        },
        methods: {
            back() {
                this.$MKOPop();
            },
            tab(item) {
                for (let tab of this.tabs) {
                    tab.actived = item.name == tab.name ? true : false
                }
                this.labelName = item.labelName
            },
            goInfo(item) {
                this.$MKOPush({
                    name: 'AlarmDetail',
                    params: {
                        id: item
                    }
                })
            },
            goLiveViedo(item) {
//                type: "application/x-mpegURL",
//                type: "video/mp4",
//                type: "rtmp/mp4",
                this.$MKOPush({
                    name: 'LiveVideoDetail',
                    params: {
                        id: item.id
                    },
                    query: {
                        liveUrl: item.url,
                        type: item.liveVideoType
                    }
                })
            },
            tab(text){
                for (let i in this.tabItems) {
                    if (text == this.tabItems[i]) {
                        this.tabI = i;
                        return;
                    }
                }
            },
            titleFilter(item) {
                if (item.count == 0) {
                    return item.name;
                } else {
                    return `<span class='dingding'>${item.count}</span>${item.name}`;
                }
            }
        }
    }
</script>
<style lang="less">
    @import "../../config.less";

    .VideoSurveillance {
        .title-wrap-a {
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
            .right {
                float: right;
                font-size: 12px;
                color: #999999;
                letter-spacing: 0px;
                line-height: 44px;
                height: 44px;
            }
        }
        .video-table-view {
            width: 100%;
            background-color: #ffffff;
            .blue {
                color: #3CA0E8;
            }
            .dingding {
                color: #ffffff;
                background-color: #ff0008;
                font-size: 12px;
                width: 24px;
                height: 14px;
                text-align: center;
                display: inline-block;
                border-radius: 3px;
                line-height: 17px;
                margin-right: 6px;
            }
        }
        .surveillance-table-view {
            width: 100%;
            .surveillance-table-cell {
                width: 100%;
                position: relative;
                background-color: #ffffff;
                box-sizing: border-box;
                margin-bottom: 14px;
                .padding {
                    .border-btm(@borderGray);
                    .vjs-custom-skin {
                        width: 100%;
                        .video-js {
                            height: 228px !important;
                        }
                    }
                    img {
                        width: 100%;
                    }
                    .item {
                        position: relative;
                        height: 60px;
                        padding-left: 55px;
                        .dingding {
                            background: url('/static/icons/video.png') 0 0 no-repeat;
                            width: 55px / 2;
                            height: 55px / 2;
                            position: absolute;
                            background-size: cover;
                            left: 14px;
                            margin: AUTO;
                            top: 0;
                            bottom: 0;
                        }
                        .icon {
                            position: absolute;
                            right: 14px;
                            margin: auto;
                            bottom: 0;
                            top: 0;
                        }
                        .name {
                            width: 100%;
                            font-size: 14px;
                            padding-top: 14px;
                        }
                        .address {
                            width: 100%;
                            font-size: 12px;
                            margin-top: 10px;
                            color: #999;
                        }
                        .time {
                            position: absolute;
                            right: 28px;
                            font-size: 14px;
                            height: 14px;
                            margin: auto;
                            top: 0;
                            bottom: 0;
                        }
                    }
                }
            }
        }
    }
</style>
