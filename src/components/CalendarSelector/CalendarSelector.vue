<template>
    <div class="calendar-wrap-popup" v-if="popupVisible">
        <div class="calendar-main">
            <div class="calendar-options">
                <div class="go-today" @click="goToday">
                    <i class="go-today-icon"></i>回到今天
                </div>
                <div class="year-selector">
                    <i class="icon iconfont icon-xiangzuojiantou previous-year-icon" @click="previousYear(fullyearDatas.year)"></i> {{fullyearDatas.year}}
                    <i class="icon iconfont icon-xiangyoujiantou next-year-icon" @click="nextYear(fullyearDatas.year)"></i>
                </div>
            </div>
            <div class="calendar-datas-view">
                <div class="week-item">
                    <div class="week-cell" v-for="(item, index) in weeks" v-text="item"></div>
                </div>
                <div class="calendar" v-for="(calendar, calendarIndex) in fullyearDatas.datas">
                    <div class="month-item">{{calendar.month + 1}}月</div>
                    <ul class="week-table-view" :class="monthIndex == calendar.datas.length - 1 && calendar.month != 11 ? 'border-bottom' : null " v-for="(month, monthIndex) in calendar.datas">
                        <li class="week-table-cell" :class="week.actived" v-for="(week, weekIndex) in month.weeks" v-html="week.date" @click="chooseDate(calendarIndex, monthIndex, weekIndex)"></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" rel="stylesheet/less">
    
</style>

