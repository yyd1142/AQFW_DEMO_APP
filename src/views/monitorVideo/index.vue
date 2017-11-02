<template>
    <div class="VideoSurveillance">
        <div class="placeholder-item"></div>
        <mko-header title="视频监控" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <div class="tabs-wrap">
                <div class="cell" :class="item.actived ? 'actived' : null" v-for="(item, index) in tabs"
                     @click="tab(item)">
                    <i class="icon iconfont icon-success"></i>
                    <span class="text" v-text="item.name"></span>
                </div>
            </div>
            <div class="title">{{labelName == 'alarm' ? '实时报警信息' : '实时监控视频'}}</div>
            <ul class="video-table-view" v-if="labelName == 'alarm'">
                <li class="video-table-cell" v-for="item in 3" @click="goInfo(item)">
                    <div class="padding">
                        <span class="number">1</span>
                        <div class="name">消防通道堵塞监测</div>
                        <div class="address">A栋|B1|131（消防通道）</div>
                        <div class="time">2017-11-11 09:11</div>
                        <div class="status">待处理</div>
                        <i class="icon icon-link-arrow"></i>
                    </div>
                </li>
            </ul>
            <ul class="surveillance-table-view" v-if="labelName == 'surveillance'">
                <li class="surveillance-table-cell" v-for="item in 3" @click="goLiveViedo(item)">
                    <div class="padding">
                        <img src="/static/WX20171101-165733.png"/>
                        <div class="name">消防通道堵塞监测</div>
                        <div class="address">A栋|B1|131（消防通道）</div>
                        <div class="time">2017-11-11 09:11</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                tabs: [{name: '设备报警', actived: true, labelName: 'alarm'}, {name: '监控设备', actived: false, labelName: 'surveillance'}],
                labelName: 'alarm'
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
                this.$MKOPush({
                    name: 'LiveVideoDetail',
                    params: {
                        id: item
                    }
                })
            }
        }
    }
</script>
<style lang="less">
    @import "../../config.less";

    .VideoSurveillance {
        .tabs-wrap {
            width: 100%;
            background-color: #ffffff;
            height: 88px;
            .cell {
                width: 50%;
                height: 88px;
                float: left;
                position: relative;
                text-align: center;
                padding-top: 14px;
                &.actived {
                    .icon, .text {
                        color: #3CA0E8;
                    }
                }
                .icon {
                    font-size: 26px;
                }
                .text {
                    width: 100%;
                    display: block;
                    font-size: 14px;
                    margin-top: 10px;
                }
            }
        }
        .title {
            font-size: 14px;
            height: 36px;
            line-height: 36px;
            padding-left: 14px;
        }
        .video-table-view {
            width: 100%;
            background-color: #ffffff;
            .video-table-cell {
                width: 100%;
                position: relative;
                background-color: #ffffff;
                height: 66px;
                padding: 0 0 0 14px;
                box-sizing: border-box;
                .padding {
                    .border-btm(@borderGray);
                    .number {
                        position: absolute;
                    }
                    .name {
                        width: 100%;
                    }
                    .address {
                        width: 100%;
                    }
                    .time {
                        width: 100%;
                    }
                    .status {
                        width: 100%;
                        color: #ff0008;
                    }
                    .icon {
                        position: absolute;
                        right: 14px;
                        bottom: 0;
                        top: 0;
                        margin: auto;
                    }
                }
            }
        }
        .surveillance-table-view {
            width: 100%;
            background-color: #ffffff;
            .surveillance-table-cell {
                width: 100%;
                position: relative;
                background-color: #ffffff;
                box-sizing: border-box;
                .padding {
                    .border-btm(@borderGray);
                    img {
                        width: 100%;
                    }
                    .name {
                        width: 100%;
                    }
                    .address {
                        width: 100%;
                    }
                    .time {
                        width: 100%;
                    }
                }
            }
        }
    }
</style>
