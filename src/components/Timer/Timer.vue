<template>
    <div class="timer">
        <transition name="fade">
            <div class="timer-wrap" v-if="status == 2">
                <div>
                    <i class="icon icon-clock"></i>进行中, {{usedTimer}}
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: ['status', 'usedTimer']
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
            width: 122px;
            margin: 0 auto;
            height: 30px;
            line-height: 30px;
            vertical-align: middle;
            font-size: 12px;
            color: #FFFFFF;
            letter-spacing: 0px;
            text-align: center;
            position: relative;
            padding-left: 14px;
            .icon {
                position: absolute;
                margin: auto;
                top: 0;
                bottom: 0;
                left: 0;
            }
        }
    }
}
</style>
