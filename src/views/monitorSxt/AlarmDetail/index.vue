<template>
    <div>
        <mko-header title="报警详情" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap monitor-sxt-alarm-wrap">
            <mko-info-bar v-if="data.status==0">已于2017-11-08 15:12排除该风险</mko-info-bar>
            <div class="title-card">
                <div class="cell clear">
                    <div class="title">报警部件</div>
                    <div class="value">{{data.name}}</div>
                </div>
                <div class="cell clear">
                    <div class="title">安装位置</div>
                    <div class="value">深圳湾体育中心-体育馆，-1层，东北角巡查点</div>
                </div>
                <div class="cell clear">
                    <div class="title">首次报警时间</div>
                    <div class="value">2017-11-08 14:15</div>
                </div>
                <div class="cell clear">
                    <div class="title">最近报警时间</div>
                    <div class="value">2017-11-08 14:21</div>
                </div>
                <div class="cell clear">
                    <div class="title">报警次数</div>
                    <div class="value">2</div>
                </div>
                <div class="cell clear">
                    <div class="title">报警值</div>
                    <div class="value">{{data.alarmData}}</div>
                </div>
                <div class="cell clear">
                    <div class="title">警告值</div>
                    <div class="value">{{data.desc?data.desc.split('：')[1]:''}}</div>
                </div>
            </div>

            <div class="title-bar">
                <div class="label">警情处理状态跟踪</div>
            </div>
            <div class="alarm-record-wrap">
                <mko-double-cell icon="icon-device-succ" title="已确认正常" label="2017-11-08 14:30" v-if="data.status==0"></mko-double-cell>
                <mko-double-cell icon="icon-device-warn" title="已通知" label="2017-11-08 12:47" v-if="data.status<=1"></mko-double-cell>
                <mko-double-cell icon="icon-device-danger" title="待处理" label="2017-11-08 12:30"></mko-double-cell>
                <mko-double-cell icon="icon-device-danger" title="待处理" label="2017-11-06 13:23"></mko-double-cell>
            </div>

            <div class="button-wrap" v-if="data.status!==0">
                <mko-button size="large" @click="selPerson" v-if="data.status==2">通知责任人</mko-button>
                <mko-button size="large" plain @click="removeDanger" v-if="data.status>0">确认正常</mko-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                data: {}
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
            getData(){
                let data = sessionStorage.getItem('sxtAlarmData');
                if (data) {
                    this.data = JSON.parse(data)[this.$route.params.id - 1];
                }
            },
            selPerson(){
                this.$MKOPush({
                    name: 'ChoosePerson',
                    params: {
                        id: this.$route.params.id
                    },
                    query: {
                        from: 'sxt'
                    }
                })
            },
            removeDanger(){
                this.$MKODialog({
                    title: '排除风险吗',
                    msg: '排除风险后，该设备状态将恢复为正常',
                    cancelBtn: true
                }).then(res => {
                    if (res == 'confirm') {
                        this.data.status = 0;
                        let list = JSON.parse(sessionStorage.getItem('sxtAlarmData'));
                        for (let i in list) {
                            if (list[i].id == this.data.id) {
                                list.splice(i, 1, this.data)
                            }
                        }
                        sessionStorage.setItem('sxtAlarmData', JSON.stringify(list));
                    }
                })
            },
            back(){
                this.$MKOPop();
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .monitor-sxt-alarm-wrap {
        .mko-info-bar {
            padding-bottom: 0;
            height: auto;
            background-color: transparent;
        }
        .title-card {
            margin: 14px;
            padding: 8px 14px;
            border-radius: 4px;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
            letter-spacing: 0;
            background-color: #FFFFFF;
            .cell {
                padding: 6px 0;
                line-height: 14px;
                .title {
                    float: left;
                    margin-right: 14px;
                    width: 24%;
                    font-size: 14px;
                    color: @baseText03;
                }
                .value {
                    float: left;
                    width: 70%;
                    font-size: 14px;
                    color: @baseText02;
                }
            }
        }
        .title-bar {
            height: 34px;
            padding: 14px 14px 8px;
            line-height: 12px;
            font-size: 12px;
            letter-spacing: 0;
            background-color: @baseBG01;
            .label {
                color: @baseText02;
            }
        }
        .alarm-record-wrap {
            .mko-double-cell + .mko-double-cell {
                position: relative;
                &:after {
                    content: '';
                    position: absolute;
                    left: 23px;
                    top: -19px;
                    height: 38px;
                    width: 3px;
                    background-color: @baseBorder;
                }
            }
        }
        .button-wrap {
            position: fixed;
            bottom: 0;
            width: 100%;
            background-color: #fff;
            padding: 14px 0;
            .mko-button + .mko-button {
                margin-top: 14px;
            }
        }
    }
</style>
