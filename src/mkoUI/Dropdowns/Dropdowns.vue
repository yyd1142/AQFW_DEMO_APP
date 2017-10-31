<template>
    <div class="dropdowns" v-show="open">
        <div class="dropdowns-right">
            <div class="hidden" @click="open = false;"></div>
            <div class="main">
                <div class="label" v-for="(item, index) in actions" @click="action(item, index)">
                    <i class="icon" :class="item.icon"></i>
                    <span v-text="item.name"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['actions'],
    data() {
        return {
            open: false
        }
    },
    methods: {
        action(item, index) {
            if (item.method && typeof item.method === 'function') {
                item.method(item, index);
            }
        }
    }
}
</script>

<style lang='less'>
@import "../../config.less";
.dropdowns {
    .dropdowns-right {
        width: 100%;
        position: fixed;
        z-index: 30;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        &::before {
            content: "";
            width: 12px;
            height: 12px;
            position: fixed;
            background-color: #333333;
            z-index: 24;
            right: 16px;
            top: 38px + @headerTop;
            transform: rotate(45deg);
        }
        .hidden {
            width: 100%;
            position: fixed;
            z-index: 23;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            background-color: rgba(160, 160, 160, 0.07);
        }
        .main {
            width: 140px;
            background-color: #333333;
            border-radius: 3px;
            position: fixed;
            right: 4px;
            top: 43px + @headerTop;
            z-index: 24;
            padding-left: 20px;
            .label {
                width: 100%;
                height: 44px;
                line-height: 44px;
                position: relative;
                .border-btm(#444444);
                .icon {
                    position: absolute;
                    margin: auto;
                    left: 0;
                    top: 0;
                    bottom: 0;
                }
                span {
                    font-size: 16px;
                    color: #FFFFFF;
                    letter-spacing: 0;
                    line-height: 16px;
                    padding-left: 40px;
                }
            }
        }
    }
}
</style>
