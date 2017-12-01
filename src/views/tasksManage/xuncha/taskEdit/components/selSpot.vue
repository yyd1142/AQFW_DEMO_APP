<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="title" left-icon="icon-back" @handleLeftClick="back"
                    :right-icon-text="show[0]?'确定':''" @handleRightClick="confirm"></mko-header>
        <div class="sel-spot-wrap">
            <mko-cell :title="jz.jzName" main="left" @click="selJz(jz)" v-for="jz in options_build">
                <div class="active" slot="icon" v-show="show[0]&&activeData.jz.jzID==jz.jzID"></div>
            </mko-cell>
            <mko-popup-right v-model="show[0]" inset no-btn>
                <mko-cell :class="{'disabled':l.posCount==0}" main="left"
                          :title="`${l.label} (${l.posCount})`" @click="l.posCount==0?'':selLevel(l)" v-for="l in options_level">
                    <div class="active" slot="icon" v-show="show[1]&&activeData.jzLevel.value==l.value"></div>
                    <mko-check-box slot="icon" :active="selAllSpotFr(l)"
                                   @click="selAllPosition(l)" v-if="l.posCount"></mko-check-box>
                </mko-cell>
            </mko-popup-right>
            <mko-popup-right v-model="show[1]" width="78.6%" inset no-btn>
                <div class="no-data-hint abs-all-middle" v-if="options_spot.length==0">
                    <div class="no-data-sign"></div>
                    当前没有巡查点
                </div>
                <mko-cell :title="`${s.jzPosition} (${s.count})`" main="left" @click="selSpot(s)" v-for="s in options_spot">
                    <mko-check-box slot="icon" :active="selSpotFr(s)" @click="selSpot(s)"></mko-check-box>
                </mko-cell>
            </mko-popup-right>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import { levelFr } from 'filters'

    import { Indicator } from 'mint-ui'
    var Promise = require("bluebird");
    let initFormData = {};
    export default {
        props: ['selected-form'],
        data () {
            return {
                show: [false, false],
                test: false,
                options_build: [],
                options_level: [],
                options_spot: [],
                activeData: {
                    jz: {},
                    jzLevel: {},
//                    spot: []
                },
                formData: {
//                    jz: {},
//                    level: {},
//                    spot: []
                },
                title: '建筑',
                update: false,
            }
        },
        watch: {
            show(arr){
                if (arr[1]) {
                    this.title = '巡查点';
                } else if (arr[0]) {
                    this.title = '楼层';
                } else {
                    this.title = '建筑';
                }
            }
        },
        computed: {},
        mounted() {
            this.options_build = [];
            this.options_level = [];
            this.options_spot = [];
            this.formData = {};
            initFormData = {};
            this.getJzList();
            this.matchSelected();
            this.setBackButton();
        },
        activated(){

        },
        deactivated() {
        },
        destroyed(){
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
        },
        methods: {
            levelFr,
            selAllSpotFr(l){
                if (!this.formData[l.jzID + '/' + l.value] || !this.formData[l.jzID + '/' + l.value].spot)
                    return false;

                return this.formData[l.jzID + '/' + l.value].spot.length == l.posCount;
            },
            selSpotFr(item){
                let id = item.positionId;
                let _key = item.jzID + '/' + item.jzLevel;

                if (this.formData[_key] && (this.update || !this.update))
                    for (let s of this.formData[_key].spot) {
                        if (s.positionId == id)
                            return true;
                    }
                return false;
            },
            matchSelected(){
                let s = this.selectedForm;
                let f = this.formData;
                for (let item of s) {
                    let key = item.jzId + '/' + item.level;
                    f[key] = {
                        jz: {
                            jzID: item.jzId,
                            jzName: item.jzName
                        },
                        jzLevel: {
                            label: this.levelFr(item.level),
                            value: item.level,
                        },
                        spot: []
                    };
                    initFormData[key] = JSON.parse(JSON.stringify(f[key]));
                    item.pos.forEach(pos => {
                        if (pos.checkPointRuleId || pos.isInit) {
                            pos.isInit = true;
                            initFormData[key].spot.push(pos);
                        } else {
                            f[key].spot.push(pos);
                        }
                    })
                }
            },

            getJzList(){
                Indicator.open({spinnerType: 'fading-circle'});
                let pas = {
                    groupId: this.$store.getters.groupId,
                    fetchAll: true
                };
                api.searchBuild(pas).then(res => {
                    if (res && res.code == 0) {
                        this.options_build = res.response;
                        Indicator.close();
                    } else {
                        Indicator.close();
                    }
                })
            },
            selJz(item){
                this.activeData.jz = item;
                this.activeData.jzLevel = {};
                this.getLevelList(item);
                this.show[0] = true;
            },
            getLevelList(item){
                let _ds = item.jzDSNumber >= 100 ? 100 : item.jzDSNumber;
                let _dx = item.jzDXNumber;
                let arr1 = [];
                let arr2 = [];
                for (let i = 1; i <= _ds; i++) {
                    arr1.push({
                        jzID: item.jzID,
                        jzName: item.jzName,
                        label: `${i}楼`,
                        value: i,
                        posCount: 0
                    });
                }
                for (let i = _dx; i >= 1; i--) {
                    arr2.push({
                        jzID: item.jzID,
                        jzName: item.jzName,
                        label: `负${i}楼`,
                        value: -i,
                        posCount: 0
                    });
                }
                this.options_level = arr2.concat(arr1);
                this.getLevelPosData();
            },
            getLevelPosData(){
                Indicator.open({spinnerType: 'fading-circle'});
                let pas = {
                    m: 'positionCount',
                    type: this.$route.params.type == 'routine' ? 1 : 2, //1：不包含已分工的 2：包含已分工的
                    groupId: this.$store.getters.groupId,
                    jzID: this.activeData.jz.jzID
                };
                api.dwFacilities(pas).then(res => {
                    if (res && res.code == 0 && res.response) {
                        res.response.forEach(item => {
                            for (let l of this.options_level) {
                                if (l.value == item.jzLevel) {
                                    l.posCount = item.positionCount;
                                }
                            }
                        })
                    }
                    Indicator.close();
                });
            },
            selAllPosition(l){
                let _key = l.jzID + '/' + l.value;
                if (!this.formData[_key]) {
                    this.formData[_key] = {
                        jz: {
                            jzID: l.jzID,
                            jzName: l.jzName
                        },
                        jzLevel: {
                            label: l.label,
                            value: l.value,
                        },
                        spot: []
                    }
                }
                let f = this.formData[_key];
                let all = f.spot.length == l.posCount;
                if (all) {
                    delete this.formData[_key];
                    this.options_spot = [];
                } else {
                    this.getJzPosition(l, _key);
                }
            },
            selLevel(item){
                this.activeData.jzLevel = item;
                let _key = item.jzID + '/' + item.value;
                if (!this.formData[_key]) {
                    this.formData[_key] = {
                        jz: {
                            jzID: item.jzID,
                            jzName: item.jzName
                        },
                        jzLevel: {
                            label: this.levelFr(item.value),
                            value: item.value,
                        },
                        spot: []
                    }
                }
                this.getJzPosition(item);
                this.show[1] = true;
            },
            getJzPosition(level, _key){
                Indicator.open({spinnerType: 'fading-circle'});
                let pas = {
                    queryAll: this.$route.params.type == 'routine' ? 0 : 2,//1：不包含已分工的 2：包含已分工的
                    groupId: this.$store.getters.groupId,
                    jzLevel: level.value,
                    jzID: level.jzID
                };
                api.getJzPosition(pas).then(res => {
                    if (res && res.code == 0) {
                        this.options_spot = res.response;
                        if (_key) {
                            this.formData[_key].spot = res.response;
                        }
                    }
                    Indicator.close();
                });
            },
            selSpot(item){
                let _key = item.jzID + '/' + item.jzLevel;
                if (!this.formData[_key]) {
                    this.formData[_key] = {
                        jz: {
                            jzID: item.jzID,
                            jzName: item.jzName
                        },
                        jzLevel: {
                            label: this.levelFr(item.jzLevel),
                            value: item.jzLevel,
                        },
                        spot: []
                    }
                }
                this.update = !this.update;
                let s = this.formData[_key].spot;
                for (let i in s) {
                    if (s[i].positionId == item.positionId) {
                        this.formData[_key].spot.splice(i, 1);
                        return;
                    }
                }
                this.formData[_key].spot.push(item);
            },
            confirm(){
//                if (!this.show[1])
//                    return;
                for (let key in initFormData) {
                    if (this.formData[key]) {
                        let spot = JSON.parse(JSON.stringify(this.formData[key].spot));
                        let initSpot = initFormData[key].spot;
                        this.formData[key].spot = JSON.parse(JSON.stringify(initSpot.concat(spot)));
                    } else {
                        this.formData[key] = JSON.parse(JSON.stringify(initFormData[key]));
                    }
                }

                this.$emit('sel', this.formData);
                this.back();
            },
            setBackButton() {
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                if (window.mkoBackButton.bInputData) {
                    window.mkoBackButton.callback = this.back;
                }
            },
            back(){
                this.$MKOPop();
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../../../config.less";

    .xc-task-edit-wrap .sel-spot-wrap {
        position: fixed;
        top: @headerHeight+@headerTop;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        z-index: 1;
        .mko-basic-cell {
            padding-left: 12px;
            &:last-child .cell {
                box-shadow: 0 1px 0 0 @baseBorder;
            }
            &.disabled .cell .title {
                color: @baseText03;
            }
            .value {
                flex: 0 0 0;
                -webkit-flex: 0 0 0;
            }
            .title-icon {
                min-width: 0;
                margin: 0;
                > .active {
                    position: absolute;
                    width: 4px;
                    height: 44px;
                    top: 0;
                    left: -12px;
                    background-color: @mainBlue;
                }
                .mko-check-box {
                    width: 22px;
                    margin-right: 14px;
                }
            }
        }
    }


</style>
