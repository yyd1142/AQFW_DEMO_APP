<template>
    <!--下拉菜单头部-->
    <div class="mko-menu-header" @click="showFn">
        <div class="label" :class="{'no-sign':!icon}">
            <div class="sign-wrap" @click.stop="clickIconFn" v-if="icon"><span class="sign" :class="icon"></span>
            </div>
            {{title}}
        </div>
        <div class="val">
            <slot>
                {{val}}
            </slot>
        </div>
        <span class="arrow" :class="show?(dropDownSign||'icon-arrow-down'):(dropUpSign||'icon-arrow-up')"></span>
    </div>
</template>

<script>
    export default {
        props: ['value', 'title', 'val', 'icon', 'drop-up-sign', 'drop-down-sign'],
        data () {
            return {
                show: false
            }
        },
        watch: {
            value(val){
                this.show = val;
            },
            show(val){
                this.$emit('input', val)
            }
        },
        computed: {},
        mounted() {
            this.show = this.value;
        },
        activated(){
        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            clickIconFn(){
                this.$emit('clickIcon')
            },
            showFn(){
                this.show = !this.show;
                this.$emit('show', this.show);
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    @cellHeight: 44px;
    .mko-menu-header {
        position: relative;
        padding-right: 36px;
        height: @cellHeight;
        line-height: @cellHeight - 1px;
        font-size: 14px;
        letter-spacing: 0;
        box-shadow: 0 0 0 1px @baseBorder;
        background: #fff;
        color: @baseText02;
        .label {
            float: left;
            font-size: 16px;
            color: @baseText01;
            &.no-sign {
                padding-left: 14px;
            }
            .sign-wrap {
                box-sizing: content-box;
                width: 8px;
                height: 44px;
                float: left;
                padding-left: 14px;
                padding-right: 14px;
                .sign {
                    position: relative;
                    top: 2px;
                    color: #979797;
                }
            }
        }
        .val {
            float: right;
            font-size: 14px;
            font-family: HelveticaNeue-Light;
        }
        .arrow {
            position: absolute;
            right: 14px;
            top: 16px;
            transition: transform 0.3s;
            -webkit-transition: transform 0.3s;

        }
    }
</style>
