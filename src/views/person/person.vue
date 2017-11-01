<template>
  <div>
    <div class="placeholder-item"></div>
    <mko-header title="我的"></mko-header>
    <div class="page-wrap person-page-wrap" v-if="!resError">
      <div ref="wrapper">
        <mt-loadmore ref="loadmore" :top-method="loadTop" @top-status-change="handleTopChange" :auto-fill="autoFill">
          <div :style="{ height: wrapperHeight - 50 + 'px'}">
            <div class="data" @click="go('/person_data')">
              <mt-cell is-link>
                <div class="avatar-wrap">
                  <div class="default"></div>
                  <!--<img class="avatar" slot="icon" src="./logo.png">-->
                </div>
                <div class="content">
                  <div class="main">{{personData.employeeName}}（{{personData.role | roleFilter}}）</div>
                  <div class="desc">{{personData.dwName}}</div>
                </div>
              </mt-cell>
            </div>
            <div class="cell-wrap">
              <div class="cell" @click="go('/message?from=my')">
                <mt-cell title="消息" is-link>
                  <span slot="icon" class="sign sign-msg"></span>
                </mt-cell>
              </div>
              <div class="cell" @click="go('/config')">
                <mt-cell title="设置" is-link>
                  <span slot="icon" class="sign sign-conf"></span>
                </mt-cell>
              </div>
            </div>
          </div>
          <!--<div slot="top" class="mint-loadmore-top">
            <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
            <span v-show="topStatus === 'loading'">
              <mt-spinner type="snake"></mt-spinner>
            </span>
          </div>-->
        </mt-loadmore>
      </div>
    </div>
    <tabs actived="my"></tabs>
    <res-error v-if="resError"></res-error>
  </div>
</template>

<style lang="less" rel="stylesheet/less">
  @import "../../config.less";

  .person-page-wrap {
    padding-bottom: 0;
    .data {
      .mint-cell-wrapper {
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        padding: @cellPadding;
        height: 80px;
        .mint-cell-title {
          -webkit-box-flex: 0.0;
          -moz-box-flex: 0.0;
          width: 0;
          -webkit-flex: none;
          -ms-flex: none;
          flex: none;
        }
        .mint-cell-value {
          .avatar-wrap {
            width: 60px;
            height: 60px;
            margin-right: 12px;
            .default {
              height: 100%;
              background: url(/static/icons/resource.png) -654px 0 no-repeat;
              background-size: 892px auto;
            }
            .avatar {
              width: 100%;
            }
          }
          .content {
            .main {
              margin-bottom: 5px;
              font-size: 14px;
              font-weight: 600;
              color: @textBase;
            }
            .desc {
              font-size: 12px;
              color: @textLB;
            }
          }
        }
      }
    }
    .cell-wrap {
      margin-top: 14px;
      .cell {
        background-color: @bgWhite;
        .mint-cell-wrapper {
          padding: @cellPadding;
          display: table;
          .mint-cell-title {
            display: table-cell;
            vertical-align: middle;
            line-height: 22px;
            font-size: 16px;
            letter-spacing: 1px;
            .sign {
              position: relative;
              bottom: 4px;
              padding: 11px;
              margin-right: 9px;
              font-size: 0;
              &.sign-msg {
                background: url(/static/icons/resource.png) -654px -60px no-repeat;
                background-size: @bg-size;
              }
              &.sign-conf {
                background: url(/static/icons/resource.png) -676px -60px no-repeat;
                background-size: @bg-size;
              }
            }
          }
        }
      }
    }
  }
</style>

<script>
  import api from 'api';
  import {roleFilter} from 'filters';
  import {Indicator} from 'mint-ui';
  import {Tabs, ResError} from 'components';
  export default {
    data() {
      return {
        //loadMore
        wrapperHeight: 0,
        autoFill: false,
        topStatus: '',
        //数据
        personData: {},
        resError: false
      }
    },
    activated() {
      this.$nextTick(() => {
        this.getLocalData();
        this.wrapperHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight) - this.$refs.wrapper.getBoundingClientRect().top;
      });
    },
    methods: {
      getLocalData() {
        let local = localStorage['USER_DATA'];
        if (local && local.length > 0) {
          try {
            this.personData = JSON.parse(local);
          } catch (err) {
            console.log(err.name + '：' + err.message);
            return;
          }
        } else {
          this.UpdateData();
        }
      },
      UpdateData() {
        api.getUserData({
          userName: this.$store.getters.userName
        }).then(res => {
          this.$refs.loadmore.onTopLoaded();
          if (!res) {
            this.resError = true;
            return;
          }
          try {
            localStorage.setItem('USER_DATA', JSON.stringify(res.response));
          } catch (err) {
            console.log(err.name + '：' + err.message);
            return;
          }
          this.personData = res.response;
        });
      },
      loadTop() {
        let timer = setTimeout(() => {
          this.UpdateData();
          clearTimeout(timer);
        }, 1000);
      },
      handleTopChange(status) {
        this.topStatus = status;
      },
      go(path) {
        if (this.topStatus != 'loading') {
          this.$MKOPush(path)
        }
      }
    },
    components: {
      Tabs,
      ResError
    }
  }
</script>
