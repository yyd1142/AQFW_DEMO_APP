<template>
    <div class="ZhibanTmpTable">
        <div class="placeholder-item"></div>
        <mko-header title="临时值班任务表" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <div class="zhiban-item" v-for="zhibanTable in zhibanItem">
                <div class="month">{{zhibanTable.month}}</div>
                <div class="zhiban-table">
                    <ul class="zhiban-date-table-view" v-for="(item, index) in zhibanTable.tables">
                        <li class="zhiban-date" :class="styleFilter(item.fullDay, index)">
                            <span>{{item.day}}</span>
                            <span>{{weekFilter(item)}}</span>
                        </li>
                        <li class="zhiban-date-table-cell" :style="{ width: cellWidth + 'px' }"
                            v-for="(banci, index) in item.taskZibans" @click.stop="viewTasksDetail(banci, item)">
            <span>
              <i class="dingding" :class="dingdingStyleFilter(banci.status)"></i>{{banci.description}}</span>
                            <span>{{banci.startTime | formatDate('HH:mm')}}~{{banci.endTime | formatDate('HH:mm')}}</span>
                            <span>{{banci.executorName}}
              <font v-if="banci.collaboratorName">,{{banci.collaboratorName}}</font>
            </span>
                        </li>
                        <li class="zhiban-date-table-cell not-data" v-if="item.taskZibans.length <= 0">
                            <span class="not-data">休息日</span>
                        </li>
                    </ul>
                    <no-data class="not-data-wrap" v-if="notData"></no-data>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import moment from 'moment'
    import {NoData} from 'components'
    import {Toast, Indicator} from 'mint-ui'
    import zhiban from 'store/modules/zhiban'
    import * as types from 'store/mutation-types'
    import cloneDeep from 'lodash/cloneDeep';

    var getCalendar = function (start, intervalDay) {
        start = start.split('-');
        let days = [];
        for (let i = 0; i <= intervalDay; i++) {
            let date = new Date(start[0], start[1] - 1, start[2], 0, 0, 0);
            let n = date.getDate() + i;
            date.setDate(n);
            days.push({
                week: date.getDay() == 0 ? 7 : date.getDay(),
                day: date.getDate(),
                fullDay: moment(date).format('YYYY-MM-DD'),
                taskZibans: []
            })
        }
        return days;
    }
    export default {
        data() {
            return {
                tables: [],
                allData: {},
                notData: false,
                today: null,
                cellWidth: 0
            }
        },
        computed: {
            zhibanItem() {
                let zhibanItem = [];
                let months = [];
                for (let item of this.tables) {
                    months.push(parseInt(item.fullDay.split('-')[1]))
                }
                months = Array.from(new Set(months));
                for (let item of months) {
                    zhibanItem.push({
                        month: `${item}月`,
                        tables: this.tables.filter(subItem => {
                            return item === parseInt(subItem.fullDay.split('-')[1])
                        })
                    })
                }
                return zhibanItem;
            }
        },
        mounted() {
            if (this.$store.state.xuncha) {
                this.$store.dispatch('clearXunChaTimer');
                this.$store.unregisterModule('xuncha');
            }
            if (this.$store.state.zhiban) {
                this.$store.dispatch('clearZhiBanTimer');
                this.$store.unregisterModule('zhiban');
            }
            this.$nextTick(() => {
                this.cellWidth = (document.body.clientWidth - 45) / 3 - 3;
            })
        },
        activated() {
            Indicator.open({spinnerType: 'fading-circle'});
            this.$nextTick(() => {
                this.getTaskZBRule()
            })
        },
        deactivated() {
            Indicator.close()
        },
        methods: {
            getTaskZBRule() {
                let params = {
                    page: 1,
                    count: 50,
                    status: -1,
                    taskType: 1,
                    groupId: this.$store.getters.groupId
                }
                if (this.$route.query.description) {
                    params['taskId'] = this.$route.query.description
                }
                api.getTaskList(params).then(result => {
                    if (!result) return false;
                    Indicator.close()
                    if (result.code == 0) {
                        if (result.response === undefined) {
                            this.tables = [];
                            this.notData = true;
                        } else {
                            let datas = result.response.datas;
                            datas.sort(function (a, b) {
                                return a.startTime - b.startTime
                            });
                            let minStartTime = datas[0].startTime;
                            datas.sort(function (a, b) {
                                return b.endTime - a.endTime
                            });
                            let maxEndTime = datas[0].endTime;
                            let intervalDay = ((maxEndTime - minStartTime) / 3600000 / 24).toFixed(0);
                            let Calendar = getCalendar(moment(minStartTime).format('YYYY-MM-DD'), intervalDay);
                            result.response.datas.forEach(data => {
                                data['startTimeText'] = moment(data.startTime).format('YYYY-MM-DD')
                                data['endTimeText'] = moment(data.endTime).format('YYYY-MM-DD')
                            });
                            for (let item of Calendar) {
                                let arr = [];
                                for (let j = 0; j < result.response.datas.length; j++) {
                                    let startTimeText = result.response.datas[j].startTimeText.split('-');
                                    let endTimeText = result.response.datas[j].endTimeText.split('-');
                                    let fullDayText = item.fullDay.split('-');
                                    let startDate = new Date(startTimeText[0], startTimeText[1] - 1, startTimeText[2], 0, 0, 0);
                                    let endDate = new Date(endTimeText[0], endTimeText[1] - 1, endTimeText[2], 0, 0, 0);
                                    let fullDate = new Date(fullDayText[0], fullDayText[1] - 1, fullDayText[2], 0, 0, 0);
                                    if (startDate <= fullDate && fullDate <= endDate) {
                                        arr.push(result.response.datas[j])
                                    }
                                }
                                item.taskZibans = arr;
                            }
                            this.tables = Calendar;
                            this.today = moment(minStartTime).format('YYYY年MM月');
                            this.notData = false;
                        }
                    }
                })

            },
            back() {
                this.$MKOPop();
            },
            edit() {
                sessionStorage.setItem('lastZhibanTableDatas', JSON.stringify(this.allData))
                this.$MKOPush({
                    path: '/editZhibanTable',
                    query: {
                        ruleId: parseInt(this.$route.params.id)
                    }
                })
            },
            zhibanTableScroll(item, index) {
                // let zhibanTableEle = document.getElementById(`scrollTable${index}`);
                // let scrollTableCellEle = document.getElementById(`scrollTableCell${index}`);
                // scrollTableCellEle.style.left = `${zhibanTableEle.scrollLeft}px`
            },
            handleScroll() {

            },
            viewTasksDetail(historyTasks, item) {
                this.$MKOPush({
                    path: `/zhibanTmpTableDetail/${historyTasks.taskId}`,
                    query: {
                        bcDetail: historyTasks,
                        zbDescribe: this.allData.zbDescribe,
                        modificationDate: `${moment(item.fullDay).format("YYYY-MM-DD")}`
                    }
                })
            },
            weekFilter(item) {
                let week = item.week;
                let text = "";
                switch (week) {
                    case 1:
                        text = "周一"
                        break;
                    case 2:
                        text = "周二"
                        break;
                    case 3:
                        text = "周三"
                        break;
                    case 4:
                        text = "周四"
                        break;
                    case 5:
                        text = "周五"
                        break;
                    case 6:
                        text = "周六"
                        break;
                    case 7:
                        text = "周日"
                        break;
                    default:

                }
                if (item.fullDay === moment(new Date()).format('YYYY-MM-DD')) text = '今天';
                return text;
            },
            styleFilter(date, index) {
                if (moment(new Date()).format('YYYY-MM-DD') === date) {
                    return 'today-item';
                } else {
                    return null
                }
            },
            dingdingStyleFilter(status) {
                //任务状态 [1: 待执行，2: 执行中，3: 已完成，未上传 4: 已上传，处理中  5: 处理完成，待审核，6: 通过审核（已完成） 7: 已超期]
                let colors = ['', 'gray', 'blue', 'green', 'red', 'yellow', 'green', 'red', 'blue'];
                return colors[status];
            }
        },
        components: {
            NoData
        }
    }
