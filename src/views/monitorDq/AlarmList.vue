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
                        name: '电气火灾监控探测',
                        desc: '温度报警，警告值：0.0-60℃',
                        alarmType: '温度过高',
                        alarmData: '72℃',
                        count: 2,
                        status: 2
                    },
                    {
                        id: 2,
                        name: '电气火灾监控探测',
                        desc: '电流报警，警告值：0.0~0.6A',
                        alarmType: '电流过高',
                        alarmData: '7.0A',
                        status: 1
                    }
                ]
            }
        },
        watch: {},
        computed: {},
        mounted() {
            sessionStorage.setItem('dqAlarmData', JSON.stringify(this.list));
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
                let data = sessionStorage.getItem('dqAlarmData');
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
                this.$MKOPush('/monitorDqAlarmDetail/' + id);
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .monitor-dq-wrap {
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
