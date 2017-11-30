<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="电气监测"
                    :right-icon-text="status == 0 ? '启用': '停用'" @handleRightClick="changeStatus"
                    left-icon="icon-back" @handleLeftClick="back">
        </mko-header>
        <div class="page-wrap monitor-dq-device-wrap">
            <div class="chart-module-wrap">
                <div class="chart-wrap clear">
                    <div class="dashboard-wrap">
                        <div class="dashboard" ref="dashboard-left"></div>
                        <div class="sign">电压(V)</div>
                        <div class="fanwei">185V～245V</div>
                    </div>
                    <div class="dashboard-wrap">
                        <div class="dashboard" ref="dashboard-mid"></div>
                        <div class="sign">剩余电流(mA)</div>
                        <div class="fanwei">300mA～999mA</div>
                    </div>
                    <div class="dashboard-wrap">
                        <div class="dashboard" ref="dashboard-right"></div>
                        <div class="sign">线温(℃)</div>
                        <div class="fanwei">0～60℃</div>
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
    import echarts from 'echarts';
    import { Indicator, Toast } from 'mint-ui'

    let theme = 'macarons';
    export default {
        data () {
            return {
                tabI: 0,
                tabItems: ['设备信息', '报警记录'],
                status: '',
            }
        },
        watch: {},
        computed: {},
        mounted() {
        },
        activated(){
            this.DrawChart1(echarts);
            this.DrawChart2(echarts);
            this.DrawChart3(echarts);
            this.status = JSON.parse(sessionStorage.getItem('dqDeviceData'))[parseInt(this.$route.params.id) - 1].status;

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
                let id = 1;
                this.$MKOPush('/monitorDqDeviceChart/' + id);
            },
            changeStatus() {
                let status = this.status;
                let list = JSON.parse(sessionStorage.getItem('dqDeviceData'));
                console.log(list);
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
                        sessionStorage.setItem('dqDeviceData', JSON.stringify(list));
                        setTimeout(() => {
                            Indicator.close();
                            this.status = this.status == 0 ? 1 : 0;
                            Toast({message: `已${this.status === 0 ? '停用' : '启用'}`, duration: 2000});
                        }, 1500)
                    }
                });
            },
            DrawChart1(ec){
//                let datas = [19.5, 26.1, 20.3, 19.8];
//                let i = parseInt(Math.random() * 4);
                let data = 220;

                let myChart = ec.init(this.$refs['dashboard-left'], theme);
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
                            min: 185,
                            max: 245,
                            name: '',
                            type: 'gauge',
                            center: ['50%', '40%'],
                            splitNumber: 5,       // 分割段数，默认为5
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: [[0.001, '#FF6666'], [0.999, '#3399ff'], [1, '#FF6666']],
                                    width: 1,
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                splitNumber: 10,   // 每份split细分多少段
                                length: 5,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: 'auto',
                                }
                            },
                            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    color: 'auto',
                                    fontSize: 4,

                                }
                            },
                            splitLine: {           // 分隔线
                                show: true,        // 默认显示，属性show控制显示与否
                                length: 5,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    color: 'auto'
                                }
                            },
                            pointer: {
                                width: 1,
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
                                    fontSize: 5,
                                },

                            },
                            detail: {
                                formatter: '{value}',
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    color: 'auto',
                                    fontSize: 12,
                                }
                            },
                            data: [{value: data, name: ''}]
                        }
                    ]
                })
            },
            DrawChart2(ec){
                let datas = [310, 320, 310, 320, 330];
                let i = parseInt(Math.random() * 4);
                let data = datas[0];
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
                            max: 1000,
                            min: 300,
                            name: '',
                            type: 'gauge',
                            center: ['50%', '40%'],
                            splitNumber: 10,       // 分割段数，默认为5
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: [[0.001, '#FF6666'], [0.999, '#3399ff'], [1, '#FF6666']],
                                    width: 1,
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                splitNumber: 10,   // 每份split细分多少段
                                length: 5,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: 'auto',
                                }
                            },
                            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    color: 'auto',
                                    fontSize: 4,

                                }
                            },
                            splitLine: {           // 分隔线
                                show: true,        // 默认显示，属性show控制显示与否
                                length: 5,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    color: 'auto'
                                }
                            },
                            pointer: {
                                width: 1,
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
                                    fontSize: 5,
                                },

                            },
                            detail: {
                                formatter: '{value}',
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    color: 'auto',
                                    fontSize: 12,
                                }
                            },
                            data: [{value: data, name: ''}]
                        }
                    ]
                })
            },
            DrawChart3(ec){
                let datas = [31, 32, 35, 42];
                let i = parseInt(Math.random() * 4);
                let data = datas[0];
                let myChart = ec.init(this.$refs['dashboard-right'], theme);
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
                            min: 0,
                            max: 60,
                            name: '线温',
                            type: 'gauge',
                            center: ['50%', '40%'],
                            splitNumber: 5,       // 分割段数，默认为5
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: [[0.001, '#FF6666'], [0.999, '#3399ff'], [1, '#FF6666']],
                                    width: 1,
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                splitNumber: 10,   // 每份split细分多少段
                                length: 5,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: 'auto',
                                }
                            },
                            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    color: 'auto',
                                    fontSize: 4,

                                }
                            },
                            splitLine: {           // 分隔线
                                show: true,        // 默认显示，属性show控制显示与否
                                length: 5,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    color: 'auto'
                                }
                            },
                            pointer: {
                                width: 1,
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
                                    fontSize: 5,
                                },

                            },
                            detail: {
                                formatter: '{value}',
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    color: 'auto',
                                    fontSize: 12,
                                }
                            },
                            data: [{value: data, name: ''}]
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

    .monitor-dq-device-wrap {
        .chart-module-wrap {
            margin-bottom: 14px;
            .chart-wrap {
                background-color: #fff;
                .dashboard-wrap {
                    position: relative;
                    width: 33.33%;
                    float: left;
                    .dashboard {
                        margin: auto;
                        height: 160px;
                    }
                    .sign {
                        position: absolute;
                        bottom: 10px;
                        left: 50%;
                        transform: translate(-50%, 0);
                        -webkit-transform: translate(-50%, 0);
                        min-width: 100px;
                        font-size: 12px;
                        text-align: center;
                        color: @baseText02;
                    }
                    .fanwei {
                        position: absolute;
                        bottom: 25px;
                        width: 100%;
                        text-align: center;
                        font-size: 12px;
                        color: @baseText01;
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
