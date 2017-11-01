<template>
    <div class="CreateTmpZhibanTable">
        <div class="placeholder-item"></div>
        <mko-header title="新建临时值班表" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <div class="form-card">
                <mko-form-cell title="值班表名称" :edit="true" type="text" v-model="formData.description" holder-text="请输入值班表名称"></mko-form-cell>
            </div>
            <div class="form-card last-child">
                <mko-form-cell title="有效期" :val="formData.validPeriod || '请选择'" v-model="formData.validPeriod" :edit="true" type="sel" @click="popupPickerShow('validPeriod')"></mko-form-cell>
                <mko-form-cell :edit="true" title="班次" type="sel">
                    <div class="add-banci" slot="button" @click="addBanci">
                        <span class="item">添加</span>
                        <i class="icon icon-plus-blue"></i>
                    </div>
                </mko-form-cell>
            </div>
            <mko-edit-card :title="'班次'+ (index + 1)" title-color="black-font" :edit="false" :remove="true" @remove="removeZhibanCard(index)" v-for="(cell, index) in formData.banciDatas">
                <mko-form-cell title="值班时间" :val="banciTimeFilter(cell.bcTime)" v-model="cell.bcTime" :edit="true" type="sel" @click="popupPickerShow('zhibanTime', index)"></mko-form-cell>
                <mko-form-cell title="值班人" :val="cell.executorName || '选择'" v-model="cell.executorName" :edit="true" type="sel" @click="popupPickerShow('zhibanName', index)"></mko-form-cell>
            </mko-edit-card>
            <mko-button class="save-btn" text="保存" @click="save" size="large"></mko-button>
        </div>
        <!--弹出框-->
        <mko-popup-bottom :title="popupName" v-model="selPopupShow" @save="selPickerVal" @cancel="selPopupClose">
            <mt-picker :slots="zhibanTimes" value-key="Name" @change="onZhibanTimeChange" :visible-item-count="5" :show-toolbar="false" v-show="pickerWrapperName === 'zhibanTime'"></mt-picker>
            <mt-picker :slots="validPeriods" value-key="Name" @change="onValidPeriodChange" :visible-item-count="5" :show-toolbar="false" v-show="pickerWrapperName === 'validPeriod'"></mt-picker>
            <mko-select-box :column="4" :options="zhibanNames" :selected="zhibanNamesSelecteds" @select="onZhibanNameChange" v-show="pickerWrapperName === 'zhibanName'"></mko-select-box>
        </mko-popup-bottom>
    </div>
</template>

<script>
var hours = []
var minutes = []
var months = []
var days = []
var monthNow = new Date().getMonth();
var dayNow = new Date().getDate();
var year = new Date().getFullYear();
//判断闰年
var isLeapYear = function() {
    return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
}
var setHours = function() {
    for (let i = 0; i < 24; i++) {
        if (i < 10) {
            hours.push({
                Name: `0${i}`, Value: i
            })
        } else {
            hours.push({
                Name: `${i.toString()}`, Value: i
            })
        }
    }
}
var setMinutes = function() {
    for (let i = 0; i < 60; i++) {
        if (i < 10) {
            minutes.push({
                Name: `0${i}`, Value: i
            })
        } else {
            minutes.push({
                Name: `${i.toString()}`, Value: i
            })
        }
    }
}
var setMonths = function() {
    for (let i = 1; i <= 12; i++) {
        if (i < 10) {
            months.push({
                Name: `0${i}`, Value: i
            })
        } else {
            months.push({
                Name: `${i.toString()}`, Value: i
            })
        }
    }
    months.splice(0, monthNow)
}
var setDays = function() {
    for (let i = 1; i <= 31; i++) {
        if (i < 10) {
            days.push({
                Name: `0${i}`, Value: i
            })
        } else {
            days.push({
                Name: `${i.toString()}`, Value: i
            })
        }
    }
    days.splice(0, dayNow - 1)
}
import api from 'api'
import { Toast, Indicator } from 'mint-ui';

