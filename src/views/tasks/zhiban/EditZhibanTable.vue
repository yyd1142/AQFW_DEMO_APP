<template>
    <div class="EditZhibanTable">
        <div class="placeholder-item"></div>
        <mko-header title="编辑值班表" left-icon="icon-back" @handleLeftClick="back" right-icon="icon-delete"
                    @handleRightClick="remove"></mko-header>
        <div class="page-wrap">
            <div class="form-card">
                <mko-form-cell title="值班表名称" :edit="true" type="text" v-model="formData.description"
                               holder-text="请输入值班表名称"></mko-form-cell>
                <mko-textarea :val="formData.zbDescribe" v-model="formData.zbDescribe"
                              placeholder="这里是值班表描述"></mko-textarea>
            </div>
            <div class="form-card last-child">
                <mko-form-cell title="行业类型" :val="depFilter[formData.dep] || '选择'" v-model="depFilter[formData.dep]"
                               :edit="true" type="sel"
                               @click="popupPickerShow('dep')"></mko-form-cell>
                <mko-form-cell title="休息日" :val="formData.xiuxiri || '选择'" v-model="formData.xiuxiri" :edit="true"
                               type="sel" @click="popupPickerShow('offDuty')"></mko-form-cell>
                <mko-form-cell :edit="true" title="班次" type="sel">
                    <div class="add-banci" slot="button" @click="addBanci">
                        <span class="item">添加</span>
                        <i class="icon icon-plus-blue"></i>
                    </div>
                </mko-form-cell>
            </div>
            <mko-edit-card :title="'班次'+ (index + 1)" title-color="black-font" :edit="false" :remove="true"
                           @remove="removeZhibanCard(cell, index)" v-for="(cell, index) in formData.banciDatas">
                <mko-form-cell title="班次名称" :val="cell.bcName" v-model="cell.bcName" :edit="true" type="text"
                               holder-text="填写班次名称, 例 : 早班"></mko-form-cell>
                <mko-form-cell title="值班时间" :val="banciTimeFilter(cell.bcTime)" v-model="cell.bcTime" :edit="true"
                               type="sel" @click="popupPickerShow('zhibanTime', index)"></mko-form-cell>
                <mko-form-cell title="值班人" :val="cell.executorName || '选择'" v-model="cell.executorName" :edit="true"
                               type="sel" @click="popupPickerShow('zhibanName', index)"></mko-form-cell>
            </mko-edit-card>
            <div class="footer-wrap" @click.stop="save">
                <mko-button class="btn bottom-btn" size="large">保存</mko-button>
            </div>
        </div>
        <!--弹出框-->
        <mko-popup-bottom :title="popupName" v-model="selPopupShow" @save="selPickerVal" @cancel="selPopupClose">
            <mt-picker :slots="zhibanTimes" value-key="Name" @change="onZhibanTimeChange" :visible-item-count="5"
                       :show-toolbar="false" v-if="pickerWrapperName === 'zhibanTime'"></mt-picker>
            <mko-select-box :column="4" :options="weekList" :selected="offDutyDatas" @select="onOffDutyChange"
                            v-if="pickerWrapperName === 'offDuty'"></mko-select-box>
            <mko-select-box :column="4" :options="depOptions" name-key="name" value-key="value" :selected="depDatas" @select="onDepChange"
                            v-if="pickerWrapperName === 'dep'"></mko-select-box>
            <mko-select-box :column="4" :options="zhibanNames" :selected="zhibanNamesSelecteds"
                            @select="onZhibanNameChange" v-if="pickerWrapperName === 'zhibanName'"></mko-select-box>
        </mko-popup-bottom>
    </div>
</template>

