<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="$route.query.title" left-icon="icon-back" @handleLeftClick="back" right-icon-text="保存" @handleRightClick="submit"></mko-header>
        <div class="page-wrap person-data-wrap">
            <div class="xfzr-field">
                <span class="label">单位名称</span>
                <input type="text" placeholder="请输入单位名称" v-model="formData.dwName" @change="onInputData" />
            </div>
            <div class="xfzr-field">
                <span class="label">联系人</span>
                <input type="text" placeholder="请输入联系人" v-model="formData.dwContact" @change="onInputData" />
            </div>
            <div class="xfzr-field">
                <span class="label">联系电话</span>
                <input type="text" @keyup="formData.dwPhone = formData.dwPhone.replace(/[^\d]/g,'') " placeholder="请输入联系电话" v-model="formData.dwPhone" @change="onInputData" />
            </div>
            <div class="xfzr-field" @click="$refs.contractDate.open();">
                <span class="label">合同签订日期</span>
                <span class="value">{{formData.contractDate | formatDate('YYYY-MM-DD') || '请选择签订日期'}}</span>
            </div>
            <div class="xfzr-field" @click="$refs.contractStartDate.open();">
                <span class="label">合同开始日期</span>
                <span class="value">{{formData.contractStartDate | formatDate('YYYY-MM-DD') || '请选择开始日期'}}</span>
            </div>
            <div class="xfzr-field" @click="$refs.contractEndDate.open();">
                <span class="label">合同截止日期</span>
                <span class="value">{{formData.contractEndDate | formatDate('YYYY-MM-DD') || '请选择截止日期'}}</span>
            </div>
            <div class="xfzr-field">
                <span class="label">合同文件</span>
                <span class="value">请登录WEB端上传</span>
            </div>
        </div>
        <mt-datetime-picker ref="contractDate" type="date" :end-date="new Date()" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" v-model="time.contractDate" @confirm="handleConfirm(1, time.contractDate)"></mt-datetime-picker>
        <mt-datetime-picker ref="contractStartDate" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" v-model="time.contractStartDate" @confirm="handleConfirm(2, time.contractStartDate)"></mt-datetime-picker>
        <mt-datetime-picker ref="contractEndDate" type="date" :start-date="contractEndDateMax" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" v-model="time.contractEndDate" @confirm="handleConfirm(3, time.contractEndDate)"></mt-datetime-picker>
    </div>
</template>



<style lang="less" scoped>
.save-btn {
    position: absolute;
    bottom: 0;
}

.xfzr-field {
    width: 100%;
    height: 44px;
    background-color: #ffffff;
    position: relative;
    padding-left: 115px;
    border-bottom: 1px solid #d9d9d9;
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

.xfzr-seleced {
    height: 44px;
}
</style>

<script>
// {"groupId":"QYWX000005","dwName":"tutu","dwType":1,"dwContact":"tutu","dwPhone":"13222222222","contractDate":"2017-08-02 00:00","contractStartDate":"2017-08-02 00:00","contractEndDate":"2018-08-02 00:00","attachmentID":"ce7da278c607448687087ec080cb871f07000000","zrdwID":"ZRWX000000"}
import api from 'api'
import { Toast } from 'mint-ui'
import moment from 'moment'
import { formatDate } from 'filters'
var formData = {}
export default {
    data() {
        return {
            contractEndDateMax: new Date(),
            formData: {},
            time: {
                contractDate: '',
                contractStartDate: '',
                contractEndDate: ''
            },
            bInputData: false
        }
    },
    activated() {
        formData = this.$route.query.zrdwItem;
        this.formData = formData;
    },
    methods: {
        back() {
            if (this.bInputData) {
                this.$MKODialog({
                    title: '提示',
                    msg: '返回上一级将不会保存当前操作，确认要返回吗？',
                    cancelBtn:true
                }).then(action => {
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
        handleConfirm(type, date) {
            this.onInputData();
            if (type == 1) this.formData.contractDate = moment(date).format("YYYY-MM-DD 00:00");
            if (type == 2) {
                this.formData.contractStartDate = moment(date).format("YYYY-MM-DD 00:00");
                this.contractEndDateMax = new Date(date);
            }
            if (type == 3) this.formData.contractEndDate = moment(date).format("YYYY-MM-DD 00:00");
        },
        submit() {
            // console.log(this.formData.dwPhone.toString())
            this.formData['groupId'] = this.$store.getters.groupId;
            this.formData.dwPhone = this.formData.dwPhone.toString();
            // delete this.formData.attachmentID;
            api.updateZRDWUnit(this.formData).then(result => {
                if (!result) return false;
                if (result.code === 0) {
                    Toast({
                        message: '编辑成功',
                        position: 'middle',
                        duration: 1500
                    });
                    setTimeout(() => {
                        this.bInputData = false;
                        window.mkoBackButton.bInputData = false;
                        this.$MKOPop()
                    }, 1500);
                } else {
                    Toast({
                        message: '编辑失败',
                        position: 'middle',
                        duration: 1500
                    });
                }
            });
        },
        resetData() {
            this.bInputData = false;
            window.mkoBackButton.bInputData = false;
            this.contractEndDateMax = new Date()
            formData = {}
            // this.time = {
            //     contractDate: '',
            //     contractStartDate: '',
            //     contractEndDate: ''
            // }
        },
        onInputData() {
            let self = this;
            this.bInputData = true;
            window.mkoBackButton = {};
            window.mkoBackButton.bInputData = true;
            window.mkoBackButton.callback = function (action) {
                self.$MKODialog({
                    title: '提示',
                    msg: '返回上一级将不会保存当前操作，确认要返回吗？',
                    cancelBtn:true
                }).then(action => {
                    if (action == 'confirm') {
                        self.resetData();
                        self.$MKOPop()
                    }
                });
            }
        }
    }
}
</script>
