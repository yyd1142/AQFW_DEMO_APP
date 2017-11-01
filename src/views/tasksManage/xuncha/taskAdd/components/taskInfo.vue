<template>
    <div class="task-info-wrap">
        <div class="body">
            <mko-double-cell title="信息" label="完善任务名称与任务要求" @click="fold">
                <div class="header-sign" slot="icon" v-show="!isConfirm">1</div>
                <div class="header-sign succ" slot="icon" v-show="isConfirm">
                    <span class="icon-tick-white-2"></span>
                </div>
            </mko-double-cell>
            <div class="fold-wrap" v-show="!isFold">
                <mko-form-cell title="任务名称" v-model="formData.name" holder-text="输入任务名称" type="text" edit></mko-form-cell>
                <mko-textarea placeholder="请输入任务要求" v-model="formData.desc"></mko-textarea>
                <mko-form-cell title="截止日期" type="sel" edit @click="datePickerShow" v-if="$route.params.type != 'routine'">
                    <div class="icon-circle-drop fr text-middle" slot="button"></div>
                    {{formatDate(formData.limitDate, 'YYYY-MM-DD') || '选择'}}
                </mko-form-cell>
                <mko-button size="large" plain :disabled="!valid" @click="confirm">确认</mko-button>
            </div>
        </div>
        <mt-datetime-picker ref="DatePicker" type="date" :startDate="new Date()" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" v-model="history_date" @confirm="selDate()"></mt-datetime-picker>
    </div>
</template>

<script>
    import api from 'api'
    import { formatDate } from 'filters';

    let _validKey = ['name', 'desc'];
    export default {
        data () {
            return {
                isFold: false, //折叠
                isConfirm: false, //已保存数据
                valid: false,
                history_date: '',
                formData: {
                    name: '',
                    desc: '',
                    limitDate: ''
                }
            }
        },
        watch: {
            formData: {
                handler() {
                    this.validForm();
                },
                deep: true
            },
        },
        computed: {},
        mounted() {
        },
        activated(){
            if (this.$route.params.type == 'routine') {
                _validKey = ['name', 'desc']
            } else {
                _validKey = ['name', 'desc', 'limitDate']
            }
        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            formatDate,
            datePickerShow(){
                this.history_date = this.formData.limitDate ? new Date(this.formData.limitDate) : new Date();
                this.$refs.DatePicker.open();
            },
            selDate(){
                this.formData.limitDate = this.history_date;
            },
            validForm(){
                for (let key of _validKey) {
                    if (this.formData[key] === '') {
                        this.valid = false;
                        return;
                    }
                }
                this.valid = true;
            },
            fold(){
                if (!this.valid)
                    this.isConfirm = false;
                this.isFold = !this.isFold;
            },
            confirm(){
                if (!this.valid)
                    return false;
                this.$emit('save', this.formData);
                this.isConfirm = true;
                this.isFold = true;
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../../../config.less";


</style>
