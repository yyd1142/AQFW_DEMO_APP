<template>
    <div class="mko-info-bar" :class="{'expand':isExpand}" @click="click">
        <div class="bar">
            <div class="msg no-overflow" v-if="!isExpand">
                <slot>
                    {{msg}}
                </slot>
            </div>
            <div class="title fl no-overflow">
                <slot name="title">
                    {{title}}
                </slot>
            </div>
            <div class="value fr no-overflow" :class="{'is-link':fr(isLink)}">
                <slot name="val">
                    {{val}}
                </slot>
            </div>
            <span class="link-arrow icon-link-arrow" v-if="fr(isLink)"></span>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['msg', 'is-link', 'title', 'val'],
        data () {
            return {}
        },
        watch: {},
        computed: {
            isExpand(){
                return this.title || this.$slots.title || this.val || this.$slots.val;
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
                this.$emit('click')
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    @import "../../config.less";

    @cellHeight: 36px;

    .mko-info-bar {
        height: 60px;
        padding: 12px 8px;
        background-color: #fff;
        &.expand {
            background-color: @baseBG01;
        }
        .bar {
            position: relative;
            padding: 0 24px 0 12px;
            height: @cellHeight;
            border-radius: @cellHeight;
            border: 0.5px solid @baseBorder;
            box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.05);
            letter-spacing: 0;
            background-color: #FFFFFF;

            .link-arrow {
                position: absolute;
                right: 12px;
                top: 10px;
                &.icon-link-arrow {
                    transform: scale(0.44, 0.57);
                }
            }
            .msg {
                line-height: @cellHeight;
                font-size: 12px;
                text-align: center;
                color: @baseText03;
            }
            .title {
                line-height: @cellHeight;
                max-width: 120px;
                font-size: 12px;
                color: @baseText01;
            }
            .value {
                line-height: @cellHeight;
                max-width: 120px;
                font-size: 12px;
                color: @baseText01;
            }
        }
    }
</style>
