<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="titleNames[$route.params.id - 1]"
                    left-icon="icon-back" @handleLeftClick="back">
        </mko-header>
        <div class="page-wrap sxt-chart-module-wrap">
            <!--<div class="timer-bar">-->
            <!--<div class="timer">倒计时：{{time || '0'}}</div>-->
            <!--</div>-->
            <timer :status="2" :text="`${time||'0'}秒自动刷新`"></timer>
            <div class="chart-wrap clear">
                <div class="dashboard-wrap">
                    <div class="dashboard" ref="dashboard-mid"></div>
                    <div class="sign">{{chartNames[$route.params.id - 1]}}</div>
                    <div class="fanwei">{{fanwei[type].text}}</div>
                </div>
            </div>
            <div class="chart-wrap clear">
                <div class="line-chart" ref="lineChart-1"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts';
    import { Timer } from 'components'

    let theme = 'macarons';
    let timer = null;
    let type = '';
    let names = ['压力值{kPa)', '水位值(米)'];
    let i = 0;

    export default {
        data () {
            return {
                type: 0,
                allShow: false,
                time: 30,
                chartNames: ['压力值{kPa)', '水位值(米)'],
                titleNames: ['水压实时监测', '水位实时监测'],
                fanwei: [
                    {max: 666, min: 20, unit: 'kPa', text: '20.0～666.0kPa'},
                    {max: 2, min: 0.5, unit: 'M', text: '0.5～2.0M'}
                ],
            }
        },
        watch: {},
        computed: {},
        mounted() {
        },
        activated(){
            type = this.type = this.$route.params.id - 1;

            i = 0;
            this.refreshData();
            this.DrawChart4(echarts);

            this.time = 30;
            let that = this;
            timer = setInterval(function () {
                that.time = parseInt(that.time) - 1;
                if (that.time < 0) {
                    that.time = 30;
                    that.refreshData();
                }
            }, 1000);

        },
        deactivated() {
            clearInterval(timer);
            timer = null;
        },
        destroyed(){
        },
        methods: {
            refreshData(){
                this.DrawChart2(echarts);
                i++;
                if (i > 4)
                    i = 0;
            },
            DrawChart2(ec){
                let maxs = [1000, 3];
                let max = maxs[type];
                let datas = [
                    [200, 250, 300, 350, 310],
                    [1.5, 1.7, 1.4, 1.45, 1.46],
                ];
                let data = datas[type][i];

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
                            data: [{value: data, name: ''}]
                        }
                    ]
                })
            },

            DrawChart4(ec){

                let xData = [];
                let initDate = new Date(2017, 10, 1);
                for (let i = 0; i < 6; i++) {
                    if (i != 0)
                        initDate.setDate(initDate.getDate() + 1);

                    let date = `${initDate.getFullYear()}/${initDate.getMonth() || 12}/${initDate.getDate()}`;
                    xData.push(date);

                }

                let yDatas = [
                    [200, 250, 300, 350, 320, 360],
                    [1.5, 1.7, 1.4, 1.45, 1.43, 1.51],
                ];
                let yData = yDatas[type];
                let myChart = ec.init(this.$refs['lineChart-1'], theme);
                myChart.setOption({
                    title: {
                        text: names[type],
                        padding: 10,
                        textStyle: {
                            fontWeight: 'normal',
//                            fontSize: 5,
                            color: '#333',
                        },
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
//                        data: ['压力值']
                    },
                    toolbox: {
                        show: true,
                        feature: {}
                    },
                    calculable: true,
                    color: ['#3399ff'],
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            axisLine: {
                                lineStyle: {
                                    color: '#333'
                                }
                            },
                            axisLabel: {
                                interval: 0,
                                textStyle: {
                                    fontSize: 10,
                                    fontWeight: 100
                                }
                            },
                            axisTick: {
                                interval: 0
                            },
                            data: xData
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            max: this.fanwei[type].max * 1.1,
                            min: this.fanwei[type].min * 0.9,
                            axisLine: {
                                lineStyle: {
                                    color: '#333'
                                }
                            },
                            axisLabel: {
                                interval: 0,
                                textStyle: {
//                                    fontSize: 1,
                                    fontWeight: 100
                                }
                            },
                        }
                    ],
                    series: [
                        {
                            name: names[type],
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data: yData,
                            markLine: {
                                data: [
                                    {name: '范围最高值', yAxis: this.fanwei[type].max},
                                    {name: '范围最小值', yAxis: this.fanwei[type].min},
                                ],
                                lineStyle: {
                                    normal: {
                                        color: '#FF6666'
                                    },
                                },
                            }
                        }
                    ]
                })
            },
            back(){
                this.$MKOPop();
            }
        },
        components: {
            Timer
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .sxt-chart-module-wrap {
        .timer-bar {
            height: 30px;
            background-color: #fff;
            .timer {
                float: right;
                padding: 10px 10px 0 0;
            }
        }
        .chart-wrap {
            margin-bottom: 14px;
            background-color: #fff;
            .dashboard-wrap {
                padding-top: 14px;
                position: relative;
                .dashboard {
                    margin: auto;
                    height: 280px;
                }
                .sign {
                    position: absolute;
                    bottom: 15px;
                    left: 50%;
                    transform: translate(-50%, 0);
                    -webkit-transform: translate(-50%, 0);
                    min-width: 75px;
                    font-size: 12px;
                    text-align: center;
                    color: @baseText02;
                }
                .fanwei {
                    position: absolute;
                    bottom: 30px;
                    width: 100%;
                    font-size: 12px;
                    text-align: center;
                    color: @baseText01;
                }
            }
            .line-chart {
                margin: auto;
                height: 300px;
            }
        }
    }
</style>
