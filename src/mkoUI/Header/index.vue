<template>
    <div id="header">
        <header class="mko-header-wrap" :style="{ backgroundColor: backgroundColor ? backgroundColor : '#3399FF', borderBottom: `1px solid ${borderColor}` }">
            <div class="header-left" @click="onLeftClickEvent" v-if="leftIconText || leftIcon">
                <i class="left-icon icon" :class="leftIcon" v-if="leftIcon"></i>
                <span class="left-text" v-text="leftIconText" v-if="leftIconText"></span>
            </div>
            <div class="title" :style="{color: titleColor}" v-text="title" v-if="title"></div>
            <div class="header-right" @click="onRightClickEvent" v-if="rightIconText || rightIcon">
                <i class="right-icon icon" :class="rightIcon" v-if="rightIcon"></i>
                <span class="right-text" :class="rightFontColor" v-text="rightIconText" v-if="rightIconText"></span>
            </div>
            <slot name="custom"></slot>
        </header>
    </div>
</template>

<script>
export default {
    props: ['title', 'leftIcon', 'rightIcon', 'leftIconText', 'rightIconText', 'type', 'backgroundColor', 'rightFontColor', 'titleColor', 'border-color'],
    methods: {
        onRightClickEvent() {
            this.$emit("handleRightClick");
        },
        onLeftClickEvent() {
            this.$emit("handleLeftClick");
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../config.less";
@headerTitleFontSize: 18px;
@headerFontSize: 14px;
#header {
    position: relative;
    .mko-header-wrap {
        top: 0 + @headerTop;
        right: 0;
        left: 0;
        position: fixed;
        z-index: 25;
        display: flex;
        color: #fff;
        height: @headerHeight;
        padding-top: 0px;
        .header-left {
            margin: 0;
            width: 80px;
            float: left;
            padding: 0;
            height: @headerHeight;
            position: relative;
            .icon {
                display: block;
            }
            .left-icon {
                margin: auto;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 14px;
            }
            .left-text {
                float: left;
                vertical-align: middle;
                height: @headerHeight;
                line-height: @headerHeight;
                padding-left: 14px;
                width: 100%;
            }
        }
        .title {
            text-align: center;
            font-size: @headerTitleFontSize;
            position: absolute;
            left: 80px;
            right: 80px;
            height: @headerHeight;
            line-height: @headerHeight;
            width: auto;
            top: 0;
            bottom: 0;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .header-right {
            margin: 0 0 0 auto;
            width: 80px;
            float: right;
            padding: 0;
            height: @headerHeight;
            position: relative;
            .icon {
                display: block;
            }
            .right-icon {
                margin: auto;
                position: absolute;
                top: 0;
                bottom: 0;
                right: 14px;
            }
            .right-text {
                float: right;
                vertical-align: middle;
                height: @headerHeight;
                line-height: @headerHeight;
                text-align: right;
                padding-right: 14px;
                width: 100%;
            }
        }
    }
}
</style>

