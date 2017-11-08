<template>
    <div class="mko-search-wrap"
         :class="{'is-header':fr(isHeader),'has-left-button':$slots['left-button'],'has-right-button':$slots['right-button']}">

        <slot name="left-button"></slot>

        <div class="box">
            <div class="sign-wrap" @click="focus">
                <i class="icon"></i>
                <span class="sign" v-show="!iptHasValue||!iptOnFocus">{{hintText || '搜索'}}</span>
            </div>
            <input ref="input" class="ipt" type="text" v-model="iptValue" @focus="inputOnFocus" @blur="inputOnBlur">
            <i class="mintui mintui-field-error cancel-xx" @click="inputReset" v-if="iptHasValue"></i>
        </div>
        <div class="cancel" @click="cancel" v-if="!$slots['right-button']">
            取消
        </div>
        <slot name="right-button"></slot>
    </div>
</template>

<script>
    export default {
        props: ['value', 'hintText', 'isHeader', 'autofocus'],
        data() {
            return {
                iptValue: '',
                iptHasValue: false,
                iptOnFocus: false,
            }
        },
        watch: {
            value(val){
                this.iptValue = val;
            },
            iptValue: function (val) {
                if (!val) {
                    this.iptHasValue = false;
                } else {
                    this.iptHasValue = true;
                }
                this.$emit('input', val);
            }
        },
        mounted() {
            if (this.autofocus !== undefined && this.autofocus !== false) {
                this.$refs.input.focus();
            }
        },
        activated(){

        },
        methods: {
            fr(val){
                return val !== undefined && val !== false
            },
            cancel(){
                this.iptValue = '';
                this.$emit('onCancel');
            },
            focus(){
                this.$refs.input.focus();
            },
            inputReset() {
                this.iptValue = '';
                this.$emit('onCancelSearch');
            },
            inputOnFocus() {
                this.iptOnFocus = true;
                this.$emit('onFocus', true);
            },
            inputOnBlur() {
                this.iptOnFocus = false;
                this.$emit('onBlur', true);
            },
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    @import "../../config.less";

    .mko-search-wrap {
        position: relative;
        height: 44px;
        padding: 8px;
        background: @mainBlue;
        &.is-header {
            position: fixed;
            top: @headerTop;
            z-index: 26;
            width: 100%;
        }
        &.has-left-button {
            padding-left: 14px;
            .box {
                left: 34px;
            }
        }
        &.has-right-button {
            padding-right: 14px;
        }
        .box {
            position: absolute;
            left: 10px;
            right: 50px;
            height: 30px;
            padding: 0 5px;
            border-radius: 100px;
            background: #FFFFFF;

            .ipt {
                position: relative;
                top: 2px;
                left: 24px;
                width: 90%;
                height: 20px;
                border: none;
                border-radius: 28px;
                font-size: 14px;
            }
            .cancel-xx {
                position: absolute;
                top: 5px;
                right: 8px;
                /*width: 14px;*/
                /*height: 14px;*/
                font-size: 18px;
                color: #c9c9ce;
                background: none;
                &:before {
                    /*font-size:14px;*/
                }
            }
        }
        .sign-wrap {
            position: absolute;
            top: 50%;
            left: 8px;
            z-index: 1;
            transform: translate(0, -50%);
            -webkit-transform: translate(0, -50%);
            min-width: 100px;
            font-size: 14px;
            letter-spacing: 0.87px;
            color: @baseText03;
            .icon {
                position: relative;
                top: -5px;
                margin-right: 8px;
                font-size: 0;
                padding: 6px;
                background: url('/static/icons/resource.png') -822px 0 no-repeat;
                background-size: @bg-size;
            }
            .sign {
                position: relative;
                left: 2px;
            }
        }
        .cancel {
            position: absolute;
            right: 0;
            top: 0;
            width: 50px;
            height: 44px;
            line-height: 44px;
            font-size: 16px;
            text-align: center;
            color: #fff;
        }
    }
</style>