</script>

<style lang="less">
    @import "../../../config.less";

    @borderStyle: 1px solid rgba(238, 238, 238, 0.63);
    .ZhibanTmpTable {
        .month {
            background: #FFFFFF;
            box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.10);
            height: 30px;
            line-height: 30px;
            width: 100%;
            text-align: center;
            top: 0;
            z-index: 10;
            position: absolute;
        }
        .zhiban-table {
            width: 100%;
            background-color: #ffffff;
            .zhiban-date-table-view {
                width: 100%;
                display: -webkit-box;
                height: 88px;
                position: relative;
                padding-left: 50px;
                box-sizing: border-box;
                border-bottom: @borderStyle;
                .zhiban-date {
                    width: 45px;
                    height: 88px;
                    background-color: #fff;
                    letter-spacing: 0;
                    position: absolute;
                    left: 0;
                    color: #333333;
                    &.today-item {
                        color: #3399FF;
                    }
                    span {
                        width: 100%;
                        display: block;
                        text-align: center;
                    }
                    span:first-child {
                        font-size: 24px;
                        margin-top: 22px;
                    }
                    span:last-child {
                        font-size: 14px;
                    }
                }
                .zhiban-date-table-cell {
                    height: 88px;
                    text-align: center;
                    border-right: @borderStyle;
                    background: #f8f8f8;
                    &.zhiban-date-table-cell:last-child {
                        border-right: none;
                    }
                    &.not-data {
                        width: 100%;
                        font-size: 12px;
                        color: #333333;
                        letter-spacing: 0;
                        background-color: #ffffff;
                        height: 88px;
                        display: table;
                        span {
                            height: 88px;
                            line-height: 88px;
                            display: table-cell;
                            vertical-align: middle;
                            padding-right: 45px;
                        }
                    }
                    span {
                        display: block;
                    }
                    span:first-child {
                        font-size: 12px;
                        color: #333333;
                        letter-spacing: 0;
                        margin: 22px auto 8px auto;
                        position: relative;
                        width: 50%;
                        padding-left: 14px;
                        box-sizing: border-box;
                        height: 16px;
                        line-height: 16px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        .dingding {
                            width: 12px;
                            height: 12px;
                            line-height: 12px;
                            text-align: center;
                            position: absolute;
                            border-radius: 50%;
                            left: 0;
                            margin: auto;
                            top: 0;
                            bottom: 0;
                            &.green {
                                background: #57DA6D;
                            }
                            &.yellow {
                                background: #FFBB00;
                            }
                            &.gray {
                                background: #CCCCCC;
                            }
                            &.blue {
                                background: #3399FF;
                            }
                            &.red {
                                background: #FF6666;
                            }
                        }
                    }
                    span:nth-child(2) {
                        font-size: 12px;
                        color: #333333;
                        letter-spacing: 0;
                        line-height: 12px;
                        margin: 0 0 8px 0;
                    }
                    span:last-child {
                        font-size: 12px;
                        color: #666666;
                        letter-spacing: 0;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
            }
        }
        .zhiban-item {
            position: relative;
            padding-top: 30px;
        }
    }
</style>
