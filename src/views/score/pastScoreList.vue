<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="往期得分" left-icon="icon-back" right-icon-text="刷新" @handleLeftClick="back" @handleRightClick="loadTop"></mko-header>
        <no-data v-if="noData"></no-data>
        <div class="page-wrap past-score-wrap" v-if="!noData" id="pageWrapper">
            <mt-loadmore ref="loadmore" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="bottomAllLoaded" :auto-fill="autoFill">
                <mko-cell :title="`${dateFr(item.createDate)}安全评分`" :val="item.totalScore"
                          main="left" is-link @click="linkPath(item)" v-for="item in allScore" ></mko-cell>
            </mt-loadmore>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import { Indicator, Toast } from 'mint-ui'
    import { NoData } from 'components'
    import moment from 'moment'
    var count = 10;
    export default {
        data() {
            return {
                noData: false,
                allScore: [],
                pageItem: {},
                autoFill: false,
                bottomStatus: '',
                bottomAllLoaded: false
            }
        },
        activated() {
            window.addEventListener('scroll', this.handleScroll);
            this.$nextTick(() => {
                this.getHistoryScoreList();
            });
        },
        deactivated() {
            window.removeEventListener('scroll', this.handleScroll)
        },
        methods: {
            getHistoryScoreList() {
                this.noData = false;
                let params = {
                    m: 'historyList',
                    groupId: this.$store.getters.groupId,
                    count: count,
                    page: 1,
                    type: 1
                }
                api.getHistoryScoreList(params).then(result => {
                    this.$refs.loadmore.onTopLoaded();
                    Indicator.close()
                    if (result.code == 0) {
                        if (result.response.datas.length <= 0) {
                            this.noData = true;
                            return false;
                        }
                        this.allScore = result.response.datas;
                        this.pageItem = {page: result.response.page, pageCount: result.response.pageCount}
                        this.noData = false
                    }
                })
            },
            dateFr(str) {
                return moment(str).format("YYYY年MM月DD日");
            },
            back() {
                this.$MKOPop()
            },
            linkPath(item) {
                if (this.topStatus == 'drop' || this.topStatus == 'loading' || this.bottomStatus == 'drop' || this.bottomStatus == 'loading') {
                    return false;
                }
                let date = item.createDate.split('-');
                this.$MKOPush({
                    path: '/past_score_detail',
                    query: {
                        title: `${moment(item.createDate).format("YYYY年MM月DD日")}安全评分`,
                        id: item.id
                    }
                })
            },
            //刷新
            loadTop() {
                Indicator.open({spinnerType: 'fading-circle'});
                setTimeout(() => {
                    this.bottomAllLoaded = false
                    this.getHistoryScoreList()
                    Toast({
                        message: '刷新完成',
                        position: 'middle',
                        duration: 1500
                    });
                }, 1500)
            },
            // 分页
            loadBottom() {
                setTimeout(() => {
                    if (this.pageItem.page == this.pageItem.pageCount) {
                        Toast({
                            message: '暂无更多数据',
                            position: 'middle',
                            duration: 1500
                        });
                        this.bottomAllLoaded = true;
                        this.$refs.loadmore.onBottomLoaded();
                        return false;
                    }
                    this.pageItem.page = this.pageItem.page + 1;
                    api.getHistoryScoreList({
                        m: 'historyList',
                        groupId: this.$store.getters.groupId,
                        count: count,
                        page: this.pageItem.page,
                        type: 1
                    }).then(result => {
                        this.bottomAllLoaded = true
                        this.$refs.loadmore.onBottomLoaded();
                        if (result.code === 0) {
                            if (result.response.datas === undefined || result.response.datas.length == 0) {
                                Toast({
                                    message: '暂无更多数据',
                                    position: 'middle',
                                    duration: 1500
                                });
                            } else {
                                Toast({
                                    message: '加载完成',
                                    position: 'middle',
                                    duration: 1500
                                });
                                this.allScore = this.allScore.concat(result.response.datas);
                                this.pageItem = {page: result.response.page, pageCount: result.response.pageCount}
                            }
                        }
                    })
                }, 1500);
            },
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            handleScroll() {
                this.$nextTick(() => {
                    let totalHeight = document.getElementById('pageWrapper').offsetHeight + 40;
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
            }
        },
        components: {
            NoData
        }
    }
</script>

<style lang="less" scoped>
    .past-score-wrap {
        padding: 0;
    }
</style>
