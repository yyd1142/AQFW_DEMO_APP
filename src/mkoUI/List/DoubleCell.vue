<template>
    <div class="mko-double-cell" @click="click">
        <div class="cell">
            <div class="title-icon fl" @click.stop="clickIconFn" v-show="$slots.icon||icon">
                <slot name="icon">
                    <span class="icon" :class="icon"></span>
                </slot>
            </div>
            <div class="title-wrap fl no-overflow">
                <div class="title no-overflow" v-html="title"></div>
                <div class="label no-overflow">
                    <slot name="label">
                        <div class="no-overflow" v-html="label"></div>
                    </slot>
                </div>
            </div>
            <span class="link-arrow" :class="linkIcon||'icon-link-arrow'" v-if="fr(isLink)"></span>
            <div class="value fr no-overflow" :class="{'is-link':fr(isLink),'is-active':fr(active)}">
                <div class="text no-overflow">
                    <slot>
                        {{val || nonText}}
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['icon', 'title', 'label', 'val', 'is-link', 'link-icon', 'active', 'non-text'],
        data () {
            return {}
        },
        watch: {},
        computed: {},
        mounted() {
//            if (this.$slots.icon) {
//
//            }
//            console.log(this.$slots.icon[0].elm.offsetWidth)
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
            clickIconFn(){
                this.$emit('clickIcon')
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    @cellHeight: 60px;

    .mko-double-cell {
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
    }

    .mko-double-cell {
        height: @cellHeight;
        background: #fff;
        font-family: STHeitiSC-Light;
        &:active {
            opacity: 0.8;
        }
        .cell {
            display: -webkit-flex;
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            position: relative;
            margin-left: 14px;
            padding-right: 14px;
            height: @cellHeight;
            font-size: 14px;
            letter-spacing: 0;
            .link-arrow {
                position: absolute;
                right: 14px;
                top: 50%;
                transform: translate(0, -50%);
                -webkit-transform: translate(0, -50%);
            }
            .title-icon {
                position: relative;
                margin-right: 14px;
                min-width: 10px;
                .icon {
                    display: block;
                }
                > img, > div {
                    /*width: 60px;*/
                    display: block;
                }
            }
            .title-wrap {
                min-width: 100px;
                flex: auto;
                -webkit-flex: auto;
                /*margin-top: 13px;*/
                margin-right: 10px;
                color: @baseText01;
                > .title {
                    margin-bottom: 8px;
                    line-height: 14px;
                    font-size: 14px;
                }
                > .label {
                    line-height: 14px;
                    font-size: 12px;
                    color: @baseText03;
                }
            }
            > .value {
                position: relative;
                flex: auto;
                -webkit-flex: auto;
                min-width: 100px;
                line-height: 14px;
                font-size: 14px;
                text-align: right;
                color: @baseText03;
                font-family: HelveticaNeue-Light;
                &.is-link {
                    margin-right: 12px;
                }
                &.is-active {
                    color: @mainBlue;
                }
                .text {
                    width: 100%;
                }
            }
        }
    }
</style>
