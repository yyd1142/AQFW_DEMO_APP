<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="修改密码" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap config-pwd-wrap">
            <div class="data-wrap">
                <mko-form-cell title="原密码" v-model="formData.originPwd" holder-text="请输入原密码" type="password" edit></mko-form-cell>
                <mko-form-cell title="新密码" v-model="formData.newPwd" holder-text="请输入新密码" type="password" edit></mko-form-cell>
                <mko-form-cell title="确认密码" v-model="formData.renewPwd" holder-text="请再次输入新密码" type="password" edit>
                    <span slot="button" class="error-text abs-vertical-middle" v-if="formData.newPwd != formData.renewPwd">两次密码输入不一致</span>
                </mko-form-cell>
            </div>
        </div>

        <div class="footer-button">
            <mko-button size="large" no-radius @click="submitPwd()">提交</mko-button>
        </div>
    </div>
</template>

<script>
    import api from 'api';
    import { Toast } from 'mint-ui';
    import md5 from 'blueimp-md5'

    var isClick = false
    var formNull = false
    export default {
        data() {
            return {
                formData: {
                    originPwd: '',
                    newPwd: '',
                    renewPwd: ''
                }
            }
        },
        deactivated() {
            this.resetData();
        },
        methods: {
            submitPwd() {
                for (let key in this.formData) {
                    if (this.formData[key] == '') {
                        formNull = true
                    }
                }
                if (formNull) {
                    Toast({
                        message: '请输入密码',
                        position: 'middle',
                        duration: 1500
                    });
                    return
                }
                if (this.formData.newPwd != this.formData.renewPwd) {
                    Toast({
                        message: '两次密码输入不一致',
                        position: 'middle',
                        duration: 1500
                    });
                    return
                }
                if (isClick) return
                isClick = true
                let params = {
                    m: 'modifyPassword',
                    userName: this.$store.getters.userName,
                    // oldPassword: md5(this.formData.originPwd),
                    oldPassword: this.formData.originPwd,
                    newPassword: this.formData.newPwd
                }
                api.resetPasswrod(params).then(res => {
                    this.resetData();
                    if (res.code == 0) {
                        Toast({
                            message: '修改成功，请重新登录',
                            position: 'middle',
                            duration: 1500
                        });
                        setTimeout(() => {
                            this.$MKOJump('/login')
                        }, 1500)
                    } else {
                        Toast({
                            message: `修改失败(${res.msg})`,
                            position: 'middle',
                            duration: 1500
                        });
                    }
                })
            },
            back() {
                this.$MKOPop()
            },
            resetData() {
                isClick = false;
                formNull = false;
                this.formData = {
                    originPwd: '',
                    newPwd: '',
                    renewPwd: ''
                }
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    @import "../../config.less";

    .config-pwd-wrap {
        padding-top:10px;
        .data-wrap {
            position: relative;
            .error-text {
                right: 14px;
                font-size: 12px;
                color: @mainDanger;
            }
        }

    }

    .footer-button {
        margin: auto;
        position: absolute;
        width: 100%;
        bottom: 0;
    }
</style>
