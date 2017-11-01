<template>
    <div class="ZhibanTable">
        <div class="placeholder-item"></div>
        <mko-header :title="allData.description" left-icon="icon-back" @handleLeftClick="back" right-icon="icon-edit-header" @handleRightClick="edit"></mko-header>
        <div class="page-wrap">
            <div class="month">{{today | formatDate('YYYY年MM月')}}</div>
            <div class="zhiban-table">
                <ul class="zhiban-date-table-view" v-for="(item, index) in historyTables">
                    <li class="zhiban-date" :class="styleFilter(item.fullDay, index)">
                        <span>{{item.day}}</span>
                        <span>{{weekFilter(item)}}</span>
                    </li>
                    <li class="zhiban-date-table-cell" :style="{ width: cellWidth + 'px' }" v-for="(banci, index) in item.taskZibans" @click.stop="viewHistoryTasksDetail(banci, item)">
                        <span>
                            <i class="dingding" :class="dingdingStyleFilter(banci.status)"></i>{{banci.description}}</span>
                        <span>{{banci.startTime | formatDate('HH:mm')}}~{{banci.endTime | formatDate('HH:mm')}}</span>
                        <span v-text="banci.executorName"></span>
                    </li>
                    <li class="zhiban-date-table-cell not-data" v-if="item.taskZibans.length <= 0">
                        <span>休息日</span>
                    </li>
                </ul>
                <ul :id="'scrollTable' + index" class="zhiban-date-table-view" v-for="(item, index) in sixDaysTables">
                    <li :id="'scrollTableCell' + index" class="zhiban-date" :class="styleFilter(item.fullDay, index)">
                        <span>{{item.day}}</span>
                        <span>{{weekFilter(item)}}</span>
                    </li>
                    <li class="zhiban-date-table-cell" :style="{ width: cellWidth + 'px' }" v-for="(banci, index) in item.taskZibans" @click.stop="viewTasksDetail(banci, item)">
                        <span>
                            <i class="dingding gray" v-if="banci.type != 2"></i>{{banci.type == 2 ? '' : banci.bcName}}</span>
                        <span>{{banci.type == 2 ? '' : banciTimeFilter(banci.bcTime)}}</span>
                        <span>{{banci.type == 2 ? '' : banci.executorName}}</span>
                    </li>
                    <li class="zhiban-date-table-cell not-data" v-if="item.taskZibans.length <= 0">
                        <span>休息日</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import api from 'api'
import moment from 'moment'
import { Toast, Indicator } from 'mint-ui'
import zhiban from 'store/modules/zhiban'
import * as types from 'store/mutation-types'
import cloneDeep from 'lodash/cloneDeep'
var intervalDay = 3;
var getSixDaysBYtoday = function() {
    let sixDays = [];
    for (let i = 0; i <= 6; i++) {
        let date = new Date();
        date.setDate(date.getDate() + i);
        sixDays.push({
            week: date.getDay() == 0 ? 7 : date.getDay(),
            day: date.getDate(),
            fullDay: moment(date).format('YYYY-MM-DD'),
            taskZibans: []
        })
    }
    sixDays.splice(0, 1);
    return sixDays;
}

