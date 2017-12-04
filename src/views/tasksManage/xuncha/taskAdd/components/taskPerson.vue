<template>
    <div>
        <div v-show="!$route.query.sel">
            <div>
                <mko-double-cell title="人员" label="选择执行人员" @click="fold">
                    <div class="header-sign" slot="icon" v-show="!isConfirm">3</div>
                    <div class="header-sign succ" slot="icon" v-show="isConfirm">
                        <span class="icon-tick-white-2"></span>
                    </div>
                </mko-double-cell>
            </div>
            <div class="fold-wrap" v-show="!isFold">
                <mko-select-box title="执行人员(可多选)" :options="options" :selected="formData"
                                :column="4" name-key="employeeName" value-key="userName" @select="selPerson">
                </mko-select-box>
                <mko-button plain size="large" :disabled="!valid" @click="confirm">确认</mko-button>
            </div>
        </div>
    </div>
</template>

<script>
    import api from 'api'

    export default {
        data () {
            return {
                isFold: true, //折叠
                isConfirm: false, //已保存数据
                valid: false,
                options: [],
                formData: [],
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
            this.getPersonList();
        },
        activated(){

        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            getPersonList(){
                let params = {
                    m: 'rwList',
                    roleRuls: 2,
                    groupId: this.$store.getters.groupId
                };
                api.getEmployeeList(params).then(res => {
                    if (res && res.code == 0) {
                        this.options = res.response;
                    }
                })
            },
            selPerson(item){
                let f = this.formData;
                let fns = function () {
                    for (let i in f) {
                        if (f[i].userName == item.userName) {
                            f.splice(i, 1);
                            return;
                        }
                    }
                    f.push(item);
                };
                fns();
            },
            validForm(){
                this.valid = this.formData.length !== 0;
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
</style>

