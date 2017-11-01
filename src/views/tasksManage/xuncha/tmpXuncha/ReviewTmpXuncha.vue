<template>
    <div class="ReviewTmpXuncha">
        <div class="placeholder-item"></div>
        <mko-header :title="$route.query.name" left-icon="icon-back" @handleLeftClick="back">
            <div class="header-right sp-header-right" slot="custom">
                <!-- <div class="right-icon icon icon-edit-header" @click="edit"></div> -->
                <!-- <div class="right-icon icon icon-history"></div> -->
            </div>
        </mko-header>
        <div class="page-wrap">
            <task-summary :task-info="taskInfo" :status="status"></task-summary>
            <div class="check-point-wrap" v-for="build, buildIndex  in builds">
                <div class="build-name" v-text="build.title"></div>
                <div class="floor" v-for="position, positionIndex in build.positions" @click="goReviewQiandao(position)">
                    <div class="padding floor-wrap">
                        <div class="floor-name">
                            <span class="item">{{position.name}}</span>
                            <span class="device-account">{{position.status | CheckPointPositionStatusFilter}}</span>
                            <i class="icon icon-link-arrow"></i>
                        </div>
                    </div>
                </div>
            </div>
            <no-data text="暂无巡查点" v-if="builds.length <= 0"></no-data>
        </div>
    </div>
</template>

<script>
import api from 'api'
import { Toast } from 'mint-ui'
import { TaskSummary, NoData } from 'components'
import moment from 'moment'
function compare(property) {
    return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}
export default {
    data() {
        return {
            builds: [],
            taskInfo: []
        }
    },
    computed: {
        taskDetail() {
            return this.$route.query.taskDetail;
        },
        status() {
            return this.$route.query.taskDetail ? this.$route.query.taskDetail.status : null;
        }
    },
    activated() {
        this.getXCTaskPosition()
    },
    methods: {
        back() {
            this.$MKOPop()
        },
        getXCTaskPosition() {
            api.getXCTaskPosition({
                taskId: this.taskDetail.taskId
            }).then(res => {
                let positions = res.response;
                let checkPoints = {};
                let builds = [];
                let status = 0;
                for (let p of positions) {
                    let v = p.positionName.split('|');
                    let v2 = p.positionValue.split('|');
                    let k = `${v[0]}${v[1]}`
                    let obj = checkPoints[k];
                    if (!p.status) {
                        status = 0;
                    } else {
                        status = this.taskDetail.status == 6 ? p.status : 0;
                    }
                    if (obj) {
                        obj.positions.push({
                            positionId: p.positionId,
                            fixedPositionId: p.fixedPositionId,
                            name: v[2],
                            status: status,
                            level: parseInt(v2[1])
                        });
                    } else {
                        obj = {
                            jzId: parseInt(v2[0]),
                            title: k,
                            level: parseInt(v2[1]),
                            positions: [{
                                positionId: p.positionId,
                                fixedPositionId: p.fixedPositionId,
                                name: v[2],
                                status: status,
                                level: parseInt(v2[1])
                            }],
                            status: 0
                        };
                        checkPoints[k] = obj;
                    }
                }
                for (let k of Object.keys(checkPoints)) {
                    builds.push(checkPoints[k]);
                }
                builds.forEach((item) => {
                    let level = item.positions[0].level;
                    item['level'] = level;
                })
                builds.sort(compare('level'))
                this.builds = builds;
                this.taskInfo = [{
                    key: '执行人员', value: this.taskDetail.executorName || '暂无'
                }, {
                    key: '执行单位', value: this.taskDetail.executorGroupName || '暂无'
                }, {
                    key: '执行日期', value: moment(this.taskDetail.startTime).format('YYYY-MM-DD HH:mm')
                }]
            });
        },
        edit() {

        },
        open(buildIndex, floorIndex, show) {
            this.builds[buildIndex].floors[floorIndex].show = !show;
        },
        goReviewQiandao(item) {
            this.$MKOPush({
                name: 'ReviewTmpQiandaoXuncha',
                params: {
                    id: this.$route.params.id
                },
                query: {
                    positionId: item.positionId,
                    taskInfo: this.taskInfo,
                    status: this.status,
                    name: item.name
                }
            })
        }
    },
    components: {
        NoData,
        TaskSummary
    }
}
</script>

