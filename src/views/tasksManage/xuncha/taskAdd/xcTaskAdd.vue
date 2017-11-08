<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="title" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap xc-task-add-wrap" ref="wrapper" :style="{ height: wrapperHeight + 'px'}">
            <task-type ref="task-type" @save="getTaskType"></task-type>
            <task-info ref="task-info" @save="getTaskInfo"></task-info>
            <task-spot ref="task-spot" @save="getTaskSpot"></task-spot>
            <task-person ref="task-person" @save="getTaskPerson"></task-person>
            <mko-button size="large" @click="send" v-show="isConfirm">保存</mko-button>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import moment from 'moment'
    import { Indicator, Toast } from 'mint-ui'
    import taskType from './components/taskType.vue';
    import taskInfo from './components/taskInfo.vue';
    import taskSpot from './components/taskSpot.vue';
    import taskPerson from './components/taskPerson.vue';
    export default {
        data () {
            return {
                title: '新建巡查',
                wrapperHeight: 0,
                formData: {},
                confirm: [false, false, false, false],
                isConfirm: false
            }
        },
        watch: {},
        computed: {},
        mounted() {
            this.wrapperHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight) - this.$refs.wrapper.getBoundingClientRect().top;
        },
        activated(){
            this.title = this.$route.params.type == 'routine' ? '新建日常巡查' : '新建临时巡查'
        },
        deactivated() {
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
        },
        destroyed(){
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
        },
        methods: {
            getTaskType(obj) {
                this.formData.dep = obj[0].value;
                this.confirm[0] = true;
                this.watchConfirm();
                this.$refs['task-info'].isFold = false;
            },
            getTaskInfo(obj){
                for (let key in obj) {
                    this.formData[key] = obj[key];
                }
                this.confirm[1] = true;
                this.watchConfirm();
                this.$refs['task-spot'].isFold = false;
            },
            getTaskSpot(obj){
                this.formData.spot = obj;
                this.confirm[2] = true;
                this.watchConfirm();
                this.$refs['task-person'].isFold = false;
            },
            getTaskPerson(obj){
                this.formData.person = obj;
                this.confirm[3] = true;
                this.watchConfirm();
                this.$refs['task-person'].isFold = false;
            },
            watchConfirm(){
                for (let bool of this.confirm) {
                    if (!bool)
                        return;
                }
                this.isConfirm = true;
            },
            send(){
                Indicator.open({spinnerType: 'fading-circle'});
                let f = this.formData;
                let users = [];
                let userNames = [];
                f.person.forEach(p => {
                    users.push(p.userName);
                    userNames.push(p.employeeName);
                });
                if (this.$route.params.type == 'routine') {
                    let pos = [];
                    f.spot.forEach(jz => {
                        jz.spot.forEach(s => {
                            pos.push(s.positionId);
                        })
                    });
                    let pas = {
                        name: f.name,
                        requireDesc: f.desc,
                        users: users.join(','), //用户名
                        userNames: userNames.join(','), //名字
                        positions: pos
                    };
                    api.addRoutineXuncha(pas).then(res => {
                        if (res && res.code == 0) {
                            Indicator.close();
                            this.sendSucc();
                        } else {
                            Indicator.close();
                        }
                    });
                } else {
                    let pos = [];
                    f.spot.forEach(jz => {
                        jz.spot.forEach(s => {
                            pos.push({
                                name: s.name,
                                value: s.value,
                                positionId: s.positionId
                            });
                        })
                    });
                    let pas = {
                        taskType: 2,
                        groupId: this.$store.getters.groupId,
                        description: f.name,
                        taskDescribe: f.desc,
                        endDate: moment(f.limitData).format("YYYY-MM-DD"),
                        executor: users.join(','),
                        executorName: userNames.join(','),
                        positions: pos
                    };
                    api.addTemporaryXuncha(pas).then(res => {
                        if (res && res.code == 0) {
                            Indicator.close();
                            this.sendSucc();
                        } else {
                            Indicator.close();
                        }
                    })
                }

            },
            sendSucc(){
                this.$MKODialog({
                    title: '保存成功',
                    msg: `<div class="text-center">你已成功创建巡查任务，是否继续创建？</div>`,
                    cancelBtn: true,
                    cancelText: '完成',
                    confirmText: '继续创建',
                }).then(msg => {
                    if (msg == 'confirm') {
                        let path = this.$route.fullPath;
                        this.$MKOPop();
                        this.$nextTick(() => {
                            this.$MKOPush(path);
                        });
                    } else {
                        this.$MKOPop();
                    }
                    sessionStorage.setItem('taskInfoIsUpdate', true);
                    this.$destroy();
                })
            },
            setBackButton() {
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                if (window.mkoBackButton.bInputData) {
                    window.mkoBackButton.callback = this.back;
                }
            },
            back(){
                this.$MKODialog({
                    title: '确定返回吗？',
                    msg: '<div class="text-center">当前编辑的信息不保存，是否确定返回？</div>',
                    cancelBtn: true,
                    cancelText: '取消',
                    confirmText: '确定',
                }).then(msg => {
                    if (msg == 'confirm') {
                        this.$MKOPop();
                        this.$destroy();
                    }
                })
            }
        },
        components: {
            taskInfo, taskSpot, taskPerson, taskType
        }
    }
</script>

<style lang="less" rel="stylesheet/less" src="./index.less"></style>

