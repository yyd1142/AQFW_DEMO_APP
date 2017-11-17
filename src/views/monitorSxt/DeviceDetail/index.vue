<template>
    <div>
        <mko-header title="水系统监测"
                    :right-icon-text="status == 0 ? '启用': '停用'" @handleRightClick="changeStatus"
                    left-icon="icon-back" @handleLeftClick="back">
        </mko-header>
        <div class="page-wrap monitor-sxt-device-wrap">
            <div class="chart-module-wrap">
                <div class="chart-wrap clear">
                    <div class="dashboard-wrap">
                        <div class="dashboard" ref="dashboard-mid"></div>
                        <div class="sign">{{chartNames[$route.params.id - 1]}}</div>
                    </div>
                </div>
                <div class="more" @click="goAllChart">
                    查看全部图表 <span class="sign icon-link-arrow"></span>
                </div>
            </div>
            <div class="tab-wrap">
                <div class="cell" :class="{'active':tabI==i}" v-for="(text,i) in tabItems" @click="tab(i)">
                    <span v-text="text"></span>
                </div>
            </div>
            <device-info :status="status" v-show="tabI==0"></device-info>
            <alarm-record v-show="tabI==1"></alarm-record>
        </div>
    </div>
</template>

<script>
    import AlarmRecord from './AlarmRecord.vue'
    import DeviceInfo from './DeviceInfo.vue'
    import { Indicator, Toast } from 'mint-ui'
    import echarts from 'echarts';
    let theme = 'macarons';
    export default {
        data () {
            return {
                tabI: 0,
                tabItems: ['设备信息', '报警记录'],
                chartNames: ['压力值(Pa)', '水位值(米)'],
                status: '',
            }
        },
        watch: {},
        computed: {},
        mounted() {
        },
        activated(){
            this.DrawChart2(echarts);
            this.status = JSON.parse(sessionStorage.getItem('sxtDeviceData'))[parseInt(this.$route.params.id) - 1].status;
        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            tab(i){
                this.tabI = i;
            },
            goAllChart(){
                let id = this.$route.params.id;
                this.$MKOPush('/monitorSxtDeviceChart/' + id);
            },
            changeStatus() {
                let status = this.status;
                let list = JSON.parse(sessionStorage.getItem('sxtDeviceData'));
                this.$MKODialog({
                    title: "提示",
                    msg: `确定${status === 0 ? '启用' : '停用'}吗？`,
                    cancelBtn: true,
                    cancelText: "取消"
                }).then(msg => {
                    if (msg == "confirm") {
                        Indicator.open({spinnerType: 'fading-circle'});
                        for (let item of list) {
                            if (item.id == this.$route.params.id) {
                                item.status = status == 0 ? 1 : 0;
                            }
                        }
                        sessionStorage.setItem('sxtDeviceData', JSON.stringify(list));
                        setTimeout(() => {
                            Indicator.close();
                            this.status = this.status == 0 ? 1 : 0;
                            Toast({message: `已${this.status === 0 ? '停用' : '启用'}`, duration: 2000});
                        }, 1500)
                    }
                });
            },
            DrawChart2(ec){
                let names = ['', ''];
                let maxs = [1000, 3];
                let max = maxs[this.$route.params.id - 1];
                let datas = [
                    [200, 250, 300, 350],
                    [1.5, 1.7, 1.4, 1.45],
                ];
                let i = parseInt(Math.random() * 4);
                let data = datas[this.$route.params.id - 1][0];


                let myChart = ec.init(this.$refs['dashboard-mid'], theme);
                myChart.setOption({
                    tooltip: {
                        formatter: "{a} <br/>{b} : {c}%"
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
//                            restore: {show: true},
//                            saveAsImage: {show: true}
                        }
                    },
                    series: [
                        {
                            max: max,
                            name: '',
                            type: 'gauge',
                            splitNumber: 10,       // 分割段数，默认为5
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: [[0.1, '#FF6666'], [0.8, '#3399ff'], [1, '#FF6666']],
                                    width: 3,
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                splitNumber: 10,   // 每份split细分多少段
                                length: 15,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: 'auto',
                                }
                            },
                            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    color: 'auto',
                                    fontSize: 12,

                                }
                            },
                            splitLine: {           // 分隔线
                                show: true,        // 默认显示，属性show控制显示与否
                                length: 15,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    color: 'auto'
                                }
                            },
                            pointer: {
                                width: 3,
                                lineStyle: {       // 属性lineStyle控制线条样式

                                }
                            },
                            title: {
                                show: true,
                                offsetCenter: [0, '-40%'],       // x, y，单位px
                                z: 0,
                                zlevel: 0,

                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    fontWeight: 'normal',
                                    fontSize: 12,
                                },

                            },
                            detail: {
                                formatter: '{value}',
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    color: 'auto',
                                    fontWeight: 'thin'
                                }
                            },
                            data: [{value: data, name: names[this.$route.params.id - 1]}]
                        }
                    ]
                })
            },

            back(){
                this.$MKOPop();
            }
        },
        components: {
            DeviceInfo, AlarmRecord
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .monitor-sxt-device-wrap {
        .chart-module-wrap {
            margin-bottom: 14px;
            .chart-wrap {
                background-color: #fff;
                .dashboard-wrap {
                    position: relative;
                    .dashboard {
                        margin: auto;
                        height: 280px;
                    }
                    .sign {
                        position: absolute;
                        bottom: 24px;
                        left: 50%;
                        transform: translate(-50%, 0);
                        -webkit-transform: translate(-50%, 0);
                        min-width: 75px;
                        font-size: 12px;
                        text-align: center;
                        color: @mainBlue;
                    }
                }
            }
            .more {
                height: 30px;
                line-height: 30px;
                border-top: 1px solid @baseBorder;
                font-size: 12px;
                text-align: center;
                background-color: #fff;
                .sign {
                    position: relative;
                    top: 1px;
                    left: 4px;
                    transform: scale(0.7, 0.7);
                }
            }
        }
        .tab-wrap {
            width: 100%;
            height: 32px;
            background-color: #ffffff;
            .cell {
                width: 50%;
                float: left;
                height: 24px;
                line-height: 26px;
                text-align: CENTER;
                color: @mainBlue;
                &.active {
                    span {
                        border-bottom: 2px solid @mainBlue;
                        display: block;
                        width: 62px;
                        margin-left: auto;
                        margin-right: auto;
                    }
                }
                span {
                    font-size: 15px;
                }
            }
        }
    }
</style>
