<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="设施设备详情" left-icon="icon-back" @handleLeftClick="back" right-icon-text="保存" @handleRightClick="submit"></mko-header>
        <div class="page-wrap">
            <div class="device-info-wrap">
                <div class="device-field">
                    <span class="label">设备编号</span>
                    <input type="text" placeholder="请输入设备编号" v-model="dwFacilitieItem.id" @change="onInputData" />
                </div>
                <div class="device-field">
                    <span class="label">品牌</span>
                    <input type="text" placeholder="请输入品牌" v-model="dwFacilitieItem.brand" @change="onInputData" />
                </div>
                <div class="device-field">
                    <span class="label">型号</span>
                    <input type="text" placeholder="请输入型号" v-model="dwFacilitieItem.model" @change="onInputData" />
                </div>
                <div class="device-field" @click="$refs.dateWrapper.open();">
                    <span class="label">安装时间</span>
                    <span class="value">{{ installDate || '请选择安装时间' }}</span>
                </div>
                <div class="device-field" @click="popupShow = true;">
                    <span class="label">安装位置</span>
                    <input type="text" placeholder="请选择安装位置" :value="dwFacilitieItem.jzName + '-' + dwFacilitieItem.jzLevel + '楼'" />
                </div>
                <div class="device-field">
                    <span class="label">具体位置</span>
                    <input type="text" placeholder="请输入具体位置" v-model="dwFacilitieItem.jzPosition" @change="onInputData" />
                </div>
                <div class="edit-status" v-if="!isNormal && $route.query.hasHistory != false">
                    <div class="device-seleced" @click="sheetShow = true">
                        <mt-cell class="seleced-mt-cell" title="设备状态" :value="sbStatus_FR" is-link></mt-cell>
                    </div>
                    <div class="device-field device-fixDescription" v-if="changStatus">
                        <span class="label">设备描述</span>
                        <textarea type="text" placeholder="请输入设备描述" v-model="fixDescription"></textarea>
                    </div>
                </div>
                <mt-datetime-picker ref="dateWrapper" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" v-model="myDate" @confirm="handleConfirm"></mt-datetime-picker>
            </div>
        </div>
        <div class="popup-wrap">
            <mt-popup v-model="popupShow" position="right">
                <div class="body-wrap">
                    <div class="radio-wrap">
                        <p class="title">建筑单位</p>
                        <div @click="chooseJzInfo(item)" v-for="item in options.jzInfos">
                            <mt-button class="radio jzyh-radio" :class="{'checked' : dwFacilitieItem.jzID == item.jzID}" size="large">
                                <span class="sign" v-show="dwFacilitieItem.jzID == item.jzID"></span>{{item.jzName}}
                            </mt-button>
                        </div>
                    </div>
                    <div class="radio-wrap floor-radio-wrap" v-if="isSelectedJZ">
                        <p class="title">楼层</p>
                        <div @click="chooseJzLevel(item)" v-for="item in options.jzLevels" class="button-wrap">
                            <mt-button class="radio" :class="{'checked' : dwFacilitieItem.jzLevel == item.value}">
                                <span class="sign" v-show="dwFacilitieItem.jzLevel == item.value"></span>{{item.label}}
                            </mt-button>
                        </div>
                    </div>
                </div>
                <div class="footer-wrap">
                    <mt-button class="reset" @click="resetData"> 重置 </mt-button>
                    <mt-button class="confirm" @click="confirmData">确定</mt-button>
                </div>
            </mt-popup>
        </div>
        <mt-actionsheet :actions="actions" v-model="sheetShow"></mt-actionsheet>
    </div>
</template>

