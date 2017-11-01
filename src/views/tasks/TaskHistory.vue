<template>
    <div class="taskHistory">
        <div class="placeholder-item" id="placeholder"></div>
        <mko-header title="执行记录" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap task-history-page" id="pageWrapper">
            <mko-double-cell :title="timeFilter(item.endTime)"
                             :label="taskNameFr(item.description,item.type,item.taskType)"
                             @click="goInfo(item.taskId,item)"
                             v-for="(item, index) in list" is-link>
                <span :class="item.status | taskStatusColorFilter">{{item.status | taskStatusFilter}}</span>
            </mko-double-cell>
        </div>
        <no-data v-if="list.length <= 0"></no-data>
    </div>
</template>

<script>
    import api from 'api'
    import moment from 'moment'
    import {NoData} from 'components'
    import {Toast, Indicator} from 'mint-ui'

    var Promise = require("bluebird");
    let page = [1, 1];
    let page_count = [0, 0];
    let count = 20;
    let enter = true;
    export default {
        data() {
            return {
                taskTypes: ['', '值班', '巡查'],
                list: [],
                loadMore: false
            }
        },
        watch: {
            loadMore(value) {
                if (value) {
                    document.body.style.overflow = 'hidden'
                    this.loadBottom();
                } else {
                    document.body.style.overflow = 'auto'
                }
            }
        },
        activated() {
            window.addEventListener('scroll', this.handleScroll);
            this.setBackButton();

            Indicator.open({spinnerType: 'fading-circle'});
            scrollTo(0, 0);
            page = [1, 1];
            this.getRecordsTask()

        },
        deactivated() {
            window.removeEventListener('scroll', this.handleScroll)
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
        },
        methods: {
            taskNameFr(name, type, taskType){
                let names = {
                    '0/1': '值班',
                    '0/2': '临时巡查',
                    '1/2': '日常巡查'
                };
                if (!name) {
                    return names[`${type}/${taskType}`] + '(默认)'
                } else {
                    return `${name}${this.taskTypes[taskType]}`
                }
            },
            timeFilter(time) {
                if (time) {
                    return moment(time).format('YYYY年MM月DD日')
                } else {
                    return '未知日期'
                }
            },
            statusFilter(status) {
                return '已完成'
            },
            getRecordsTask() {

                let fetchAll = {
                    routineTask: (page[0] != 1 && (page[0] > page_count[0])) ? '' : api.getRecordsByRoutineTask({
                        page: page[0],
                        count: count
                    }),
                    tpyTask: (page[1] != 1 && (page[1] > page_count[1])) ? '' : api.getRecordsByTpyTask({
                        page: page[1],
                        count: count
                    })
                };

                Promise.props(fetchAll).then(res => {
                    this.loadMore = false;
                    Indicator.close();
                    let r_res = res.routineTask;
                    let t_res = res.tpyTask;
                    let r_task = [];
                    let t_task = [];
                    if (r_res.code == 0 && r_res.response) {
                        r_task = r_res.response.datas.map(item => {
                            return {
                                taskId: item.taskId,
                                type: item.type,
                                taskType: 2, //巡查
                                name: item.taskName,
                                description: item.taskName,
                                status: item.status,
                                endTime: item.actualEndTime,
                            }
                        });
                        page[0] = JSON.parse(r_res.response.page);
                        page_count[0] = JSON.parse(r_res.response.pageCount);
                    }
                    if (t_res.code == 0 && t_res.response) {
                        t_task = t_res.response.datas.map(item => {
                            return {
                                taskId: item.taskId,
                                type: item.type,
                                taskType: item.taskType, //巡查or值班
                                name: item.description,
                                description: item.description,
                                status: item.status,
                                endTime: item.endTime,
                                creater: item.creater
                            }
                        });
                        page[1] = JSON.parse(t_res.response.page);
                        page_count[1] = JSON.parse(t_res.response.pageCount);
                    }

                    if (page[0] == 1 && page[1] == 1) {
                        this.list = []
                    }
                    let list = r_task.concat(t_task);
                    list.sort(function (a, b) {
                        return b.endTime - a.endTime
                    });
                    list.forEach(item => {
                        this.list.push(item);
                    });
                    enter = false;
                });
            },
            loadBottom() {
                if (page[0] >= page_count[0] && page[1] >= page_count[1]) {
                    Toast({
                        message: '暂无更多数据',
                        position: 'middle',
                        duration: 1500
                    });
                    this.loadMore = false;
                    return false;
                }
                page[0]++;
                page[1]++;
                Indicator.open({spinnerType: 'fading-circle'});
                this.getRecordsTask();
            },
            handleScroll() {
                this.$nextTick(() => {
                    let totalHeight = document.getElementById('pageWrapper').offsetHeight;
                    let placeholderHeight = document.getElementById('placeholder').offsetHeight;
                    let scrollTop = document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
                    let clientHeight = 0;
                    if (document.body.clientHeight && document.documentElement.clientHeight) {
                        clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
                    } else {
                        clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
                    }
                    let scrollBottom = (totalHeight - scrollTop - clientHeight);
                    scrollBottom = scrollBottom + placeholderHeight;
                    this.loadMore = scrollBottom <= 0 ? true : false;
                })
            },
            goInfo(id, task) {
                if (task.taskType == 1 || (task.taskType == 2 && task.type == 0)) {
                    api.getTaskInfo({
                        taskId: id
                    }).then(res => {
                        if (!res) return false;
                        if (res.code == 0) {
                            if (res.response.groupId == this.$store.getters.groupId) {
                                if (res.response.status == 5) {
                                    this.reViewTask(res.response)
                                } else {
                                    this.goTaskInfo(res.response)
                                }
                            } else {
                                this.$MKODialog({msg: '无法查看该任务'});
                            }
                        } else {
                            this.$MKODialog({msg: '无法查看该任务'});
                        }
                    })
                } else {
                    api.getRoutineTaskInfo({
                        taskId: id
                    }).then(res => {
                        if (!res) return false;
                        if (res.code == 0) {
                            this.reviewRoutineXunChaTask(res.response);
                        } else {
                            this.$MKODialog({msg: '无法查看该任务'});
                        }
                    });
                }
            },
            goTaskInfo(task) {
                let name = 'xuncha'
                if (task.taskType == 1) name = "zhiban"
                if (name == 'xuncha') {
                    this.$MKOPush({
                        name: 'ReviewTmpXuncha',
                        params: {
                            id: task.taskId
                        },
                        query: {
                            name: task.description,
                            taskDetail: task
                        }
                    })
                }
                if (name == 'zhiban') {
                    let name = 'zhiban'
                    localStorage.setItem('lastReviewZhiBanData', JSON.stringify(task));
                    localStorage.setItem('lastZhiBanTaskId', task.taskId);
                    this.$MKOPush({
                        name: name,
                        params: {
                            taskId: task.taskId
                        },
                        query: {
                            from: 'tasks_repo',
                            fromQuery: this.$route.query,
                            fromPath: this.$route.fullPath,
                            isReview: true,
                            needReview: false,
                            name: task.description
                        }
                    })
                }
            },
            reViewTask(task) {
                if (task.status == 1 || task.status == 2 || task.status == 3 || task.status == 4 || task.status == 7) {
                    if (this.$store.getters.userName === task.creater) {
                        this.$MKODialog({msg: '该任务还未执行，请在我的任务中执行'});
                    } else {
                        this.$MKODialog({msg: '不能查看未开始、执行中、已超期的任务详情'});
                    }
                    return;
                }
                let name = 'xuncha'
                if (task.taskType == 1)
                    name = "zhiban"

                if (name == 'xuncha') {
                    localStorage.setItem('lastReviewXunChaData', JSON.stringify(task));
                    localStorage.setItem('lastXunChaTaskId', task.taskId);
                }
                if (name == 'zhiban') {
                    localStorage.setItem('lastReviewZhiBanData', JSON.stringify(task));
                    localStorage.setItem('lastZhiBanTaskId', task.taskId);
                }
                this.$route.query['name'] = 'tasksRepo';
                this.$MKOPush({
                    name: name,
                    params: {
                        taskId: task.taskId
                    },
                    query: {
                        from: 'tasksRepoList',
                        isReview: true,
                        name: task.description,
                        fromPath: this.$route.fullPath
                    }
                })
            },
            reviewRoutineXunChaTask(task) {
                let name = 'xuncha'
                localStorage.setItem('lastReviewXunChaData', JSON.stringify(task));
                localStorage.setItem('lastXunChaTaskId', task.taskId);
                this.$route.query['name'] = 'tasksRepo';
                this.$MKOPush({
                    name: name,
                    params: {
                        taskId: task.taskId
                    },
                    query: {
                        from: 'tasksRepoList',
                        isReview: true,
                        isRoutineTask: true,
                        name: task.description,
                        fromPath: this.$route.fullPath
                    }
                })
            },
            setBackButton() {
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                if (window.mkoBackButton.bInputData) {
                    window.mkoBackButton.callback = this.back;
                }
            },
            back() {
                enter = true;
                this.$MKOPop()
            },

        },
        components: {
            NoData
        }
    }
</script>

<style lang="less" scoped>
    .task-history-page {
        padding-bottom: 0;
    }
</style>

