<template>
    <div class="alarm-list-wrap">
        <div class="title-info">
            <div class="label fl">实时报警记录</div>
            <div class="value fr">共2条记录</div>
        </div>
        <mko-double-cell :title="badge(2)+'水压表'"
                         label="谁呀报警，警告值：20.0~666.0kPa" active is-link>
            未处理
        </mko-double-cell>
        <mko-double-cell title="消防水池"
                         label="高度报警，警告值：0.5-2.0M" is-link>
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
