<template>
    <div class="device-list-by-dvc">
        <div v-for="item in list">
            <div v-for="(data,li) in item.jzLevel">
                <div class="build-info">{{item.jzName}}，{{data.jzLevel}}层</div>
                <mko-double-cell :icon="deviceStatusIcon[d.SSSBStatus]"
                                 :title="`${d.unitName}${d.SSSBCode||''}`"
                                 :label="createDateFr(d.createDate)"
                                 :val="nameFr(d.executorName)"
                                 is-link @click="goInfo(d.deviceId)" v-for="d in data.dvc">
                    <span class="text-danger" v-if="d.deviceCount">{{d.deviceCount}}个故障</span>
                </mko-double-cell>
            </div>
        </div>
        <no-data v-if="noData"></no-data>
    </div>
</template>

<script>
    import api from 'api'
    import conf from 'config'
    import { NoData } from 'components'
    import { Toast, Indicator } from 'mint-ui'
    import { formatDate, levelFr } from 'filters'
    let _scoTop = 0;
    let _list = [];
    let t_year = '';
    let t_month = '';
    let t_date = '';
    export default {
        props: ['value', 'cur', 'search'],
        data () {
            return {
                enter: true,
                list: [],
                noData: false,
                deviceStatusIcon: conf.deviceStatusIcon
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

            let today = new Date();
            t_year = today.getFullYear();
            t_month = today.getMonth() + 1;
            t_date = today.getDate();

            if (this.enter) {
                scrollTo(0, 0);
                this.getListData();
            } else if (this.cur == 1) {
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
            formatDate,
            nameFr(names){
                if (names.indexOf('|') == -1) {
                    return names;
                } else {
                    return names.split('|')[1];
                }
            },
            createDateFr(val){
                let day = new Date(val);
                let year = day.getFullYear();
                let month = day.getMonth() + 1;
                let date = day.getDate();
                if (year == t_year && month == t_month && date == t_date) {
                    return `执行时间 ${formatDate(day, 'HH:mm')}`
                } else {
                    return formatDate(day, 'YYYY年MM月DD日')
                }
            },
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
                                    l.dvc.push(data);
                                    item.jzLevel.sort(sort_fn);
                                    return;
                                }
                            }
                            item.jzLevel.push({
                                jzLevel: data.jzLevel,
                                dvc: [data],
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
                    m: 'faultSSSB',
                    param: search,
                    groupId: this.$store.getters.groupId
                };

                api.dwFacilities(params).then(result => {
                    Indicator.close();
                    if (result.code == 0) {
                        if (result.response === undefined || result.response.length <= 0) {
                            this.list = _list = [];
                            this.noData = true;
                            return false;
                        }
                        if (result.response.length > 0) {
                            _list = result.response;
                            this.matchData(JSON.parse(JSON.stringify(_list)));
                            this.noData = false;
                        } else {
                            this.list = _list = [];
                            this.noData = true;
                        }
                        sessionStorage.setItem(`spotInfoIsUpdate`, false);
                        this.enter = false;
                    }
                })
            },
            handleScroll(){
                _scoTop = document.documentElement.scrollTop || document.body.scrollTop;
            },
            goInfo(id){
                this.$MKOPush('/device/' + id)
            },
        },
        components: {
            NoData
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

</style>
