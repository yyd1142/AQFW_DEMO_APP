<template>
    <div class="alarm-list-wrap">
        <div class="title-info">
            <div class="label fl">实时报警记录</div>
            <div class="value fr">共2条记录</div>
        </div>
        <mko-double-cell :title="(item.status==2?badge(2):'')+item.name"
                         :label="item.desc" :active="item.status==2"
                         is-link @click="goDetail(item.id)"
                         v-if="item.status!==0" v-for="item in list">
            {{item.status == 2 ? '待处理' : '已通知'}}
        </mko-double-cell>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                list: [
                    {
                        id: 1,
                        name: '水压监测',
                        desc: '水压报警，警告值：20.0~666.0kPa',
                        alarmType: '水压过高',
                        alarmData: '672.0kPa',
                        count: 2,
                        status: 2
                    },
                    {
                        id: 2,
                        name: '水位监测',
                        desc: '高度报警，警告值：0.5-2.0M',
                        alarmType: '水位过高',
                        alarmData: '3.0M',
                        status: 1
                    }
                ]
            }
        },
        watch: {},
        computed: {},
        mounted() {
            sessionStorage.setItem('sxtAlarmData', JSON.stringify(this.list));
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
                    let num = 0;
                    this.list.forEach(item => {
                        if (item.status != 0)
                            num++;
                    });
                    this.$emit('get', num)
                }
            },
            goDetail(id){
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
