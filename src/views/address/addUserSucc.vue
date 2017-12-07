<template>
    <div>
        <div class="placeholder-item"></div>
        <mt-header class="header-wrap" fixed title="创建账号">
            <mt-button class="header-item" icon="back" slot="left" @click="back"></mt-button>
        </mt-header>
        <div class="page-wrap add-user-succ-wrap">
            <div class="com-data-wrap">
                <mko-cell title="登录账号" :val="formData.userName" :non-text="nonText"></mko-cell>
                <mko-cell title="登录密码" :val="formData.password" :non-text="nonText"></mko-cell>
                <mko-cell title="姓名" :val="formData.employeeName" :non-text="nonText"></mko-cell>
                <mko-cell title="性别" :val="formData.gender|genderFilter" :non-text="nonText"></mko-cell>
                <mko-cell title="身份证号" :val="formData.IDNumber" non-text="未填"></mko-cell>
                <mko-cell title="电话" :val="formData.phone" :non-text="nonText"></mko-cell>
                <mko-cell title="角色" :val="formData.role|roleFilter" :non-text="nonText"></mko-cell>
                <mko-cell title="职责" :val="formData.roleRuls|roleRulsFilter" :non-text="nonText"></mko-cell>
            </div>
            <div class="footer-btn">
                <span class="icon icon-tick"></span>创建账号成功，请截图保存
            </div>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import { Indicator, Toast } from 'mint-ui'
    export default {
        data () {
            return {
                formData: {},
                nonText: '未填'
            }
        },
        watch: {},
        mounted() {
        },
        activated(){
            if (sessionStorage.getItem('addUserData'))
                this.formData = JSON.parse(sessionStorage.getItem('addUserData'));
        },
        deactivated() {
            this.formData = {};
            sessionStorage.removeItem('addUserData');
        },
        methods: {
            back() {
                this.$MKOJump('/enter/mail_list');
            },
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .add-user-succ-wrap {
        .footer-btn {
            width: 100%;
            padding: 0 14px;
            margin-top: 14px;
            height: 40px;
            line-height: 40px;
            font-size: 18px;
            text-align: center;
            color: @mainBlue;
            .icon {
                transform: scale(0.75, 0.75);
                position: relative;
                top: 5px;
                right: 2px;
            }
        }
    }
</style>

