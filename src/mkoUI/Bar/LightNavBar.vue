<template>
    <div class="mko-light-nav-bar-wrap">
        <div class="cell fl" :class="{active:active==item.id}"
             @click="change(item.id,item.methods)"
             v-for="item in tabs">{{item.text}}
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            tabs: {type: Array}
        },
        data () {
            return {
                active: 0,
            }
        },
        watch: {},
        computed: {},
        mounted() {
            if (this.tabs && this.tabs instanceof Array) {
                for (let item of this.tabs) {
                    if (item.default) {
                        this.active = item.id;
                        return;
                    }
                }
                this.active = this.tabs[0].id || 0;
            }
        },
        activated(){

        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            change(id, fn){
                this.active = id;
                if (fn)
                    fn();
                this.$emit('active', id);
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    @lightNavBarHeight: 36px;
    .mko-light-nav-bar-wrap {
        position: relative;
        padding-left: 14px;
        height: @lightNavBarHeight;
        width: 100%;
        background-color: #fff;
        .cell {
            box-sizing: border-box;
            margin-right: 20px;
            height: @lightNavBarHeight;
            line-height: @lightNavBarHeight;
            font-size: 14px;
            color: @baseText02;
            &.active {
                border-bottom: 2px solid @mainBlue;
                color: @mainBlue;

            }
        }
    }
</style>
