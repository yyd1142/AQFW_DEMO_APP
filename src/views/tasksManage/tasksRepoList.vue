<template>
    <div class="tasks-repo-list-wrap" ref="pageWrapper">
        <mt-loadmore ref="loadmore" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                     :bottom-all-loaded="bottomAllLoaded" :auto-fill="autoFill">
            <div>
                <mko-double-cell :title="t.taskName"
                                 :label="`${t.executorName||'--'} ${formatDate(t.actualEndTime||t.actualStartTime,'YYYY-MM-DD')}`"
                                 @click="goInfo(t.taskId, t.type)" is-link v-for="t in list">
                    <span class="no-overflow">{{t.endTime | formatDate}}</span>
                    <!--<br><span class="no-overflow">设备故障：1</span>-->
                </mko-double-cell>
            </div>
        </mt-loadmore>

        <no-data class="not-data-wrap" v-show="noData"></no-data>
    </div>
</template>

<script>
    import api from 'api'
    import { NoData } from 'components'
    import { Toast, Indicator } from 'mint-ui'
    import { formatDate } from 'filters'
    import xuncha from 'store/modules/xuncha'
    import zhiban from 'store/modules/zhiban'
    import * as types from 'store/mutation-types'

    let _count = 20;
    export default {
        props: ['status', 'type', 'value', 'cur'],
        data() {
            return {
                scoTop: 0,
                enter: true,
                noData: false,
                page: 1,
                pageCount: 1,
                list: [],
                taskType: [
                    {text: '值班', value: 1},
                    {text: '巡查', value: 2},
                    {text: '维修', value: 3},
                    {text: '保养', value: 4},
                    {text: '检测', value: 5},
                    {text: '检查', value: 6}
                ],
                //load-more
                autoFill: false,
                bottomAllLoaded: false,
                topStatus: '',
                bottomStatus: '',
            }
        },
        watch: {
            value(val) {
                this.enter = val;
            },
            enter(val) {
                this.$emit('input', val);
            },
        },
        computed: {},
        mounted() {
        },
        activated() {
            window.addEventListener('scroll', this.handleScroll);

            let update = JSON.parse(sessionStorage.getItem('repoInfoIsUpdate'));
            if (this.enter || update) {
                scrollTo(0, 0);
                this.page = 1;
                this.getData();
            } else if (this.cur[0] == this.status && this.cur[1] == this.type) {
                scrollTo(0, this.scoTop);
            }
        },
        deactivated() {
            window.removeEventListener('scroll', this.handleScroll)
        },
        destroyed() {
            window.removeEventListener('scroll', this.handleScroll)
        },
        methods: {
            formatDate,
            getData() {
                if (this.page == 1)
                    Indicator.open({spinnerType: 'fading-circle'});

                let params = {
                    page: this.page,
                    count: _count,
                    status: JSON.parse(this.status),
                    taskType: JSON.parse(this.type),
                };
                api.getTaskReports(params).then(res => {
                    this.$refs.loadmore.onBottomLoaded();
                    Indicator.close();
                    if (res.response === undefined) {
                        this.list = [];
                        this.noData = true;
                        return false;
                    }
                    if (res.response && res.code == 0 && res.response) {
                        if (this.page == 1) {
                            this.list = res.response.datas;
                        } else {
                            res.response.datas.forEach(item => {
                                this.list.push(item)
                            })
                        }

                        if (this.list.length <= 0) {
                            this.noData = true;
                        } else {
                            this.noData = false;
                        }
                        this.page = parseInt(res.response.page);
                        this.pageCount = parseInt(res.response.pageCount);
                        if (this.page == 1)
                            this.$emit('reqSucc', parseInt(res.response.countNumber));
                        if (this.page >= this.pageCount)
                            this.bottomAllLoaded = true;

                        sessionStorage.setItem('repoInfoIsUpdate', false)
                        this.enter = false;
                    } else {
                        this.list = [];
                        this.noData = true;
                    }
                });
            },
            loadBottom() {
                if (this.page >= this.pageCount) {
                    Toast({
                        message: '暂无更多数据',
                        position: 'middle',
                        duration: 1500
                    });
                    this.bottomAllLoaded = true;
                    this.$refs.loadmore.onBottomLoaded();
                    return false;
                }
                this.page++;
                setTimeout(this.getData, 500);
            },
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            goInfo(id, taskType) {
                if (this.bottomStatus == 'drop' || this.bottomStatus == 'loading') {
                    return false;
                }
                if (taskType == 0) {
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
                } else if (taskType == 1) {
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
                    // this.$store.commit(types.XUNCHA_INIT_TASK_DATA, task);
                }
                if (name == 'zhiban') {
                    localStorage.setItem('lastReviewZhiBanData', JSON.stringify(task));
                    localStorage.setItem('lastZhiBanTaskId', task.taskId);
                    // this.$store.commit(types.ZHIBAN_INIT_TASK_DATA, task);
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
            handleScroll() {
                this.scoTop = document.documentElement.scrollTop || document.body.scrollTop;
                this.$nextTick(() => {
                    let totalHeight = this.$refs['pageWrapper'].offsetHeight;
                    let scrollTop = document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
                    let clientHeight = 0;
                    if (document.body.clientHeight && document.documentElement.clientHeight) {
                        clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
                    } else {
                        clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
                    }
                    let scrollBottom = totalHeight - scrollTop - clientHeight;
                    this.bottomAllLoaded = scrollBottom <= 0 ? false : true;
                })
            },
        },
        components: {
            NoData
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .tasks-repo-list-wrap {
        margin-top: 80px;
    }
</style>