<script>
    import api from 'api'
    import moment from 'moment'
    import { Toast } from 'mint-ui'
    import { formatDate } from 'filters'
    const status = ['未知', '正常', '故障', '维修中', '停用']
    var _id = null;
    var jzInfo = {};

    export default {
        data() {
            return {
                popupShow: false,
                isSelectedJZ: true,
                dwFacilitieItem: {},
                myDate: '',
                options: {
                    jzInfos: [],
                    jzLevels: 0
                },
                sheetShow: false,
                actions: [],
                bInputData: false,
                fixDescription: '',
                changStatus: false,
                isNormal: false
            }
        },
        computed: {
            sbStatus_FR() {
                return status[this.dwFacilitieItem.status]
            },
            installDate() {
                if (moment(this.dwFacilitieItem.installDate).format("YYYY-MM-DD") == 'Invalid date') {
                    return '';
                } else {
                    return moment(this.dwFacilitieItem.installDate).format("YYYY-MM-DD");
                }
            }
        },
        watch: {
            sheetShow: function () {
                if (this.sheetShow) {
                    let self = this;
                    window.mkoBackButton = {};
                    window.mkoBackButton.bInputData = true;
                    window.mkoBackButton.callback = function () {
                        self.sheetShow = false;
                        window.mkoBackButton.bInputData = false;
                    }
                } else {
                    window.mkoBackButton.bInputData = false;
                }
            }
        },
        activated() {
            sessionStorage.setItem('deviceItem', JSON.stringify(this.$route.query.dwFacilitieItem));
            this.actions = [{
                name: '正常',
                method: this.zhengchang
            }, {
                name: '故障',
                method: this.guzhang
            }, {
                name: '停用',
                method: this.tingyong
            }, {
                name: '维修中',
                method: this.weixiuzhong
            }];
            this.dwFacilitieItem = this.$route.query.dwFacilitieItem;
            this.isNormal = this.$route.query.dwFacilitieItem.status == 1 ? true : false;
            this.jzList();
        },
        methods: {
            jzList() {
                api.getJZList({
                    m: 'list',
                    groupId: this.$store.getters.groupId
                }).then(result => {
                    if (!result) return false;
                    if (result.code === 0) {
                        this.options.jzInfos = result.response;
                        for (let i = 0; i < result.response.length; i++) {
                            if (result.response[i].jzID == this.dwFacilitieItem.jzID) {
                                jzInfo = result.response[i]
                                this.chooseJzInfo(jzInfo);
                            }
                        }

                    }
                });
            },
            back() {
                if (this.bInputData) {
                    this.$MKODialog({title: '提示', msg: '返回上一级将不会保存当前操作，确认要返回吗？', cancelBtn: true}).then(action => {
                        if (action == 'confirm') {
                            this.resetData()
                            this.$MKOPop()
                        } else {

                        }
                    });
                } else {
                    this.$MKOPop()
                }
            },
            submit() {
                let params = {
                    id: this.dwFacilitieItem.id,
                    groupId: this.$store.getters.groupId,
                    SSSBCode: this.dwFacilitieItem.SSSBCode,
                    brand: this.dwFacilitieItem.brand,
                    model: this.dwFacilitieItem.model,
                    SSSB_SystemID: this.dwFacilitieItem.SSSB_SystemID,
                    SSSB_UnitID: this.dwFacilitieItem.SSSB_UnitID,
                    jzID: this.dwFacilitieItem.jzID,
                    jzLevel: this.dwFacilitieItem.jzLevel,
                    jzPosition: this.dwFacilitieItem.jzPosition,
                    installDate: this.installDate,
                    status: this.dwFacilitieItem.status,
                    unitName: this.dwFacilitieItem.unitName,
                    systemName: this.dwFacilitieItem.systemName,
                    jzName: this.dwFacilitieItem.jzName
                }

                api.updateDwFacilitie(params).then(result => {
                    if (!result) return false;
                    if (result.code === 0) {
                        if ((this.dwFacilitieItem.status != 4 || this.dwFacilitieItem.status != 1) && this.$route.query.hasHistory != false) {
                            this.updateDeviceStatusFn();
                        }
                        Toast({
                            message: '编辑成功',
                            position: 'middle',
                            duration: 1500
                        });
                        setTimeout(() => {
                            this.resetData()
                            this.back();
                        }, 1500);
                    } else {
                        Toast({
                            message: '编辑失败',
                            position: 'middle',
                            duration: 1500
                        });
                    }
                })
            },
            resetData() {
                this.bInputData = false;
                window.mkoBackButton.bInputData = false;
                let item = JSON.parse(sessionStorage.getItem('deviceItem'));
                this.dwFacilitieItem = item;
                this.popupShow = false;
                this.fixDescription = '';
                this.changStatus = false;
            },
            handleConfirm() {
                this.dwFacilitieItem.installDate = moment(this.myDate).format("YYYY-MM-DD 00:00")
            },
            chooseJzInfo(item) {
                let jzDSNumber = item.jzDSNumber >= 100 ? 100 : item.jzDSNumber;
                let jzDXNumber = item.jzDXNumber;
                let arr1 = [];
                let arr2 = [];
                for (let i = 1; i <= jzDSNumber; i++) {
                    arr1.push({
                        label: `${i}楼`,
                        value: i
                    });
                }
                for (let i = 1; i <= jzDXNumber; i++) {
                    arr2.push({
                        label: `负${i}楼`,
                        value: -i
                    });
                }
                this.dwFacilitieItem.jzID = item.jzID;
                this.options.jzLevels = arr2.concat(arr1);
                this.isSelectedJZ = true;
            },
            chooseJzLevel(item) {
                this.dwFacilitieItem.jzLevel = item.value
            },
            // const status = ['未知', '正常', '故障', '维修中', '停用']
            zhengchang() {
                this.onInputData();
                this.changStatus = true;
                this.dwFacilitieItem.status = 1;
            },
            guzhang() {
                this.onInputData();
                this.changStatus = true;
                this.dwFacilitieItem.status = 2;
            },
            tingyong() {
                this.onInputData();
                this.changStatus = true;
                this.dwFacilitieItem.status = 4;
            },
            weixiuzhong() {
                this.onInputData();
                this.changStatus = true;
                this.dwFacilitieItem.status = 3;
            },
            onInputData() {
                let self = this;
                this.bInputData = true;
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                window.mkoBackButton.callback = function () {
                    if (self.sheetShow) {
                        self.sheetShow = false;
                    }
                    self.$MKODialog({title: '提示', msg: '返回上一级将不会保存当前操作，确认要返回吗？', cancelBtn: true}).then(action => {
                        if (action == 'confirm') {
                            window.mkoBackButton.bInputData = false;
                            self.$MKOPop()
                        }
                    });
                }
            },
            confirmData() {
                this.popupShow = false;
                this.onInputData();
            },
            updateDeviceStatusFn() {
                api.updateDeviceStatusFn({
                    SSSBStatus: this.dwFacilitieItem.status,
                    fixDescription: this.fixDescription,
                    id: this.dwFacilitieItem.id,
                    positionId: this.$route.query.hasHistory.positionId
                }).then(result => {
                    if (!result) return false;
                    if (result.code == 0) {

                    } else {

                    }
                })
            }

        }
    }
