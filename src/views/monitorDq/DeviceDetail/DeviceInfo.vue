<template>
    <div class="device-info-wrap">
        <mko-cell title="设备名称" :val="data.name"></mko-cell>
        <mko-cell title="设备品牌" val="飞鹰"></mko-cell>
        <mko-cell title="设备单位" val="无锡万象城"></mko-cell>
        <mko-cell title="型号" val="A522"></mko-cell>
        <mko-cell title="所属系统" val="电气火灾监控系统"></mko-cell>
        <mko-cell title="安装时间" val="2017-11-01"></mko-cell>
        <mko-cell title="设备有效期" val="2020-11-01"></mko-cell>
        <mko-cell title="监控类型" val="自动火灾报警监控"></mko-cell>
        <mko-cell title="安装位置" :val="data.pos"></mko-cell>
        <mko-cell title="设备状态" :val="data.status==0?'停用':'正常'"></mko-cell>
        <!--<mko-cell title="设备编号" val="无"></mko-cell>-->
    </div>
</template>

<script>
    export default {
        props: ['status'],
        data () {
            return {
                data: {}
            }
        },
        watch: {
            status(){
                this.getData();
            }
        },
        computed: {},
        mounted() {
        },
        activated(){
            this.getData();
        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            getData(){
                let data = sessionStorage.getItem('dqDeviceData');
                if (data) {
                    this.data = JSON.parse(data)[parseInt(this.$route.params.id) - 1];
                }
            },
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .monitor-dq-device-wrap {
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
