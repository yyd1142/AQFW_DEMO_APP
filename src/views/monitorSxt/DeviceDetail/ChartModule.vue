<template>
    <div>
        <mko-header title="水系统监测"
                    left-icon="icon-back" @handleLeftClick="back">
        </mko-header>
        <div class="page-wrap sxt-chart-module-wrap">
            <div class="timer-bar">
                <div class="timer">倒计时：{{time || '0'}}</div>
            </div>
            <div class="chart-wrap clear">
                <div class="dashboard" ref="dashboard-mid"></div>
            </div>
            <div class="chart-wrap clear">
                <div class="line-chart" ref="lineChart-1"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts';
    let theme = 'macarons';
    let timer = null;
    let type = '';
    let names = ['压力值(Pa)', '水位值(米)'];
    export default {
        data () {
            return {
                allShow: false,
                time: 30,
            }
        },
        watch: {},
        computed: {},
        mounted() {
        },
        activated(){
            this.refreshData();
            this.time = 30;
            let that = this;
            timer = setInterval(function () {
                that.time = parseInt(that.time) - 1;
                if (that.time < 0) {
                    that.time = 30;
                    that.refreshData();
                }
            }, 1000);

            type = this.$route.params.id - 1;
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
                this.DrawChart4(echarts);
            },
            DrawChart2(ec){
                let names = ['压力值(Pa)', '水位值(米)'];
                let maxs = [1000, 200];
                let max = maxs[this.$route.params.id - 1];
                let data = parseInt(Math.random() * max);
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

            DrawChart4(ec){

                let xData = [];
                let initDate = new Date(1968, 10, 4);
                for (let i = 0; i < 60; i++) {
                    if (i != 0)
                        initDate.setDate(initDate.getDate() + 1);

                    let date = `${initDate.getFullYear()}/${initDate.getMonth() || 12}/${initDate.getDate()}`;
                    xData.push(date);

                }

                let yData = [];
                let initValue = 10;
                for (let i = 0; i < 60; i++) {
                    let r = parseInt(Math.random() * 20);
                    let f = r % 2 == 0 ? r : (-1 * r);
                    initValue += f;
                    if (initValue < 0) {
                        initValue += Math.abs(f) * 2;
                    }
                    yData.push(initValue);
                }

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
                        data: ['压力值']
                    },
                    toolbox: {
                        show: true,
                        feature: {}
                    },
                    calculable: true,

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
//                                interval: 0,
                                textStyle: {
                                    fontSize: 1,
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
                            name: '',
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data: yData
                        }
                    ]
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

    .sxt-chart-module-wrap {
        .timer-bar {
            height: 30px;
            background-color: #fff;
            .timer {
                float: right;
                padding:10px 10px 0 0;
            }
        }
        .chart-wrap {
            margin-bottom: 14px;
            background-color: #fff;
            .dashboard {
                margin: auto;
                height: 280px;
            }
            .line-chart {
                margin: auto;
                height: 300px;
            }
        }
    }
</style>
