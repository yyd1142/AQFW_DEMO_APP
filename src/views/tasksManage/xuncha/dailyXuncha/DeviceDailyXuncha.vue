<template>
  <div class="DeviceDailyXuncha">
    <div class="placeholder-item"></div>
    <mko-header :title="$route.query.name" left-icon="icon-back" @handleLeftClick="back" @handleRightClick="history" right-icon="icon-history"></mko-header>
    <div class="page-wrap">
      <timer :status="dailXunchaTaskStatus" :used-timer="dailyXunchaUsedTimer"></timer>
      <div class="top-header-wrap" :style="{marginTop: (dailXunchaTaskStatus == 2 ? '30px' : 0)}" @click.stop="goAllTaskLogs">
        <div class="padding">
          <span>上次执行: {{lastDeviceLog ? executorNameFilter(lastDeviceLog.executorName) : '暂无数据'}} {{lastDeviceLog ? executorTimeFilter(lastDeviceLog.executorTime) : ''}}</span>
          <i class="icon icon-link-arrow"></i>
        </div>
      </div>
      <ul class="device-table-view">
        <li class="device-table-cell" v-for="item, index in deviceDatas">
          <div class="padding">
            <div class="device-item" :class="item.status == 2 ? null : 'border-bottom'">
              <div class="dingding-icon" :class="item.needInputData == 1 ? 'yellow-icon' : statusFilter(item.status)">
                <span></span>
              </div>
              <span class="title" v-text="item.content"></span>
              <span class="value" v-if="!item.show && dailXunchaTaskStatus != 3" @click.stop="changeDeviceStatus(item, index)">{{item.needInputData == 1 ? (item.dataValue ? item.dataValue : '填写数值') : '上报风险'}}</span>
              <i class="icon icon-arrow-right" @click.stop="changeDeviceStatus(item, index)" v-if="item.needInputData == 0 && !item.show && dailXunchaTaskStatus != 3"></i>
              <span class="cancel-btn" v-if="item.needInputData == 0 && item.show && dailXunchaTaskStatus != 3" @click.stop="cancelChange(item, index)">取消</span>
              <i class="icon icon-arrow-right" @click.stop="yaliInput(item, index)" v-if="item.needInputData != 0 && dailXunchaTaskStatus != 3"></i>
              <span class="device-status" :class="item.status == 2 ? 'red-font' : ''" v-if="dailXunchaTaskStatus == 3">{{deviceStatusFilter(item.status)}}</span>
            </div>
          </div>
          <div class="desc-wrap" :class="dailXunchaTaskStatus == 3 ? 'jiantou' : null" v-if="item.show">
            <div class="text">
              <textarea :id="`dailyXcInput${index}`" placeholder="填写隐患描述" :value="item.description" @input="addDescription" v-if="dailXunchaTaskStatus != 3"></textarea>
              <span class="word-number" v-if="dailXunchaTaskStatus != 3">{{wordNumber}}/140个字</span>
              <div class="desc" v-if="dailXunchaTaskStatus == 3">{{item.description}}</div>
            </div>
            <photo-box :max="8" :photo-list="item.images" :user-camera="true" :read-only="dailXunchaTaskStatus == 3 ? true : false" @removePhotoEvent="removePhoto" @addPhotoEvent="takePhoto(item, index)" @clickPhotoEvent="viewPhoto(index)"></photo-box>
          </div>
        </li>
      </ul>
      <div class="device-submit-btn" @click.stop="confirm()" v-if="dailXunchaTaskStatus != 3">
        <span>确认</span>
      </div>
    </div>
  </div>
</template>

