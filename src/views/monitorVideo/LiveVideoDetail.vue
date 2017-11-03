<template>
    <div class="LiveVideoDetail">
        <div class="placeholder-item"></div>
        <mko-header title="设备详情" left-icon="icon-back" @handleLeftClick="back" right-icon-text="停用设备"></mko-header>
        <div class="page-wrap">
            <div class="player-wrap">
                <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions"
                              @ready="playerReadied">
                </video-player>
                <!--<div class="address">深圳湾体育中心-游泳馆，2层，西南角巡查点</div>-->
            </div>
            <div class="tab-wrap">
                <div class="cell" :class="tabI == index ? 'activied' : null" v-for="text, index in tabItems" @click="tab(text)">
                    <span v-text="text"></span>
                </div>
            </div>
            <device-detail v-show="tabI == 0"></device-detail>
            <alarm-record v-show="tabI == 1"></alarm-record>
        </div>
    </div>
</template>

<script>
    import 'videojs-contrib-hls/dist/videojs-contrib-hls'
    import DeviceDetail from './DeviceDetail.vue'
    import AlarmRecord from './AlarmRecord.vue'
    export default {
        data() {
            return {
                tabI: 0,
                tabItems: ['设备信息', '报警记录'],
                playerOptions: {
                    sources: [{
                        withCredentials: false,
                        type: "application/x-mpegURL",
                        src: "https://logos-channel.scaleengine.net/logos-channel/live/biblescreen-ad-free/playlist.m3u8"
                    }],
                    controlBar: {
                        timeDivider: false,
                        durationDisplay: false
                    },
                    autoplay: false,
                    flash: {hls: {withCredentials: false}},
                    html5: {hls: {withCredentials: false}}
                }
            }
        },
        computed: {
            player() {
                return this.$refs.videoPlayer.player
            }
        },
        deactivated() {
            this.$nextTick(() => {
                this.player.dispose(); //销毁
            })
        },
        methods: {
            playerReadied(player) {
                var hls = player.tech({IWillNotUseThisInPlugins: true}).hls
                player.tech_.hls.xhr.beforeRequest = function (options) {
                    return options
                }
            },
            back() {
                this.$MKOPop();
            },
            tab(text){
                for (let i in this.tabItems) {
                    if (text == this.tabItems[i]) {
                        this.tabI = i;
                        return;
                    }
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
                line-height: 24px;
                &.activied {
                    color: #3CA0E8;
                    span {
                        border-bottom: 2px solid #3CA0E8;
                        display: block;
                        width: 56px;
                        margin-left: auto;
                        margin-right: auto;
                    }
                }
                span {
                    font-size: 14px;
                }
            }
        }
    }
</style>
