<template>
    <div>
        <mko-header title="报警详情" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap monitor-dq-alarm-wrap">
            <mko-info-bar v-if="status==1">已于2017-11-08 15:12排除该风险</mko-info-bar>
            <div class="title-card">
                <div class="cell clear">
                    <div class="title">报警部件</div>
                    <div class="value">测温式电气火灾监控探测器</div>
                </div>
                <div class="cell clear">
                    <div class="title">安装位置</div>
                    <div class="value">深圳湾体育中心-体育馆，-1层，东北角巡查点</div>
                </div>
                <div class="cell clear">
                    <div class="title">首次报警</div>
                    <div class="value">2017-11-08 14:15</div>
                </div>
                <div class="cell clear">
                    <div class="title">最近报警</div>
                    <div class="value">2017-11-08 14:30</div>
                </div>
                <div class="cell clear">
                    <div class="title">报警次数</div>
                    <div class="value">2</div>
                </div>
                <div class="cell clear">
                    <div class="title">报警数值</div>
                    <div class="value">无</div>
                </div>
            </div>

            <div class="title-bar">
                <div class="label">警情处理状态跟踪</div>
            </div>
            <div class="alarm-record-wrap">
                <mko-double-cell icon="icon-device-succ" title="处理完成" label="2017-11-08 14:30"></mko-double-cell>
                <mko-double-cell icon="icon-device-warn" title="已通知" label="2017-11-08 14:30"></mko-double-cell>
                <mko-double-cell icon="icon-device-danger" title="设备报警" label="2017-11-08 14:30"></mko-double-cell>
            </div>

            <div class="button-wrap" v-if="status!=1">
                <mko-button size="large" @click="selPerson">通知责任人</mko-button>
                <mko-button size="large" plain @click="removeDanger">排除风险</mko-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                status: 2
            }
        },
        watch: {},
        computed: {},
        mounted() {
        },
        activated(){
            this.status = 2;
        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            selPerson(){
                let id = 1;
                this.$MKOPush('/choosePerson')
            },
            removeDanger(){
                this.$MKODialog({
                    title: '排除风险吗',
                    msg: '排除风险后，该设备状态将恢复为正常',
                    cancelBtn: true
                }).then(res => {
                    if (res == 'confirm') {
                        this.status = 1;
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

    .monitor-dq-alarm-wrap {
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
                    font-size: 14px;
                    color: @baseText03;
                }
                .value {
                    float: left;
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
