<template>
    <div class="mkotabs-item" :class="[activied ? 'is-activied' : null,{'is-header':isHeader!==undefined}]" @click.stop="tab">
        <span class="item">
            <slot>
            {{label}}
            </slot>
        </span>
    </div>
</template>

<script>
    export default {
        props: ['label', 'activied', 'is-header'],
        methods: {
            tab() {
                this.$emit('handleTabClick', this.label)
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../config.less";

    .mkotabs-item {
        display: block;
        text-align: CENTER;
        flex: 1;
        -webkit-box-flex: 1;
        height: 28px;
        letter-spacing: 0;
        box-shadow: 0 0 0 1px @mainBlue;
        color: @mainBlue;
        background-color: #fff;
        &:first-child {
            border-radius: 4px 0 0 4px;
        }
        &:last-child {
            border-radius: 0 4px 4px 0;
        }

        &.is-header {
            box-shadow: 0 0 0 1px #fff;
            color: #ffffff;
            background-color: @mainBlue;
            &.is-activied {
                color: @mainBlue;
                background-color: #fff;
            }
            .item {

            }
        }

        &.is-activied {
            color: #ffffff;
            background-color: @mainBlue;
        }
        .item {
            display: block;
            height: 28px;
            line-height: 28px;
            font-size: 14px;
        }
    }
</style>
