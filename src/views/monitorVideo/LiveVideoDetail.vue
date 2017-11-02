<template>
    <div class="LiveVideoDetail">
        <div class="placeholder-item"></div>
        <mko-header title="设备详情" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <mko-nav-bar>
                <mko-tab-item :label="item" :activied="tabI==i" @handleTabClick="tab"
                              v-for="(item,i) in tabItems"></mko-tab-item>
            </mko-nav-bar>
            <div class="player" v-show="tabI == 0">
                <video-player id="videoPlayer" class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions" @ready="playerReadied">
                </video-player>
            </div>
            <device-detail v-show="tabI == 1"></device-detail>
            <alarm-record v-show="tabI == 2"></alarm-record>
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
                tabItems: ['实时监控', '设备信息', '报警记录'],
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
                    autoplay: true,
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
                this.player.pause();
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
                if (text === '实时监控') {
                    this.player.play();
                } else {
                    this.player.pause();
                }
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
<style>
    .LiveVideoDetail {

    }
</style>
