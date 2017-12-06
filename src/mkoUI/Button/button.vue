<template>
    <div class="mko-button" :class="[type?type:'primary',size,className]" :style="sizeStyle" @click="click">
        <div class="button abs-all-middle">
            <span class="icon" :class="icon" v-show="icon"></span>
            <span class="text">
        <slot>{{text}}</slot>
      </span>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['icon', 'text', 'type', 'plain', 'disabled', 'no-radius', 'size', 'width', 'height'],
        data () {
            return {}
        },
        watch: {},
        computed: {
            className(){
                return {
                    'plain': this.fr(this.plain),
                    'disabled': this.isDisabled,
                    'no-radius': this.fr(this.noRadius)
                }
            },
            sizeStyle(){
                let obj = {};
                if (this.width)
                    obj.width = this.width + 'px';
                if (this.height)
                    obj.height = this.height + 'px';
                return obj;
            },
            isDisabled(){
                return this.fr(this.disabled);
            }
        },
        mounted() {
        },
        activated(){
        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            fr(val){
                return val !== undefined && val !== false
            },
            click(){
                if (!this.isDisabled)
                    this.$emit('click')
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .mko-button {
        /*display: table;*/
        position: relative;
        width: 100px;
        height: 40px;
        border-radius: 4px;
        line-height: 16px;
        font-size: 16px;
        letter-spacing: 0;
        text-align: center;
        color: #fff;
        //禁用
        &.disabled {
            opacity: 0.5 !important;
        }
        //无圆角
        &.no-radius {
            border-radius: 0;
        }
        //size
        &.flex {
            flex: 1;
            -webkit-flex: 1;
        }
        &.small {
            /*width: 80px;*/
            /*height: 34px;*/
            /*font-size: 14px;*/
            /*letter-spacing: 0;*/
        }
        &.large {
            margin: 0 auto;
            width: 92.8%;
            height: 40px;
            &.no-radius {
                width: 100%;
            }
        }
        //type
        &.primary {
            background-color: @mainBlue;
            &:active {
                background-color: shade(@mainBlue, 10%);
            }
            &.plain {
                color: @mainBlue;
                background-color: transparent;
                border: 1px solid @mainBlue;
                &:active:not(.disabled) {
                    background-color: fade(@mainBlue, 10%);
                }
            }
        }
        &.succ {
            background-color: @mainSucc;
            &:active {
                background-color: shade(@mainSucc, 10%);
            }
            &.plain {
                color: @mainSucc;
                background-color: transparent;
                border: 1px solid @mainSucc;
                &:active:not(.disabled) {
                    background-color: fade(@mainSucc, 10%);
                }
            }
        }
        &.warn {
            background-color: @mainWarn;
            &:active {
                background-color: shade(@mainWarn, 10%);
            }
            &.plain {
                color: @mainWarn;
                background-color: transparent;
                border: 1px solid @mainWarn;
                &:active:not(.disabled) {
                    background-color: fade(@mainWarn, 10%);
                }
            }
        }
        &.danger {
            background-color: @mainDanger;
            &:active {
                background-color: shade(@mainDanger, 10%);
            }
            &.plain {
                color: @mainDanger;
                background-color: transparent;
                border: 1px solid @mainDanger;
                &:active:not(.disabled) {
                    background-color: fade(@mainDanger, 10%);
                }
            }
        }
        .button {
            /*display: table-cell;*/
            /*vertical-align: middle;*/
            /*text-align: CENTER;*/
            min-width: 100px;
            .icon {
                display: inline-block;
            }
            .text {
                font-family: STHeitiSC-Light;
            }
        }
    }
</style>
