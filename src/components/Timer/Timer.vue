<template>
    <div class="timer">
        <transition name="fade">
            <div class="timer-wrap" :class="timer ? 'timer-header' : ''" v-if="status == 2">
                <transition name="fade">
                    <div v-if="timer === false">
                <span class="icon">
                <i class="icon-clock"></i>
                </span>
                        <span class="text">{{text ? text : `进行中,${usedTimer}`}}</span>
                    </div>
                </transition>
                <transition name="fade">
                    <div class="big" v-show="timer">
                        <div class="loading">
                            <span class="jingxingzhong">进行中</span>
                            <i id="loadingCircle" class="icon loading-circle-white"></i>
                        </div>
                        <div class="used-timer" v-text="usedTimer"></div>
                    </div>
                </transition>
            </div>
        </transition>
    </div>
</template>
<script>
    var timer = null;
    var loadingCircle = null;
    var i = 0;
    var deg = 0;
    export default {
        data() {
            return {
                timer: false
            }
        },
        activated() {
            this.timer = false;
        },
        props: ['status', 'usedTimer', 'text', 'time'],
        watch: {
            status: function (val) {
                if (val === 2 && this.time <= 3) {
                    this.timer = true;
                    timer = setInterval(() => {
                        i += 1;
                        if (i === 3) {
                            this.timer = false;
                            i = 0;
                            deg = 0;
                            clearInterval(timer);
                            clearInterval(loadingCircle);
                            loadingCircle = null;
                        }
                    }, 1000);
                } else {
                    this.timer = false;
                    i = 0;
                }
            },
            timer: function (val) {
                if (val && loadingCircle == null) {
                    loadingCircle = setInterval(() => {
                        deg += 1;
                        this.$nextTick(() => {
                            if(document.getElementById("loadingCircle")) {
                                document.getElementById("loadingCircle").style.transform = `rotate(${deg}deg)`;
                                document.getElementById("loadingCircle").style.webkitTransform = `rotate(${deg}deg)`;
                            } else {
                                clearInterval(loadingCircle);
                                clearInterval(timer);
                                timer = null;
                                loadingCircle = null;
                                i = 0;
                                deg = 0;
                            }
                        })
                    }, 2);
                }
            }
        }
    }
</script>

<style lang="less">
    @import "../../config.less";

    .timer {
        .timer-wrap {
            width: 100%;
            background: #3091F2;
            height: 30px;
            position: fixed;
            z-index: 25;
            top: 44px + @headerTop;
            &.timer-header {
                height: 152px;
                top: 42px + @headerTop;
                .big {
                    width: 100%;
                    height: 150px;
                    padding-top: 12px;
                    .loading {
                        height: 80px;
                        width: 100%;
                        position: relative;
                        .jingxingzhong {
                            color: #ffffff;
                            width: 80px;
                            height: 80px;
                            position: absolute;
                            text-align: center;
                            line-height: 80px;
                            margin: auto;
                            left: 0;
                            right: 0;
                        }
                        .icon {
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            margin: auto;
                            left: 0;
                            right: 0;
                            width: 80px;
                            height: 80px;
                        }
                    }
                    .used-timer {
                        width: 100%;
                        font-size: 30px;
                        color: #FFFFFF;
                        letter-spacing: 0;
                        line-height: 30px;
                        margin-top: 10px;
                    }
                }
            }
            div {
                margin: 0 auto;
                height: 30px;
                line-height: 30px;
                vertical-align: middle;
                letter-spacing: 0px;
                text-align: center;
                position: relative;
                display: table;
                .icon, .text {
                    display: table-cell;
                    height: 30px;
                }
                .icon {
                    position: relative;
                    width: 14px;
                    .icon-clock {
                        position: absolute;
                        margin: auto;
                        top: 0;
                        bottom: 0;
                        left: 0;
                    }
                }
                .text {
                    font-size: 12px;
                    color: #FFFFFF;
                    padding-left: 10px;
                }
            }
        }
    }
</style>
