<template>
    <div>
        <mko-header title="电气监测" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap monitor-dq-wrap">

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

    .monitor-dq-wrap {

    }
</style>
