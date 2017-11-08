<template>
    <div class="device-list-wrap">
        <div class="title-info">
            <div class="label fl">设备列表</div>
            <div class="value fr">共1个设备</div>
        </div>
        <mko-double-cell title="测温式电气火灾监控探测器" icon="icon-location"
                         label="深圳湾体育中心-体育馆，-1层，东北角巡查点"
                         @click="goDetail" is-link>
            正常
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
                this.$MKOPush('/monitorDqDeviceDetail/' + id);
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";
</style>
