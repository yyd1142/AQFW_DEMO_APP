<template>
    <div class="com-spot-info-wrap" :class="{'masking-wrap':onSelJz}">
        <div class="masking" @click.self="goSelJz(false)"></div>
        <div class="body">
            <mko-double-cell title="位置信息" :label="`完善${title}所在建筑与楼层`" @click="fold">
                <div class="header-sign" slot="icon" v-show="!isConfirm">1</div>
                <div class="header-sign succ" slot="icon" v-show="isConfirm">
                    <span class="icon-tick-white-2"></span>
                </div>
            </mko-double-cell>
            <div class="fold-wrap" v-show="!isFold">
                <!--建筑-->
                <mko-form-cell title="建筑" v-model="formData.jzName" holder-text="输入建筑名称" type="text" edit @focus="goSelJz(true)">
                    <div slot="button" class="form-btn" @click="goSelJz(!onSelJz)">
                        <div class="icon-circle-drop fr text-middle"></div>
                    </div>
                </mko-form-cell>
                <div class="sel-list" v-show="onSelJz">
                    <mko-cell class="hint" :title="`输入「${formData.jzName}」`" @click="goSelJz(false)" v-show="formData.jzName"></mko-cell>
                    <mko-cell :title="jz.jzName" icon="icon-location" @click="selJz(jz)" v-for="jz in options"></mko-cell>
                </div>
                <!--楼层-->
                <mko-form-cell title="楼层" v-model="formData.jzLevel" holder-text="输入楼层" type="number" edit v-show="!onSelJz">
                    <div slot="button" class="form-btn">
                        <div class="icon-circle-minus fl text-middle" @click="handleJzLevel(0)"></div>
                        <div class="icon-circle-plus fl text-middle" @click="handleJzLevel(1)"></div>
                    </div>
                </mko-form-cell>
                <!--巡查点名称-->
                <mko-form-cell title="名称" v-model="formData.name" :holder-text="`输入${title}名称`" type="text" edit v-show="!onSelJz"></mko-form-cell>
                <mko-button size="large" plain :disabled="!valid" @click="confirm" v-show="!onSelJz">确认</mko-button>
            </div>
        </div>
    </div>
</template>

<script>
    import api from 'api'

    let _validKey = ['jzName', 'jzLevel', 'name'];
    export default {
        props: ['value', 'parentsForm'],
        data () {
            return {
                title: '巡查点',
                isFold: false, //折叠
                isConfirm: false, //已保存数据
                valid: false,
                onSelJz: false,
                options: [
//                    {jzId: 1, jzName: '深圳湾体育中心'},
//                    {jzId: 2, jzName: '深圳湾体育中心-体育馆'}
                ],
                formData: {
                    jzId: '',
                    jzName: '',
                    jzLevel: '',
                    name: ''
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
            'formData.jzName': {
                handler(val){
                    this.getJzList(val)
                },
                deep: true
            },
            value(val){
                this.onSelJz = val;
            },
            onSelJz(val){
                this.$emit('input', val)
            },
            $route(route){
                if (route.path == '/spot_add/dvc') {
                    this.onSelJz = route.query.sel == 'jz' ? true : false;
                }
            }
        },
        computed: {},
        mounted() {
        },
        activated(){
            this.title = this.$route.query.from ? '安装点' : '巡查点';
            this.getJzList();
        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            getJzList(val){
                let pas = {
                    groupId: this.$store.getters.groupId
                };
                if (val) {
                    pas.jzName = val;
                } else {
                    pas.fetchAll = true
                }
                api.searchBuild(pas).then(res => {
                    if (res && res.code == 0) {
                        this.options = res.response;
                    }
                })
            },
            goSelJz(bool){
                if (bool) {
                    this.$MKOPush('/spot_add/dvc?sel=jz')
                } else {
                    this.$MKOPop();
                }
            },
            selJz(jz){
                this.formData.jzId = jz.jzID;
                this.formData.jzName = jz.jzName;
                this.goSelJz(false);
            },
            handleJzLevel(bool){
                if (bool) {
                    this.formData.jzLevel++;
                } else {
                    this.formData.jzLevel--;
                }
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
                if (this.onSelJz)
                    return;

                if (!this.valid)
                    this.isConfirm = false;

                this.isFold = !this.isFold;
                if (!this.isFold) {
                    let f = this.formData;
                    let p_f = this.parentsForm;
                    for (let key in f) {
                        f[key] = p_f[key] || '';
                    }
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
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../../config.less";

    .xc-spot-add-dvc-wrap .com-spot-info-wrap {
        .sel-list {
            max-height: 300px;
            overflow: scroll;
            .mko-basic-cell {
                padding-left: 26px;
                background-color: @baseBG02;
                .title {
                    font-size: 14px;
                }
                &.hint {
                    .title {
                        color: @mainBlue;
                    }
                }
                .title-icon {
                    margin-right: 24px;
                }
            }
        }
    }
</style>
