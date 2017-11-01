<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="任务报告" left-icon="icon-back" @handleLeftClick="back"></mko-header>

        <div class="page-wrap tasks-repo-wrap">
            <mko-nav-bar>
                <mko-tab-item :activied="tabI==t.value" :label="t.text" @handleTabClick="tabFn" v-for="t in tabItems">
                    {{t.text}}
                    <div class="badge" :class="{'active':tabI==t.value}" v-if="t.value!=6">{{t.repoCount}}</div>
                </mko-tab-item>
            </mko-nav-bar>
            <mt-navbar class="navbar-wrap" v-model="taskType" fixed>
                <mt-tab-item id="2">巡查</mt-tab-item>
                <mt-tab-item id="1">值班</mt-tab-item>
            </mt-navbar>
            <repo-list :status="5" :type="2" :cur="[tabI,taskType]" v-model="enter" @reqSucc="getRepoData($event,0)" v-show="tabI==5&&taskType==2"></repo-list>
            <repo-list :status="5" :type="1" :cur="[tabI,taskType]" v-model="enter" @reqSucc="getRepoData($event,0)" v-show="tabI==5&&taskType==1"></repo-list>
            <repo-list :status="6" :type="2" :cur="[tabI,taskType]" v-model="enter" @reqSucc="getRepoData($event,1)" v-show="tabI==6&&taskType==2"></repo-list>
            <repo-list :status="6" :type="1" :cur="[tabI,taskType]" v-model="enter" @reqSucc="getRepoData($event,1)" v-show="tabI==6&&taskType==1"></repo-list>
            <repo-list :status="7" :type="2" :cur="[tabI,taskType]" v-model="enter" @reqSucc="getRepoData($event,2)" v-show="tabI==7&&taskType==2"></repo-list>
            <repo-list :status="7" :type="1" :cur="[tabI,taskType]" v-model="enter" @reqSucc="getRepoData($event,2)" v-show="tabI==7&&taskType==1"></repo-list>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import repoList from './tasksRepoList.vue'
    export default {
        data () {
            return {
                enter: true,
                tabI: 5,
                tabItems: [
                    {text: '待审核', repoCount: 0, value: 5},
                    {text: '已审核', repoCount: 0, value: 6},
                    {text: '已超期', repoCount: 0, value: 7},
                ],
                taskType: '2',
            }
        },
        watch: {},
        computed: {},
        mounted() {
        },
        activated(){
            this.setBackButton();
            if (this.enter)
                this.tabItems.forEach(item => {
                    item.repoCount = 0;
                })
        },
        deactivated() {
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
        },
        destroyed(){
        },
        methods: {
            getRepoData(count, index){
                this.tabItems[index].repoCount += count;
            },
            tabFn(label){
                for (let t of this.tabItems) {
                    if (label == t.text) {
                        this.tabI = t.value;
                        return;
                    }
                }
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
            repoList
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .tasks-repo-wrap {
        padding-bottom: 0;
        .mkotabs {
            position: fixed;
            top: @headerHeight+@headerTop;
            z-index: 24;
        }
        .mkotabs-item {
            .badge {
                position: relative;
                bottom: 2px;
                display: inline-block;
                margin-left: 4px;
                padding: 0 2px;
                min-width: 14px;
                height: 14px;
                line-height: 14px;
                border-radius: 2px;
                box-shadow: 0 0 0.5px @mainBlue;
                text-align: center;
                font-size: 10px;
                color: @mainBlue;
                background-color: rgba(51, 153, 255, 0.20);
                &.active {
                    box-shadow: 0 0 0.5px #fff;
                    background-color: fade(#fff, 20%);
                    color: #fff;
                }
            }
        }
        .navbar-wrap {
            top: @headerHeight + @headerTop + 40px;
            z-index: 24;
            background: #FFFFFF;
            box-shadow: 0 1px 0 0 @baseBorder;
            .mint-tab-item {
                padding: 10px 0;
                height: 20px;
                font-size: 14px;
                &.is-selected {
                    position: relative;
                    border-bottom: 0;
                    color: @mainBlue;
                    .mint-tab-item-label:after {
                        content: "";
                        position: absolute;
                        width: 29px;
                        bottom: 7px;
                        left: 50%;
                        transform: translate(-50%, 0);
                        -webkit-transform: translate(-50%, 0);
                        border-bottom: 2px solid @mainBlue;
                    }
                }
                .mint-tab-item-label {
                    line-height: 20px;
                }
            }
        }

    }
</style>