<script>
import { PhotoBox, Timer } from 'components'
import { mapGetters } from 'vuex'
import * as types from 'store/mutation-types'
import { Toast } from 'mint-ui'
import moment from 'moment'
import api from 'api'
export default {
  data() {
    return {
      deviceDatasIndex: null,
      bInputData: false,
      wordNumber: 0,
      errorDeviceLog: false,
      deviceLogs: [],
      lastDeviceLog: {
        executorName: '',
        executorTime: ''
      }
    }
  },
  computed: {
    deviceDatas() {
      return this.$store.state.dailyXuncha ? this.$store.state.dailyXuncha.deviceDatas : [];
    },
    dailyXunchaUsedTimer() {
      return this.$store.state.dailyXuncha ? this.$store.getters.dailyXunchaUsedTimer : null;
    },
    dailXunchaTaskStatus() {
      return this.$store.state.dailyXuncha ? this.$store.state.dailyXuncha.status : 0;
    },
    fzUserNames() {
      return this.$store.state.dailyXuncha ? this.$store.state.dailyXuncha.currentTask.fzUserNames : null;
    }
  },
  activated() {
    this.$nextTick(() => {
      if (this.$route.query.isHistory) {
        this.$store.commit(types.DAILYXUNCHA_DEVICEHISTORYRESULTS, this.$route.query)
      } else {
        this.$store.dispatch('initDailyXunchaDevicesResults', this.$route.query)
      }
      if (sessionStorage.getItem(`hasInputDataValue_${this.$route.query.positionId}_${this.$route.query.deviceId}`)) {
        let inputData = JSON.parse(sessionStorage.getItem(`hasInputDataValue_${this.$route.query.positionId}_${this.$route.query.deviceId}`))
        this.$store.commit(types.DAILYXUNCHA_DEVICERESULT_ADD_DATAVALUE, {
          index: inputData.index,
          dataValue: inputData.dataValue
        })
      }
    })
    this.getLogList()
  },
  deactivated() {
    window.mkoBackButton.bInputData = false;
    sessionStorage.removeItem(`hasInputDataValue_${this.$route.query.positionId}_${this.$route.query.deviceId}`)
  },
  methods: {
    back() {
      if (this.bInputData && this.dailXunchaTaskStatus != 3) {
        this.$MKODialog({
          title: '真的要返回吗',
          msg: '<div style="text-align: center;">此页面信息将被清空</div>',
          cancelBtn: true,
          cancelText: '取消'
        }).then(msg => {
          if (msg == 'confirm') {
            this.$MKOPop()
          }
        })
      } else {
        this.$MKOPop()
      }
    },
    getLogList() {
      let pas = {
        deviceId: this.$route.query.deviceId
      }
      api.getDeviceLogList(pas).then(res => {
        if (!res) {
          this.errorDeviceLog = true;
          return false;
        }
        if (res && res.code == 0) {
          let datas = res.response;
          function sortByExecutorTime(a, b) {
            return b.executorTime - a.executorTime
          }
          datas.sort(sortByExecutorTime);
          this.deviceLogs = datas;
          this.lastDeviceLog = datas[0]
        } else {
          this.deviceLogs = []
        }
        this.errorDeviceLog = false;
      })
    },
    goAllTaskLogs() {
      if (!this.errorDeviceLog) {
        this.$MKOPush({
          name: 'DailyXunchaHistory',
          query: {
            deviceLogs: this.deviceLogs,
            patrolFrequency: this.$route.query.patrolFrequency.join('/')
          }
        })
      }
    },
    history() {
      this.$MKOPush(`/device_log_list/${this.$route.query.deviceId}?name=${this.$route.query.name}`)
    },
    statusFilter(status) {
      if (status == 1) {
        return 'green-icon'
      } else if (status == 2) {
        return 'red-icon'
      }
    },
    changeDeviceStatus(item, index) {
      this.bInputData = item.status == 2 ? false : true;
      this.$store.commit(types.DAILYXUNCHA_CHANGE_DEVICERESULT_STATUS, { item, index });
    },
    yaliInput(item, index) {
      let query = this.$route.query;
      query['deviceDatasIndex'] = index;
      this.$MKOPush({
        path: '/inputDeviceValue',
        query: query
      })
    },
    takePhoto(item, index) {
      this.bInputData = true;
      let self = this;
      let dateNow = new Date();
      let dateTime = moment(dateNow).format("YYYY年MM月DD日 HH点mm分");
      let watermark = `巡查位置: ${this.$route.query.name}\n时间: ${dateTime}\n执行人: ${this.$store.getters.employeeName}`;
      this.$takePhotoAndAddWatermark(watermark, function(photo) {
        let url = photo.url;
        self.$store.commit(types.DAILYXUNCHA_DEVICERESULT_ADD_PHOTOS, { index, url });
      })
      
      // let url = "http://resources.aqfwy.com/0e96efcff3614b9d827dac8ef8fb3e7b00000000";
      // this.$store.commit(types.DAILYXUNCHA_DEVICERESULT_ADD_PHOTOS, { index, url });
    },
    removePhoto(index) {
      let deviceDatasIndex = this.deviceDatasIndex
      this.$store.commit(types.DAILYXUNCHA_DEVICERESULT_REMOVE_PHOTOS, { deviceDatasIndex, index });
    },
    confirm() {
      let error = false
      for (let item of this.deviceDatas) {
        if (item.status == 2 && item.description == '') {
          error = true
        }
      }
      if (error) {
        Toast({ message: '请完善信息', duration: 2000 })
        return false;
      }
      if (this.$route.query.isHistory) {
        this.$store.commit(types.DAILYXUNCHA_CONFIRM_HISTORY_DEVICERESULT, this.$route.query)
      } else {
        this.$store.commit(types.DAILYXUNCHA_CONFIRM_DEVICERESULT, this.$route.query)
      }
      sessionStorage.removeItem(`hasInputDataValue_${this.$route.query.positionId}_${this.$route.query.deviceId}`)
      this.$MKOPop()
    },
    viewPhoto(index) {
      this.deviceDatasIndex = index;
    },
    addDescription(e) {
      let index = parseInt(e.target.id.slice(12));
      let description = e.target.value;
      this.wordNumber = description.length;
      if (description.length <= 140) {
        this.$store.commit(types.DAILYXUNCHA_DEVICERESULT_ADD_DESC, { index, description })
      } else {
        this.wordNumber = 140;
        Toast({ message: '最多只能输入140个字', duration: 2000 })
      }
    },
    cancelChange(item, index) {
      if (item.description == '' && item.images.length <= 0) {
        this.bInputData = false;
        this.$store.commit(types.DAILYXUNCHA_CANCEL_CHANGE_DEVICERESULT_STATUS, { item, index });
        return false;
      }
      this.$MKODialog({
        title: '确定取消上报风险吗？',
        msg: '<div style="text-align: center;">填写的信息将被清空</div>',
        cancelBtn: true,
        cancelText: '取消'
      }).then(msg => {
        if (msg == 'confirm') {
          this.bInputData = false;
          this.$store.commit(types.DAILYXUNCHA_CANCEL_CHANGE_DEVICERESULT_STATUS, { item, index });
        }
      })
    },
    deviceStatusFilter(status) {
      let text = '正常'
      if (status == 2) text = '风险';
      return text;
    },
    setBackButton() {
      let self = this;
      window.mkoBackButton = {};
      window.mkoBackButton.bInputData = true;
      window.mkoBackButton.callback = function() {
        self.$MKODialog({
          title: '真的要返回吗',
          msg: '<div style="text-align: center;">此页面信息将被清空</div>',
          cancelBtn: true,
          cancelText: '取消'
        }).then(msg => {
          if (msg == 'confirm') {
            window.mkoBackButton.bInputData = false;
            self.$MKOPop()
          }
        })
      }
    },
    executorTimeFilter(time) {
      if (time) {
        return moment(time).format('YYYY-MM-DD')
      } else {
        return ''
      }
    },
    executorNameFilter(name) {
      if(name.indexOf('|') < 0) return name;
      if (name) {
        return name.split('|')[1];
      } else {
        return '未知执行人'
      }
    }
  },
  components: {
    PhotoBox, Timer
  }
}
</script>

