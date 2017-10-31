<template>
    <div class="mko-check-box" @click="click">
        <div :class="active?'icon-is-checked':'icon-no-checked'"></div>
    </div>
</template>

<script>
    export default {
        props: ['active'],
        data () {
            return {
//                active: false
            }
        },
        watch: {
//            value(val){
//                this.active = val;
//            },
//            active(val){
//                this.$emit('input', val)
//            }
        },
        computed: {},
        mounted() {
//            this.active = this.value;
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

    .mko-check-box {
        .box {
            width: 22px;
            height: 22px;
            border: 1px solid @baseBorder;
            border-radius: 4px;
            background-color: #FFFFFF;
            &.active {
                border: 1px solid @mainBlue;
                background-color: @mainBlue;
            }
        }
    }
</style>
