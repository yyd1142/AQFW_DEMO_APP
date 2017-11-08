<template>
    <div class="alarm-record-wrap">
        <mko-double-cell :title="badge(2)+'水压表'"
                         label="谁呀报警，警告值：20.0~666.0kPa" active is-link @click="goDetail">
            未处理
        </mko-double-cell>
        <mko-double-cell title="消防水池"
                         label="高度报警，警告值：0.5-2.0M" is-link @click="goDetail">
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
                this.$MKOPush('/monitorSxtAlarmDetail/' + id);
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .monitor-sxt-device-wrap {
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
