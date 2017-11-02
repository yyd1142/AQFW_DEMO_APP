<template>
    <div class="LiveVideoDetail">
        <div class="placeholder-item"></div>
        <mko-header title="设备详情" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <mko-nav-bar>
                <mko-tab-item :label="item" :activied="tabI==i" @handleTabClick="tab"
                              v-for="(item,i) in tabItems"></mko-tab-item>
            </mko-nav-bar>
            <div class="player">
                <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions" @ready="playerReadied">
                </video-player>
            </div>
        </div>
    </div>
</template>

<script>
    require('videojs-contrib-hls/dist/videojs-contrib-hls')
    export default {
        data() {
            return {
                tabI: 0,
                tabItems: ['实时监控', '设备信息', '报警记录'],
                playerOptions: {
                    sources: [{
                        withCredentials: false,
                        type: "application/x-mpegURL",
                        src: "http://ivi.bupt.edu.cn/hls/cctv5hd.m3u8"
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
                this.player.pause();
                for (let i in this.tabItems) {
                    if (text == this.tabItems[i]) {
                        this.tabI = i;
                        return;
                    }
                }
            }
        }
    }
</script>
<style>
    .LiveVideoDetail {

    }
</style>
