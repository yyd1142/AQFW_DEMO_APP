<template>
    <div class="alarm-record-wrap">
        <mko-double-cell :title="(item.status==2?badge(2):'')+item.name"
                         :label="item.desc" :active="item.status==2"
                         v-if="item.status!==0" v-for="item in list">
            {{item.status == 2 ? '待处理' : '已通知'}}
        </mko-double-cell>
    </div>
</template>

<script>
    export default {
        data () {
            return {
              list:[]
            }
        },
        watch: {},
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
            badge(val){
                return `<span class="badge">${val}</span>`
            },
            getData(){
                let data = sessionStorage.getItem('sxtAlarmData');
                if (data) {
                    this.list = JSON.parse(data);
                }
            },
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
