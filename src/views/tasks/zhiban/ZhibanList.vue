<template>
    <div class="zhiban">
        <div class="placeholder-item"></div>
        <mko-header title="值班管理" left-icon="icon-back" right-icon="icon-add" @handleRightClick="addZhibanTask" @handleLeftClick="back"></mko-header>
        <mko-dropdowns :actions="actions" ref="dropdownWrapper"></mko-dropdowns>
        <div class="page-wrap" id="pageWrapper">
            <mko-nav-bar>
                <mko-tab-item :label="item.label" :activied="item.activied" v-for="(item, index) in tabs" @handleTabClick="tab"></mko-tab-item>
            </mko-nav-bar>
            <mt-loadmore :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="bottomAllLoaded" :auto-fill="autoFill" ref="loadmore">
                <ul class="tasks-table-view" v-if="tabName == '日常值班'">
                    <li class="tasks-table-cell" v-for="(item, index) in tasks" @click="viewTask(item)">
                        <div class="tasks-type">长期有效</div>
                        <div>
                            <mko-double-cell :title="item.description || '暂无名称'" :label="item.executorGroupName" :val="'共'+ item.banciCount +'个班次'" is-link></mko-double-cell>
                        </div>
                    </li>
                </ul>
                <ul class="tasks-table-view" v-if="tabName == '临时值班'">
                    <li class="tasks-table-cell" v-for="(item, index) in tmpTasks" @click="vieTmpTask(item)">
                        <div class="tasks-type">{{item.createTime | formatDate}}</div>
                        <div>
                            <mko-double-cell :title="item.description || '暂无名称'" :label="zhibanUserFilter(item)" :val="'共'+ item.taskCount +'个班次'" is-link></mko-double-cell>
                        </div>
                    </li>
                </ul>
            </mt-loadmore>
            <no-data class="not-data-wrap" v-if="tasks.length <= 0 && tabName == '日常值班'"></no-data>
            <no-data class="not-data-wrap" v-if="tmpTasks.length <= 0 && tabName == '临时值班'"></no-data>
        </div>
    </div>
</template>