<style lang="less">
@import "../../../../config.less";
.ReviewTmpXuncha {
    .sp-header-right {
        .right-icon+.right-icon {
            right: 48px !important;
        }
    }
    .xuncha-top-wrap {
        width: 100%;
        padding: 14px;
        .padding {
            background: #FFFFFF;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
            border-radius: 4px;
            padding: 14px;
            .xuncha-item {
                min-height: 14px;
                display: table;
                width: 100%;
                margin-bottom: 12px;
                &.desc {
                    padding-bottom: 0;
                    .key {
                        // display: block;
                    }
                }
                .key,
                .value {
                    vertical-align: middle;
                    display: table-cell;
                    line-height: 14px;
                    height: 14px;
                }
                .key {
                    font-size: 14px;
                    color: #999999;
                    letter-spacing: 0;
                    width: 56px + 14px;
                    &.full-width {
                        width: 100%;
                    }
                }
                .value {
                    font-size: 14px;
                    color: #666666;
                    letter-spacing: 0;
                    line-height: 14px;
                    white-space: normal;
                    word-break: break-all;
                    &.desc {
                        color: #666666;
                    }
                }
            }
        }
    }
    .upload-task-wrap {
        width: 100%;
        padding: 14px;
        .padding {
            background: #FFFFFF;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
            border-radius: 4px;
            .upload-task {
                width: 100%;
                height: 30px;
                background: #3399FF;
                text-align: center;
                line-height: 30px;
                border-radius: 4px 4px 0 0;
                div {
                    width: 85px;
                    margin: 0 auto;
                    position: relative;
                    padding-left: 14px;
                    .icon {
                        position: absolute;
                        left: 0;
                        margin: auto;
                        top: 0;
                        bottom: 0;
                    }
                    .item {
                        font-size: 16px;
                        color: #FFFFFF;
                        letter-spacing: 0;
                        line-height: 16px;
                    }
                }
            }
            .task-item {
                padding: 14px;
                .item {
                    width: 100%;
                    min-height: 14px;
                    line-height: 14px;
                    margin-bottom: 12px;
                    .key {
                        font-size: 14px;
                        color: #999999;
                        letter-spacing: 0px;
                        margin-right: 14px;
                    }
                    .value {
                        font-size: 14px;
                        color: #666666;
                        letter-spacing: 0px;
                        line-height: 14px;
                    }
                }
                .item-btn {
                    width: 100%;
                    height: 40px;
                    text-align: center;
                    display: table;
                    box-shadow: inset 0px 0px 0px 1px #299FFF;
                    border-radius: 4px;
                    margin-top: 10px;
                    color: #3399FF;
                    &.blue {
                        font-size: 16px;
                        letter-spacing: 0px;
                        line-height: 18px;
                        background-color: #3399FF;
                        color: #ffffff;
                        margin-top: 18px;
                    }
                    span {
                        font-size: 16px;
                        letter-spacing: 0px;
                        height: 40px;
                        line-height: 40px;
                        display: table-cell;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
    .check-point-wrap {
        width: 100%;
        .build-name {
            font-size: 12px;
            color: #999999;
            letter-spacing: 0px;
            line-height: 12px;
            width: 100%;
            margin: 14px auto 10px 0;
            padding: 0 0 0 14px;
        }
        .build-device-count {
            font-size: 12px;
            color: #999999;
            letter-spacing: 0;
            line-height: 12px;
            float: right;
            margin: -22px 0 0 0;
            padding-right: 14px;
        }
        .floor {
            width: 100%;
            &:last-child>.padding>.floor-name:after {
                content: none;
            }
            .padding {
                padding-left: 14px;
                background-color: #f8f8f8;
                &.floor-wrap {
                    background-color: #ffffff;
                }
                .floor-name {
                    width: 100%;
                    height: 44px;
                    position: relative;
                    line-height: 44px;
                    .border-btm(@borderGray);
                    .item {
                        width: 100%;
                        font-size: 16px;
                        color: #333333;
                        letter-spacing: 0px;
                        padding-right: 97px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        float: left;
                        box-sizing: border-box;
                    }
                    .device-account {
                        width: 50%;
                        font-size: 14px;
                        color: #3399FF;
                        letter-spacing: 0px;
                        float: right;
                        text-align: right;
                        padding-right: 20px;
                        position: absolute;
                        right: 10px;
                        &.yellow-font {
                            color: #FFBB00;
                        }
                    }
                    i {
                        position: absolute;
                        right: 14px;
                        bottom: 0;
                        z-index: 20;
                        top: 0;
                        margin: auto;
                    }
                }
                .check-point-table {
                    width: 100%;
                    .check-point-cell {
                        width: 100%;
                        height: 44px;
                        position: relative;
                        line-height: 44px;
                        padding-left: 22px;
                        box-sizing: border-box;
                        .border-btm(@borderGray);
                        &:last-child:after {
                            content: none;
                        }
                        .name {
                            width: 100%;
                            font-size: 16px;
                            color: #333333;
                            letter-spacing: 0px;
                            float: left;
                            padding-right: 133px;
                            box-sizing: border-box;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .status {
                            display: table-cell;
                        }
                        .icon-link-arrow {
                            position: absolute;
                            right: 14px;
                            bottom: 16px;
                            z-index: 20;
                        }
                        .icon-police-uncle {
                            position: absolute;
                            margin: auto;
                            bottom: 0;
                            top: 0;
                            left: 0;
                        }
                        .device-account {
                            position: absolute;
                            font-size: 14px;
                            color: #3399FF;
                            letter-spacing: 0px;
                            right: 0;
                            text-align: right;
                            padding-right: 20px;
                        }
                    }
                }
            }
        }
    }
    .xuncha-btn {
        height: 50px;
        width: 100%;
        display: table;
        background: #3399FF;
        position: fixed;
        bottom: 0;
        z-index: 22;
        &.end {
            background: #FF6666;
        }
        span {
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0px;
            width: 100%;
            height: 50px;
            line-height: 50px;
            vertical-align: middle;
            display: table-cell;
            text-align: center;
        }
    }
    .xuncha-end-btn {
        height: 40px;
        width: 100%;
        display: table;
        padding: 0 14px;
        margin: 14px 0;
        span {
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0px;
            background: #FF6666;
            border-radius: 4px;
            width: 100%;
            height: 40px;
            line-height: 40px;
            vertical-align: middle;
            display: table-cell;
            text-align: center;
            box-sizing: border-box;
        }
    }
}
</style>
