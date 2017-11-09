<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="创建账号" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap add-user-wrap">

            <mko-form-cell title="登录账号" v-model="formData.userName" type="text" edit required></mko-form-cell>
            <mko-form-cell title="登录密码" edit required>
                <input class="ipt" type="text" placeholder="密码必须大约6位小于20位"
                       @keyup="formData.password = formData.password.replace(/[^\w./]/ig, '')"
                       @beforepaste="formData.password.setData('text',formData.password.getData('text').replace(/[^\w./]/ig, ''))"
                       v-model="formData.password">
            </mko-form-cell>
            <mko-form-cell title="姓名" v-model="formData.employeeName" type="text" edit required></mko-form-cell>
            <mko-form-cell title="性别" :val="formData.gender|genderFilter" type="sel" edit required
                           @click="popupPickerShow('gender')"></mko-form-cell>
            <mko-form-cell title="身份证号" v-model="formData.IDNumber" type="text" edit required></mko-form-cell>
            <mko-form-cell title="电话" v-model="formData.phone" type="number" edit required></mko-form-cell>
            <mko-form-cell title="角色" type="sel" edit required @click="popupPickerShow('role')">
                {{formData.department | departmentFilter}}{{formData.department || formData.department === 0 ? '部门，' : ''}}{{formData.role | roleNewFilter}}
            </mko-form-cell>

            <mko-form-cell title="职责" :val="formData.roleRuls|roleRulsFilter" type="sel" edit required
                           @click="popupPickerShow('role-ruls')"></mko-form-cell>

            <div class="footer-btn">
                <mt-button class="btn" :disabled="!isValidate" size="large" @click="postData">创建账号</mt-button>
            </div>
            <!--弹出框-->
            <mko-popup-bottom :title="popupName" v-model="selPopupShow" @save="selPickerVal" @cancel="selPopupClose">
                <mt-picker :slots="genderList" @change="onGenderChange" v-show="pickerShow=='gender'"></mt-picker>
                <mt-picker :slots="roleList" value-key="text" @change="onRoleChange" v-show="pickerShow=='role'"></mt-picker>
                <!--<div class="checkbox" v-if="pickerShow=='role-ruls'">-->
                <!--<mt-button :class="{'active':history_roleRuls.join('').indexOf(key)!=-1}" :disabled="key>2"-->
                <!--@click="onRoleRulsChange(key)"-->
                <!--v-for="(item,key) in roleRulsList">{{item}}-->
                <!--</mt-button>-->
                <!--</div>-->
                <mko-select-box :column="4" :options="roleRulsList1" :selected="history_roleRuls" @select="onRoleRulsChange"
                                v-if="pickerShow=='role-ruls'"></mko-select-box>
            </mko-popup-bottom>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import conf from 'config'
    import { Indicator, Toast } from 'mint-ui'
    //  import { MkoFormCell, MkoEditCard, MkoPopupBottom } from 'mko-ui'

    let history_gender = '';
    let history_dpm = '';
    let history_role = '';
    export default {
        data () {
            return {
                holderText: '请完善信息',
                selPopupShow: false,
                pickerShow: '',
                isValidate: false,
                history_roleRuls: [],
                formData: {
                    userName: '',
                    password: '',
                    employeeName: '',
                    gender: '',
                    IDNumber: '',
                    phone: '',
                    role: '',
                    roleRuls: [],
                    status: 1 //1启用 2禁用
                },
                genderList: [{flex: 1, values: ['男', '女']}],  //1,2
                roleList: [
                    {flex: 1, values: conf.departmentList, className: 'picker-left', defaultIndex: 0},
                    {flex: 1, values: [], className: 'picker-right'}
                ],
                roleRulsList: ['管理', '值班', '巡查', '检测', '保养', '维修', '检查'], //0
                roleRulsList1: [
                    {text: '管理', value: 0},
                    {text: '值班', value: 1},
                    {text: '巡查', value: 2},
                    {text: '检测', value: 3, disabled: true},
                    {text: '保养', value: 4, disabled: true},
                    {text: '维修', value: 5, disabled: true},
                    {text: '检查', value: 6, disabled: true},
                ] //0
            }
        },
        watch: {
            selPopupShow: function (val) {
                if (!val) {
                    this.pickerShow = '';
                    document.body.style.overflow = 'auto'
                } else {
                    document.body.style.overflow = 'hidden'
                }
            },
            formData: {
                handler() {
                    this.validForm();
                },
                deep: true
            }
        },
        computed: {
            popupName(){
                let names = {
                    'gender': '性别',
                    'role': '角色',
                    'role-ruls': '职责',
                };
                return names[this.pickerShow] || ''
            },
        },
        mounted() {
        },
        activated(){
            this.onInputData();
            this.roleList[0].values = conf.departmentList;
        },
        deactivated() {
        },
        destroyed(){
            window.mkoBackButton.bInputData = false;
            document.body.style.overflow = 'auto';
        },
        methods: {
            test(){
                this.formData.password = this.formData.password.replace(/[^\w./]/ig, '');
            },
            selPopupClose(){
                this.selPopupShow = false;
            },
            popupPickerShow(picker){
                let that = this;
                let fns = {
                    'gender': function () {
                        if (that.formData.gender)
                            that.genderList[0].defaultIndex = that.formData.gender - 1;
                    },
                    'role': function () {
//                        if (that.formData.role)
//                            for (let i in that.roleList[0].values) {
//                                if (that.formData.role == that.roleList[0].values[i].value) {
//                                    that.roleList[0].defaultIndex = i;
//                                }
//                            }
                    },
                    'role-ruls': function () {
                        that.history_roleRuls = that.formData.roleRuls.join('').split('');
                    }
                };
                if (fns[picker])
                    fns[picker]();
                this.selPopupShow = true;
                this.pickerShow = picker;
            },
            selPickerVal(){
                let that = this;
                let form = this.formData;
                let Fns = {
                    'gender': function () {
                        form.gender = history_gender;
                    },
                    'role': function () {
                        form.department = history_dpm;
                        form.role = history_role;
                    },
                    'role-ruls': function () {
                        form.roleRuls = that.history_roleRuls.join('').split('');
                    }
                };
                if (Fns[this.pickerShow])
                    Fns[this.pickerShow]();
                this.selPopupShow = false;
            },
            validForm(){
                for (let key in this.formData) {
                    if (!this.formData[key] && this.formData[key] !== 0) {
                        this.isValidate = false;
                        return false;
                    }
                }
                if ((this.formData.password.length < 6) || (this.formData.password.length > 20)) {
                    this.isValidate = false;
                    return false;
                }
                this.isValidate = true;
            },
            postData(){
                let form = JSON.parse(JSON.stringify(this.formData));
                form.groupId = this.$store.getters.groupId;
                form.roleRuls = form.roleRuls.join(',');
                api.postPerson(form, {m: 'add'}).then(res => {
                    if (res && res.code == 0) {
                        Toast({
                            message: '创建账号成功！',
                            duration: 1000
                        });
                        sessionStorage.setItem('addUserData', JSON.stringify(form));
                        let that = this;
                        setTimeout(function () {
                            that.$MKOJump('/add_user_succ');
                            that.$destroy();
                        }, 1000);
                    } else if (res && res.code == 9) {
                        Toast({
                            message: '添加失败！账号名已存在，请使用其他账号名',
                            duration: 1000
                        });
                    }
                });
            },
            //当前选项
            onGenderChange(picker, vals){
                let list = this.genderList[0].values;
                for (let i = 0; i < list.length; i++) {
                    if (list[i] == vals[0])
                        history_gender = i + 1;
                }
            },
            onRoleChange(picker, vals){
                let dpm = (vals[0] || vals[0] == 0) ? vals[0].value : '';
                let role = vals[1] ? vals[1].value : '';
                if (dpm != history_dpm) {
                    history_dpm = dpm;
                    this.roleList[1].values = conf.roleList[dpm] ? conf.roleList[dpm].role : [];
                }
                history_role = role;
            },
            onRoleRulsChange(item){
                let index = this.history_roleRuls.join('').indexOf(item.value);
                if (index == -1) {
                    this.history_roleRuls.push(item.value);
                } else {
                    this.history_roleRuls.splice(index, 1)
                }
            },
            back() {
                let valid_key = ['userName', 'password', 'employeeName', 'gender', 'phone', 'role', 'roleRuls'];
                for (let key of valid_key) {
                    if (this.formData[key].length != 0) {
                        this.$MKODialog({
                            title: '真的要返回吗',
                            msg: '此页面信息将被清空',
                            cancelBtn: true
                        }).then(action => {
                            if (action === 'confirm') {
                                this.$MKOPop();
                                this.$destroy();
                            }
                        });
                        return;
                    }
                }
                this.$MKOPop();
                this.$destroy();
            },
            onInputData() {
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                window.mkoBackButton.callback = this.back;
            }
        },
        components: {
//      MkoFormCell, MkoEditCard, MkoPopupBottom
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .add-user-wrap {
        .footer-btn {
            width: 100%;
            padding: 0 10px;
            margin-top: 14px;
            .btn {
                background: @bgBlue;
                color: #fff;
                text-align: center;
                &.is-disabled {
                    opacity: 0.3;
                }
            }
        }
    }
</style>
