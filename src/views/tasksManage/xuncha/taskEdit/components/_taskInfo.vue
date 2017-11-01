<template>
    <div class="module-wrap">
        <mko-form-cell title="巡查点名" v-model="formData.name" type="text" edit></mko-form-cell>
        <mko-form-cell title="执行人员" :val="personFr(formData.person)" type="sel" edit></mko-form-cell>
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
                    person:[]
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