<script>
import api from 'api'
import { formatDate } from 'filters'
import { Indicator, Toast } from 'mint-ui'
import { NoData } from 'components'
var tabs = [{
    label: '日常值班', activied: true
}, {
    label: '临时值班', activied: false
}]
export default {
    data() {
        return {
            tabs: tabs,
            tasks: [],
            tmpTasks: [],
            actions: [],
            tabName: '日常值班',
            autoFill: false,
            bottomAllLoaded: false,
            bottomStatus: '',
            pageItem: []
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.actions = [{
                icon: 'icon-dailyZhiban', name: '日常值班', method: this.createZhibanTable
            }, {
                icon: 'icon-tmpZhiban', name: '临时值班', method: this.createTmpZhibanTask
            }]
        })
    },
    activated() {
        window.addEventListener('scroll', this.handleScroll);
        Indicator.open({ spinnerType: 'fading-circle' });
        this.getZhiBanTasksList(1)
        this.getZhiBanTmpTasksList(1)
    },
    deactivated() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        back() {
            this.$MKOPop()
        },
        addZhibanTask() {
            this.$refs.dropdownWrapper.open = true;
        },
        getZhiBanTasksList(page, type) {
            api.getZhiBanTasksList({
                groupId: this.$store.getters.groupId,
                page: page,
                count: 15
            }).then(result => {
                Indicator.close();
                if(type === 'loadmore') this.$refs.loadmore.onBottomLoaded();
                if (!result) return false;
                if (result.code == 0) {
                    if (result.response === undefined || result.response.datas.length == 0) {
                        this.tasks = type == 'loadmore' ? this.tasks.concat(result.response.datas) : [];
                        this.bottomAllLoaded = true;
                    } else {
                        if (type == 'loadmore') {
                            Toast({
                                message: '加载完成',
                                position: 'middle',
                                duration: 1500
                            });
                            this.tasks = this.tasks.concat(result.response.datas);
                            this.pageItem[0] = {
                                page: result.response.page,
                                pageCount: result.response.pageCount,
                                count: result.response.count,
                                countNumber: result.response.countNumber
                            }
                            this.bottomAllLoaded = true;
                        } else {
                            this.tasks = result.response ? result.response.datas : [];
                            this.bottomAllLoaded = false;
                            if (result.response) {
                                this.pageItem[0] = {
                                    page: result.response.page,
                                    pageCount: result.response.pageCount,
                                    count: result.response.count,
                                    countNumber: result.response.countNumber
                                }
                            }
                        }
                    }

                } else {
                    this.tasks = [];
                    this.bottomAllLoaded = true;
                }
            })
        },
        getZhiBanTmpTasksList(page, type) {
            api.getZhiBanTmpTasksList({
                groupId: this.$store.getters.groupId,
                taskType: 1,
                count: 15,
                page: page,
                type: 0,
                sortField: 'createTime',
                sortValue: 'DESC'
            }).then(result => {
                Indicator.close()
                if(type === 'loadmore') this.$refs.loadmore.onBottomLoaded();
                if (!result) return false;
                if (result.code == 0) {
                    if (result.response === undefined || result.response.datas.length == 0) {
                        this.tmpTasks = type == 'loadmore' ? this.tmpTasks.concat(result.response.datas) : [];
                        this.bottomAllLoaded = true;
                    } else {
                        if (type == 'loadmore') {
                            Toast({
                                message: '加载完成',
                                position: 'middle',
                                duration: 1500
                            });
                            this.tmpTasks = this.tmpTasks.concat(result.response.datas);
                            this.bottomAllLoaded = true;
                            this.pageItem[1] = {
                                page: result.response.page,
                                pageCount: result.response.pageCount,
                                count: result.response.count,
                                countNumber: result.response.countNumber
                            }
                        } else {
                            this.tmpTasks = result.response ? result.response.datas : [];
                            this.bottomAllLoaded = false;
                            if (result.response) {
                                this.pageItem[1] = {
                                    page: result.response.page,
                                    pageCount: result.response.pageCount,
                                    count: result.response.count,
                                    countNumber: result.response.countNumber
                                }
                            }
                        }
                    }

                } else {
                    this.tmpTasks = [];
                    this.bottomAllLoaded = true;
                }
            })
        },
        createZhibanTable() {
            this.$refs.dropdownWrapper.open = false;
            this.$nextTick(() => {
                this.$MKOPush('/createZhibanTable')
            })
        },
        createTmpZhibanTask() {
            this.$refs.dropdownWrapper.open = false;
            this.$nextTick(() => {
                this.$MKOPush('/createTmpZhibanTask')
            })
        },
        tab(label) {
            this.tabs.forEach((tab) => {
                if (tab.label === label) {
                    tab.activied = true;
                } else {
                    tab.activied = false;
                }
            })
            this.tabName = label;
            this.bottomAllLoaded = false;
        },
        viewTask(item) {
            if (this.bottomStatus == 'drop' || this.bottomStatus == 'loading') {
                return false;
            }
            this.$MKOPush(`/zhibanTable/${item.ruleId}`)
        },
        vieTmpTask(item) {
            if (this.bottomStatus == 'drop' || this.bottomStatus == 'loading') {
                return false;
            }
            this.$MKOPush({
                path: `/zhibantmpTable`,
                query: {
                    description: item.description ? item.description : ''
                }
            })
        },
        zhibanUserFilter(item) {
            if (item.collaboratorName) {
                return `${item.executorName},${item.collaboratorName}`
            } else {
                return item.executorName
            }
        },
        handleScroll() {
            this.$nextTick(() => {
                let totalHeight = document.getElementById('pageWrapper').offsetHeight;
                let scrollTop = document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
                let clientHeight = 0;
                if (document.body.clientHeight && document.documentElement.clientHeight) {
                    clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
                } else {
                    clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
                }
                let scrollBottom = totalHeight - scrollTop - clientHeight;
                if (scrollTop === 0) {
                    //刷新
                }
                this.bottomAllLoaded = scrollBottom <= 0 ? false : true;
            })
        },
        // 分页
        loadBottom() {
            let pageItem = this.tabName === '临时值班' ? this.pageItem[1] : this.pageItem[0]
            setTimeout(() => {
                if (pageItem.page == pageItem.pageCount) {
                    Toast({
                        message: '暂无更多数据',
                        position: 'middle',
                        duration: 1500
                    });
                    this.bottomAllLoaded = true;
                    this.$refs.loadmore.onBottomLoaded();
                    return false;
                }
                pageItem.page = pageItem.page + 1;
                if (this.tabName === '临时值班') {
                    this.getZhiBanTmpTasksList(pageItem.page, 'loadmore')
                } else {
                    this.getZhiBanTasksList(pageItem.page, 'loadmore')
                }
            }, 1500);
        },
        handleBottomChange(status) {
            this.bottomStatus = status;
        }
    },
    components: {
        NoData
    }
}
</script>

<style lang="less" scoped>
@import "../../../config.less";
.zhiban {
    .tasks-table-view {
        width: 100%;
        .tasks-table-cell {
            width: 100%;
            .tasks-type {
                font-size: 12px;
                color: #666666;
                letter-spacing: 0;
                line-height: 12px;
                width: 100%;
                padding: 14px 0 8px 14px;
            }
        }
    }
}
</style>

