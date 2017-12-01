<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="title" left-icon="icon-back" @handleLeftClick="back" :right-icon-text="(show[1]&&formData.spot.length!=0)?'确定':''" @handleRightClick="confirm"></mko-header>
        <div class="sel-spot-wrap">
            <mko-cell :title="jz.jzName" main="left" @click="selJz(jz)" v-for="jz in options_build">
                <div class="active" slot="icon" v-show="formData.jzId==jz.jzID"></div>
            </mko-cell>
            <mko-popup-right v-model="show" inset no-btn>
                <mko-cell :title="l.label" main="left" @click="selLevel(l)" v-for="l in options_level">
                    <div class="active" slot="icon" v-show="formData.jzLevel==l.value"></div>
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
                show: false,
                test: false,
                options_build: [],
                options_level: [],
                formData: {
                    jzName: '',
                    jzId: '',
                    jzLevel: ''
                },
                title: '建筑',
            }
        },
        watch: {
            show(bool){
                this.title = bool ? '楼层' : '建筑';
            }
        },
        computed: {},
        mounted() {
            this.getJzList();
            this.setBackButton();
//            this.matchSelected();
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
            matchSelected(){
                let s = this.selectedForm;
                let f = this.formData;
                f.jzName = s.jzName;
                f.jzId = s.jzId;
                f.jzLevel = s.level;
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
                this.formData.jzName = item.jzName;
                this.formData.jzId = item.jzID;
                this.formData.jzLevel = '';
                this.getLevelList(item);
                this.show = true;
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
                this.formData.jzLevel = item.value;
                this.show = false;
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

    .spot-info-wrap {
        .sel-spot-wrap {
            position: fixed;
            top: @headerHeight+@headerTop;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #fff;
            .mko-basic-cell {
                padding-left: 12px;
                &:last-child .cell {
                    box-shadow: 0 1px 0 0 @baseBorder;
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
                        margin-right: 10px;
                    }
                }
            }
        }
    }


</style>
