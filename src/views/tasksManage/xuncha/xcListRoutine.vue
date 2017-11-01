<template>
    <div class="xc-list-wrap" ref="pageWrapper">
        <div ref="wrapper" :style="{'min-height':0+'px'}">
            <mko-double-cell :title="item.name" is-link @click="go(item)" v-for="item in list">
                <div slot="label">
                    <!--<div class="badge">长期有效</div>-->
                    <span class="label-info">{{item.fzUserNames}}</span>
                </div>
                {{item.positionCount}}
                <!--<span class="light">23</span>50-->
            </mko-double-cell>
        </div>
        <xc-handle-hint :status="1" v-if="!isLoading&&list.length==0"></xc-handle-hint>
    </div>
</template>

<script>
    import api from 'api'
    import xcHandleHint from './xcHandleHint.vue';
    import { Toast, Indicator } from 'mint-ui'
    import cloneDeep from 'lodash/cloneDeep';
    import * as types from 'store/mutation-types'
    import dailyXuncha from 'store/modules/dailyXuncha'

    let _scoTop = 0;
    export default {
        props: ['value', 'cur'],
        data() {
            return {
                enter: true,
                isLoading: false,
                list: [],
                wrapperHeight: 0,
            }
        },
        watch: {
            value(val) {
                this.enter = val;
            },
            enter(val) {
                this.$emit('input', val)
            }
        },
        computed: {},
        mounted() {
            this.wrapperHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight) - this.$refs.wrapper.getBoundingClientRect().top;
        },
        activated() {
            window.addEventListener('scroll', this.handleScroll);
            if (this.enter || JSON.parse(sessionStorage.getItem('taskInfoIsUpdate'))) {
                scrollTo(0, 0);
                this.routineList();
            } else if (this.cur == 0) {
                scrollTo(0, _scoTop);
            }
        },
        deactivated() {
            window.removeEventListener('scroll', this.handleScroll)
        },
        destroyed() {
        },
        methods: {
            routineList() {
                if (this.cur == 0)
                    Indicator.open({spinnerType: 'fading-circle'});
                this.isLoading = true;
                api.getRoutineXunchaList().then(res => {
                    if (res && res.code == 0) {
                        // reverse
                        let list = res.response.filter(item => { return item.ruleId != 0 });
                        this.list = list.reverse();
                        this.enter = false;
                        sessionStorage.setItem('taskInfoIsUpdate', false);
                        Indicator.close();
                    }
                    if (this.cur == 0)
                        Indicator.close();
                    this.isLoading = false;
                });
            },
            go(task) {
                task['type'] = 1;
                let data = {
                    taskDetail: task,
                };
                sessionStorage.setItem(`ruleData${task.ruleId}`, JSON.stringify(data));
                this.$MKOPush({
                    path: `/reviewDailyXuncha/${task.ruleId}`,
//                    query: {
//                        name: task.name,
//                        taskDetail: task
//                    }
                });
            },
            handleScroll() {
                _scoTop = document.documentElement.scrollTop || document.body.scrollTop;
            },
        },
        components: {
            xcHandleHint
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .xc-list-wrap {
        box-shadow: 0 -0.5px 0 0 @baseBorder;
        .badge {
            display: inline-block;
            width: 54px;
            height: 20px;
            border: 1px solid @baseBorder;
            border-radius: 4px;
            line-height: 20px;
            font-size: 11px;
            text-align: center;
            color: @baseText02;
            background-color: @baseBG02;
        }
        .label-info {
            line-height: 12px;
            font-size: 12px;
            color: @baseText02;
        }
        .light {
            color: @mainBlue;
        }
    }
</style>

<!--<script>-->

<!--import xcHandleHint from './xcHandleHint.vue';-->
<!--import { Toast, Indicator } from 'mint-ui'-->
<!--import cloneDeep from 'lodash/cloneDeep';-->
<!--import * as types from 'store/mutation-types'-->
<!--import dailyXuncha from 'store/modules/dailyXuncha'-->

<!--export default {-->
<!--props: ['type', 'value', 'cur'],-->
<!--data() {-->
<!--return {-->
<!--enter: true,-->
<!--scoTop: 0,-->
<!--list: [],-->
<!--//load-more-->
<!--autoFill: false,-->
<!--bottomAllLoaded: false,-->
<!--topStatus: '',-->
<!--bottomStatus: '',-->
<!--wrapperHeight: 0,-->
<!--}-->
<!--},-->
<!--watch: {-->
<!--value(val) {-->
<!--this.enter = val;-->
<!--},-->
<!--enter(val) {-->
<!--this.$emit('input', val)-->
<!--}-->
<!--},-->
<!--computed: {},-->
<!--mounted() {-->
<!--this.wrapperHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight) - this.$refs.wrapper.getBoundingClientRect().top;-->
<!--},-->
<!--activated() {-->
<!--window.addEventListener('scroll', this.handleScroll);-->

<!--if (this.enter) {-->
<!--scrollTo(0, 0);-->
<!--let fns = [this.usualList, this.tpyList];-->
<!--if (fns[this.type])-->
<!--fns[this.type]();-->
<!--} else if (this.cur == this.type) {-->
<!--scrollTo(0, this.scoTop);-->
<!--}-->
<!--},-->
<!--deactivated() {-->
<!--window.removeEventListener('scroll', this.handleScroll)-->
<!--},-->
<!--destroyed() {-->
<!--},-->
<!--methods: {-->
<!--usualList() {-->
<!--this.list = ['日常1', '日常2'];-->
<!--this.enter = false;-->
<!--},-->
<!--tpyList() {-->
<!--this.list = ['临时1'];-->
<!--this.enter = false;-->
<!--},-->
<!--loadBottom() {-->
<!--Indicator.open({spinnerType: 'fading-circle'});-->
<!--this.$refs.loadmore.onBottomLoaded();-->
<!--let tp = this.type;-->
<!--let list = [-->
<!--['日常3', '日常4'],-->
<!--['临时2']-->
<!--];-->
<!--list[tp].forEach(item => {-->
<!--this.list.push(item);-->
<!--});-->
<!--this.$nextTick(() => {-->
<!--Indicator.close();-->
<!--})-->
<!--},-->
<!--handleBottomChange(status) {-->
<!--this.bottomStatus = status;-->
<!--},-->
<!--go(id, name) {-->
<!--let task = {-->
<!--"fzUserNames": "Kevin,MKO",-->
<!--"fzUsers": "Kevin,MKO",-->
<!--"groupId": "QYWX000010",-->
<!--"name": "猫空巡查e",-->
<!--"requireDesc": "做好巡查",-->
<!--"ruleId": 1,-->
<!--"actualStartTime": '',-->
<!--"actualEndTime": '',-->
<!--"status": 1-->
<!--} //test data-->
<!--task['taskId'] = task.ruleId-->
<!--let taskData = cloneDeep(task);-->
<!--this.$store.registerModule('dailyXuncha', dailyXuncha);-->
<!--this.$store.commit(types.DAILYXUNCHA_INIT_TASK_DATA, taskData);-->
<!--this.$MKOPush(`/startDailyXuncha/${task.taskId}?name=${task.name}`);-->
<!--},-->
<!--handleScroll() {-->
<!--this.scoTop = document.documentElement.scrollTop || document.body.scrollTop;-->
<!--this.$nextTick(() => {-->
<!--let totalHeight = this.$refs['pageWrapper'].offsetHeight;-->
<!--let scrollTop = document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;-->
<!--let clientHeight = 0;-->
<!--if (document.body.clientHeight && document.documentElement.clientHeight) {-->
<!--clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;-->
<!--} else {-->
<!--clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;-->
<!--}-->
<!--let scrollBottom = totalHeight - scrollTop - clientHeight;-->
<!--this.bottomAllLoaded = scrollBottom <= 0 ? false : true;-->
<!--})-->
<!--},-->
<!--},-->
<!--components: {-->
<!--xcHandleHint-->
<!--}-->
<!--}-->
<!--</script>-->

<!--<style lang="less" rel="stylesheet/less">-->
<!--@import "../../../config.less";-->

<!--.xc-list-wrap {-->
<!--box-shadow: 0 -0.5px 0 0 @baseBorder;-->
<!--.badge {-->
<!--display: inline-block;-->
<!--width: 54px;-->
<!--height: 20px;-->
<!--border: 1px solid @baseBorder;-->
<!--border-radius: 4px;-->
<!--line-height: 20px;-->
<!--font-size: 11px;-->
<!--text-align: center;-->
<!--color: @baseText02;-->
<!--background-color: @baseBG02;-->
<!--}-->
<!--.label-info {-->
<!--line-height: 12px;-->
<!--font-size: 12px;-->
<!--color: @baseText02;-->
<!--}-->
<!--.light {-->
<!--color: @mainBlue;-->
<!--}-->
<!--}-->
<!--</style>-->
