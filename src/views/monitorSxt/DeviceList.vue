<template>
    <div class="device-list-wrap">
        <div class="title-info">
            <div class="label fl">设施列表</div>
            <div class="value fr">共2个设施</div>
        </div>
        <mko-double-cell title="水压表" icon="icon-location"
                         label="深圳湾体育中心-体育馆，-1层，东北角巡查点" is-link @click="goDetail">
            正常
        </mko-double-cell>
        <mko-double-cell title="消防水池" icon="icon-location"
                         label="深圳湾体育中心-体育馆，2层，西南角巡查点" is-link @click="goDetail">
            停用
        </mko-double-cell>
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
            goDetail(){
                let id = 1;
                this.$MKOPush('/monitorSxtDeviceDetail/' + id);
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .monitor-sxt-wrap {
        .device-list-wrap {

        }
    }
</style>
