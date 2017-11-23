<template>
    <div class="LiveVideoDetail">
        <div class="placeholder-item"></div>
        <mko-header title="设备详情" left-icon="icon-back" @handleLeftClick="back" :right-icon-text="status == 0 ? '启用': '停用'" @handleRightClick="changeStatus"></mko-header>
        <div class="page-wrap">
            <div class="player-wrap">
                <video-player id="videoPlayer" class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions" @ready="playerReadied"></video-player>
                <!--<div class="address">深圳湾体育中心-游泳馆，2层，西南角巡查点</div>-->
            </div>
            <div class="tab-wrap">
                <div class="cell" :class="tabI == index ? 'activied' : null" v-for="text, index in tabItems"
                     @click="tab(text)">
                    <span v-text="text"></span>
                </div>
            </div>
            <device-detail v-show="tabI == 0" :status="status" :address="address"></device-detail>
            <alarm-record v-show="tabI == 1" :address="address"></alarm-record>
        </div>
    </div>
</template>

<script>
    import { Indicator, Toast } from 'mint-ui'
    import DeviceDetail from './DeviceDetail.vue'
    import AlarmRecord from './AlarmRecord.vue'
    import 'videojs-contrib-hls/dist/videojs-contrib-hls'
    export default {
        data() {
            return {
                tabI: 0,
                tabItems: ['设备信息', '报警记录'],
                isPlayer: true,
                status: '',
                address: ''
            }
        },
        computed: {
            player() {
                return this.$refs.videoPlayer ? this.$refs.videoPlayer.player : null;
            },
            playerOptions() {
                let id = this.$route.params.id;
                let liveVideoSrc = ['', 'http://61.177.139.216:8891/hls/100961/index.m3u8', 'http://61.177.139.216:8891/hls/100962/index.m3u8', 'http://61.177.139.216:8891/hls/100963/index.m3u8', 'http://61.177.139.216:8891/hls/100964/index.m3u8']
                let options = {
                    sources: [{
                        withCredentials: false,
                        type: 'application/x-mpegURL',
                        src: liveVideoSrc[id]
                    }],
                    controlBar: {
                        timeDivider: false,
                        durationDisplay: false,
                        fullscreenToggle: false
                    },
                    autoplay: true,
                    flash: {hls: {withCredentials: true}},
                    html5: {hls: {withCredentials: true}}
                }
                return options;
            },
        },
        activated() {
            this.status = this.$route.query.status;
            this.address = this.$route.query.address;
            if(!this.isPlayer) {

            }
        },
        deactivated() {
            this.tabI = 0
        },
        methods: {
            back() {
                this.isPlayer = false;
                this.$MKOPop();
            },
            tab(text){
                for (let i in this.tabItems) {
                    if (text == this.tabItems[i]) {
                        this.tabI = i;
                        return;
                    }
                }
            },
            changeStatus() {
                let status = this.$route.query.status;
                let json = JSON.parse(sessionStorage.getItem('videoDeviceDatas'));
                this.$MKODialog({
                    title: "提示",
                    msg: `确定${status === 0 ? '启用' : '停用'}吗？`,
                    cancelBtn: true,
                    cancelText: "取消"
                }).then(msg => {
                    if (msg == "confirm") {
                        Indicator.open({ spinnerType: 'fading-circle' });
                        for(let item of json.deviceMonitorDatas) {
                            if(item.id === this.$route.params.id) {
                                item.status = status === 0 ? 1 : 0;
                            }
                        }
                        sessionStorage.setItem('videoDeviceDatas', JSON.stringify(json));
                        setTimeout(() => {
                            Indicator.close();
                            this.status = this.status === 0 ? 1 : 0;
                            Toast({message: `已${this.status === 0 ? '停用' : '启用'}`, duration: 2000});
                        }, 1500)
                    }
                });
            },
            playerReadied(player) {
                var hls = player.tech({ IWillNotUseThisInPlugins: true }).hls
                player.tech_.hls.xhr.beforeRequest = function(options) {
                    // console.log(options)
                    return options
                }
            }
        },
        components: {
            DeviceDetail,
            AlarmRecord
        }
    }
</script>
<style lang="less">
    @import "../../config.less";
    .LiveVideoDetail {
        .player-wrap {
            position: relative;
            .address {
                position: absolute;
                color: #ffffff;
                font-size: 14px;
                bottom: 0;
                height: 24px;
                line-height: 24px;
                padding-left: 14px;
                background-color: rgba(51, 51, 51, 0.55);
                width: 100%;
            }
            .vjs-custom-skin {
                width: 100%;
                .video-js {
                    height: 228px !important;
                }
            }
        }
        .tab-wrap {
            width: 100%;
            height: 32px;
            background-color: #ffffff;
            margin-bottom: 14px;
            .cell {
                width: 50%;
                float: left;
                text-align: CENTER;
                height: 24px;
                line-height: 26px;
                color: @mainBlue;
                &.activied {
                    span {
                        border-bottom: 2px solid @mainBlue;
                        display: block;
                        width: 62px;
                        margin-left: auto;
                        margin-right: auto;
                    }
                }
                span {
                    font-size: 15px;
                }
            }
        }
    }
</style>
