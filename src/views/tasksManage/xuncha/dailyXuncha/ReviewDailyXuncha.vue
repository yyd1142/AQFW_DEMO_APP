<template>
    <div class="ReviewDailyXuncha">
        <div class="placeholder-item"></div>
        <mko-header :title="taskDetail.name" left-icon="icon-back" @handleLeftClick="back">
            <div class="header-right sp-header-right" slot="custom">
                <div class="right-icon icon icon-edit-header" @click="edit"></div>
                <!-- <div class="right-icon icon icon-history"></div> -->
            </div>
        </mko-header>
        <div class="page-wrap">
            <task-summary :task-info="taskInfo"></task-summary>
            <div class="check-point-wrap" v-for="build, buildIndex  in builds">
                <div class="build-name" v-text="build.jzName"></div>
                <div class="build-device-count" v-if="build.totalDeviceCount != 0">共{{build.totalDeviceCount}}个设备</div>
                <div class="floor" v-for="floor, floorIndex in build.floors">
                    <div class="padding floor-wrap" @click.stop="open(buildIndex, floorIndex, floor.show)">
                        <div class="floor-name">
                            <span class="item">{{floor.level}}层</span>
                            <i class="icon icon-link-arrow-up"></i>
                        </div>
                    </div>
                    <transition name="fade">
                        <div class="padding" v-if="floor.show">
                            <ul class="check-point-table">
                                <li class="check-point-cell" v-for="checkPoint in floor.positions" @click="goReviewQiandao(checkPoint)">
                                    <i class="icon icon-police-uncle"></i>
                                    <span class="name" v-text="checkPoint.name"></span>
                                    <span class="device-account">{{checkPoint.deviceCount}}个设备</span>
                                    <i class="icon icon-link-arrow"></i>
                                </li>
                            </ul>
                        </div>
                    </transition>
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
    export default {
        data() {
            return {
                builds: [],
                taskInfo: [],
                positionIds: [],
                ruleId: this.$route.params.id
            }
        },
        computed: {
            taskDetail: {
                cache: false,
                get: function () {
                    return JSON.parse(sessionStorage.getItem(`ruleData${this.ruleId}`)).taskDetail;
                }
            },
            status() {
                let data = JSON.parse(sessionStorage.getItem(`ruleData${this.ruleId}`)).taskDetail;
                return data ? data.status : null;
            }
        },
        activated() {
            this.ruleId = this.$route.params.id;
            this.setBackButton();
            this.getPositions();
        },
        deactivated() {
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
        },
        methods: {
            setBackButton() {
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                if (window.mkoBackButton.bInputData) {
                    window.mkoBackButton.callback = this.back;
                }
            },
            back() {
                sessionStorage.removeItem(`ruleData${this.ruleId}`);
                this.$MKOPop()
            },
            getPositions() {
                api.getXunchaSpotListByTask({
                    ruleId: this.taskDetail.ruleId
                }).then(result => {
                    if (!result) return false;
                    if (result.code == 0) {
                        let CheckPointPositions = result.response;
                        let builds = [];
                        let jzIDs = [];
                        let positionIds = [];
                        CheckPointPositions.forEach((item) => {
                            let deviceCounts = [];
                            jzIDs.push(item.jzId);
                            item['show'] = false;
                            item['status'] = 1;
                            item.positions.forEach(position => {
                                position['status'] = 1;
                                positionIds.push(position.positionId);
                                deviceCounts.push(position.deviceCount);
                            })
                            item['positionsDeviceCount'] = eval(deviceCounts.join('+'))
                        })
                        jzIDs = Array.from(new Set(jzIDs))
                        for (let item of jzIDs) {
                            let deviceCounts = [];
                            let floors = CheckPointPositions.filter((subItem) => {
                                return subItem.jzId == item
                            });
                            floors.forEach(floor => {
                                deviceCounts.push(floor.positionsDeviceCount);
                                floor.show = false;
                            });
                            builds.push({
                                jzId: item,
                                jzName: floors[0].jzName ? floors[0].jzName : '',
                                status: 1,
                                floors: floors,
                                totalDeviceCount: eval(deviceCounts.join('+'))
                            })
                        }
                        this.builds = builds;
                        this.positionIds = positionIds;
                        this.taskInfo = [{
                            key: '执行人员', value: this.taskDetail.fzUserNames || '暂无'
                        }, {
                            key: '执行日期', value: moment(new Date()).format('YYYY-MM-DD')
                        }, {
                            key: '任务描述', value: this.taskDetail.requireDesc || '暂无'
                        }]
                    }
                })
            },
            edit() {
                let data = {
                    taskDetail: this.taskDetail,
                    positionIds: this.positionIds,
                    builds: this.builds
                };
                sessionStorage.setItem('lastRuleId', parseInt(this.ruleId));
                sessionStorage.setItem(`ruleData${this.ruleId}`, JSON.stringify(data));

                this.$MKOPush({
                    path: '/xc_task_edit/routine?id=' + this.ruleId,
//                query: {
//                    taskDetail: this.$route.query.taskDetail,
//                    positionIds: this.positionIds,
//                    builds: this.builds
//                }
                })
            },
            open(buildIndex, floorIndex, show) {
                this.builds[buildIndex].floors[floorIndex].show = !show;
            },
            goReviewQiandao(item) {
                this.$MKOPush({
                    name: 'ReviewDailyXunchaQiandao',
                    params: {
                        id: this.$route.params.id
                    },
                    query: {
                        positionId: item.positionId,
                        taskInfo: this.taskInfo,
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

    .ReviewDailyXuncha {
        .sp-header-right {
            .right-icon + .right-icon {
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
                &:last-child > .padding > .floor-name:after {
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
