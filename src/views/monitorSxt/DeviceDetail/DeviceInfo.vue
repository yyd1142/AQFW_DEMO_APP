<template>
    <div class="device-info-wrap">
        <mko-cell title="设备名称" :val="name"></mko-cell>
        <mko-cell title="设备品牌" val="飞鹰"></mko-cell>
        <mko-cell title="设备单位" val="无锡万象城"></mko-cell>
        <mko-cell title="型号" val="A522"></mko-cell>
        <mko-cell title="所属系统" val="电气火灾监控系统"></mko-cell>
        <mko-cell title="安装时间" val="2017-11-01"></mko-cell>
        <mko-cell title="设备有效期" val="2021-11-01"></mko-cell>
        <mko-cell title="监控类型" val="水压监控"></mko-cell>
        <mko-cell title="安装位置" val="深圳湾体育中心-游泳馆，2层，西南角巡查点"></mko-cell>
        <mko-cell title="设备状态" val="开启"></mko-cell>
        <!--<mko-cell title="设备编号" val="无"></mko-cell>-->
    </div>
</template>

<script>
    export default {
        data () {
            return {
                name: ''
            }
        },
        watch: {},
        computed: {},
        mounted() {
        },
        activated(){
            let type = this.$route.params.id - 1;
            let names = ['水压监测', '水位监测'];
            this.name = names[type]
        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {},
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .monitor-sxt-device-wrap {
        .device-info-wrap {
            .mko-basic-cell {
                .title {
                    width: 120px;
                }
                .value {
                    flex: auto;
                    -webkit-flex: auto;
                    width: auto;
                }
            }
        }
    }
</style>