<script>
    var hours = [];
    var minutes = [];
    var setHours = function () {
        for (let i = 0; i < 24; i++) {
            if (i < 10) {
                hours.push({
                    Name: `0${i}`,
                    Value: i
                });
            } else {
                hours.push({
                    Name: `${i.toString()}`,
                    Value: i
                });
            }
        }
    };
    var setMinutes = function () {
        for (let i = 0; i < 60; i++) {
            if (i < 10) {
                minutes.push({
                    Name: `0${i}`,
                    Value: i
                });
            } else {
                minutes.push({
                    Name: `${i.toString()}`,
                    Value: i
                });
            }
        }
    };
    import api from "api";
    import {Toast, Indicator} from "mint-ui";
    var formData = null;
    export default {
        data() {
            return {
                isValidate: false,
                selPopupShow: false,
                pickerShow: false,
                popupName: "",
                zhibanTime: "",
                zhibanName: "",
                zhibanIndex: "",
                pickerWrapperName: "",
                zhibanTimes: [
                    {flex: 1, values: hours, className: "slot-1"},
                    {divider: true, content: ":"},
                    {flex: 1, values: minutes, className: "slot-2"},
                    {divider: true, content: ""},
                    {divider: true, content: "~"},
                    {flex: 1, values: hours, className: "slot-3"},
                    {divider: true, content: ":"},
                    {flex: 1, values: minutes, className: "slot-4"},
                    {divider: true, content: ""}
                ],
                zhibanNames: [],
                formData: {
                    description: "",
                    zbDescribe: "",
                    xiuxiri: "",
                    banciDatas: []
                },
                weekList: [
                    {text: "周一", value: 1},
                    {text: "周二", value: 2},
                    {text: "周三", value: 3},
                    {text: "周四", value: 4},
                    {text: "周五", value: 5},
                    {text: "周六", value: 6},
                    {text: "周日", value: 7}
                ],
                offDutyDatas: [],
                zhibanNamesSelecteds: [],
                zhibanUserNameSelecteds: [],
                depOptions: [{
                    name: '消防', value: 1
                }, {
                    name: '安监', value: 2
                }, {
                    name: '其他', value: 0
                }],
                depDatas: [],
                depFilter: ['其他', '消防', '安监']
            };
        },
        beforeCreate() {
            setHours();
            setMinutes();
        },
        mounted() {
            this.$nextTick(() => {
                this.getEmployeeList();
            });
        },
        activated() {
            if (!sessionStorage.getItem("lastZhibanTableDatas")) {
                this.back();
                return false;
            }
            formData = sessionStorage.getItem("lastZhibanTableDatas") ? JSON.parse(sessionStorage.getItem("lastZhibanTableDatas")) : null;
            this.$nextTick(() => {
                this.formData.description = formData.description;
                this.formData.zbDescribe = formData.zbDescribe;
                this.formData.banciDatas = formData.taskZibans;
                if (formData.offDuty) {
                    let xiuxiri = [];
                    formData.offDuty.forEach(item => {
                        switch (item) {
                            case "1":
                                xiuxiri.push("周一");
                                break;
                            case "2":
                                xiuxiri.push("周二");
                                break;
                            case "3":
                                xiuxiri.push("周三");
                                break;
                            case "4":
                                xiuxiri.push("周四");
                                break;
                            case "5":
                                xiuxiri.push("周五");
                                break;
                            case "6":
                                xiuxiri.push("周六");
                                break;
                            case "7":
                                xiuxiri.push("周日");
                                break;
                        }
                    });
                    this.formData.xiuxiri = xiuxiri.join(",");
                    this.offDutyDatas = formData.offDuty;
                } else {
                    this.formData.xiuxiri = "";
                }
            });
        },
        deactivated() {
            this.formData = {
                description: "",
                xiuxiri: "",
                zbDescribe: "",
                banciDatas: []
            };
            this.zhibanTime = "";
            this.popupName = "";
            this.offDutyDatas = [];
            sessionStorage.removeItem("lastZhibanTableDatas");
        },
        methods: {
            back() {
                this.$MKOPop();
            },
            popupPickerShow(type, index) {
                if (type === "zhibanTime") {
                    this.popupName = "值班时间";
                } else if (type === "zhibanName") {
                    let zhibanUserNameSelecteds = this.formData.banciDatas[index]
                        .executorName
                        ? this.formData.banciDatas[index].executorName.split(",")
                        : [];
                    let zhibanNamesSelecteds = this.formData.banciDatas[index].executor
                        ? this.formData.banciDatas[index].executor.split(",")
                        : [];
                    this.zhibanNamesSelecteds = zhibanNamesSelecteds;
                    this.zhibanUserNameSelecteds = zhibanUserNameSelecteds;
                    this.popupName = "值班人";
                } else if (type === "offDuty") {
                    this.popupName = "休息日";
                } else if (type === 'dep') {
                    this.popupName = '行业类型';
                }
                this.zhibanIndex = index;
                this.pickerWrapperName = type;
                this.selPopupShow = true;
            },
            addBanci() {
                if (this.formData.banciDatas.length === 3) {
                    this.setToast("最多只能添加3个班次");
                    return false;
                }
                this.formData.banciDatas.push({
                    bcName: "",
                    bcTime: "",
                    executorName: "",
                    executor: ""
                });
            },
            onZhibanTimeChange(picker, vals) {
                let start_h = vals[0] ? vals[0] : {Name: "00"};
                let start_m = vals[1] ? vals[1] : {Name: "00"};
                let end_h = vals[2] ? vals[2] : {Name: "00"};
                let end_m = vals[3] ? vals[3] : {Name: "00"};
                this.zhibanTime = `${start_h.Name}:${start_m.Name}:00-${end_h.Name}:${end_m.Name}:00`;
            },
            onZhibanNameChange(item) {
                let value = item.value;
                if (this.zhibanNamesSelecteds.length == 0) {
                    this.zhibanNamesSelecteds.push(value);
                    this.zhibanUserNameSelecteds.push(item.text);
                } else {
                    let cancelSelected = false;
                    for (let [index, data] of this.zhibanNamesSelecteds.entries()) {
                        if (data == value) {
                            this.zhibanNamesSelecteds.splice(index, 1);
                            this.zhibanUserNameSelecteds.splice(index, 1);
                            cancelSelected = true;
                        }
                    }
                    if (!cancelSelected) {
                        this.zhibanNamesSelecteds.push(value);
                        this.zhibanUserNameSelecteds.push(item.text);
                    }
                }
            },
            selPickerVal() {
                if (this.pickerWrapperName === "zhibanTime") {
                    let times = this.zhibanTime.split("-");
                    let arr1 = times[0].split(":");
                    let arr2 = times[1].split(":");
                    if (
                        new Date(2016, 1, 7, arr1[0], arr1[1], arr1[2]) <
                        new Date(2016, 1, 7, arr2[0], arr2[1], arr2[2])
                    ) {
                        this.formData.banciDatas[this.zhibanIndex].bcTime = this.zhibanTime;
                    } else {
                        Toast({message: "开始时间不可以大于结束时间哦", duration: 1500});
                        return false;
                    }
                } else if (this.pickerWrapperName === "zhibanName") {
                    this.formData.banciDatas[
                        this.zhibanIndex
                        ].executorName = this.zhibanUserNameSelecteds.join(",");
                    this.formData.banciDatas[
                        this.zhibanIndex
                        ].executor = this.zhibanNamesSelecteds.join(",");
                } else if (this.pickerWrapperName === "offDuty") {
                    let week = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];
                    let offDuty = [];
                    this.offDutyDatas.forEach(data => {
                        offDuty.push(week[data]);
                    });
                    this.formData.xiuxiri = offDuty.join(",");
                } else if (this.pickerWrapperName === 'dep') {
                    this.formData.dep = this.depDatas[0].value;
                }
                this.selPopupShow = false;
            },
            //弹出框
            selPopupClose() {
                this.selPopupShow = false;
            },
            removeZhibanCard(item, index) {
                if (item.id) {
                    this.$MKODialog({
                        title: "确认删除该班次吗？",
                        cancelBtn: true,
                        cancelText: "取消"
                    }).then(msg => {
                        if (msg == "confirm") this.doRemoveZhibanCard(item.id, index);
                    });
                } else {
                    this.formData.banciDatas.splice(index, 1);
                }
            },
            doRemoveZhibanCard(id, index) {
                api
                    .removeZBBanci({
                        id: id
                    })
                    .then(result => {
                        if (!result) return false;
                        if (result.code == 0) {
                            this.setToast("删除成功");
                            this.formData.banciDatas.splice(index, 1);
                        }
                    });
            },
            save() {
                let isEmpty = false;
                for (let key in this.formData) {
                    if (!this.formData[key]) {
                        isEmpty = true;
                    }
                }
                this.formData.banciDatas.forEach(banci => {
                    for (let key in banci) {
                        if (key != "xiuxiri") {
                            if (!banci[key]) {
                                isEmpty = true;
                            }
                        }
                    }
                });
                if (isEmpty) {
                    this.setToast("请完善信息");
                    return false;
                }
                Indicator.open({spinnerType: "fading-circle"});
                api
                    .addAndUpdateZBRule({
                        ruleId: this.$route.query.ruleId,
                        groupId: this.$store.getters.groupId,
                        executorGroupId: this.$store.getters.groupId,
                        executorGroupName: this.$store.getters.employeeName,
                        description: this.formData.description,
                        zbDescribe: this.formData.zbDescribe,
                        taskType: 1,
                        createrName: this.$store.getters.employeeName,
                        creater: this.$store.getters.userName,
                        offDuty: this.offDutyDatas.join(","),
                        bgColor: formData.bgColor,
                        fgColor: formData.fgColor
                    })
                    .then(result => {
                        if (!result) return false;
                        if (result.code == 0) {
                            if (result.response.ruleId) {
                                this.addZBBanci(result.response.ruleId);
                            } else {
                                this.setToast("编辑失败！");
                            }
                        } else {
                        }
                    });
            },
            addZBBanci(id) {
                let self = this;
                let doAddZBBanci = function (item) {
                    let params = item;
                    params["ruleId"] = id;
                    api.addAndUpdateZBBanci(params).then(result => {
                        if (!result) return false;
                        if (result.code == 0) return true;
                    });
                };
                this.formData.banciDatas.forEach(banci => {
                    let i = doAddZBBanci(banci);
                });
                setTimeout(() => {
                    Indicator.close();
                    this.setToast("编辑成功！");
                    this.$MKOPop();
                }, 1500);
            },
            onOffDutyChange(item) {
                let value = item.value;
                if (this.offDutyDatas.length == 0) {
                    this.offDutyDatas.push(value);
                } else {
                    let cancelSelected = false;
                    this.offDutyDatas.forEach(data => {
                        if (data == value) {
                            this.offDutyDatas.splice(this.offDutyDatas.indexOf(data), 1);
                            cancelSelected = true;
                        }
                    });
                    if (!cancelSelected) {
                        this.offDutyDatas.push(value);
                    }
                }
            },
            onDepChange(item) {
                this.depDatas = [];
                this.depDatas.push(item);
            },
            getEmployeeList() {
                api
                    .getEmployeeList({
                        m: "rwList",
                        roleRuls: 1,
                        groupId: this.$store.getters.groupId
                    })
                    .then(result => {
                        if (!result) return false;
                        if (result.code == 0) {
                            let employees = [];
                            result.response.forEach(item => {
                                employees.push({text: item.employeeName, value: item.userName});
                            });
                            this.zhibanNames = employees;
                        } else {
                            this.zhibanNames = [];
                        }
                    });
            },
            remove() {
                this.$MKODialog({
                    title: "确认删除该值班表吗？",
                    cancelBtn: true,
                    cancelText: "取消"
                }).then(msg => {
                    if (msg == "confirm") {
                        this.doRemove();
                    }
                });
            },
            doRemove() {
                api
                    .removeZBRule({
                        ruleId: this.$route.query.ruleId
                    })
                    .then(result => {
                        if (!result) return false;
                        if (result.code == 0) {
                            this.setToast("删除成功");
                            setTimeout(() => {
                                this.back();
                            }, 1000);
                        }
                    });
            },
            setToast(text) {
                Toast({message: text, duration: 1500});
            },
            banciTimeFilter(time) {
                if (!time) return "选择";
                let startTime = time.substr(0, 5);
                let endTime = time.substring(9, 14);
                return `${startTime}~${endTime}`;
            }
        }
    };
