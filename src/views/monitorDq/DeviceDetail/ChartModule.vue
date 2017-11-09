<template>
    <div>
        <mko-header title="水系统监测"
                    :right-icon-text="time||'0'"
                    left-icon="icon-back" @handleLeftClick="back">
        </mko-header>
        <div class="page-wrap dq-chart-module-wrap">
            <div class="chart-wrap clear">
                <div class="dashboard" ref="dashboard-left"></div>
                <div class="dashboard" ref="dashboard-mid"></div>
                <div class="dashboard" ref="dashboard-right"></div>
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
    let theme = 'macarons';
    let timer = null;


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
            },
            DrawChart1(ec){
                let data = parseInt(Math.random() * 220);
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
                            max: 220,
                            name: '业务指标',
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
                            data: [{value: data, name: '电压()'}]
                        }
                    ]
                })
            },
            DrawChart2(ec){
                let data = parseInt(Math.random() * 1000);
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
                            name: '业务指标',
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
                            data: [{value: data, name: '电流(mA)'}]
                        }
                    ]
                })
            },
            DrawChart3(ec){
                let data = parseInt(Math.random() * 150);
                while (data < 20) {
                    console.log(data);
                    data = parseInt(Math.random() * 150);
                }
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
                            min: 20,
                            max: 150,
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
                            data: [{value: data, name: '线温(℃)'}]
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
                            name: '成交',
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data: yData
                        }
                    ]
                })
            },
            DrawChart5(ec){

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
                        initValue += (Math.abs(f) * 2);
                    }
                    yData.push(initValue);
                }

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
                        data: ['电压']
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
                            name: '成交',
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data: yData
                        }
                    ]
                })
            },
            DrawChart6(ec){
                let myChart = ec.init(this.$refs['lineChart-3'], theme);

                let xData = ['13:30', '13:31', '13:32', '13:33', '13:34'];


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
                        show: true,
                        feature: {}
                    },
                    calculable: true,
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
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} °C'
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
                            name: '最高气温',
                            type: 'line',
                            data: [11, 11, 15, 13, 12],
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        },
                        {
                            name: '最低气温',
                            type: 'line',
                            data: [1, -2, 2, 5, 3],
                            markPoint: {
                                data: [
                                    {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                                ]
                            },
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                });
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

    .dq-chart-module-wrap {
        .chart-wrap {
            margin-bottom: 14px;
            background-color: #fff;
            .dashboard {
                margin: auto;
                height: 150px;
                width: 33.33%;
                float: left;
            }
            .line-chart {
                margin: auto;
                height: 300px;
            }
        }
    }
</style>
