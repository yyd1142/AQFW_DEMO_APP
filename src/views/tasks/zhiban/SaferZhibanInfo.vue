<template>
  <div>
    <div class="placeholder-item"></div>
    <mko-header :title="$route.query.name" left-icon="icon-back" @handleLeftClick="back"></mko-header>
    <div class="page-wrap admin-zhiban-info">
      <xun-cha-status :status-item="zhibanStatusInfo" v-if="status == 4 || status == 5 || status == 6"></xun-cha-status>
      <div class="status-wrap" :class="status > 1 && status < 7 ? 'hasDesc' : null">
        <div class="btn" :class="btnZhiBan.style" @click="startZhiBan()">
          <p class="logo" v-if="status == 5 || status == 6"></p>
          <div class="text" v-html="btnZhiBan.text"></div>
        </div>
        <div class="desc" v-if="status == 2">
          {{zhibanUsedTimer}}
        </div>
        <div class="desc" v-if="status == 5 || status == 6">
          本次值班用时{{zhibanTotalUsedTimeString}}
        </div>
      </div>
      <div class="info-wrap">
        <div class="info">
          <mt-cell title="日期" :value="currentTask.startTime | formatDate"></mt-cell>
          <mt-cell title="值班人" :value="currentTask.executorName"></mt-cell>
        </div>
        <div class="desc">
          <p class="title">任务描述</p>
          <p class="content">{{$route.query.taskDescribe || '无'}}</p>
        </div>
      </div>
      <div class="zhiban-log-notdata" v-if="zhibanRecord.length <= 0">暂无值班日志</div>
      <div class="record-wrap" v-else>
        <div class="record" v-for="(item, index) in zhibanRecord">
          <i class="sign" :class="zhibanRecord.length - 1 == index ? 'btn-red' : 'btn-primary'"></i>
          <div class="text">{{item.createTime | formatDate}}&nbsp;{{item.description}}</div>
        </div>
      </div>
      <div class="footer-wrap" v-if="status === 2">
        <mt-button class="btn bottom-btn" size="large" @click="checkHideDanger()">风险上报</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api';
