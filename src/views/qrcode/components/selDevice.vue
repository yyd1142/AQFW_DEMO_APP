<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header background-color="#ffffff" title-color="#333333" border-color="#eee" :title="title" left-icon="icon-back-black" @handleLeftClick="back"></mko-header>
        <div class="sel-spot-wrap">
            <!--<mko-cell :title="type.name" @click="selType(type)" v-for="type in deviceTypes">-->
            <!--<div class="active" slot="icon" v-show="formData.dep == type.dep"></div>-->
            <!--</mko-cell>-->
            <div class="no-data-hint abs-all-middle" v-if="deviceDatas.length == 0">
                <div class="no-data-sign"></div>
                暂无设备
            </div>
            <mko-cell :title="`${item.unitName}`"  main="left" v-for="item in deviceDatas" @click="selDevice(item)">
                <!--<mko-check-box slot="icon" :active="formData.device.sssbId == item.sssbId ? true : false" @click="selDevice(item)"></mko-check-box>-->
            </mko-cell>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import {Indicator} from 'mint-ui'
    var Promise = require("bluebird");
    export default {
        props: ['selected-form', 'position-id'],
        data () {
            return {
                show: [true],
                test: false,
                deviceDatas: [],
                options_spot: [],
                formData: {
                    jz: {},
                    device: {}
                },
                title: '设备',
                noDevice: false
            }
        },
        computed: {},
        mounted() {
            this.setBackButton();
            this.getDeviceByDep();
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
            selType(item){
                this.formData.dep = item.dep;
                this.formData.device = {};
                this.getDeviceByDep(item.dep);
                this.show[0] = true;
            },
            getDeviceByDep(){
                Indicator.open({spinnerType: 'fading-circle'});
                let params = {
                    groupId: this.$store.getters.groupId,
                    isCheck: 1,
                    id: this.positionId,
                    dep: 1
                };
                api.getDvcPositionInfo(params).then(result => {
                    Indicator.close();
                    if (result && result.code == 0) {
                        if (result.response.length <= 0) {
                            this.noDevice = true;
                            this.deviceDatas = [];
                        } else {
                            this.noDevice = false;
                            this.deviceDatas = result.response;
                        }
                    }
                })
            },
            selDevice(item){
                this.formData.device = item;
                this.$emit('sel', this.formData);
                this.back();
            },
            confirm(){
                if (!this.show[0]) return;
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

    .bind-device, .sel-spot-wrap {
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
