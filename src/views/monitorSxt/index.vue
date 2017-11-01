<template>
    <div>
        <mko-header title="水系统监测" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap monitor-sxt-wrap">

        </div>
    </div>
</template>

<script>
    export default {
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
            back(){
                this.$MKOPop();
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .monitor-sxt-wrap {

    }
</style>
