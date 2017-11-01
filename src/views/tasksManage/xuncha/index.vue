<template>
    <div>
        <div class="placeholder-item" id="placeholder"></div>
        <mko-header title="巡查管理" left-icon="icon-back" @handleLeftClick="back" right-icon="icon-add" @handleRightClick="handleAddButton"></mko-header>

        <div class="page-wrap xc-manage-wrap" id="pageWrapper">
            <div v-show="xcSpotCount!=0||isLoading">
                <mko-dropdowns ref="dropdowns" :actions="actions"></mko-dropdowns>
                <mko-info-bar is-link title="全部巡查点" :val="xcSpotCount" @click="go('/xc_spot_list')"></mko-info-bar>
                <mko-nav-bar>
                    <mko-tab-item :label="item" :activied="tabI==i" @handleTabClick="tab"
                                  v-for="(item,i) in tabItems"></mko-tab-item>
                </mko-nav-bar>
                <xc-list-routine v-model="enter" :cur="tabI" v-show="tabI==0"></xc-list-routine>
                <xc-list-temporary v-model="enter" :cur="tabI" v-show="tabI==1"></xc-list-temporary>
            </div>
            <xc-handle-hint status="0" v-show="xcSpotCount==0&&!isLoading"></xc-handle-hint>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import { Indicator, Toast } from 'mint-ui'
    import xcListRoutine from './xcListRoutine.vue';
    import xcListTemporary from './xcListTemporary.vue';
    import xcHandleHint from './xcHandleHint.vue';

    export default {
        data () {
            return {
                enter: true,
                tabI: 0,
                tabItems: ['日常巡查', '临时巡查'],
                actions: [
                    {name: '日常巡查', icon: 'icon-routine-xc-task', method: this.addXc(0)},
                    {name: '临时巡查', icon: 'icon-tpy-xc-task', method: this.addXc(1)}
                ],
                xcSpotCount: 1,
                isLoading: false,
            }
        },
        watch: {},
        computed: {},
        mounted() {
        },
        activated(){
            this.setBackButton();
            this.getXcSpotList();
        },
        deactivated() {
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
        },
        destroyed(){
        },
        methods: {
            getXcSpotList(){
                this.isLoading = true;

                api.getXunchaSpotList().then(res => {
                    if (res && res.code == 0) {
                        let c = 0;
                        res.response.forEach(item => {
                            c += item.positions.length;
                        })
                        this.xcSpotCount = c;
                        this.isLoading = false;
                    } else {
                        this.isLoading = false;
                    }
                })
            },
            tab(text){
                for (let i in this.tabItems) {
                    if (text == this.tabItems[i]) {
                        this.tabI = i;
                        return;
                    }
                }
            },
            addXc(i){
                let that = this;
                let fns = [
                    function () {
                        that.$MKOPush('/xc_task_add/routine')
                        that.$refs.dropdowns.open = false;
                    },
                    function () {
                        that.$MKOPush('/xc_task_add/temporary')
                        that.$refs.dropdowns.open = false;
                    }
                ];
                return fns[i];
            },
            handleAddButton(){
                if (this.isLoading)
                    return;

                if (this.xcSpotCount) {
                    this.$refs.dropdowns.open = true;
                } else {
                    this.go('/spot_add');
                }
            },
            go(path){
                this.$MKOPush(path);
            },

            setBackButton() {
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                if (window.mkoBackButton.bInputData) {
                    window.mkoBackButton.callback = this.back;
                }
            },
            back(){
                this.enter = true;
                this.$MKOPop();
            }
        },
        components: {
            xcListRoutine, xcListTemporary, xcHandleHint
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .xc-manage-wrap {
        padding-bottom: 0;
    }
</style>
