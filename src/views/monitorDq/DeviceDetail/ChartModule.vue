<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="电气实时监测"
                    left-icon="icon-back" @handleLeftClick="back">
        </mko-header>
        <div class="page-wrap dq-chart-module-wrap">
            <!--<div class="timer-bar clear">-->
            <!--<div class="timer">倒计时：{{time || '0'}}</div>-->
            <!--</div>-->
            <timer :status="2" :text="`${time||0}秒后自动刷新`"></timer>
            <div class="chart-wrap clear">
                <div class="dashboard-wrap">
                    <div class="dashboard" ref="dashboard-left"></div>
                    <div class="sign">电压(V)</div>
                    <div class="fanwei">187V～242V</div>
                </div>
                <div class="dashboard-wrap">
                    <div class="dashboard" ref="dashboard-mid"></div>
                    <div class="sign">电流(mA)</div>
                    <div class="fanwei">300mA～999mA</div>
                </div>
                <div class="dashboard-wrap">
                    <div class="dashboard" ref="dashboard-right"></div>
                    <div class="sign">线温(℃)</div>
                    <div class="fanwei">0～60℃</div>
                </div>
            </div>
            <div class="chart-wrap clear">
                <div class="line-chart" ref="lineChart-1"></div>
                <div class="line-chart" ref="lineChart-2"></div>
                <div class="line-chart" ref="lineChart-3"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts';
    import { Timer } from 'components'
    let theme = 'macarons';
    let timer = null;
    let i = 0;

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
            i = 0;
            this.refreshData();
