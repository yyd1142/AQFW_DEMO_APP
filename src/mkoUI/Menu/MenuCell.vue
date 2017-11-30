<template>
    <!--下拉菜单-->
    <div class="mko-menu-cell" @click="click">
        <div class="cell">
            <span class="label">{{title}}</span>
            <div class="val">
                <slot>
                    <span>{{val}}</span>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['title', 'val'],
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
            click(){
                this.$emit('click')
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    @import "../../config.less";

    @cellHeight: 44px;
    .mko-menu-cell {
        font-size: 14px;
        background: #F5F6F7;
        color: #72787D;
        &:first-child {
            .border-top(@baseBorder);
        }
        &:last-child {
            .border-btm(@baseBorder);
        }
        &:not(:last-child) .cell {
            .border-btm(@baseBorder);
        }
        .cell {
            padding-right: 36px;
            margin-left: 36px;
            height: @cellHeight;
            line-height: @cellHeight - 1px;
            &:last-child {
                margin: 0;
                padding-left: 36px;
            }
            .label {
                float: left;
            }
            .val {
                float: right;
            }
        }
    }
</style>
