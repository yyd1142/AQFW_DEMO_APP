<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="全部巡查点" left-icon="icon-back" @handleLeftClick="back" right-icon="icon-add" @handleRightClick="addXcSpot"></mko-header>
        <div class="page-wrap xc-spot-list-wrap">
            <div class="title-card">
                <div class="cell clear">
                    <div class="title fl">建筑总数</div>
                    <div class="value fl">{{list.length}}栋</div>
                </div>
                <div class="cell clear">
                    <div class="title fl">巡查点总数</div>
                    <div class="value fl">{{allPosCount}}个</div>
                </div>
            </div>
            <div v-for="(b,i) in list">
                <div class="build-info">
                    <div class="label fl">{{b.jzName}}</div>
                    <div class="value fr">共{{b.posCount}}个设备</div>
                </div>
                <div v-for="level in b.level">
                    <span></span>
                    <mko-menu-header :title="`${level.level}层`" :val="level.position.length" v-model="level.show"
                                     drop-up-sign="icon-link-arrow-down" drop-down-sign="icon-link-arrow-up"></mko-menu-header>
                    <div class="pos-wrap" v-show="level.show">
                        <mko-cell :title="pos.name" :val="`${pos.deviceCount}个设备`" main="left" is-link
                                  :icon="pos.needCheckDeviceCount?'icon-police-uncle':'icon-location-gray'"
                                  @click="goInfo(pos.positionId,pos.name,level.level,i)" v-for="pos in level.position"></mko-cell>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import api from 'api'
    import { Toast, Indicator } from 'mint-ui'
    import { levelFr } from 'filters'
    let _scoTop = 0;
    let _enter = true;
    export default {
        data () {
            return {
                list: [],
                allPosCount: 0
            }
        },
        watch: {},
        computed: {},
        mounted() {
        },
        activated(){
            window.addEventListener('scroll', this.handleScroll);
            this.setBackButton();
            if (_enter) {
                scrollTo(0, 0);
                this.getXcSpotList();
            } else {
                if (JSON.parse(sessionStorage.getItem('spotInfoIsUpdate')))
                    this.getXcSpotList();
                scrollTo(0, _scoTop);
            }
        },
        deactivated() {
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
            window.removeEventListener('scroll', this.handleScroll)
        },
        destroyed(){
        },
        methods: {
            levelFr,
            getXcSpotList(){
                Indicator.open({spinnerType: 'fading-circle'});

                api.getXunchaSpotList().then(res => {
                    if (res && res.code == 0) {
                        this.allPosCount = 0;
                        this.list = this.matchData(res.response);
                        Indicator.close();
                        sessionStorage.setItem(`spotInfoIsUpdate`, false);
                        _enter = false;
                    } else {
                        Indicator.close();
                    }
                })
            },
            matchData(res){
                let that = this;
                let list = [];

//                let buildMap = {};
//                for (let p of res){
//                  let key = `$`
//                }

                let jz_fn = function () {
                    res.forEach(data => {
                        for (let item of list) {
                            if (data.jzId == item.jzId) {
                                level_fn(data);
                                return;
                            }
                        }
                        list.push({
                            jzId: data.jzId,
                            jzName: data.jzName,
                            posCount: 0,
                            level: []
                        });
                        level_fn(data);
                    })
                };

                let level_fn = function (data) {
                    list.forEach(item => {
                        if (data.jzId == item.jzId) {
//                            for (let l of item.level) {
//                                if (l.level == data.level) {
//                                    l.position.cancat(data.positions);
//                                    that.allPosCount += data.positions.length;
//                                    item.posCount += data.positions.length;
//                                    item.level.sort(sort_fn);
//                                    return;
//                                }
//                            }
                            item.level.push({
                                show: false,
                                level: data.level,
                                position: data.positions,
                            });
                            that.allPosCount += data.positions.length;
                            item.posCount += data.positions.length;
                            item.level.sort(sort_fn);
                        }
                    });
                };
                let sort_fn = function (a, b) {
                    return a.level - b.level;
                };
                jz_fn();

                return list;
            },
            addXcSpot(){
                this.$MKOPush('/spot_add')
            },
            goInfo(id, pos, level, index){
                let path = `/spot_info/${id}`;
                let jz = this.list[index];
                let data = {
                    isC: 1,
                    pos: pos,
                    level: level,
                    jzName: jz.jzName,
                    jzId: jz.jzId
                };
                sessionStorage.setItem(`spotInfo${id}`, JSON.stringify(data));
                this.$MKOPush(path)
            },
            handleScroll() {
                _scoTop = document.documentElement.scrollTop || document.body.scrollTop;
            },
            setBackButton() {
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                if (window.mkoBackButton.bInputData) {
                    window.mkoBackButton.callback = this.back;
                }
            },
            back(){
                _enter = true;
                this.$MKOPop();
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .xc-spot-list-wrap {

        .title-card {
            margin: 14px;
            padding: 10px 14px;
            border-radius: 4px;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
            letter-spacing: 0;
            background-color: #FFFFFF;
            .cell {
                padding: 4px 0;
                line-height: 14px;
                .title {
                    width: 70px;
                    margin-right: 14px;
                    font-size: 14px;
                    color: @baseText03;
                }
                .value {
                    font-size: 14px;
                    color: @baseText02;
                }
            }
        }
        .build-info {
            height: 34px;
            padding: 14px 14px 8px;
            line-height: 12px;
            font-size: 12px;
            letter-spacing: 0;
            background-color: @baseBG01;
            .label {
                color: @baseText02;
            }
            .value {
                color: @baseText03;
            }
        }
        .pos-wrap {
            .mko-basic-cell {
                background-color: @baseBG02;
                .value {
                    padding-right: 22px;
                    color: @baseText02;
                }
            }
        }
        .mko-menu-header {
            .arrow {
                /*top: 15px;*/
            }
        }
    }
</style>
