<template>
    <div class="mko-basic-cell" @click="handleClick">
        <div class="cell">
            <div class="title-icon fl" @click.stop="clickIconFn" v-show="$slots.icon||icon">
                <slot name="icon">
                    <span class="icon" :class="icon"></span>
                </slot>
            </div>
            <div class="title fl no-overflow" :class="{'main-left':main=='left'}">{{title}}</div>
            <span class="link-arrow" :class="linkIcon||(fr(active)?'icon-arrow-right':'icon-link-arrow')" v-if="fr(isLink)"></span>
            <div class="value fr no-overflow" :class="{'main-left':main=='left','is-link':fr(isLink),'is-active':fr(active)}">
                <slot>
                    <span v-if="!fr(phone)||!val" :class="valStyle">{{val || nonText}}</span>
                    <a class="phone" :href="'tel:' + val" v-if="fr(phone)&&val">{{val || nonText}}</a>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['main', 'icon', 'title', 'val', 'non-text', 'is-link', 'link-icon', 'val-style', 'active', 'phone', 'show-val'],
        data () {
            return {}
        },
        watch: {},
        computed: {},
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
            clickIconFn(){
                this.$emit('clickIcon')
            },
            handleClick(){
                if (this.showVal) {
                    this.showValue();
                } else {
                    this.click();
                }
            },
            showValue(){
                let datas = this.showVal;
                this.$MKODialog({
                    title: datas.title,
                    msg: datas.msg || datas
                })
            },
            click(){
                this.$emit('click');
            },
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    @cellHeight: 44px;

    .mko-basic-cell:not(:last-child) .cell {
        .border-btm(@baseBorder);
    }

    .mko-basic-cell {
        height: @cellHeight;
        background: #fff;
        padding-left: 14px;
        &:active {
            opacity: 0.8;
        }
        .cell {
            display: -webkit-flex;
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            position: relative;
            padding-right: 14px;
            height: @cellHeight;
            font-size: 14px;
            .link-arrow {
                position: absolute;
                right: 14px;
                top: 50%;
                transform: translate(0, -50%);
                -webkit-transform: translate(0, -50%);
            }
            .title-icon {
                margin-right: 14px;
                min-width: 10px;
                .icon {
                    display: block;
                }
            }
            .title {
                flex: 0 0 128px;
                -webkit-flex: 0 0 128px;
                width: 128px;
                margin-right: 10px;
                line-height: @cellHeight;
                font-size: 16px;
                color: @baseText01;
                font-family: STHeitiSC-Light;
                &.main-left {
                    flex: auto;
                    -webkit-flex: auto;
                    width: 44%;
                }
            }
            > .value {
                flex: auto;
                -webkit-flex: auto;
                width: 37%;
                line-height: @cellHeight;
                text-align: right;
                color: @baseText01;
                font-family: HelveticaNeue-Light;
                &.main-left {
                    flex: 0 0 108px;
                    -webkit-flex: 0 0 108px;
                    width: 108px;
                }
                &.is-link {
                    padding-right: 12px;
                }
                &.is-active, .phone {
                    color: @mainBlue;
                }
            }
        }
    }
</style>
