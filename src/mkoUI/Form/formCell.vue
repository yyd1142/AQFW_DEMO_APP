<template>
    <!--可用于展示和编辑表单信息的组件-->
    <div class="mko-form-cell" @click="click">
        <div class="cell" :class="{'is-link':fr(isLink)}">
            <span class="required" v-if="isEdit&&fr(required)">*</span>
            <div class="title fl no-overflow">{{title}}</div><!--标题限定最多7个字-->
            <span class="sign icon-link-arrow" v-if="fr(isLink)"></span>

            <!--非编辑状态-->
            <div class="value fr no-overflow" v-if="!isEdit&&(!fr(phone)||!val)">
                <slot>{{val || nonText}}</slot>
            </div>
            <a class="value phone fr no-overflow" :href="'tel:' + val" v-if="!isEdit&&fr(phone)&&val">
                <slot>{{val || nonText}}</slot>
            </a>

            <!--编辑状态-->
            <div class="sel fr no-overflow" v-if="isEdit&&type=='sel'">
                <slot>{{val}}</slot>
                <span class="arrow icon-arrow-right" v-if="!$slots.button"></span>
            </div>
            <slot v-if="isEdit&&type!='sel'">
                <input class="ipt fr" type="text" :placeholder="holderText||'请完善信息'" v-model="iptData" @focus="focus" @blur="blur" v-if="isEdit&&type=='text'">
                <input class="ipt fr" type="number" :placeholder="holderText||'请完善信息'" v-model.number="iptData" @focus="focus" @blur="blur" v-if="isEdit&&type=='number'">
                <input class="ipt fr" type="password" :placeholder="holderText||'请完善信息'" v-model="iptData" @focus="focus" @blur="blur" v-if="isEdit&&type=='password'">
            </slot>

            <!--自定义按钮-->
            <slot name="button" v-if="isEdit"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {}, val: {}, value: {}, isLink: {}, phone: {}, nonText: {}, required: {}, edit: {}, holderText: {},
            type: {String, default: 'text'},
        },
        data () {
            return {
                iptData: ''
            }
        },
        watch: {
            value: function (val) {
                this.iptData = val;
            },
            iptData: function (val) {
                this.$emit('input', this.iptData)
            },
//            isEdit: function (val) {
//                if (val && this.val)
//                    this.iptData = this.val;
//            }
        },
        computed: {
            isEdit(){
                return this.fr(this.edit)
            }
        },
        mounted() {
            if (this.value) this.iptData = this.value;
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
                this.$emit('click');
            },
            focus(){
                this.$emit('focus')
            },
            blur(){
                this.$emit('blur')
            },
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    @import "../../config.less";

    @cellHeight: 44px;

    .mko-form-cell:not(:last-child) .cell {
        //        .border-btm(@baseBorder);
    }

    .mko-form-cell {
        height: @cellHeight;
        background: #fff;
        padding-left: 14px;
        &:first-child {
            .border-top(@baseBorder);
        }
        &:last-child {
            .border-btm(@baseBorder);
            &:after {
                bottom: -1px;
            }
        }
        &:not(:last-child) .cell {
            .border-btm(@baseBorder);
        }
        &:active {
            opacity: 0.8;
        }
        .cell {
            display: -webkit-flex;
            display: flex;
            position: relative;
            padding-right: 14px;
            height: @cellHeight;
            font-size: 14px;
            &.is-link {
                .value {
                    padding-right: 20px;
                }
            }
            .required {
                position: absolute;
                z-index: 1;
                left: -7px;
                top: 18px;
                font-size: 14px;
                color: @mainDanger;
            }
            .sign {
                position: absolute;
                right: 14px;
                top: 15px;
            }
            .title {
                flex: 0 0 115px;
                -webkit-flex: 0 0 115px;
                width: 115px;
                margin-right: 5px;
                line-height: @cellHeight;
                font-size: 16px;
                color: @baseText01;
            }
            .value {
                flex: 1;
                -webkit-flex: 1;
                width: 60%;
                line-height: @cellHeight;
                text-align: right;
                color: @baseText01;
                &.phone {
                    color: @mainBlue;
                }
            }
            .sel {
                flex: 1;
                -webkit-flex: 1;
                position: relative;
                width: 60%;
                padding-right: 14px;
                line-height: @cellHeight;
                color: @baseText02;
                .arrow {
                    position: absolute;
                    right: 0;
                    top: 15px;
                }
            }
            > input, .ipt {
                float: right;
                box-sizing: border-box;
                flex: 1;
                -webkit-flex: 1;
                width: 60%;
                position: relative;
                padding: 0;
                padding-right: 34px;
                height: 36px;
                top: 4px;
                border: none;
                font-size: 14px;
                color: @baseText02;
                &::-webkit-input-placeholder {
                    color: @baseText03;
                }
            }
        }
    }
</style>
