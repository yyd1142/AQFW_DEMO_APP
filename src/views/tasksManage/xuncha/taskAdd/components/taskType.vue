<template>
    <div>
        <div v-show="!$route.query.sel">
            <mko-double-cell title="行业类型" label="选择行业类型" @click="fold">
                <div class="header-sign" slot="icon" v-show="!isConfirm">1</div>
                <div class="header-sign succ" slot="icon" v-show="isConfirm">
                    <span class="icon-tick-white-2"></span>
                </div>
            </mko-double-cell>
            <div class="fold-wrap" v-show="!isFold">
                <mko-select-box title="行业标准(单选)" :options="options" :selected="formData"
                                :column="4" name-key="name" value-key="value" @select="selPerson">
                </mko-select-box>
                <mko-button plain size="large" :disabled="!valid" @click="confirm">确认</mko-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                isFold: false, //折叠
                isConfirm: false, //已保存数据
                valid: false,
                options: [{
                    name: '消防', value: 1
                }, {
                    name: '安监', value: 2
                }, {
                    name: '其他', value: 0
                }],
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
        activated(){

        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            selPerson(item){
                this.formData = [];
                this.formData.push(item);
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
        }
        ,
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
</style>

