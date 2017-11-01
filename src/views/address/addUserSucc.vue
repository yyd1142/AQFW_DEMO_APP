<template>
  <div>
    <div class="placeholder-item"></div>
    <mt-header class="header-wrap" fixed title="创建账号">
      <mt-button class="header-item" icon="back" slot="left" @click="back"></mt-button>
    </mt-header>
    <div class="page-wrap add-user-succ-wrap">
      <div class="com-data-wrap">
        <mt-cell title="登录账号" :value="formData.userName"></mt-cell>
        <mt-cell title="登录密码" :value="formData.password"></mt-cell>
        <mt-cell title="姓名" :value="formData.employeeName"></mt-cell>
        <mt-cell title="性别" :value="formData.gender|genderFilter"></mt-cell>
        <mt-cell title="身份证号" :value="formData.IDNumber||'暂无'"></mt-cell>
        <mt-cell title="电话" :value="formData.phone"></mt-cell>
        <mt-cell title="角色" :value="formData.role|roleFilter"></mt-cell>
        <mt-cell title="职责" :value="formData.roleRuls|roleRulsFilter"></mt-cell>
      </div>
      <div class="footer-btn">
        <div class="btn">
          <span class="icon icon-tick"></span>创建账号成功，请截图保存
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from 'api'
  import { Indicator, Toast} from 'mint-ui'
  export default {
    data () {
      return {
        formData: {},
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
      padding: 0 10px;
      margin-top: 14px;
      .btn {
        height: 40px;
        line-height:40px;
        border-radius: 2px;
        box-shadow: 0 0 1px @mainBlue;
        font-size: 18px;
        text-align: center;
        background: #f7faff;
        color: @mainBlue;
        &.is-disabled {
          opacity: 0.3;
        }
      }
      .icon {
        transform: scale(0.75, 0.75);
        position: relative;
        top: 5px;
        right: 2px;
      }
    }
  }
</style>

