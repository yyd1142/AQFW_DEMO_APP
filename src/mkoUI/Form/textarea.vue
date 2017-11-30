<template>
    <!--输入框组件-->
    <div class="mko-text-area">
        <div class="title" v-if="title">{{title}}</div>
        <div class="body" :class="{'has-limit':limitCount}">
            <textarea class="text-area" :placeholder="placeholder||''" v-model="areaValue"></textarea>
            <div class="limit" :class="{'error':areaValue.length>limitCount}" v-if="limitCount">{{areaValue.length}}/{{limitCount}}字</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['value', 'title', 'placeholder', 'limit-count'],
        data() {
            return {
                areaValue: ''
            }
        },
        watch: {
            value(val) {
                this.areaValue = val;
            },
            areaValue(val) {
                this.$emit('input', val)
            }
        },
        computed: {},
        mounted() {
            if (this.areaValue)
                this.$emit('input', this.areaValue)
        },
        activated() {
        },
        deactivated() {
        },
        destroyed() {
        },
        methods: {},
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    @import "../../config.less";

    .mko-text-area {
        background-color: @baseBG02;
        padding: 14px;
        .title {
            margin-bottom: 14px;
            font-size: 14px;
            color: #232323;
            padding-left: 4px;
        }
        .body {
            position: relative;
            box-sizing: border-box;
            padding: 8px 10px 6px;
            height: 80px;
            border: 1px solid @baseBorder;
            border-radius: 4px;
            letter-spacing: 0;
            background-color: #fff;
            font-family: STHeitiSC-Light;
            &.has-limit {
                padding-bottom: 24px;
            }
            .text-area {
                width: 100%;
                height: 100%;
                padding: 0;
                border: 0;
                outline: none;
                line-height: 18px;
                font-size: 14px;
                color: @baseText01;
                background-color: #fff;
                resize: none;
                &::-webkit-input-placeholder {
                    color: @baseText03;
                }
            }
            .limit {
                position: absolute;
                right: 10px;
                bottom: 6px;
                line-height: 12px;
                font-size: 12px;
                color: @baseText03;
                &.error {
                    color: @mainDanger;
                }
            }
        }
    }
</style>
