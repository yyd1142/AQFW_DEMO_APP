<template>
    <div class="EditBanci">
        <div class="placeholder-item"></div>
        <mko-header :title="formData.bcName" left-icon="icon-back" @handleLeftClick="back" right-icon="icon-delete" @handleRightClick="remove"></mko-header>
        <div class="page-wrap">
            <mko-form-cell title="班次名称" :val="formData.bcName" :edit="true" type="text" v-model="formData.bcName" holder-text="请输入班次名称"></mko-form-cell>
            <mko-form-cell title="值班时间" :val="banciTimeFilter(formData.bcTime)" v-model="formData.bcTime" :edit="true" type="sel" @click="popupPickerShow('zhibanTime')"></mko-form-cell>
            <mko-form-cell title="值班人" :val="formData.executorName" v-model="formData.executorName" :edit="true" type="sel" @click="popupPickerShow('zhibanName')"></mko-form-cell>
            <div class="footer-wrap" @click.stop="save">
                <mko-button class="btn bottom-btn" size="large">保存</mko-button>
            </div>
        </div>
        <!--弹出框-->
        <mko-popup-bottom :title="popupName" v-model="selPopupShow" @save="selPickerVal" @cancel="selPopupClose">
            <mt-picker :slots="zhibanTimes" value-key="Name" @change="onZhibanTimeChange" :visible-item-count="5" :show-toolbar="false" v-if="pickerWrapperName === 'zhibanTime'"></mt-picker>
            <mko-select-box :column="4" :options="zhibanNames" :selected="zhibanNamesSelecteds" @select="onZhibanNameChange" v-if="pickerWrapperName === 'zhibanName'"></mko-select-box>
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
import { Toast } from 'mint-ui'
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
            zhibanNamesSelecteds: [],
            zhibanUserNameSelecteds: [],
            formData: {}
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
    activated() {
        this.formData = this.$route.query.bcDetail;
    },
    methods: {
        back() {
            this.$MKOPop()
        },
        popupPickerShow(type, index) {
            if (type === 'zhibanTime') {
                this.popupName = '值班时间';

            } else if (type === 'zhibanName') {
                this.zhibanNamesSelecteds = this.formData.executor.split(',');
                this.zhibanUserNameSelecteds = this.formData.executorName.split(',');
                this.popupName = '值班人';
            }
            this.pickerWrapperName = type;
            this.selPopupShow = true;
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
            if (this.pickerWrapperName === 'zhibanTime') {
                this.formData.bcTime = this.zhibanTime;
            } else if (this.pickerWrapperName === 'zhibanName') {
                this.formData.executorName = this.zhibanUserNameSelecteds.join(',');
                this.formData.executor = this.zhibanNamesSelecteds.join(',');
            }
        },
        //弹出框
        selPopupClose() {
            this.selPopupShow = false;
        },
        remove() {
            this.$MKODialog({
                title: '确认删除该班次吗？',
                cancelBtn: true,
                cancelText: '取消'
            }).then(msg => {
                if (msg == 'confirm') this.doRemove();
            })
        },
        doRemove() {
            let params = {
                ruleId: this.formData.ruleId,
                banciId: this.formData.id,
                type: 2,
                content: JSON.stringify(this.formData),
                modificationDate: `${this.$route.query.modificationDate} 00:00:00`
            }
            if (this.formData.recordId) {
                params['id'] = this.formData.recordId
            }
            api.updateZBRecord(params).then(result => {
                if (!result) return false;
                if (result.code == 0) {
                    this.setToast('删除成功');
                    this.$MKOPop()
                }
            })
        },
        setToast(text) {
            Toast({ message: text, duration: 1500 });
        },
        save() {
            let params = {
                ruleId: this.formData.ruleId,
                banciId: this.formData.id,
                type: 1,
                content: JSON.stringify(this.formData),
                modificationDate: `${this.$route.query.modificationDate} 00:00:00`
            }
            if (this.formData.recordId) {
                params['id'] = this.formData.recordId
            }
            api.updateZBRecord(params).then(result => {
                if (!result) return false;
                if (result.code == 0) {
                    Toast({ message: '编辑成功！', duration: 1500 });
                    this.$MKOPop()
                }
            })
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
        }
    }
}
</script>

<style lang="less">
@import "../../../config.less";
.EditBanci {
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
    .footer-wrap {
        margin-top: 14px;
    }
}
</style>