//            this.DrawChart4(echarts);
//            this.DrawChart5(echarts);
//            this.DrawChart6(echarts);

            this.time = 30;
            let that = this;
            timer = setInterval(function () {
                that.time = parseInt(that.time) - 1;
                if (that.time < 0) {
                    that.time = 30;
                    that.refreshData();
                }
            }, 1000)

        },
        deactivated() {
            clearInterval(timer);
            timer = null;
        },
        destroyed(){
        },
        methods: {
            refreshData(){
                this.DrawChart1(echarts);
                this.DrawChart2(echarts);
                this.DrawChart3(echarts);
                this.DrawChart4(echarts);
                this.DrawChart5(echarts);
                this.DrawChart6(echarts);
                i++;
                if (i > 4)
                    i = 0;
            },
            DrawChart1(ec){
                let datas = [220, 210, 200, 211, 190];
                let data = datas[i];
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
                            max: 500,
                            name: '',
                            type: 'gauge',
                            splitNumber: 5,       // 分割段数，默认为5
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: [[0.045, '#FF6666'], [0.999, '#3399ff'], [1, '#FF6666']],
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
            DrawChart2(ec){
                let datas = [200, 220, 210, 240, 260];
                let data = datas[i];
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
                            name: '',
                            type: 'gauge',
                            splitNumber: 10,       // 分割段数，默认为5
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: [[0.1, '#FF6666'], [0.8, '#3399ff'], [1, '#FF6666']],
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
                                    fontWeight: 'thin'
                                }
                            },
                            data: [{value: data, name: ''}]
                        }
                    ]
                })
            },
            DrawChart3(ec){
                let datas = [31, 32, 35, 42, 44];
                let data = datas[i];
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
                            max: 100,
                            name: '线温',
                            type: 'gauge',
                            splitNumber: 5,       // 分割段数，默认为5
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: [[0.1, '#FF6666'], [0.8, '#3399ff'], [1, '#FF6666']],
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
                    [220, 210, 200, 211, 190, 220],
                    [19.2, 19.4, 19.5, 19.6, 20.1, 20.2],
                ];
                let i = Math.round(Math.random() * 1, 0);
                let yData = yDatas[0];

                let myChart = ec.init(this.$refs['lineChart-1'], theme);
                myChart.setOption({
                    title: {
                        text: '电压(V)',
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
                        data: ['电压']
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
                            min: 100,
                            max: 250,
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
                            name: '电压值',
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data: yData,
                            markLine: {
                                data: [
                                    {name: '范围最高值', yAxis: 242},
                                    {name: '范围最小值', yAxis: 187},
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
            DrawChart5(ec){

                let xData = [];
                let initDate = new Date(2017, 10, 1);
                for (let i = 0; i < 6; i++) {
                    if (i != 0)
                        initDate.setDate(initDate.getDate() + 1);

                    let date = `${initDate.getFullYear()}/${initDate.getMonth() || 12}/${initDate.getDate()}`;
                    xData.push(date);

                }

                let yDatas = [
                    [320, 340, 410, 504, 720, 450],
                    [0.23, 0.24, 0.25, 0.22, 0.46, 0.42],
                ];
                let i = Math.round(Math.random() * 1, 0);
                let yData = yDatas[0];

                let myChart = ec.init(this.$refs['lineChart-2'], theme);
                myChart.setOption({
                    title: {
                        text: '电流(mA)',
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
                        data: ['电流']
                    },
                    toolbox: {
                        show: false,
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
                            min: 100,
                            max: 1000,
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
                            name: '电流值',
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data: yData,
                            markLine: {
                                data: [
                                    {name: '范围最高值', yAxis: 999},
                                    {name: '范围最小值', yAxis: 300},
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
            DrawChart6(ec){
                let myChart = ec.init(this.$refs['lineChart-3'], theme);

                let xData = [];
                let initDate = new Date(2017, 10, 1);
                for (let i = 0; i < 6; i++) {
                    if (i != 0)
                        initDate.setDate(initDate.getDate() + 1);

                    let date = `${initDate.getFullYear()}/${initDate.getMonth() || 12}/${initDate.getDate()}`;
                    xData.push(date);

                }

                let yDatas = [
                    [31, 32, 35, 42, 34, 29],
                    [29, 31, 34, 41, 32, 28],
                ];
                let i = Math.round(Math.random() * 1, 0);
                let yData = yDatas[0];


                myChart.setOption({
                    title: {
                        text: '线温(℃)',
                        padding: 10,
                        textStyle: {
                            fontWeight: 'normal',
                            color: '#333',
                        },
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
//                        data: ['最高气温', '最低气温']
                    },
                    toolbox: {
                        show: false,
                        feature: {}
                    },
                    calculable: true,
                    color: ['#3399ff'],

                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: xData,
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
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            min: -10,
                            max: 80,
                            axisLabel: {
                                formatter: '{value}°C',
                                textStyle: {
//                                    fontSize: 1,
                                    fontWeight: 100
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#333'
                                }
                            },
                        }
                    ],
                    series: [
                        {
                            name: '温度值',
                            type: 'line',
                            data: yData,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            markPoint: {
//                                data: [
//                                    {type: 'max', name: '最大值'},
//                                    {type: 'min', name: '最小值'}
//                                ]
                            },
                            markLine: {
                                data: [
                                    {name: '范围最高值', yAxis: 60},
                                    {name: '范围最小值', yAxis: 0},
                                ],
                                lineStyle: {
                                    normal: {
                                        color: '#FF6666'
                                    },
                                },
                            }
                        },
                    ]
                });
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

    .dq-chart-module-wrap {
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
                position: relative;
                padding-top: 14px;
                width: 33.33%;
                float: left;
                .dashboard {
                    margin: auto;
                    height: 180px;
                }
                .sign {
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translate(-50%, 0);
                    -webkit-transform: translate(-50%, 0);
                    min-width: 75px;
                    font-size: 12px;
                    text-align: center;
                    color: @mainBlue;
                }
                .fanwei {
                    position: absolute;
                    text-align: center;
                    font-size: 12px;
                    width: 100%;
                    bottom: 27px;
                    color: @mainBlue;
                }
            }
            .line-chart {
                margin: auto;
                height: 300px;
            }
        }
    }
</style>