</script>

<style lang="less" scoped>
    @import "../../../config.less";

    .device-info-wrap {
        width: 100%;
        margin-bottom: 15px;
        .edit-status {
            margin: 10px 0 0 0;
        }
    }

    .popup-wrap {
        position: relative;
        .mint-popup-right {
            width: 284px;
            height: 100%;
        }
        .body-wrap {
            overflow: scroll;
            padding: 34px 7px 100px;
            height: 100%;
            bottom: 100px;
            &:after {
                display: table;
                content: "";
            }
            .radio-wrap {
                margin-bottom: 10px;
                font-size: 12px;
                .radio {
                    padding: 0 4px;
                    margin-bottom: 6px; // height: 30px;
                    border-radius: @radiusS;
                    background: #f0f2f5;
                    color: @textBase;
                    &.checked {
                        background: #fff;
                        border: 1px solid @textBlue;
                        color: @textBlue;
                    }
                    .mint-button-text {
                        font-size: 12px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        .sign {
                            display: inline-block;
                            position: relative;
                            top: 1px;
                            padding: 9px 12px 0 0;
                            background: url(/static/icons/resource.png) -44px -61px no-repeat;
                            background-size: 356px auto;
                            &.has-gutter {
                                right: 5px;
                            }
                        }
                    }
                }
                .title {
                    margin: 0 0 10px;
                }
                &.floor-radio-wrap {
                    .radio {
                        min-width: 50px; // height: 30px;
                        margin-right: 4px;
                        font-size: 13px;
                    }
                }
                & + .radio-wrap {
                    margin-top: 20px;
                    padding-top: 20px;
                    .border-top(#D8D8D8);
                }
            }
        }
        .footer-wrap {
            position: absolute;
            bottom: 0;
            width: 100%;
            .mint-button {
                float: left;
                width: 50%;
                height: 39px;
                border-radius: 0;
                opacity: 0.73;
                &.reset {
                    border: 1px solid #EDEEF1;
                    background: #fff;
                    color: @textBlue;
                }
                &.confirm {
                    background: #0398FF;
                    color: #fff;
                }
            }
        }
    }

    .button-wrap {
        width: 25%;
        display: inline-block;
    }

    .jzyh-radio {
        font-size: 12px;
    }

    .device-field {
        width: 100%;
        height: 44px;
        background-color: #ffffff;
        position: relative;
        padding-left: 115px;
        border-bottom: 1px solid #d9d9d9;
        &.device-fixDescription {
            height: 100px;
            textarea {
                width: 100%;
                float: right;
                height: 90px;
                font-size: 14px;
                line-height: 44px;
                text-align: right;
                padding-right: 10px;
                color: #757575;
                border-style: none;
            }
        }
        .label {
            font-size: 14px;
            line-height: 44px;
            position: absolute;
            width: 105px;
            padding: 0 0 0 10px;
            left: 0;
        }
        input {
            border-style: none;
            width: 100%;
            float: right;
            height: 38px;
            font-size: 14px;
            line-height: 40px;
            text-align: right;
            padding-right: 10px;
            color: #757575;
            background: none;
        }
        .value {
            width: 100%;
            float: right;
            height: 44px;
            font-size: 14px;
            line-height: 44px;
            text-align: right;
            padding-right: 10px;
            color: #757575;
        }
    }

    .device-seleced {
        height: 44px;
    }
</style>
