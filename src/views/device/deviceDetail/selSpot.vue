<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="title" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="sel-spot-wrap">
            <mko-cell :title="jz.jzName" main="left" @click="selJz(jz)" v-for="jz in options_build">
                <div class="active" slot="icon" v-show="formData.jz.jzID==jz.jzID"></div>
            </mko-cell>
            <mko-popup-right v-model="show[0]" inset no-btn>
                <mko-cell :title="l.label" main="left" @click="selLevel(l)" v-for="l in options_level">
                    <div class="active" slot="icon" v-show="formData.jzLevel.value==l.value"></div>
                </mko-cell>
            </mko-popup-right>
            <mko-popup-right v-model="show[1]" width="78.6%" inset no-btn>
                <div class="no-data-hint abs-all-middle" v-if="options_spot.length==0">
                    <div class="no-data-sign"></div>
                    当前没有安装点
                </div>
                <mko-cell :title="s.jzPosition" main="left" @click="selSpot(s)" v-for="s in options_spot">
                    <!--<mko-check-box slot="icon" :active="selSpotFr(s.positionId)"></mko-check-box>-->
                </mko-cell>
            </mko-popup-right>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import { Indicator } from 'mint-ui'

    export default {
        props: ['selected-form'],
        data () {
            return {
                show: [false, false],
                test: false,
                options_build: [],
                options_level: [],
                options_spot: [],
                formData: {
                    jz: {},
                    jzLevel: {},
                    spot: {}
                },
                title: '建筑',
            }
        },
        watch: {
            show(arr){
                if (arr[1]) {
                    this.title = '安装点';
                } else if (arr[0]) {
                    this.title = '楼层';
                } else {
                    this.title = '建筑';
                }
            }
        },
        computed: {},
        mounted() {
            this.getJzList();
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
            selSpotFr(id){
                for (let item of this.formData.spot) {
                    if (item.positionId == id)
                        return true;
                }
                return false;
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
                this.formData.jz = item;
                this.formData.jzLevel = {};
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
                        label: `${i}楼`,
                        value: i
                    });
                }
                for (let i = _dx; i >= 1; i--) {
                    arr2.push({
                        label: `负${i}楼`,
                        value: -i
                    });
                }
                this.options_level = arr2.concat(arr1);
            },
            selLevel(item){
                this.formData.jzLevel = item;
                this.formData.spot = {};
                this.getJzPosition();
//                this.matchSelected();
                this.show[1] = true;
            },
            matchSelected(){
                let s = this.selectedForm;
                let f = this.formData;
                for (let item of s) {
                    if (item.jz.jzID == f.jz.jzID && item.jzLevel.value == f.jzLevel.value) {
                        f.spot = JSON.parse(JSON.stringify(item.spot));
                    }
                }
            },
            getJzPosition(){
                Indicator.open({spinnerType: 'fading-circle'});
                let pas = {
                    groupId: this.$store.getters.groupId,
                    jzLevel: this.formData.jzLevel.value,
                    jzID: this.formData.jz.jzID
                };
                api.getJzPosition(pas).then(res => {
                    if (res && res.code == 0) {
                        this.options_spot = res.response;
                    }
                    Indicator.close();
                });
            },
            selSpot(item){
                this.formData.spot = item;
                this.confirm();
            },
            confirm(){
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
    @import "../../../config.less";

    .device-info-wrap .sel-spot-wrap {
        position: fixed;
        top: @headerHeight+@headerTop;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        z-index: 1;
        .mko-basic-cell {
            padding-left: 12px;
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
                    margin-right: 10px;
                }
            }
        }
    }


</style>
