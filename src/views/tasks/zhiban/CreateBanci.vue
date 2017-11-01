<template>
    <div class="CreateBanci">
        <div class="placeholder-item"></div>
        <mko-header title="新建班次" left-icon="icon-back" @handleLeftClick="back" right-icon-text="保存" @handleRightClick="save"></mko-header>
        <div class="page-wrap">
            <mko-form-cell title="班次名称" :val="formData.bcName" :edit="true" type="text" v-model="formData.bcName" holder-text="请输入班次名称"></mko-form-cell>
            <mko-form-cell title="值班时间" :val="formData.bcTime" v-model="formData.bcTime" :edit="true" type="sel" @click="popupPickerShow('bcTime')"></mko-form-cell>
            <mko-form-cell title="值班人" :val="formData.executorName" v-model="formData.executorName" :edit="true" type="sel" @click="popupPickerShow('executorName')"></mko-form-cell>
        </div>
        <!--弹出框-->
        <mko-popup-bottom :title="popupName" v-model="selPopupShow" @save="selPickerVal" @cancel="selPopupClose">
            <mt-picker :slots="zhibanTimes" value-key="Name" @change="onZhibanTimeChange" :visible-item-count="5" :show-toolbar="false" v-if="pickerWrapperName === 'bcTime'"></mt-picker>
            <mko-select-box :column="4" :options="zhibanNames" :selected="zhibanNamesSelecteds" @select="onZhibanNameChange" v-if="pickerWrapperName === 'executorName'"></mko-select-box>
        </mko-popup-bottom>
    </div>
</template>

<script>
var hours = []
var minutes = []
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
import api from 'api'
import { Toast } from 'mint-ui';
export default {
    data() {
        return {
            isValidate: false,
            selPopupShow: false,
            pickerShow: false,
            popupName: '',
            zhibanTime: '',
            zhibanName: '',
            pickerWrapperName: '',
            zhibanTimes: [
                { flex: 1, values: hours, className: 'slot-1' },
                { divider: true, content: '时' },
                { flex: 1, values: minutes, className: 'slot-2' },
                { divider: true, content: '分' },
                { divider: true, content: '-' },
                { flex: 1, values: hours, className: 'slot-3' },
                { divider: true, content: '时' },
                { flex: 1, values: minutes, className: 'slot-4' },
                { divider: true, content: '分' },
            ],
            zhibanNames: [],
            formData: {
                bcName: '', bcTime: '', executorName: '', executor: ''
            },
            zhibanNamesSelecteds: [],
            zhibanUserNameSelecteds: []
        }
    },
    beforeCreate() {
        setHours()
        setMinutes()
    },
    mounted() {
        this.$nextTick(() => {
            this.getEmployeeList();
        })
    },
    deactivated() {
        this.formData = {
            bcName: '', bcTime: '', executorName: '', executor: ''
        }
        this.zhibanTime = ''
        this.popupName = ''
    },
    methods: {
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
        back() {
            this.$MKOPop()
        },
        popupPickerShow(type, index) {
            if (type === 'bcTime') {
                this.popupName = '值班时间';

            } else if (type === 'executorName') {
                this.popupName = '值班人';
            }
            this.pickerWrapperName = type;
            this.selPopupShow = true;
        },
        onZhibanTimeChange(picker, vals) {
            let start_h = vals[0] ? vals[0] : { Name: '00' };
            let start_m = vals[1] ? vals[1] : { Name: '00' };
            let endHours = [];
            let endMinutes = [];
            hours.forEach((hour) => {
                if (vals[0].Value <= hour.Value) {
                    endHours.push(hour);
                }
            })
            minutes.forEach((minute) => {
                if (vals[0].Value <= minute.Value) {
                    endMinutes.push(minute);
                }
            })
            this.zhibanTimes[5].values = endHours
            this.zhibanTimes[7].values = endMinutes
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
                this.zhibanNamesSelecteds.forEach((data) => {
                    if (data == value) {
                        this.zhibanNamesSelecteds.splice(this.zhibanNamesSelecteds.indexOf(data), 1);
                        this.zhibanUserNameSelecteds.splice(this.zhibanNamesSelecteds.indexOf(data), 1);
                        cancelSelected = true;
                    }
                })
                if (!cancelSelected) {
                    this.zhibanNamesSelecteds.push(value)
                    this.zhibanUserNameSelecteds.push(item.text)
                }
            }
        },
        selPickerVal() {
            this.selPopupShow = false;
            if (this.pickerWrapperName === 'bcTime') {
                this.formData.bcTime = this.zhibanTime;
            } else if (this.pickerWrapperName === 'executorName') {
                this.formData.executorName = this.zhibanUserNameSelecteds.join(',');
                this.formData.executor = this.zhibanNamesSelecteds.join(',');
            }
        },
        //弹出框
        selPopupClose() {
            this.selPopupShow = false;
        },
        save() {
            let isEmpty = false;
            for (let key in this.formData) {
                if (!this.formData[key]) {
                    isEmpty = true;
                }
            }
            if (isEmpty) {
                Toast({ message: '请完善信息', duration: 1500 });
                return false;
            }
            let params = this.formData;
            params['ruleId'] = this.$route.query.ruleId;
            api.addAndUpdateZBBanci(params).then(result => {
                if (!result) return false;
                if (result.code == 0) {
                    setTimeout(() => {
                        Toast({ message: '新建成功！', duration: 1500 });
                        this.$MKOPop();
                    }, 1500)
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>
.CreateBanci {
    .add-banci-btn {
        width: 44px;
        height: 44px;
        line-height: 42px;
        text-align: center;
        color: #79b8f9;
        font-size: 30px;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        right: 0;
        z-index: 20;
    }
}
</style>

