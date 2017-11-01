<template>
  <div>
    <div class="placeholder-item"></div>
    <mko-header title="修改密码" left-icon="icon-back" @handleLeftClick="back"></mko-header>
    <div class="page-wrap config-pwd-wrap">
      <form>
        <mt-field v-model="formData.originPwd" label="原密码" placeholder="请输入原密码" type="password"></mt-field>
        <mt-field v-model="formData.newPwd" label="新密码" placeholder="请输入新密码" type="password"></mt-field>
        <mt-field v-model="formData.renewPwd" label="确认密码" placeholder="请再次输入新密码" type="password">
          <span class="error-text" v-if="formData.newPwd != formData.renewPwd">两次密码输入不一致</span>
        </mt-field>
      </form>
    </div>
    <mt-button class="submit btn" size="large" @click="submitPwd()">提交</mt-button>
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
  .mint-cell {
    height: 44px;
    &.error {
      .mint-cell-value {
        &>input {
          color: @redColor;
        }
      }
    }
    .mint-cell-wrapper {
      padding: 0 14px;
      .mint-cell-title {
        width: 97px;
        font-size: 14px;
      }
      .mint-cell-value {
        font-size: 14px;
        color: #d2d2d2;
        .mint-field-other {
          top: 16px;
          right: 35px;
          color: @redColor;
        }
      }
    }
  }
}

.submit {
  background-color: #299fff;
  color: #ffffff;
  margin: auto;
  position: absolute;
  bottom: 0;
}

.error-text {
  font-size: 12px;
  color: #f44336;
}
</style>