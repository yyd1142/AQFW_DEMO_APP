<template>
    <div class="timer">
        <transition name="fade">
            <div class="timer-wrap" v-if="status == 2">
                <div>
                    <span class="icon">
                        <i class="icon-clock"></i>
                    </span>
                    <span class="text">{{text ? text : `进行中,${usedTimer}`}}</span>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: ['status', 'usedTimer', 'text']
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
