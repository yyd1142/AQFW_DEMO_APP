<template>
    <div class="device-list-by-spot">
        <!--<mt-loadmore ref="loadmore" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"-->
        <!--:bottom-all-loaded="bottomAllLoaded" :auto-fill="autoFill">-->
        <!--安装点-->
        <div v-for="item in list">
            <div v-for="(data,li) in item.jzLevel">
                <div class="build-info">{{item.jzName}}，{{data.jzLevel}}层</div>
                <mko-cell :title="p.jzPosition" is-link @click="goInfo(item,li,pi)" v-for="(p,pi) in data.pos">
                    <span class="text-danger" v-if="p.malfunctionCount">{{p.malfunctionCount}}个故障</span>
                </mko-cell>
            </div>
        </div>
        <!--</mt-loadmore>-->
        <no-data v-if="noData"></no-data>
    </div>
</template>

<script>
    import api from 'api'
    import { NoData } from 'components'
    import { Toast, Indicator } from 'mint-ui'
    import { levelFr } from 'filters'
    let _page = 1;
    let _pageCount = 1;
    let _count = 15;
    let _scoTop = 0;
    let _list = [];
    export default {
        props: ['value', 'cur', 'search'],
        data () {
            return {
                enter: true,
                list: [],
                noData: false,
                //load-more
                autoFill: false,
                bottomAllLoaded: false,
                topStatus: '',
                bottomStatus: '',
                wrapperHeight: 0,
            }
        },
        watch: {
            value(val) {
                this.enter = val;
            },
            enter(val) {
                this.$emit('input', val)
            },
            search(val){
                this.getListData(val)
            }
        },
        computed: {},
        mounted() {
        },
        activated(){
            window.addEventListener('scroll', this.handleScroll);
            if (this.enter) {
                scrollTo(0, 0);
//                this.bottomAllLoaded = false;
//                _page = 1;
//                _pageCount = 0;
                this.getListData();
            } else if (this.cur == 0) {
                if (JSON.parse(sessionStorage.getItem('spotInfoIsUpdate')))
                    this.getListData();
                scrollTo(0, _scoTop);
            }
        },
        deactivated() {
            window.removeEventListener('scroll', this.handleScroll)
        },
        destroyed(){
        },
        methods: {
            levelFr,
            matchData(list){
                let _l = [];
                let jz_fn = function () {
                    list.forEach(item => {
                        for (let i in _l) {
                            if (_l[i].jzID == item.jzID) {
                                level_fn(item);
                                return;
                            }
                        }
                        _l.push({
                            jzID: item.jzID,
                            jzName: item.jzName,
                            jzLevel: [],
                        });
                        level_fn(item);
                    });
                };

                let level_fn = function (data) {
                    _l.forEach(item => {
                        if (data.jzID == item.jzID) {
                            for (let l of item.jzLevel) {
                                if (l.jzLevel == data.jzLevel) {
                                    l.pos.push(data);
                                    item.jzLevel.sort(sort_fn);
                                    return;
                                }
                            }
                            item.jzLevel.push({
                                jzLevel: data.jzLevel,
                                pos: [data],
                            });
                            item.jzLevel.sort(sort_fn);
                        }
                    });
                };
                let sort_fn = function (a, b) {
                    return a.jzLevel - b.jzLevel;
                };
                jz_fn();
                this.list = _l;
            },
            getListData(search) {
                Indicator.open({spinnerType: 'fading-circle'});
                let params = {
                    m: 'positionListByApp',
//                    page: 1,
//                    count: _count,
                    param: search,
                    noPaging: true,
                    groupId: this.$store.getters.groupId
                };
                api.dwFacilities(params).then(result => {
                    Indicator.close();
                    if (result.code == 0) {
                        if (result.response.datas === undefined || result.response.datas.length <= 0) {
                            this.list = _list = [];
                            this.noData = true;
                            return false;
                        }
                        if (result.response.datas.length > 0) {
                            _list = result.response.datas;
                            this.matchData(JSON.parse(JSON.stringify(_list)));
                            this.noData = false;
                        } else {
                            this.list = _list = [];
                            this.noData = true;
                        }
//                        _page = JSON.parse(result.response.page);
//                        _pageCount = JSON.parse(result.response.pageCount);
                        sessionStorage.setItem(`spotInfoIsUpdate`, false);
                        this.enter = false;
                    }
                })
            },
            loadBottom() {
                if (_page >= _pageCount) {
                    Toast({
                        message: '暂无更多数据',
                        position: 'middle',
                        duration: 1500
                    });
                    this.bottomAllLoaded = true;
                    this.$refs.loadmore.onBottomLoaded();
                    return false;
                }
                _page = _page + 1;

                let params = {
                    m: 'list',
                    page: _page,
                    count: _count,
                    groupId: this.$store.getters.groupId,
//                    jzID: this.formData[_ti].jzID,
//                    jzLevel: this.formData[_ti].jzLevel,
//                    systemID: this.formData[_ti].systemID,
//                    status: this.formData[_ti].status
                };

                api.dwFacilities(params).then(result => {
                    this.bottomAllLoaded = true;
                    this.$refs.loadmore.onBottomLoaded();
//                    this.popupShow = false;

                    if (result.code == 0) {
                        if (result.response.datas === undefined || result.response.datas.length <= 0) {
                            Toast({
                                message: '暂无更多数据',
                                position: 'middle',
                                duration: 1500
                            });
                            this.bottomAllLoaded = true;
                            return false;
                        }
                        if (result.response.datas.length > 0) {
                            _list = _list.concat(result.response.datas);
                            this.matchData(JSON.parse(JSON.stringify(_list)));
                        }
                        _page = JSON.parse(result.response.page);
                        _pageCount = JSON.parse(result.response.pageCount);
                    }
                })
            },
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            handleScroll() {
                this.$nextTick(() => {
                    _scoTop = document.documentElement.scrollTop || document.body.scrollTop;
//                    let totalHeight = document.getElementById('pageWrapper').offsetHeight;
//                    let scrollTop = document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
//                    let clientHeight = 0;
//                    if (document.body.clientHeight && document.documentElement.clientHeight) {
//                        clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
//                    } else {
//                        clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
//                    }
//                    let scrollBottom = totalHeight - scrollTop - clientHeight;
//                    this.bottomAllLoaded = scrollBottom <= 0 ? false : true;
                })
            },
            goInfo(item, l_i, p_i){
                let pos = item.jzLevel[l_i].pos[p_i];
                let path = `/spot_info/${pos.id}`;
                let data = {
                    isC: pos.isCheckPoint,
                    pos: pos.jzPosition,
                    jzId: item.jzID,
                    jzName: item.jzName,
                    level: item.jzLevel[l_i].jzLevel
                };
                sessionStorage.setItem(`spotInfo${pos.id}`, JSON.stringify(data));
                this.$MKOPush(path)
            },
        },
        components: {
            NoData
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .device-list-by-spot {

    }
</style>
