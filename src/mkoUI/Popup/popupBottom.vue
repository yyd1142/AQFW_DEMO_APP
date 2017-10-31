<template>
    <div>
        <mt-popup class="mko-popup-btm" v-model="show" position="bottom">
            <div class="header">
                <div class="title abs-middle">{{title}}</div>
                <div class="btn fl" @click="cancel">取消</div>
                <div class="btn fr" @click="save">确定</div>
            </div>
            <div class="body">
                <slot></slot>
            </div>
            <div class="footer"></div>
        </mt-popup>
    </div>
</template>

<script>
    export default {
        props: ['value', 'title'],
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
            cancel(){
                this.$emit('cancel');
            },
            save(){
                this.$emit('save');
            },
            change(picker, vals){
                this.$emit('change', picker, vals);
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .mko-popup-btm {
        width: 100%;
        background-color: @baseBG02;
        > .header {
            height: 44px;
            line-height: 44px;
            font-size: 14px;
            .title {
                color: @baseText01;
            }
            .btn {
                padding: 0 14px;
                color: @mainBlue;
            }
        }
        > .body {
            padding: 10px 0;
            /*max-height: 200px;*/
            .picker {
                .picker-slot {
                    font-size: 16px;
                }
                .picker-center-highlight {
                    z-index: -1;
                    background-color: #fff;
                }
            }
            > .checkbox {
                margin: 0 auto;
                padding: 0 9px 29px 9px;
                max-width: 414px;
                .mint-button {
                    margin: 1.3%;
                    width: 22.4%;
                    height: 34px;
                    border-radius: 2px;
                    box-shadow: 0 0 0 1px @baseBorder;
                    font-size: 14px;
                    background: #FFFFFF;
                    color: @baseText01;
                    &.active {
                        box-shadow: 0 0 0 1px @mainBlue;
                    }
                    &.is-disabled {
                        box-shadow: 0 0 0 1px @baseBorder;
                        color: #E0E3E7;
                    }
                }
            }
        }
    }
</style>
