<template>
    <div class="alarm-list-wrap">
        <div class="title-info">
            <div class="label fl">实时报警记录</div>
            <div class="value fr">共2条记录</div>
        </div>
        <mko-double-cell :title="badge(2)+'水压监测'"
                         label="水压报警，警告值：20.0~666.0kPa" active is-link @click="goDetail">
            待处理
        </mko-double-cell>
        <mko-double-cell title="水位监测"
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
    @import "../../config.less";

    .monitor-sxt-wrap {
        .alarm-list-wrap {
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
