<template>
    <div>
        <div class="logo-wrap">
            <i class="logo-icon"></i>
            <span>安 全 服 务 云</span>
        </div>
        <DIV class="form form-login" ref="wrapper" :style="{ height: wrapperHeight - 32 + 'px'}">
            <div class="form-group" :class="{'has-error': errors.has('用户名')}">
                <i class="icon-account-user"></i>
                <div class="xiajiantou-btn" @click="userTableShow = userTableShow ? false : true;"
                     v-if="userLocalStorages && userLocalStorages.length > 0"><i class="icon-xiajiantou"></i></div>
                <input type="text" name="用户名" class="form-control" placeholder="用户名" v-model="account.username"
                       v-validate data-vv-rules="required"/>
                <p class="help-block">{{errors.first('用户名')}}</p>
            </div>
            <div class="user-table-hidden" @click="userTableShow = false;" v-if="userTableShow"></div>
            <div class="user-table-wrap" v-if="userLocalStorages && userLocalStorages.length > 0 && userTableShow">
                <ul class="user-table-view">
                    <li class="user-table-cell" v-for="item in userLocalStorages" @click="selectedUser(item)">
                        <span v-text="item.username"></span>
                    </li>
                </ul>
            </div>

            <div class="form-group" :class="{'has-error': errors.has('password')}">
                <i class="icon-account-password"></i>
                <input type="password" class="form-control" name="password" placeholder="6-16位密码，数字或符号"
                       v-model="account.password" v-validate data-vv-rules="required"/>
                <p class="help-block">{{errors.first('密码')}}</p>
            </div>
            <div class="remenber-password" @click="remenberPassword">
                <i class="remenber-password-icon" :class="remenberClass"></i>
                <span>记住密码</span>
            </div>
            <div class="form-group">
                <button class="btn btn-primary btn-block" @click="login">登录</button>
            </div>
        </DIV>
        <!--<div class="forget-password">忘记密码</div>-->
        <div class="version">
            <span>{{version}}</span>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import md5 from 'blueimp-md5'
    import {Toast, Indicator} from 'mint-ui'
    import {mapGetters} from 'vuex'
    import * as types from '../../store/mutation-types'
    import moment from 'moment'
    var userData = {};
    export default {
        data() {
            return {
                account: {
                    username: '',
                    password: '',
                    token: ''
                },
                version: '',
                wrapperHeight: '',
                remenberClass: 'false',
                needRemenberPasswrod: false,
                userTableShow: false,
                userLocalStorages: []
            }
        },
        watch: {
            remenberClass(val) {
                this.needRemenberPasswrod = val == 'true' ? true : false;
            }
        },
        mounted() {
            this.wrapperHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight) - this.$refs.wrapper.getBoundingClientRect().top;
            this.$nextTick(() => {
                api.getVersion().then(result => {
                    if (!result) return false;
                    this.version = result.version;
                    this.$getAppVersion((appVersion) => {
                        if (!appVersion || appVersion.length == 0)
                            return;
                        this.version += '-' + appVersion;
                    })
                })
                Indicator.close()
            })
        },
        activated() {
            if (localStorage.getItem('userLocalStorages')) {
                this.userLocalStorages = JSON.parse(localStorage.getItem('userLocalStorages'))
            } else {
                this.userLocalStorages = [];
            }
        },
        methods: {
            login() {
                if (this.$route.query.appState && this.$route.query.appState == 1) {
                    Toast({
                        message: `系统维护中，预计维护完成时间${this.$route.query.time}`,
                        position: 'middle',
                        duration: 2000
                    });
                    return false;
                }
                this.$validator.validateAll()
                if (this.errors.any()) return
                Indicator.open({spinnerType: 'fading-circle'});
                api.login({
                    userName: this.account.username,
                    password: md5(this.account.password),
                    platform: 'mobile'
                }).then(result => {
                    if (!result) {
                        Indicator.close();
                        return false;
                    }
                    if (result.code != 0) {
                        Indicator.close();
                        Toast({
                            message: result.msg,
                            position: 'middle',
                            duration: 1500
                        });
                        return;
                    }
                    this.token = result.response.token;
                    localStorage.setItem('qy_token', this.token)
                    this.getUserData();
                })
            },
            getUserData() {
                api.getUserData({
                    userName: this.account.username,
                }).then(result => {
                    Indicator.close();
                    if (!result) return false
                    if (result.response == null) {
                        Toast({
                            message: `找不到用户[${this.account.username}]`,
                            position: 'middle',
                            duration: 1000
                        });
                        return false;
                    }
                    this.getUnitInfo(result)
                })
            },
            getUnitInfo(result) {
                let self = this;
                userData = result.response;
                api.getQYDWInfo({
                    m: 'info',
                    groupId: userData.groupId
                }).then(res => {
                    if (res.code === 0) {
                        if (res.response.status == 0) {
                            this.$MKODialog({
                                title: '温馨提示',
                                msg: "<div style='text-align: left;'>1. 点击“确定”激活账号<br>2. 修改登录密码<br><br>以下步骤请登录网页版操作http://61.177.139.223:20480<br>3. 核对并补充单位基本信息和建筑信息<br>4. 录入消防设施设备<br>5. 创建工作人员账号<br>6. 创建、执行、管理消防安全任务</div>",
                                cancelBtn: true
                            }).then(action => {
                                if (action === 'confirm') {
                                    this.activaDW();
                                }
                            });
                            return false;
                        }
                        userData['token'] = this.token;
                        let groupIdAndRole = `${userData.groupId}_Role_${userData.role}`;
                        let groupId = userData.groupId;
                        let userName = userData.userName;
                        let tags = [groupIdAndRole, groupId];
                        this.$registerPUSHService(tags.join(','), userName);
                        this.$store.dispatch('saveUserData', {
                            userData: userData,
                            callback: function () {
                                Toast({
                                    message: '登录成功',
                                    position: 'middle',
                                    duration: 1000
                                });
                                self.setUserLocalStorages();
                                self.$Login(userName, groupId);
                                setTimeout(() => {
                                    self.$MKOJump({
                                        path: '/enter/home'
                                    })
                                }, 1000)
                            }
                        })
                    }
                });
            },
            //激活账号
            activaDW() {
                let self = this;
                api.activaDW({m: 'activaDW'}).then(res => {
                    if (!res) return false;
                    if (res.code != 0) {
                        Toast('激活失败');
                        return false;
                    }
                    userData['token'] = this.token;
                    let groupIdAndRole = `${userData.groupId}_Role_${userData.role}`;
                    let groupId = userData.groupId;
                    let tags = [groupIdAndRole, groupId];
                    this.$registerPUSHService(tags.join(','), userData.userName);
                    this.$store.dispatch('saveUserData', {
                        userData: userData,
                        callback: function () {
                            Toast({
                                message: '激活成功',
                                position: 'middle',
                                duration: 1000
                            });
                            self.setUserLocalStorages();
                            setTimeout(() => {
                                self.$MKOJump({
                                    path: '/enter/home'
                                })
                            }, 1000)
                        }
                    })
                })
            },
            remenberPassword() {
                this.remenberClass = this.remenberClass == 'false' ? 'true' : 'false';
            },
            selectedUser(item) {
                this.account = item;
                this.userTableShow = false;
            },
            setUserLocalStorages() {
                if (!this.needRemenberPasswrod) return false;
                let needPushData = true;
                if (localStorage.getItem('userLocalStorages') && JSON.parse(localStorage.getItem('userLocalStorages'))) {
                    let userLocalStorage = JSON.parse(localStorage.getItem('userLocalStorages'));
                    userLocalStorage.forEach((item) => {
                        if (item.username == this.account.username) {
                            needPushData = false;
                            item.password = this.account.password;
                        }
                    })
                    if (needPushData) {
                        localStorage.setItem('userLocalStorages', JSON.stringify([this.account].concat(userLocalStorage)));
                    } else {
                        localStorage.setItem('userLocalStorages', JSON.stringify(userLocalStorage));
                    }
                } else {
                    localStorage.setItem('userLocalStorages', JSON.stringify([this.account]));
                }
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less" src="./login.less" scoped></style>