<script>
    //判断当前年份是否是闰年(闰年2月份有29天，平年2月份只有28天)
    function isLeap(year) {
        return year % 4 == 0 ? (year % 100 != 0 ? 1 : (year % 400 == 0 ? 1 : 0)) : 0;
    }
    import moment from 'moment'
    var yearArray = []
    export default {
        data() {
            return {
                weeks: ['日', '一', '二', '三', '四', '五', '六'],
                calendarDatas: {},
                today: moment(new Date()).format("YYYY-MM-DD"),
                todayIndex: {},
                popupVisible: false,
                nextMonth: '',
                fullyearDatas: {}
            }
        },
        activated() {
            this.getFullYearDates(moment(new Date()).format("YYYY"))
        },
        methods: {
            chooseDate(calendarIndex, monthIndex, weekIndex) {
                let date = this.fullyearDatas.datas[calendarIndex].datas[monthIndex].weeks[weekIndex];
                if (date.fullDate != '') {
                    this.fullyearDatas.datas.forEach((calendarData) => {
                        let i = this.fullyearDatas.datas.indexOf(calendarData);
                        calendarData.datas.forEach((month) => {
                            let j = calendarData.datas.indexOf(month)
                            month.weeks.forEach((week) => {
                                let k = month.weeks.indexOf(week);
                                if (`${calendarIndex}|${monthIndex}|${weekIndex}` === `${i}|${j}|${k}`) {
                                    week.actived = 'actived';
                                } else {
                                    week.actived = null;
                                }
                            })
                        })
                    })
                    this.$emit('onChangeDateEvent', date.fullDate);
                    this.popupVisible = false;
                }
            },
            goToday() {
                yearArray = []
                this.getFullYearDates(moment(new Date()).format("YYYY"))
                this.$emit('onChangeDateEvent', this.today);
                this.popupVisible = false;
            },
            initCalendarSelector(_date) {
                let i, k, today = new Date(_date), //获取当前日期
                    y = today.getFullYear(), //获取日期中的年份
                    m = today.getMonth(), //获取日期中的月份(需要注意的是：月份是从0开始计算，获取的值比正常月份的值少1)
                    d = today.getDate(), //获取日期中的日(方便在建立日期表格时高亮显示当天)
                    firstday = new Date(y, m, 1), //获取当月的第一天
                    dayOfWeek = firstday.getDay(), //判断第一天是星期几(返回[0-6]中的一个，0代表星期天，1代表星期一，以此类推)
                    days_per_month = new Array(31, 28 + isLeap(y), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31), //创建月份数组
                    str_nums = Math.ceil((dayOfWeek + days_per_month[m]) / 7); //确定日期表格所需的行数
                let calendarDatas = {
                    datas: [],
                    month: m
                }
                for (i = 0; i < str_nums; i += 1) { //二维数组创建日期表格
                    calendarDatas.datas.push({
                        weeks: []
                    })
                    for (k = 0; k < 7; k++) {
                        let idx = 7 * i + k; //为每个表格创建索引,从0开始
                        let date = idx - dayOfWeek + 1; //将当月的1号与星期进行匹配
                        if ((date <= 0 || date > days_per_month[m])) {
                            calendarDatas.datas[i].weeks.push({
                                date: "<i style='color: #F7FAFF'>s</i>",
                                fullDate: '',
                                actived: ''
                            });
                        } else {
                            calendarDatas.datas[i].weeks.push({
                                date: idx - dayOfWeek + 1,
                                fullDate: new Date(y, m + 1, date, 0, 0, 0),
                                actived: ''
                            });
                        }
                        if (this.today == moment(calendarDatas.datas[i].weeks[k].fullDate).format("YYYY-MM-DD")) {
                            this.todayIndex = {
                                index: i,
                                weekIndex: k
                            }
                            calendarDatas.datas[i].weeks[k].actived = 'actived';
                        } else {
                            calendarDatas.datas[i].weeks[k].actived = null;
                        }
                    }
                }
                yearArray.push(calendarDatas)
                this.fullyearDatas = {
                    year: y,
                    datas: yearArray
                }
            },
            getFullYearDates(year) {
                for (let i = 0; i < 12; i++) {
                    this.initCalendarSelector(`${year}-${i + 1}-1`)
                }
            },
            previousYear(year) {
                yearArray = []
                for (let i = 0; i < 12; i++) {
                    this.initCalendarSelector(`${year - 1}-${i + 1}-1`)
                }
            },
            nextYear(year) {
                yearArray = []
                for (let i = 0; i < 12; i++) {
                    this.initCalendarSelector(`${year + 1}-${i + 1}-1`)
                }
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    @import "../../config.less";
    .calendar-wrap-popup {
        width: 100%;
        margin: auto;
        background-color: #F7FAFF;
        z-index: 20;
        position: fixed;
        top: 40px + @headerTop;
        .calendar-main {
            width: 100%;
            margin: 0 auto;
            position: relative;
            box-shadow: 0 2px 6px 0 rgba(201, 209, 217, 0.5);
            .calendar-datas-view {
                width: 100%;
                margin: 0 auto;
                background-color: #f7faff;
                height: 500px;
                overflow-y: scroll;
                padding-top: 74px;
                .calendar {}
            }
            .calendar-options {
                width: 100%;
                height: 30px;
                background-color: #EDF3FC;
                line-height: 30px;
                position: fixed;
                top: 40px + @headerTop;
                z-index: 20;
                .go-today {
                    color: #30A4FF;
                    font-size: 12px;
                    height: 30px;
                    float: left;
                    .go-today-icon {
                        background: url('/static/icons/resource.png') -822px -56px no-repeat;
                        background-size: @bg-size;
                        width: 10px;
                        height: 12px;
                        float: left;
                        margin: 8px 4px 0 30px;
                    }
                }
                .year-selector {
                    width: 100px;
                    font-size: 20px;
                    color: #A1ACBD;
                    text-align: center;
                    margin-left: auto;
                    margin-right: 28px;
                    .previous-year-icon {
                        font-weight: bold;
                    }
                    .next-year-icon {
                        font-weight: bold;
                    }
                }
            }
        }
    }
    
    .border-bottom {
        border-bottom: 1px solid #d3d3d3
    }
    
    .month-item {
        color: #0398FF;
        font-size: 30px;
        width: 100%;
        text-align: right;
        padding: 0 14px 0 0;
        height: 100vw / 7;
        line-height: 100vw / 7;
    }
    
    .week-table-view {
        width: 100%;
        margin-bottom: 10px;
        &.week-item {
            height: 38px;
            border-bottom: 1px solid #D3D3D3;
            position: fixed;
            top: 69px;
            z-index: 20;
            background-color: #f7faff;
            width: 100%;
            line-height: 38px;
            li {
                height: 36px;
                font-size: 10px;
                color: #333333;
                line-height: 36px;
            }
        }
    }
    
    .week-table-cell {
        width: 100% / 7;
        height: 100vw / 7;
        line-height: 100vw / 7;
        display: inline-block;
        text-align: center;
        font-size: 18px;
        color: #333333;
        &.is-today {
            background-color: #2CABFF;
            color: #ffffff;
            border-radius: 50%;
        }
        &.actived {
            background-color: #2CABFF;
            color: #ffffff;
            border-radius: 50%;
        }
        .not-date {
            color: #ffffff
        }
        .has-date {
            color: #ffffff
        }
    }
    
    .week-item {
        height: 38px;
        box-shadow: 0 2px 6px 0 rgba(201, 209, 217, 0.5);
        position: fixed;
        top: 69px + @headerTop;
        z-index: 20;
        background-color: #f7faff;
        width: 100%;
        line-height: 38px;
    }
    
    .week-cell {
        width: 100% / 7;
        text-align: center;
        font-size: 14px;
        color: #333333;
        float: left;
    }
</style>


