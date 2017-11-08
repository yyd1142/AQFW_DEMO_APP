<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="title" left-icon="icon-back" @handleLeftClick="back" right-icon="icon-delete"
                    @handleRightClick="remove"></mko-header>
        <div class="page-wrap xc-task-edit-wrap" ref="wrapper" :style="{ height: wrapperHeight + 'px'}">
            <div class="module-wrap">
                <mko-form-cell title="巡查任务名" v-model="formData.name" type="text" edit></mko-form-cell>
                <mko-form-cell title="行业类型" :val="depFilter[formData.dep] || '选择'"
                               type="sel" edit @click="popupPickerShow('dep')"></mko-form-cell>
                <mko-form-cell title="执行人员" :val="personFr(formData.person)"
                               type="sel" edit @click="popupPickerShow('person')"></mko-form-cell>
            </div>
            <!--<div class="no-data-hint text-center base-text-02" v-if="formData.spot.length==0">未添加巡查点</div>-->

            <div class="module-wrap mof-clear">
                <div class="spot-sel-btn" @click="goSelSpot(true)" v-show="formData.spot.length==0">
                    <span class="icon-plus-blue-0 abs-all-middle"></span>
                </div>
                <mko-select-box :title="`${item.jzName}，${item.level}`" :options="options_spot[i]" :selected="item.pos"
                                :column="2" name-key="name" value-key="positionId" @select="selSpot($event,i)"
                                v-for="(item,i) in formData.spot">
                    <button slot="more" class="sel-btn" :style="{margin:'5px 1.4%',width:'47.2%'}"
                            @click="goSelSpot(true)">
                        <span class="icon icon-plus-blue-1"></span>
                    </button>
                </mko-select-box>
            </div>
            <div class="module-wrap">
                <mko-textarea v-model="formData.desc" :limit-count="50" placeholder="请填写任务描述"></mko-textarea>
            </div>
            <mko-button size="large" @click="send" :disabled="!valid">保存</mko-button>

            <!--选项-->
            <sel-spot @sel="selSpotOnList" :selected-form="formData" v-if="$route.query.sel"></sel-spot>
            <mko-popup-bottom :title="popupName" v-model="selPopupShow" @save="selPickerVal"
                              @cancel="selPopupShow=false">
                <mko-select-box :selected="history_person" :options="options_person"
                                name-key="employeeName" value-key="userName" @select="onPersonChange"
                                v-if="pickerWrapperName === 'person'"></mko-select-box>
                <mko-select-box :column="4" :options="depOptions" name-key="name" value-key="value" :selected="depDatas"
                                @select="onDepChange"
                                v-if="pickerWrapperName === 'dep'"></mko-select-box>
            </mko-popup-bottom>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import moment from 'moment'
    import {Indicator, Toast} from 'mint-ui'
    import selSpot from './components/selSpot.vue';
    //    import taskInfo from './components/_taskInfo.vue';
    //    import taskSpot from './components/_taskSpot.vue';
    //    import taskPerson from './components/_taskPerson.vue';

    let valid_key = ['desc', 'name', 'person', 'spot'];
    var Promise = require("bluebird");
    export default {
        data() {
            return {
                title: '编辑日常巡查',
                wrapperHeight: 0,
                valid: false,
                formData: {
                    name: '',
                    desc: '',
                    person: [],
                    spot: [],
                },
                options_spot: [],
                options_person: [],
                history_person: [],
                selPopupShow: false,
                pickerShow: '',
                ruleId: '',
                depOptions: [{
                    name: '消防', value: 1
                }, {
                    name: '安监', value: 2
                }, {
                    name: '其他', value: 0
                }],
                depDatas: [],
                depFilter: ['其他', '消防', '安监'],
                popupName: '',
                pickerWrapperName: ''
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
//            ruleId() {
//                return sessionStorage.getItem('lastRuleId') ? sessionStorage.getItem('lastRuleId') : null;
//            },
//            positionIds() {
//                return this.$route.query ? this.$route.query.positionIds : [];
//            }
        },
        mounted() {
            this.wrapperHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight) - this.$refs.wrapper.getBoundingClientRect().top;
        },
        activated() {
            this.ruleId = sessionStorage.getItem('lastRuleId') ? sessionStorage.getItem('lastRuleId') : null;
            let datas = JSON.parse(sessionStorage.getItem(`ruleData${this.$route.query.id}`));
            let taskDetail = datas.taskDetail;
            let builds = datas.builds;
            if (taskDetail.fzUsers && taskDetail.fzUserNames) {
                let person = [];
                let fzUsers = taskDetail.fzUsers.split(',');
                let fzUserNames = taskDetail.fzUserNames.split(',');
                for (let [index, user] of fzUsers.entries()) {
                    person.push({
                        employeeName: fzUserNames[index],
                        userName: user
                    })
                }
                let spots = [];
                let op_spots = [];
                builds.forEach(item => {
                    item.floors.forEach(data => {
                        let pos = JSON.stringify(data.positions);
                        spots.push({
                            jzId: data.jzId,
                            jzName: data.jzName,
                            level: data.level,
                            pos: JSON.parse(pos)
                        });
                        op_spots.push(JSON.parse(pos));
                    })
                });
                let form_data = {
                    name: taskDetail.name,
                    desc: taskDetail.requireDesc,
                    person: person,
                    spot: spots
                };
                this.formData = form_data;
                this.options_spot = op_spots;
            }
            this.getPersonList()
            // this.initTaskSpotByPositionId()
        },
        deactivated() {
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
            sessionStorage.removeItem('lastRuleId')
        },
        destroyed() {
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
        },
        methods: {
            personFr(vals){
                let _p = [];
                vals.forEach(item => {
                    _p.push(item.employeeName);
                });
                return _p.join(',')
            },
            getPersonList(){
                let params = {
                    m: 'rwList',
                    roleRuls: 2,
                    groupId: this.$store.getters.groupId
                };
                api.getEmployeeList(params).then(res => {
                    if (res && res.code == 0) {
                        this.options_person = res.response;
                    }
                })
            },
            popupPickerShow(picker){
                let that = this;
                if (picker == 'person') {
                    let fns = {
                        'person': function () {
                            that.history_person = JSON.parse(JSON.stringify(that.formData.person));
                        },

                    };
                    if (fns[picker])
                        fns[picker]();
                    this.popupName = '执行人员';
                } else if (picker == 'dep') {
                    this.popupName = '行业类型';
                }
                this.selPopupShow = true;
                this.pickerShow = picker;
                this.pickerWrapperName = picker;
            },
            onPersonChange(item){
                let p = this.history_person;
                for (let i in p) {
                    if (p[i].userName == item.userName) {
                        p.splice(i, 1);
                        return;
                    }
                }
                p.push(item);
            },
            selPickerVal(){
                let that = this;
                let f = this.formData;
                if (this.pickerWrapperName == 'person') {
                    let fns = {
                        'person': function () {
                            f.person = JSON.parse(JSON.stringify(that.history_person));
                        },
                    };
                    if (fns[this.pickerShow])
                        fns[this.pickerShow]();
                } else if (this.pickerWrapperName === 'dep') {
                    this.formData.dep = this.depDatas[0].value;
                }
                this.selPopupShow = false;
            },
            goSelSpot(bool){
                if (bool) {
                    let path = this.$route.fullPath;
                    this.$MKOPush(path + '&sel=spot');
                } else {
                    this.$MKOPop();
                }
            },
            selSpotOnList(form){
                let op = this.options_spot;
                let f = this.formData.spot;
                let data = {
                    jzId: form.jz.jzID,
                    jzName: form.jz.jzName,
                    level: form.level.value,
                    pos: []

                };
                form.spot.forEach(item => {
                    data.pos.push({
                        name: item.jzPosition,
                        positionId: item.positionId,
                    })
                });
                let fns = function () {
                    for (let i in f) {
                        if (f[i].jzId == data.jzId && f[i].level == data.level) {
                            f[i].pos = JSON.parse(JSON.stringify(data.pos));
                            op[i] = JSON.parse(JSON.stringify(data.pos));
                            return;
                        }
                    }
                    f.push(JSON.parse(JSON.stringify(data)));
                    op.push(JSON.parse(JSON.stringify(data.pos)));
                };
                fns();
            },
            selSpot(item, index){
                let s = this.formData.spot[index].pos;
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
                for (let item of valid_key) {
                    if (f[item] && f[item].length <= 0) {
                        this.valid = false;
                        return;
                    }
                }
                if (f.desc.length > 50) {
                    this.valid = false;
                    return;
                }
                this.valid = true;
            },
            send() {
                Indicator.open({spinnerType: 'fading-circle'});
                let f = this.formData;
                let users = [];
                let userNames = [];
                f.person.forEach(p => {
                    users.push(p.userName);
                    userNames.push(p.employeeName);
                });
                let pos = [];
                f.spot.forEach(item => {
                    item.pos.forEach(s => {
                        pos.push(parseInt(s.positionId));
                    })
                });
                let pas = {
                    name: f.name,
                    requireDesc: f.desc,
                    users: users.join(','), //用户名
                    userNames: userNames.join(','), //名字
                    positions: pos

                };
                api.editRoutineXuncha(pas, {
                    ruleId: this.ruleId || this.$route.query.id
                }).then(res => {
                    if (res && res.code == 0) {
                        Indicator.close();
                        this.sendSucc(f, users, userNames);
                    } else {
                        Indicator.close();
                    }
                });

            },
            sendSucc(f, users, userNames) {
                this.$MKODialog({
                    title: '提示',
                    msg: `<div class="text-center">编辑成功，新增的巡查点将在第二天零点生效，目前看不到新增的巡查点数据。</div>`
                }).then(msg => {
                    if (msg == 'confirm') {
                        let datas = JSON.parse(sessionStorage.getItem(`ruleData${this.ruleId}`));
                        let data = datas.taskDetail;
                        data.name = f.name;
                        data.fzUserNames = userNames.join(',');
                        data.fzUsers = users.join(',');
                        data.requireDesc = f.desc;
                        sessionStorage.setItem(`ruleData${this.ruleId}`, JSON.stringify(datas));
                        sessionStorage.setItem('taskInfoIsUpdate', true);
                        this.$MKOPop();
                    }
                })
            },
            setBackButton() {
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                if (window.mkoBackButton.bInputData) {
                    window.mkoBackButton.callback = this.back;
                }
            },
            back() {
                this.$MKOPop();
            },
            remove() {
                this.$MKODialog({
                    title: '提示',
                    msg: '<div class="text-center">确定删除该日常巡查任务吗？</div>',
                    cancelBtn: true,
                    cancelText: '取消',
                    confirmText: '确定',
                }).then(msg => {
                    if (msg == 'confirm') {
                        api.removeRoutineXuncha({
                            ruleId: this.ruleId
                        }).then(result => {
                            if (!result) return false;
                            if (result.code == 0) {
                                Toast({message: '删除成功', duration: 2000});
                                sessionStorage.setItem('taskInfoIsUpdate', true);
                                this.$MKOPop(2);
                                sessionStorage.removeItem(`ruleData${this.ruleId}`);
                            } else {
                                Toast({message: '删除失败', duration: 2000})
                            }
                        })
                    }
                })
            },
            initTaskSpotByPositionId() {
                let spot = []
                let fetchAll = []
                let self = this
                for (let id of this.positionIds) {
                    let request = api.getPointDetail({
                        m: 'pointDetail',
                        id: id
                    })
                    fetchAll.push(request);
                }
                Promise.props(fetchAll).then(positions => {
                    for (let key in positions) {
                        spot.push(positions[key].response)
                    }

                })
            },
            onDepChange(item) {
                this.depDatas = [];
                this.depDatas.push(item);
            }
        },
        components: {
            selSpot
//            taskInfo, taskSpot, taskPerson
        }
    }
</script>

<style lang="less" rel="stylesheet/less" src="./index.less"></style>