import { XunChaStatus } from 'components'
import { formatDate } from 'filters';
import { mapGetters } from 'vuex'
import * as types from 'store/mutation-types'
import moment from 'moment';
var _taskId = ''
export default {
  data() {
    return {
      page: 'base',
      backItem: {
        text: ''
      },
      zhibanRecord: []
    }
  },
  mounted() {
    this.$store.dispatch('initZhiBanTimer');
    this.$nextTick(() => {
      this.zhibanTaskLogs();
      _taskId = this.currentTask.taskId;
    })
  },
  activated() {
    this.$nextTick(() => {
      this.zhibanTaskLogs();
      _taskId = this.currentTask.taskId;
    })
  },
  computed: {
    status() {
      return this.$store.state.zhiban ? this.$store.state.zhiban.status : 0;
    },
    btnZhiBan() {
      let status = this.$store.state.zhiban ? this.$store.state.zhiban.status : 0;
      if (status == 2) {
        return {
          text: '结束<br>值班',
          style: 'on'
        };
      } else if (status == 5 || status == 6) {
        return {
          style: 'end',
          text: `已完成`
        };
      } else if (status == 7) {
        return {
          text: '任务<br>超期',
          style: 'over'
        };
      } else {
        return {
          text: '开始<br>值班',
          style: 'start'
        };
      }
    },
    currentTask() {
      return this.$store.state.zhiban ? this.$store.state.zhiban.currentTask : {};
    },
    zhibanUsedTimer() {
      return this.$store.state.zhiban ? this.$store.getters.zhibanUsedTimer : null
    },
    zhibanTotalUsedTimeString() {
      return this.$store.state.zhiban ? this.$store.getters.zhibanTotalUsedTimeString : null
    },
    currentZhiBanTaskId() {
      return this.$store.state.zhiban ? this.$store.getters.currentZhiBanTaskId : null
    },
    zhibanStatusInfo() {
      return this.$store.state.zhiban ? this.$store.getters.zhibanStatusInfo : null
    }
  },
  methods: {
    startZhiBan() {
      let sta = this.status;
      if (this.status == 7) {
        this.msgBox('任务已超期!');
        return;
      }

      let dateNow = new Date();
      if (dateNow < new Date(this.$store.state.zhiban.currentTask.startTime)) {
        this.$MKODialog({msg:'任务时间还未到，不能开始!'});
        return;
      }

      if (this.status == 1) {
        this.msgBox('确定开始值班？', '', true).then(action => {
          let status = 2;
          if (action == 'confirm') {
            api.changeTaskStatusByTaskId({
              taskId: this.currentZhiBanTaskId,
              status: status
            }).then(res => {
              if (!res)
                return;
              if (res.code != 0) {
                this.$MKODialog({msg:res.msg});
                return;
              }
              this.updateZhiBanStatus(status);
            })
          }
        });
        return;
      }

      if (this.status == 2) {
        this.msgBox('要结束值班吗', '结束后完成任务', true).then(action => {
          let status = 8;
          if (action == 'confirm') {
            api.changeTaskStatusByTaskId({
              taskId: this.currentZhiBanTaskId,
              status: status
            }).then(res => {
              if (!res)
                return;
              if (res.code != 0) {
                this.$MKODialog({msg:res.msg});
                return;
              }
              this.updateZhiBanStatus(status);
            })
          }
        });
      }
    },
    calStatus() {
      let now = new Date();
      this.statusInfo = {
        style: 'over',
        text: `任务<br>超期`
      };
      this.statusInfo = {
        style: 'notYet',
        text: `未到<br>时间`
      };
    },
    msgBox(title, msg, showCancelButton) {
      return this.$MKODialog({
        title: title,
        msg: msg,
        cancelBtn: showCancelButton
      })
    },
    checkHideDanger() {
      let taskId = this.currentTask.taskId;
      if (this.currentTask.pTaskId && this.currentTask.pTaskId.length > 0) {
        taskId = this.currentTask.pTaskId;
      }
      this.$MKOPush(`/check_hideDanger/${taskId}`)
    },
    back() {
      this.$MKOPop();
    },
    // 更新值班任务状态
    updateZhiBanStatus(status) {
      if (status == 2) {
        this.statusInfo = {
          style: 'on',
          text: `结束<br>值班`
        }
        this.$store.commit(types.ZHIBAN_ACTION_START)
      } else if (status == 5) {
        this.statusInfo = {
          style: 'end',
          text: `已完成`
        }
        // this.$store.commit(types.ZHIBAN_ACTION_END);
      } else if (status == 8) {
        this.statusInfo = {
          style: 'on',
          text: `进行中`
        }
        this.$store.commit(types.ZHIBAN_ACTION_END);
        this.$MKOPop();
      }
      this.zhibanTaskLogs()
      // let data = { description: desc }
      // let params = { taskId: this.currentZhiBanTaskId }
      // api.updateZhiBanStatus(data, params).then(res => {
      //   if (!res)
      //     return;
      //   if (res.code != 0) {
      //     MessageBox.alert(res.msg);
      //     return;
      //   }
      // })
    },
    // 值班日志
    zhibanTaskLogs() {
      let taskId = this.currentTask.taskId;
      if (this.currentTask.pTaskId && this.currentTask.pTaskId.length > 0) {
        taskId = this.currentTask.pTaskId;
      }
      let params = {
        taskId: taskId
      }
      api.getZbTaskLogs(params).then(res => {
        if (!res)
          return;
        if (res.code != 0) {
          this.$MKODialog({msg:res.msg});
          return;
        }
        this.zhibanRecord = res.response;
      })
    }
  },
  components: {
    XunChaStatus
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../../config.less";

.admin-zhiban-info {
  padding-bottom: 0;
}

.status-wrap {
  position: relative;
  height: 120px;
  padding-top: 20px;
  background: #F8FBFD;
  box-shadow: @baseShadow;
  &.hasDesc {
    height: 150px;
  }
  .btn {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
    box-sizing: border-box;
    width: 80px;
    height: 80px;
    padding: 17px 21px;
    border-radius: 50%;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    display: table;
    .text {
      width: 36px;
      height: 44px;
      line-height: 22px;
      font-size: 12px;
      display: table-cell;
      vertical-align: middle;
    }
    &.over {
      background: #FFF6F3;
      border: 1px solid @redColor;
      color: @redColor;
    }
    &.notYet {
      background: @bgDisabled;
      color: #fff;
    }
    &.start {
      background: @bgBlue;
      color: #fff;
    }
    &.on {
      background: #E2F4FF;
      border: 1px solid @borderBlue;
      color: @textBlue;
    }
    &.timeup {
      background: #FFF6F3;
      border: 1px solid @redColor;
      color: @redColor;
    }
    &.end {
      background: #E2F4FF;
      border: 1px solid @borderBlue;
      color: @textBlue;
      font-size: 12px;
      .logo {
        width: 30px;
        height: 22px;
        background: url(/static/icons/resource.png) -110px -152px no-repeat;
        background-size: @bg-size;
        POSITION: ABSOLUTE;
        TOP: 15PX;
        MARGIN: AUTO;
        LEFT: 0;
        RIGHT: 0;
      }
      .text {
        position: relative;
        left: 0;
        margin-top: 3px;
        min-width: 37px;
        text-align: center;
        line-height: 17px;
        PADDING-TOP: 20PX;
      }
    }
  }
  .desc {
    position: absolute;
    bottom: 18px;
    left: 50%;
    transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
    min-width: 200px;
    line-height: 17px;
    font-size: 12px;
    text-align: center;
    color: @textBlue;
  }
}

.info-wrap {
  margin-top: 14px;
  .border-btm(@borderGray);
  font-size: 14px;
  .info {
    .mint-cell {
      min-height: 44px;
      .mint-cell-wrapper {
        padding: @cellPadding;
        font-size: 14px;
        .mint-cell-value {
          color: @textLB;
        }
      }
    }
  }
  .desc {
    padding: @cellPadding;
    line-height: 20px;
    background: #F7F7F8;
    &:after {
      display: table;
      content: "";
    }
    .title {
      margin: 0 0 2px 0;
      padding-top: 7px;
    }
    .content {
      margin: 0;
      min-height: 80px;
      color: @textGray;
    }
  }
}

.record-wrap {
  min-height: 200px;
  padding: 25px 14px 25px 31px;
  font-size: 12px;
  .record {
    position: relative;
    margin-bottom: 31px;
    &:last-child::after {
      background: none;
    }
    &::after {
      content: '';
      height: 40px;
      position: absolute;
      background-color: #dee0e2;
      width: 1px;
      left: -11px;
      margin: auto;
      top: 14px;
    }
    .sign {
      position: absolute;
      top: 4px;
      left: -16px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .text {
      vertical-align: baseline;
    }
  }
}

.footer-wrap {
  position: fixed;
  width: 100%;
  bottom: 0;
  .btn {
    background: @redColor;
    color: #fff;
  }
}

.zhiban-log-notdata {
  font-size: 14px;
  width: 100%;
  padding: 14px;
}
</style>