export default {
    data() {
        return {
            isValidate: false,
            selPopupShow: false,
            pickerShow: false,
            popupName: '',
            zhibanTime: '',
            zhibanName: '',
            validPeriod: '',
            zhibanIndex: '',
            pickerWrapperName: '',
            zhibanTimes: [
                { flex: 1, values: [], className: 'slot-1' },
                { divider: true, content: ':' },
                { flex: 1, values: [], className: 'slot-2' },
                { divider: true, content: '~' },
                { flex: 1, values: [], className: 'slot-3' },
                { divider: true, content: ':' },
                { flex: 1, values: [], className: 'slot-4' }
            ],
            zhibanNames: [],
            formData: {
                description: '', startDate: '', endDate: '', validPeriod: '', banciDatas: [{ startTime: '', endTime: '', executor: '', bcTime: '', executorName: '' }]
            },
            validPeriod: {
                startDate: '',
                endDate: '',
                text: ''
            },
            weekList: [
                { text: '周一', value: 1 },
                { text: '周二', value: 2 },
                { text: '周三', value: 3 },
                { text: '周四', value: 4 },
                { text: '周五', value: 5 },
                { text: '周六', value: 6 },
                { text: '周日', value: 7 }
            ],
            offDutyDatas: [],
            zhibanNamesSelecteds: [],
            zhibanUserNameSelecteds: [],
            validPeriods: [
                { flex: 1, values: months, className: 'slot-1' },
                { divider: true, content: '月' },
                { flex: 1, values: days, className: 'slot-2' },
                { divider: true, content: '日' },
                { divider: true, content: '~' },
                { flex: 1, values: months, className: 'slot-3' },
                { divider: true, content: '月' },
                { flex: 1, values: days, className: 'slot-4' },
                { divider: true, content: '日' }]
        }
    },
    mounted() {
        setHours()
        setMinutes()
        setMonths()
        setDays()
        this.$nextTick(() => {
            this.zhibanTimes[0].values = hours;
            this.zhibanTimes[2].values = minutes;
            this.zhibanTimes[4].values = hours;
            this.zhibanTimes[6].values = minutes;
            this.getEmployeeList();
        })
    },
    deactivated() {
        this.formData = {
            description: '', startDate: '', endDate: '', validPeriod: '', banciDatas: [{ startTime: '', endTime: '', executor: '', bcTime: '', executorName: '' }]
        }
        this.zhibanTime = ''
        this.popupName = ''
        this.offDutyDatas = []
    },
    methods: {
        back() {
            this.$MKOPop()
        },
        popupPickerShow(type, index) {
            if (type === 'zhibanTime') {
                this.popupName = '值班时间';
            } else if (type === 'zhibanName') {
                let zhibanUserNameSelecteds = this.formData.banciDatas[index].executorName ? this.formData.banciDatas[index].executorName.split(',') : [];
                let zhibanNamesSelecteds = this.formData.banciDatas[index].executor ? this.formData.banciDatas[index].executor.split(',') : [];
                if (this.formData.banciDatas[index].collaborator) zhibanNamesSelecteds = zhibanNamesSelecteds.concat(this.formData.banciDatas[index].collaborator.split(','));
                this.zhibanNamesSelecteds = zhibanNamesSelecteds;
                this.zhibanUserNameSelecteds = zhibanUserNameSelecteds;
                this.popupName = '值班人';
            } else if (type === 'validPeriod') {
                this.popupName = '有效期';
            }
            this.zhibanIndex = index;
            this.pickerWrapperName = type;
            this.selPopupShow = true;
        },
        addBanci() {
            if (this.formData.banciDatas.length === 3) {
                Toast({ message: '最多只能添加3个班次', duration: 1500 });
                return false;
            }
            this.formData.banciDatas.push({ startTime: '', endTime: '', executor: '', bcTime: '', executorName: '' });
        },
        onZhibanTimeChange(picker, vals) {
            let start_h = vals[0] ? vals[0] : { Name: '00' };
            let start_m = vals[1] ? vals[1] : { Name: '00' };
            let end_h = vals[2] ? vals[2] : { Name: '00' };
            let end_m = vals[3] ? vals[3] : { Name: '00' };
            this.zhibanTime = `${start_h.Name}:${start_m.Name}:00-${end_h.Name}:${end_m.Name}:00`
        },
        onZhibanNameChange(item) {
            let value = item.value;
            if (this.zhibanNamesSelecteds.length == 0) {
                this.zhibanNamesSelecteds.push(value);
                this.zhibanUserNameSelecteds.push(item.text)
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
                    this.zhibanNamesSelecteds.push(value)
                    this.zhibanUserNameSelecteds.push(item.text)
                }
            }
        },
        onValidPeriodChange(picker, vals) {
            let start_m = vals[0] ? vals[0] : { Name: '01' };
            let start_d = vals[1] ? vals[1] : { Name: '01' };
            let end_m = vals[2] ? vals[2] : { Name: '01' };
            let end_d = vals[3] ? vals[3] : { Name: '01' };
            this.startDateFilterByStartMonths(start_m.Value);
            this.endDateFilterByEndMonths(end_m.Value);
            this.validPeriod.startDate = `${year}-${start_m.Name}-${start_d.Name}`
            this.validPeriod.endDate = `${year}-${end_m.Name}-${end_d.Name}`
            this.validPeriod.text = `${start_m.Name}月${start_d.Name}日-${end_m.Name}月${end_d.Name}日`
        },
        selPickerVal() {
            if (this.pickerWrapperName === 'zhibanTime') {
                let times = this.zhibanTime.split('-');
                let arr1 = times[0].split(':');
                let arr2 = times[1].split(':');
                if (new Date(2016, 1, 7, arr1[0], arr1[1], arr1[2]) < new Date(2016, 1, 7, arr2[0], arr2[1], arr2[2])) {
                    this.formData.banciDatas[this.zhibanIndex].startTime = times[0];
                    this.formData.banciDatas[this.zhibanIndex].endTime = times[1];
                    this.formData.banciDatas[this.zhibanIndex].bcTime = this.zhibanTime;
                } else {
                    Toast({ message: '开始时间不可以大于结束时间哦', duration: 1500 });
                    return false;
                }
            } else if (this.pickerWrapperName === 'zhibanName') {
                this.formData.banciDatas[this.zhibanIndex].collaborator = (this.zhibanNamesSelecteds.slice(1)).join(',')
                this.formData.banciDatas[this.zhibanIndex].executorName = this.zhibanUserNameSelecteds.join(',');
                this.formData.banciDatas[this.zhibanIndex].executor = this.zhibanNamesSelecteds[0];
            } else if (this.pickerWrapperName === 'validPeriod') {
                let startDate = this.validPeriod.startDate.split('-');
                let endDate = this.validPeriod.endDate.split('-');
                if (new Date(startDate[0], startDate[1] - 1, startDate[2], 0, 0, 0) > new Date(endDate[0], endDate[1] - 1, endDate[2], 0, 0, 0)) {
                    Toast({ message: '开始时间不可以大于结束时间哦', duration: 1500 });
                    return false;
                }
                this.formData.startDate = this.validPeriod.startDate
                this.formData.endDate = this.validPeriod.endDate
                this.formData.validPeriod = this.validPeriod.text
            }
            this.selPopupShow = false;
        },
        //弹出框
        selPopupClose() {
            this.selPopupShow = false;
        },
        removeZhibanCard(index) {
            this.formData.banciDatas.splice(index, 1);
        },
        save() {
            let tasks = [];
            let isEmpty = false;
            for (let key in this.formData) {
                if (!this.formData[key]) {
                    isEmpty = true;
                }
            }
            this.formData.banciDatas.forEach((banci) => {
                for (let key in banci) {
                    if (key != 'collaborator') {
                        if (!banci[key]) isEmpty = true;
                    }
                }
                tasks.push({
                    collaborator: banci.collaborator,
                    endTime: banci.endTime,
                    executor: banci.executor,
                    startTime: banci.startTime
                })
            })
            if (isEmpty) {
                Toast({
                    message: '请完善信息',
                    duration: 1500
                });
                return false;
            }
            Indicator.open({ spinnerType: 'fading-circle' });
            api.addZhibanTask({
                groupId: this.$store.getters.groupId,
                description: this.formData.description,
                startDate: this.formData.startDate,
                endDate: this.formData.endDate,
                taskType: 1,
                tasks: tasks
            }).then(result => {
                Indicator.close();
                if (!result) return false;
                if (result.code == 0) {
                    setTimeout(() => {
                        Toast({ message: '新建成功！', duration: 1500 });
                        this.$MKOPop();
                    }, 1500)
                } else {
                    Toast({ message: '新建失败！', duration: 1500 });
                }
            })
        },
        onOffDutyChange(item) {
            let value = item.value;
            if (this.offDutyDatas.length == 0) {
                this.offDutyDatas.push(value)
            } else {
                let cancelSelected = false;
                this.offDutyDatas.forEach((data) => {
                    if (data == value) {
                        this.offDutyDatas.splice(this.offDutyDatas.indexOf(data), 1);
                        cancelSelected = true;
                    }
                })
                if (!cancelSelected) {
                    this.offDutyDatas.push(value)
                }
            }
        },
        getEmployeeList() {
            api.getEmployeeList({
                m: 'rwList',
                roleRuls: 1,
                groupId: this.$store.getters.groupId
            }).then(result => {
                if (!result) return false;
                if (result.code == 0) {
                    let employees = [];
                    result.response.forEach(item => {
                        employees.push({ text: item.employeeName, value: item.userName })
                    })
                    this.zhibanNames = employees;
                } else {
                    this.zhibanNames = [];
                }
            })
        },
        banciTimeFilter(time) {
            if (!time) return '选择';
            let startTime = time.substr(0, 5);
            let endTime = time.substring(9, 14);
            return `${startTime}~${endTime}`
        },
        startDateFilterByStartMonths(month) {
            if(month == 2) {
                this.validPeriods[2].values = days.filter(item => { 
                    return item.Value <= (isLeapYear() ? 29 : 28); 
                });
            } else {
                let m = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                this.validPeriods[2].values = days.filter(item => { 
                    return item.Value <= m[month];
                });
            }
        },
        endDateFilterByEndMonths(month) {
            if(month == 2) {
                this.validPeriods[2].values = days.filter(item => { 
                    return item.Value <= (isLeapYear() ? 29 : 28); 
                });
            } else {
                let m = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                this.validPeriods[7].values = days.filter(item => { 
                    return item.Value <= m[month];
                });
            }
        }
    }
}
</script>

<style lang="less">
@import "../../../config.less";
.CreateTmpZhibanTable {
    .save-btn {
        margin-top: 14px;
    }
    .add-banci {
        width: 60px;
        height: 44px;
        position: relative;
        .item {
            font-size: 14px;
            color: #3399FF;
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
}
</style>