<style lang="less">
@import "../../../../config.less";
.DeviceDailyXuncha {
  .top-header-wrap {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 8px;
    height: 60px;
    background-color: #ffffff;
    .border-btm(@borderGray);
    .padding {
      width: 100%;
      height: 36px;
      background: #FFFFFF;
      border: 1px solid #DDDDDD;
      box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.05);
      border-radius: 100px;
      text-align: center;
      line-height: 30px;
      position: relative;
      span {
        font-size: 12px;
        color: #999999;
        letter-spacing: 0px;
      }
      .icon {
        position: absolute;
        right: 14px;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
  }
  .device-table-view {
    width: 100%;
    .device-table-cell {
      width: 100%;
      background-color: #f8f8f8;
      .padding {
        width: 100%;
        padding: 0 0 0 50px;
        background-color: #fff;
        .device-item {
          width: 100%;
          height: 44px;
          line-height: 44px;
          position: relative;
          &.border-bottom {
            .border-btm(@borderGray);
          }
          .dingding-icon {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            position: absolute;
            left: -36px;
            top: 0;
            bottom: 0;
            margin: AUTO;
            span {
              width: 14px;
              height: 14px;
              border-radius: 50%;
              position: absolute;
              top: 0;
              bottom: 0;
              margin: auto;
              left: 0;
              right: 0;
            }
          }
          .yellow-icon {
            background: rgba(255, 170, 68, 0.2);
            span {
              background: #FFAA44;
            }
          }
          .green-icon {
            background: rgba(85, 204, 51, 0.2);
            span {
              background: #55CC33;
            }
          }
          .red-icon {
            background: rgba(255, 102, 102, 0.2);
            span {
              background: #FF6666;
            }
          }
          .title {
            font-size: 16px;
            color: #333333;
            letter-spacing: 0px;
            line-height: 16px;
          }
          .value {
            font-size: 14px;
            color: #666666;
            letter-spacing: 0px;
            position: absolute;
            padding-right: 35px;
            right: 0;
            z-index: 20;
          }
          .icon {
            position: absolute;
            right: 14px;
            bottom: 16px;
            z-index: 20;
          }
          .cancel-btn {
            font-size: 14px;
            color: #3399FF;
            letter-spacing: 0px;
            position: absolute;
            z-index: 22;
            right: 14px;
            width: 40px;
            text-align: right;
          }
          .device-status {
            font-size: 14px;
            color: #666666;
            letter-spacing: 0px;
            position: ABSOLUTE;
            right: 14px;
            &.red-font {
              color: #FF6666;
            }
          }
        }
      }
      .desc-wrap {
        width: 100%;
        &.jiantou {
          position: relative;
          &::before {
            content: "";
            width: 18px;
            height: 18px;
            background-color: #f2f2f2;
            position: absolute;
            right: 18px;
            top: -7px;
            transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            /* IE 9 */
            -moz-transform: rotate(45deg);
            /* Firefox */
            -webkit-transform: rotate(45deg);
            /* Safari 和 Chrome */
            -o-transform: rotate(45deg);
          }
        }
        .text {
          width: 100%;
          padding: 14px 14px 0 14px;
          position: relative;
          height: 94px;
          textarea {
            width: 100%;
            height: 80px;
            background: #F2F2F2;
            border: 1px solid #EEEEEE;
            border-radius: 4px;
            padding: 8px;
            box-sizing: border-box;
          }
          .word-number {
            font-size: 12px;
            color: #999999;
            letter-spacing: 0px;
            position: absolute;
            bottom: 6px;
            right: 24px;
            .red-font {
              color: #ff4949;
            }
          }
          .desc {
            opacity: 0.72;
            background: #FFFFFF;
            border: 1px solid #CCCCCC;
            border-radius: 4px;
            height: 80px;
            font-size: 14px;
            color: #666666;
            letter-spacing: 0px;
            line-height: 18px;
            padding: 8px
          }
        }
        .photo-wrap {
          background: none;
        }
      }
    }
  }
  .device-submit-btn {
    height: 40px;
    width: 100%;
    display: table;
    padding: 0 14px;
    margin: 14px 0;
    span {
      font-size: 16px;
      color: #FFFFFF;
      letter-spacing: 0px;
      background: #3399FF;
      border-radius: 4px;
      width: 100%;
      height: 40px;
      line-height: 40px;
      vertical-align: middle;
      display: table-cell;
      text-align: center;
      box-sizing: border-box;
    }
  }
}
</style>