</script>

<style lang="less">
    @import "../../../config.less";

    .EditZhibanTable {
        .add-banci {
            width: 60px;
            height: 44px;
            position: relative;
            .item {
                font-size: 14px;
                color: #3399ff;
                letter-spacing: 0;
                line-height: 44px;
                height: 44px;
                display: block;
            }
            .icon {
                position: absolute;
                top: 0;
                right: 0;
                margin: auto;
                bottom: 0;
            }
        }
        .mko-form-cell {
            .cell {
                .title {
                    flex: 0 0 81px;
                    -webkit-flex: 0 0 81px;
                    width: 81px;
                }
                .sel {
                    text-align: right;
                    color: @mainBlue;
                }
                .form-btn {
                    padding-top: 10px;
                    padding-right: 4px;
                    line-height: 44px;
                    color: @mainBlue;
                    .icon-arrow-up,
                    .icon-arrow-down {
                        display: block;
                    }
                }
            }
        }
        .mko-text-area {
            background: none;
            .body {
                background-color: @baseBG02;
                textarea {
                    background-color: @baseBG02 !important;
                    color: #666666 !important;
                }
            }
        }
        .form-card {
            background-color: #ffffff;
            &.last-child {
                margin-top: 10px;
            }
        }
        .black-font {
            font-size: 16px;
            color: #333333;
            letter-spacing: 0;
            line-height: 16px;
        }
        .textarea-font {
            font-size: 14px;
            color: #666666;
            letter-spacing: 0;
            line-height: 18px;
        }
        .footer-wrap {
            margin-top: 14px;
        }
    }
</style>

