<template>
    <div class="mko-basic-cell" @click="click">
        <div class="cell">
            <div class="title-icon fl" @click.stop="clickIconFn" v-show="$slots.icon||icon">
                <slot name="icon">
                    <span class="icon" :class="icon"></span>
                </slot>
            </div>
            <div class="title fl no-overflow">{{title}}</div>
            <span class="link-arrow" :class="linkIcon||(fr(active)?'icon-arrow-right':'icon-link-arrow')" v-if="fr(isLink)"></span>
            <div class="value fr no-overflow" :class="{'is-link':fr(isLink),'is-active':fr(active)}">
                <slot>
                    <span v-if="!fr(phone)||!val">{{val || nonText}}</span>
                    <a class="phone" :href="'tel:' + val" v-if="fr(phone)&&val">{{val || nonText}}</a>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['icon', 'title', 'val', 'is-link', 'link-icon', 'active', 'non-text', 'phone'],
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

    .mko-basic-cell:last-child .cell {
        box-shadow: none;
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
            box-shadow: 0 1px 0 0 @baseBorder;
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
                flex: 0 0 112px;
                -webkit-flex: 0 0 112px;
                width: 112px;
                margin-right: 10px;
                line-height: @cellHeight;
                font-size: 16px;
                color: @baseText01;
                font-family: STHeitiSC-Light;
            }
            > .value {
                flex: auto;
                -webkit-flex: auto;
                width: 40%;
                line-height: @cellHeight;
                text-align: right;
                color: @baseText01;
                font-family: HelveticaNeue-Light;
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
