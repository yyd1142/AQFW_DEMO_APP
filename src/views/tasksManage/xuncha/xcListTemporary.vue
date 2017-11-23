<template>
    <div class="xc-list-wrap">
        <mko-double-cell :title="item.description" is-link @click="go(item)" v-for="item in list_2.concat(list_1)">
            <div slot="label">
                <span class="label-info">{{item.executorName}}</span>
            </div>
            <span :class="item.status==2?'light':''">{{item.status | taskStatusFilter}}</span>
        </mko-double-cell>
        <xc-handle-hint :status="2" v-if="!isLoading&&(list_1.length+list_2.length)==0"></xc-handle-hint>
        <!--<xc-handle-hint :status="parseInt(type)+1"></xc-handle-hint>-->
    </div>
</template>

<script>
    import api from 'api'
    import xcHandleHint from './xcHandleHint.vue';
    import {Toast, Indicator} from 'mint-ui'
    import cloneDeep from 'lodash/cloneDeep';
    import * as types from 'store/mutation-types'
    import xuncha from 'store/modules/xuncha'

    let _page = 1;
    let _count = 20;
    let _totalCount = [0, 0, 0];   //总数
    let _scoTop = 0;
    let _reqCount = 0;
    export default {
        props: ['value', 'cur'],
        data() {
            return {
                enter: true,
                isLoading: false,
                list_1: [],
                list_2: [],
                //load-more
                autoFill: false,
                bottomAllLoaded: false,
                topStatus: '',
                bottomStatus: '',
                wrapperHeight: 0,
                loadMore: false
            }
        },
        watch: {
            value(val) {
                this.enter = val;
            },
            enter(val) {
                this.$emit('input', val)
            },
            loadMore(value) {
                if (value) this.loadBottom();
            }
        },
        computed: {},
        activated() {
            window.addEventListener('scroll', this.handleScroll);

            if (this.enter) {
                scrollTo(0, 0);
                this.bottomAllLoaded = false;
                _page = 1;
                //                this.list = [];
                _reqCount = 0;
                this.tpyList(1);
                this.tpyList(2);
            } else if (this.cur == 1) {
                scrollTo(0, _scoTop);
            }

            if (this.$store.state.dailyXuncha) {
                this.$store.dispatch('clearDailyXunchaTimer');
                this.$store.unregisterModule('dailyXuncha');
            }
        },
        deactivated() {
            window.removeEventListener('scroll', this.handleScroll)
        },
        destroyed() {
        },
        methods: {
            sortList() {
                if (_reqCount != 2) {
                    return;
                }
                let fns = function (a, b) {
                    return b.startTime - a.startTime;
                };
                this.list.sort(fns);
            },
            tpyList(status) {
                if (this.cur == 1 && _page == 1)
                    Indicator.open({spinnerType: 'fading-circle'});

                this.isLoading = true;
                let params = {
                    groupId: this.$store.getters.groupId,
                    status: status || 1,     //所有状态的任务
                    taskType: 2,    //巡查任务
                    page: _page,
                    count: _count
                };
                api.getTaskList(params).then(res => {
                    if (this.cur == 1)
                        Indicator.close();
                    this.isLoading = false;

                    if (res && res.code == 0) {
                        if (res.response) {
                            if (_page == 1) {
                                this[`list_${status}`] = res.response.datas;
                            } else {
                                res.response.datas.forEach(item => {
                                    this[`list_${status}`].push(item)
                                });
                            }
                            _reqCount++;
                            _totalCount[status] = res.response.countNumber;
                        }
                        //                        this.sortList();
                        this.enter = false;
                    }

                });
            },
            loadBottom() {
                if (this.list_1.length >= _totalCount[1] && this.list_2.length >= _totalCount[2]) {
                    Toast({
                        message: '暂无更多数据',
                        position: 'middle',
                        duration: 1500
                    });
                    this.bottomAllLoaded = true;
                    return false;
                }
                _page++;
                _reqCount = 0;
                this.tpyList(1);
                this.tpyList(2);
            },
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            go(task) {
                if (this.bottomStatus == 'drop' || this.bottomStatus == 'loading') {
                    return false;
                }
                if (task.status == 2) {
                    this.$MKODialog({title: '提示', msg: '<div class="center">任务正在进行中！</div>'})
                    return false;
                }
                if (task.status == 1) {
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
                } else {
                    this.$MKODialog({title: '提示', msg: '<div class="center">任务无法查看！</div>'})
                }
                // if (task.status == 5 || task.status == 6) {
                //     let name = 'xuncha'
                //     localStorage.setItem('lastReviewXunChaData', JSON.stringify(task));
                //     localStorage.setItem('lastXunChaTaskId', task.taskId);
                //     this.$MKOPush({
                //         name: name,
                //         params: {
                //             taskId: task.taskId
                //         },
                //         query: {
                //             from: 'xc_manage',
                //             fromQuery: this.$route.query,
                //             isReview: true,
                //             fromPath: this.$route.fullPath
                //         }
                //     })
                //     return;
                // }
                // if (task.status == 4) {
                //     this.$MKODialog({ title: '提示', msg: '报告上传成功，服务器正在自动处理，某些情况下可能需要1到2天' })
                //     return;
                // }
                // let routerPath = {};
                // let taskData = cloneDeep(task);
                // this.$store.registerModule('xuncha', xuncha);
                // this.$store.commit(types.XUNCHA_INIT_TASK_DATA, taskData);
                // localStorage.setItem('lastXunChaTaskId', task.taskId);
                // routerPath = {
                //     name: 'xuncha',
                //     params: {
                //         taskId: task.taskId
                //     },
                //     query: {
                //         from: 'xc_manage',
                //         fromPath: this.$route.fullPath
                //     }
                // }
                // this.$MKOPush(routerPath, {
                //     path: `/xc_manage`
                // });
            },
            handleScroll() {
                _scoTop = document.documentElement.scrollTop || document.body.scrollTop;
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
            }
        },
        components: {
            xcHandleHint
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .xc-list-wrap {
        box-shadow: 0 -0.5px 0 0 @baseBorder;
        .badge {
            display: inline-block;
            width: 54px;
            height: 20px;
            border: 1px solid @baseBorder;
            border-radius: 4px;
            line-height: 20px;
            font-size: 11px;
            text-align: center;
            color: @baseText02;
            background-color: @baseBG02;
        }
        .label-info {
            line-height: 12px;
            font-size: 12px;
            color: @baseText02;
        }
        .light {
            color: @mainBlue;
        }
    }
</style>

