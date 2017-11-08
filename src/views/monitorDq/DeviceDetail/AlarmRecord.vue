<template>
    <div class="alarm-record-wrap">
        <mko-double-cell :title="badge(2)+'测温式电气火宅监控探测器'"
                         label="温度报警，警告值：0.0~60.0℃" is-link @click="goDetail">
            未处理
        </mko-double-cell>
        <mko-double-cell title="剩余电流式电气火灾监控探测器"
                         label="温度报警，警告值：0.0~0.6A" is-link @click="goDetail">
            已通知
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
            badge(val){
                return `<span class="badge">${val}</span>`
            },
            goDetail(){
                let id = 1;
                this.$MKOPush('/monitorDqAlarmDetail/' + id);
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .monitor-dq-device-wrap {
        .alarm-record-wrap {
            .badge {
                margin-right: 8px;
                padding: 1px 12px;
                border-radius: 2px;
                font-size: 12px;
                vertical-align: bottom;
                background-color: @mainDanger;
                color: #fff;
            }
        }
    }
</style>
