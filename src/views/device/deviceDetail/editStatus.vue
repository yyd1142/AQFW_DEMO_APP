<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="更改设备状态" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="edit-status-wrap">
            <div class="body">
                <mko-select-box :selected="[formData.status]" :options="options" :column="2" @select="selStatus"></mko-select-box>
                <mko-textarea v-model="formData.desc" placeholder="请输入处理描述" :limit-count="descLimit"></mko-textarea>
            </div>
            <mko-button size="large" :disabled="!valid" @click="save">确定</mko-button>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['curStatus'],
        data () {
            return {
                options: [
                    {value: 1, text: '正常'},
                ],
                valid: false,
                formData: {
                    status: '',
                    desc: ''
                },
                descLimit: 50
            }
        },
        watch: {
            formData: {
                handler(f) {
                    this.validForm(f);
                },
                deep: true
            }
        },
        computed: {},
        mounted() {
            if (this.curStatus == 2) {
                this.options.push({value: 3, text: '维修'})
            } else {
                this.options.push({value: 2, text: '故障'})
            }
        },
        activated(){

        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            selStatus(val){
                this.formData.status = val.value;
            },
            validForm(f){
                for (let k in f) {
                    if (!f[k]) {
                        this.valid = false;
                        return;
                    }
                }
                if (f.desc.length > this.descLimit) {
                    this.valid = false;
                    return;
                }

                this.valid = true;
            },
            save(){
                this.$emit('save', this.formData);
                this.back();
            },
            back(){
                this.$MKOPop();
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .device-info-wrap {
        .edit-status-wrap {
            position: fixed;
            top: @headerHeight+@headerTop;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1;
            background-color: @baseBG01;
            > .body {
                margin-bottom: 14px;
                background-color: #fff;
                .mko-text-area {
                    padding-top: 9px;
                    background-color: #fff;
                    .body, .text-area {
                        background-color: @baseBG02;
                    }

                }
            }
        }
    }
</style>
