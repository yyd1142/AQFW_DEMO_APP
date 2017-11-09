<template>
    <div class="dvc-type-wrap">
        <div v-show="!onSelDvc">
            <mko-double-cell title="设备类型" :label="`选择该${title}包含的设备`" @click="fold">
                <div class="header-sign" slot="icon" v-show="!isConfirm">{{num}}</div>
                <div class="header-sign succ" slot="icon" v-show="isConfirm">
                    <span class="icon-tick-white-2"></span>
                </div>
            </mko-double-cell>
            <div class="fold-wrap" v-show="!isFold">
                <mko-select-box title="设备类型" :options="options.dvcType" :selected="[formData.dvcType]" @select="selDvcType" :column="2"></mko-select-box>

                <mko-select-box title="消防设备（可多选）" :options="options.dvcXf_0.concat(options.dvcXf_1)" :selected="formData.dvc"
                                value-key="unitID" name-key="unitName" :column="2" @select="selDvc" v-show="formData.dvcType==1">
                    <button slot="more" class="sel-btn" :style="{margin:'5px 1.4%',width:'47.2%'}" @click="goSelDvc(true)">
                        <div class="icon-search-blue"></div>
                    </button>
                </mko-select-box>
                <mko-select-box title="安监设备（可多选）" :options="options.dvcAj_0.concat(options.dvcAj_1)" :selected="formData.dvc"
                                value-key="unitID" name-key="unitName" :column="2" @select="selDvc" v-show="formData.dvcType==2">
                    <button slot="more" class="sel-btn" :style="{margin:'5px 1.4%',width:'47.2%'}" @click="goSelDvc(true)">
                        <div class="icon-search-blue"></div>
                    </button>
                </mko-select-box>

                <mko-select-box title="频率（单选）" name-key="label" :options="options.rate" :selected="[formData.rate]" :column="4" @select="selRate"></mko-select-box>
                <div class="desc">
                    建议巡查频率：<br>
                    1.消防安全重点单位每天巡查1次；<br>
                    2.公共娱乐场所至少每天巡查1次；<br>
                    3.其他单位至少每周巡查1次。<br>
                </div>
                <mko-button plain size="large" :disabled="!valid" @click="confirm">确认</mko-button>
            </div>
        </div>
        <dvc-search :type="formData.dvcType" @sel="selDvcOnList" @back="goSelDvc(false)" v-if="onSelDvc"></dvc-search>
    </div>
</template>

<script>
    import dvcSearch from './dvcSearch.vue'
    let _key = ['Xf', 'Aj'];
    export default {
        props: ['parentsForm'],
        data () {
            return {
                title: '巡查点',
                num: 2,
                isFold: true, //折叠
                isConfirm: false, //已保存数据
                valid: false,
                onSelDvc: false,
                options: {
                    dvcType: [
                        {value: 1, text: '消防设备'},
                        {value: 2, text: '安监设备'}
                    ],
                    dvcXf_0: [],
                    dvcXf_1: [],
                    dvcAj_0: [],
                    dvcAj_1: [],
                    rate: []
                },
                formData: {
                    dvcType: '',
                    dvc: [],
                    rate: {}
                },
            }
        },
        watch: {
            formData: {
                handler() {
                    this.validForm();
                },
                deep: true
            }
        },
        computed: {
            patrolOptions: function () {
                let _l = []
                if (this.$route.query.from == 'device' || this.$route.params.spotId)
                    _l.push({
                        value: '0/0/0', label: '无需巡查'
                    })
                for (let i = 0; i < 3; i++) {
                    _l.push({
                        value: `1/1/${i + 1}`, label: `每日${i + 1}次`
                    })
                }
                for (let i = 1; i < 6; i++) {
                    _l.push({
                        value: `1/${(i + 1)}/1`, label: `${i + 1}天1次`
                    })
                }
                _l.push(
                    {value: `2/0/1`, label: `每周1次`},
                    {value: `4/0/1`, label: `半月1次`},
                    {value: `5/0/1`, label: `每月1次`},
                    {value: `3/0/1`, label: `每季度1次`}
                )
                return _l
            },
        },
        mounted() {
        },
        activated(){
            this.options.dvcXf_0 = [
                {unitID: 163, unitName: '灭火器', systemID: 18, systemName: '灭火器'},
                {unitID: 54, unitName: '室内消火栓', systemID: 6, systemName: '消火栓（消防炮）灭火系统'},
                {unitID: 170, unitName: '安全出口', systemID: 19, systemName: '其他'},
                {unitID: 130, unitName: '防火卷帘', systemID: 14, systemName: '防火分隔设施'},
                {unitID: 167, unitName: '疏散走道', systemID: 19, systemName: '其他'},
                {unitID: 116, unitName: '疏散指示标志灯具', systemID: 11, systemName: '应急照明和疏散指示标志'},
                {unitID: 52, unitName: '泵房', systemID: 5, systemName: '消防供水设施'},
            ];
            this.options.dvcXf_1 = [];
            this.options.rate = this.patrolOptions;
            if (this.$route.params.spotId) {
                this.num = 1;
                this.isFold = false;
            } else {
                this.num = 2;
                this.isFold = true;
            }
            this.title = this.$route.query.from ? '安装点' : '巡查点';
        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            selDvcType(item){
                this.formData.dvcType = item.value;
            },
            goSelDvc(bool){
//                if (bool) {
//                    let path = this.$route.fullPath;
//                    this.$MKOPush(path + '?sel=search');
//                } else {
//                    this.$MKOPop();
//                }
                this.onSelDvc = bool;
            },
            selDvcOnList(item){
                let key = `dvc${_key[this.formData.dvcType - 1]}_`;
                let op_0 = this.options[key + '0'];
                let op_1 = this.options[key + '1'];
                let fr = function () {
                    for (let i in op_0) {
                        if (op_0[i].unitID == item.unitID) {
                            return;
                        }
                    }
                    for (let i in op_1) {
                        if (op_1[i].unitID == item.unitID) {
                            return;
                        }
                    }
                    op_1.push(item);
                };
                fr();
                this.selDvc(item, true);
                this.goSelDvc(false);
            },
            selDvc(item, dontDel){
                let d = this.formData.dvc;
                for (let i in d) {
                    if (d[i].unitID == item.unitID) {
                        if (!dontDel) {
                            d.splice(i, 1);
                        }
                        return;
                    }
                }
                d.push(item);
            },
            selRate(item){
                this.formData.rate = item;
            },
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
            fold(){
                if (!this.valid)
                    this.isConfirm = false;

                this.isFold = !this.isFold;

                if (!this.isFold) {
                    this.formData.dvc = JSON.parse(JSON.stringify(this.parentsForm.dvc));
                    this.formData.rate = JSON.parse(JSON.stringify(this.parentsForm.rate));
                }
            },
            confirm(){
                if (!this.valid)
                    return false;
                this.$emit('save', this.formData);
                this.isConfirm = true;
                this.isFold = true;
            }
        },
        components: {
            dvcSearch
        }
    }
</script>


