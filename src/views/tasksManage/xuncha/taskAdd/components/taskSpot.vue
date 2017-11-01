<template>
    <div class="task-spot-wrap">
        <div v-show="!$route.query.sel">
            <mko-double-cell title="巡查点" label="选择该任务需巡查的巡查点" @click="fold">
                <div class="header-sign" slot="icon" v-show="!isConfirm">2</div>
                <div class="header-sign succ" slot="icon" v-show="isConfirm">
                    <span class="icon-tick-white-2"></span>
                </div>
            </mko-double-cell>
            <div class="fold-wrap" v-show="!isFold">
                <div class="spot-sel-btn" @click="goSelSpot(true)" v-show="!formData.length">
                    <span class="icon-plus-blue-0 abs-all-middle"></span>
                </div>
                <mko-select-box :title="`${item.jz.jzName}，${item.jzLevel.label}`" :options="options[i]" :selected="item.spot"
                                :column="2" name-key="jzPosition" value-key="positionId" @select="selSpot($event,i)"
                                v-for="(item,i) in formData">
                    <button slot="more" class="sel-btn" :style="{margin:'5px 1.4%',width:'47.2%'}" @click="goSelSpot(true)">
                        <span class="icon icon-plus-blue-1"></span>
                    </button>
                </mko-select-box>
                <mko-button plain size="large" :disabled="!valid" @click="confirm">确认</mko-button>
            </div>
        </div>
        <sel-spot @sel="selSpotOnList" :selected-form="formData" v-if="$route.query.sel"></sel-spot>
    </div>
</template>

<script>
    import selSpot from './selSpot.vue';

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
        },
        activated(){

        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            goSelSpot(bool){
                if (bool) {
                    let path = this.$route.fullPath;
                    this.$MKOPush(path + '?sel=spot');
                } else {
                    this.$MKOPop();
                }
            },
            selSpotOnList(form){
                let op = this.options;
                let f = this.formData;

                let fns = function () {

                    for (let i in f) {
                        if (f[i].jz.jzID == form.jz.jzID && f[i].jzLevel.value == form.jzLevel.value) {
                            f[i].spot = JSON.parse(JSON.stringify(form.spot));
                            op[i] = JSON.parse(JSON.stringify(form.spot));
                            return;
                        }
                    }
                    f.push(JSON.parse(JSON.stringify(form)));
                    op.push(JSON.parse(JSON.stringify(form.spot)));
                };
                fns();
            },
            selSpot(item, index){
                let s = this.formData[index].spot;
                let fns = function () {
                    for (let i in s) {
                        if (s[i].positionId == item.positionId) {
                            s.splice(i, 1);
                            return;
                        }
                    }
                    s.push(item);
                };
                fns();
            },
            validForm(){
                let f = this.formData;
                for (let i in f) {
                    if (f[i].spot.length != 0) {
                        this.valid = true;
                        return;
                    }
                }
                this.valid = false;
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
        components: {
            selSpot
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    .xc-task-add-wrap .task-spot-wrap {
        .spot-sel-btn {
            position: relative;
            margin: 14px auto 0;
            width: 92.8%;
            height: 100px;
            border-radius: 4px;
            background-color: #eee;

        }
    }
</style>

