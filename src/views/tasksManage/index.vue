<template>
    <div>
        <div class="placeholder-item"></div>
        <mt-header class="header-wrap" fixed :title="title"></mt-header>
        <div class="page-wrap tasks-manage-wrap" v-if="!resError">
            <mko-double-cell title="任务执行报告" :label="`共完成${repoCount}个任务，${repoCount}个未审核`" is-link @click="$MKOPush('/tasks_repo')">
                <span class="warning">{{repoCount}}</span>
            </mko-double-cell>
            <div class="tasks-wrap">
                <mko-cell :title="s.name" is-link @click="go(i)" v-for="(s,i) in taskSurvey">
                    <span class="text-blue" v-if="i<2">{{s.count}}</span>
                </mko-cell>
            </div>
        </div>
        <tabs actived="tasks"></tabs>
        <res-error v-if="resError"></res-error>
    </div>
</template>

<script>
    import api from 'api'
    import moment from 'moment'
    import { Indicator } from 'mint-ui'
    import { DateNavbar, NoData, Tabs, ResError } from 'components'
    import MyTask from '../tasks/MyTask'
    import TaskSurvey from '../tasks/TaskSurvey'
    import * as types from 'store/mutation-types'
    var Promise = require("bluebird");

    export default {
        name: 'Tasks',
        data() {
            return {
                title: '任务',
                taskSurvey: [],
                repoCount: 0,
                tasks: [],
                notData: false,
                resError: false
            }
        },
        computed: {
            isAdmin() {
                return this.$store.state.user.isAdmin;
            }
        },
        activated() {
            this.adminMissonList();
            this.getRepoData();
        },
        methods: {
            getRepoData(){
                let params = {
                    status: 5,
                };
                let fetchAll = {
                    xc: api.getTaskReports({status: 5, taskType: 2}),
                    zb: api.getTaskReports({status: 5, taskType: 1}),
                };
                Promise.props(fetchAll).then(res => {
                    this.repoCount = 0;
                    if (res && res.xc && res.xc.code == 0) {
                        this.repoCount += parseInt(res.xc.response.countNumber);
                    }
                    if (res && res.zb && res.zb.code == 0) {
                        this.repoCount += parseInt(res.zb.response.countNumber);
                    }
                });
            },
            getXcTaskData(){
                api.getRoutineXunchaList().then(res => {
                    if (res && res.code == 0) {
                        res.response.forEach((item, i) => {
                            if (i > 0) {
                                this.taskSurvey[0].count += item.positionCount || 0;
                            } else {
                                this.taskSurvey[0].count = 0;
                            }
                        })
                    }
                });
            },
            getZbTaskData(){
                api.getZhiBanTasksList({
                    groupId: this.$store.getters.groupId,
                }).then(res => {
                    if (res && res.code == 0 && res.response) {
                        this.taskSurvey[1].count = res.response.countNumber;
                    }
                })
            },
            // 任务概况
            adminMissonList() {
                let taskSurvey = [];
                taskSurvey.push({
                    name: '巡查',
                    count: 0,
                    doing: 0,
                });
                taskSurvey.push({
                    name: '值班',
                    count: 0,
                    doing: 0,
                });
                taskSurvey.push({
                    name: '检查',
                    count: 0,
                    doing: 0,
                });
                taskSurvey.push({
                    name: '保养',
                    count: 0,
                    doing: 0,
                });
                taskSurvey.push({
                    name: '维修',
                    count: 0,
                    doing: 0,
                });
                taskSurvey.push({
                    name: '检测',
                    count: 0,
                    doing: 0,
                });
                this.taskSurvey = taskSurvey;
                localStorage.setItem('taskSurvey', JSON.stringify(taskSurvey));
                this.getXcTaskData();
                this.getZbTaskData();
            },
            initTaskData(tasks) {
                let xunchaTasks = [];
                let zhibanTasks = [];
                for (let task of tasks) {
                    if (task.taskType == 2) {
                        xunchaTasks.push(task);
                    } else if (task.taskType == 1) {
                        zhibanTasks.push(task);
                    }
                }
                let tmpTasks = [];
                if (xunchaTasks.length > 0) {
                    tmpTasks.push({
                        name: '巡查任务',
                        tasks: xunchaTasks
                    })
                }

                if (zhibanTasks.length > 0) {
                    tmpTasks.push({
                        name: '值班任务',
                        tasks: zhibanTasks
                    })
                }
                if (tmpTasks.length <= 0) {
                    this.notData = true;
                    this.tasks = [];
                } else {
                    this.notData = false;
                    this.tasks = tmpTasks;
                }
            },
            go(i){
                let path = [
                    '/xc_manage',
                    '/zhibanList'
                ];
                if (path[i])
                    this.$MKOPush(path[i]);
            }
        },
        components: {
            NoData,
            DateNavbar,
            MyTask,
            TaskSurvey,
            Tabs,
            ResError
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .tasks-manage-wrap {
        margin: 40px + @headerTop 0 0 0;
        padding: 14px 0 50px 0;
        .tasks-wrap {
            margin-top: 10px;
        }
    }

</style>