var getHistoryDaysBYtoday = function(start, end) {
    start = start.split('-');
    end = end.split('-');
    let days = [];
    for (let i = 0; i <= intervalDay; i++) {
        let date = new Date(start[0], start[1] - 1, start[2], 0, 0, 0);
        date.setDate(date.getDate() + i);
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
            sixDaysTables: [],
            allData: {},
            historyTables: [],
            cellWidth: 0,
            today: new Date()
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.cellWidth = (document.body.clientWidth - 45) / 3 - 3;
        })
    },
    activated() {
        Indicator.open({ spinnerType: 'fading-circle' });
        this.$nextTick(() => {
            this.getTaskZBRule()
            this.getTodayZBRule()
        })
    },
    deactivated() {
        Indicator.close();
    },
    methods: {
        getTodayZBRule() {
            let startTime = moment(new Date().setDate(new Date().getDate() - intervalDay)).format('YYYY-MM-DD');
            let endTime = moment(new Date()).format('YYYY-MM-DD')
            api.getTodayZBRule({
                groupId: this.$store.getters.groupId,
                taskType: 1,
                startTime: startTime,
                endTime: endTime,
                type: 1,
                ruleId: JSON.parse(this.$route.params.id)
            }).then(result => {
                if (!result) return false;
                if (result.code == 0) {
                    let taskData = result.response;
                    let historyDays = getHistoryDaysBYtoday(startTime, endTime);
                    result.response.forEach(data => { data.startTime = moment(data.startTime).format("YYYY-MM-DD HH:mm:ss") })
                    historyDays.forEach(data => {
                        let arr = []
                        for (let i = 0; i < result.response.length; i++) {
                            let startTime = result.response[i].startTime.substr(0, 10);
                            if (data.fullDay == startTime) {
                                arr.push(taskData[i])
                            }
                        }
                        data.taskZibans = arr;
                    })
                    this.historyTables = historyDays;
                } else {
                    this.historyTables = [];
                }
            })
        },
        getTaskZBRule() {
            api.getTaskZBRule({
                ruleId: JSON.parse(this.$route.params.id)
            }).then(result => {
                if (!result) return false;
                if(!result.response) {
                    this.back();
                    return false;
                }
                if (result.code == 0) {
                    let sixDays = getSixDaysBYtoday();
                    let data = result.response;
                    this.allData = data;
                    data.offDuty = data.offDuty ? data.offDuty.split(',') : [];
                    let taskZibans = data.taskZibans;
                    taskZibans.sort((a, b) => {
                        return b.id - a.id;
                    }) //固定排序
                    let taskZBRecords = data.taskZBRecords;
                    for (let day of sixDays) {
                        let zbArr = [];
                        for (let key = 0; key < data.taskZibans.length; key++) {
                            zbArr.push({
                                date: day.fullDay,
                                bcName: taskZibans[key].bcName,
                                bcTime: taskZibans[key].bcTime,
                                executor: taskZibans[key].executor,
                                executorName: taskZibans[key].executorName,
                                type: 1,
                                id: taskZibans[key].id,
                                ruleId: taskZibans[key].ruleId,
                                recordId: null
                            });
                        }
                        day.taskZibans = zbArr;
                    }
                    if (data.taskZBRecords.length > 0) {
                        for (let i of sixDays) {
                            for (let zb of i.taskZibans) {
                                for (let j = 0; j < data.taskZBRecords.length; j++) {
                                    if (data.taskZBRecords[j].banciId == zb.id && moment(data.taskZBRecords[j].modificationDate).format('YYYY-MM-DD') == zb.date) {
                                        zb.type = taskZBRecords[j].type;
                                        zb.bcName = taskZBRecords[j].content ? JSON.parse(taskZBRecords[j].content).bcName : zb.bcName;
                                        zb.bcTime = taskZBRecords[j].content ? JSON.parse(taskZBRecords[j].content).bcTime : zb.bcTime;
                                        zb.executor = taskZBRecords[j].content ? JSON.parse(taskZBRecords[j].content).executor : zb.executor;
                                        zb.executorName = taskZBRecords[j].content ? JSON.parse(taskZBRecords[j].content).executorName : zb.executorName;
                                        zb.recordId = taskZBRecords[j].id;
                                    }
                                }
                            }
                        }
                    }

                    sixDays.forEach((item) => {
                        data.offDuty.forEach(date => {
                            if (date === item.week.toString()) {
                                item.taskZibans = []
                            }
                        })
                    });

                    this.sixDaysTables = sixDays; //后6天的表格数据
                }
                Indicator.close()
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
        viewTasksDetail(banci, item) {
            console.log(banci)
            if (banci.type == 2) {
                Toast({ message: '暂无班次信息', duration: 1500 });
                return false;
            }
            this.$MKOPush({
                path: `/zhibanTableDetail/${this.allData.ruleId}`,
                query: {
                    bcDetail: banci,
                    zbDescribe: this.allData.zbDescribe,
                    modificationDate: `${moment(item.fullDay).format("YYYY-MM-DD")}`
                }
            })
        },
        viewHistoryTasksDetail(historyTasks, item) {
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
        banciTimeFilter(time) {
            if (!time) return '暂无时间段';
            let startTime = time.substr(0, 5);
            let endTime = time.substring(9, 14);
            return `${startTime}~${endTime}`
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
            let colors = ['', 'gray', 'blue', 'green', 'red', 'yellow', 'green', 'red'];
            return colors[status];
        }
    }
}
</script>

<style lang="less">
@import "../../../config.less";
@borderStyle: 1px solid rgba(238, 238, 238, 0.63);
.ZhibanTable {
    .month {
        background: #FFFFFF;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.10);
        height: 30px;
        line-height: 30px;
        width: 100%;
        text-align: center;
        top: 44px + @headerTop;
        z-index: 10;
        position: fixed;
    }
    .zhiban-table {
        width: 100%;
        background-color: #ffffff;
        margin-top: 30px;
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
}
</style>
