<template>
    <div class="mko-popup-right-wrap" :class="{'inset':fr(inset)}">
        <mt-popup class="mko-popup-right" :style="{width:width}" v-model="show" position="right">
            <div class="header">

            </div>
            <div class="body">
                <slot></slot>
            </div>
            <div class="footer" v-if="!fr(noBtn)">
                <div class="btn reset fl" @click="reset">{{resetBtnText || '重置'}}</div>
                <div class="btn confirm fr" @click="confirm">{{confirmBtnText || '确定'}}</div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
    export default {
        props: ['value', 'confirm-btn-text', 'reset-btn-text', 'width', 'no-btn', 'inset'],
        data () {
            return {
                show: false
            }
        },
        watch: {
            value(val){
                this.show = val;
            },
            show(val) {
                this.$emit('input', val)
            }
        },
        computed: {},
        mounted() {
            if (this.value) {
                this.show = true;
            }
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
            reset(){
                this.$emit('reset');
            },
            confirm(){
                this.$emit('confirm')
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .mko-popup-right-wrap {
        .v-modal {
            background-color: @baseMasking;
        }
        &.inset {
            .mint-popup-right {
                z-index: 24;
            }
            .v-modal {
                z-index: 23;
            }
            .body {
                top: @headerHeight+@headerTop;
            }
        }
    }

    .mko-popup-right {
        width: 89.3%;
        height: 100%;
        /*padding: 30px 0 100px;*/
        box-shadow: -2px 0 2px 0 rgba(0, 0, 0, 0.10);
        .body {
            position: absolute;
            top: 30px;
            bottom: 40px;
            width: 100%;
            overflow-y: scroll;
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            .btn {
                float: left;
                width: 50%;
                height: 39px;
                line-height: 39px;
                border-radius: 0;
                text-align: center;
                &.reset {
                    border: 1px solid #EDEEF1;
                    background: #fff;
                    color: @mainBlue;
                }
                &.confirm {
                    background: @mainBlue;
                    color: #fff;
                }
            }
        }
    }
</style>
