<template>
    <div>
        <div>
            <mko-double-cell title="设备数量" :label="`设置${title}设备数量`" @click="fold">
                <div class="header-sign" slot="icon" v-show="!isConfirm">{{num}}</div>
                <div class="header-sign succ" slot="icon" v-show="isConfirm">
                    <span class="icon-tick-white-2"></span>
                </div>
            </mko-double-cell>
        </div>
        <div class="fold-wrap" v-show="!isFold">
            <div class="no-data-hint text-center" v-show="formData.length==0">暂未添加设备</div>
            <mko-double-cell class="cell" :title="item.unitName" :label="dvcRate.label" v-for="(item,i) in formData">
                <mko-number-button v-model="formData[i].count" :min="1" :max="100"></mko-number-button>
            </mko-double-cell>
            <mko-button plain size="large" :disabled="!valid" @click="confirm" v-show="formData.length!=0">确认
            </mko-button>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['value', 'dvc-rate'],
        data () {
            return {
                title: '巡查点',
                num: 3,
                isFold: true, //折叠
                isConfirm: false, //已保存数据
                valid: false,
                formData: [],
            }
        },
        watch: {
            value(arr){
                this.formData = arr;
            },
            formData: {
                handler(arr) {
                    this.$emit('input', arr);
                    if (arr.length == 0) {
                        this.valid = false;
                    } else {
                        this.valid = true;
                    }
                },
                deep: true
            }
        },
        computed: {},
        mounted() {
            if (this.value) {
                this.formData = this.value;
            }
        },
        activated(){
            this.title = this.$route.query.from ? '安装点' : '巡查点';
            this.num = this.$route.params.spotId ? 2 : 3;
        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            validForm(){
                let f = this.formData;
                for (let key in f) {
                    if (f[key].length == 0) {
                        this.valid = false;
                        return;
                    }
                }
                this.valid = true;
            },
            validDvcCount(){
                let count = 0;
                this.formData.forEach(item => {
                    count += parseInt(item.count);
                });
                return count > 100 ? true : false;
            },
            fold(){
                if (!this.valid)
                    this.isConfirm = false;
                this.isFold = !this.isFold;
            },
            confirm(){
                if (!this.valid)
                    return false;
                if (this.validDvcCount()) {
                    this.$MKODialog({msg: '一个巡查点/安装点最多只能添加100个设备'});
                    return;
                }
                this.$emit('save', this.formData);
                this.isConfirm = true;
                this.isFold = true;
            }
        },
        components: {}
    }
</script>


