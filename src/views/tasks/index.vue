<template>
  <div>
    <div class="placeholder-item"></div>
    <mt-header class="header-wrap" fixed :title="title">
      <!--<mt-button class="header-item icon-wrap" slot="left" @click="$router.push('/data_count')" v-if="isAdmin">
                                    <i class="icon iconfont icon-data-count"></i>
                                  </mt-button>-->
      <mt-button class="header-item calendar-wrap" slot="right">
        <i class="calendar-icon"></i>
        <input type='date' v-model="dateTime" class="calendar-seleter" @change="onChangeDate()" />
      </mt-button>
    </mt-header>
    <div class="page-wrap admin-mission-wrap" v-if="!resError">
      <div class="header-btn-wrap"  v-if="isAdmin">
        <div class="header-btn"  v-for="(item, index) in headerBtnItems" :class="item.class" @click="tab(index)">
          {{item.text}}
        </div>
      </div>
      <date-navbar ref="DateNavbar" @sel="onChangeDateEvent"></date-navbar>
      <task-survey :task-survey="taskSurvey" :current-date="currentDate"  v-if="listType == 0"></task-survey>
      <my-task :tasks="tasks" :not-data='notData'  v-if="listType == 1"></my-task>
    </div>
    <tabs actived="tasks"></tabs>
    <res-error v-if="resError"></res-error>
  </div>
</template>

<script>
import api from 'api'
import moment from 'moment'
import { Indicator } from 'mint-ui'
import { DateNavbar, NoData, Tabs, ResError } from 'components'
import MyTask from './MyTask'
import TaskSurvey from './TaskSurvey'
import * as types from 'store/mutation-types'

export default {
  name: 'Tasks',
  data() {
    return {
      listType: 0,
      dateTime: new Date(),
      title: '我的任务',
      headerBtnItems: [{
        text: '任务概况',
        class: 'btn-actived'
      }, {
        text: '我的任务',
        class: ''
      }],
      taskSurvey: [],
      currentDate: '',
      tasks: [],
      notData: false,
      resError: false
    }
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.isAdmin;
    }
  },
  activated() {
    this.$nextTick(() => {
      if (this.isAdmin) {
        this.adminMissonList(this.dateTime);
        this.saferMissonList(this.dateTime);
      } else {
        this.title = "我的任务";
        this.saferMissonList(this.dateTime);
      }
      if (this.$route.query.listType) {
        this.listType = JSON.parse(this.$route.query.listType);
      } else {
        this.listType = this.isAdmin ? 0 : 1;
      }
      this.headerBtnItems.forEach((item) => {
        if (this.headerBtnItems.indexOf(item) == this.listType) {
          item.class = 'btn-actived'
        } else {
          item.class = ''
        }
      })
    })
  },
  methods: {
    // 任务概况
    adminMissonList(date) {
      this.currentDate = moment(date).format('YYYY-MM-DD');
      api.getTaskSurveyByGroupId({
        groupId: this.$store.getters.groupId,
        date: this.currentDate
      }).then(res => {
        Indicator.close();
        if (!res) {
          if (localStorage.getItem('taskSurvey')) {
            this.taskSurvey = JSON.parse(localStorage.getItem('taskSurvey'));
            this.resError = false;
          } else {
            this.resError = true;
          }
        } else {
          let taskSurvey = [];
          taskSurvey.push({
            name: '巡查',
            count: res.response['2'].count,
            doing: res.response['2'].doing,
            waitingConfirm: res.response['2'].waitingConfirm,
            waitingUpload: res.response['2'].waitingUpload
          });
          taskSurvey.push({
            name: '值班',
            count: res.response['1'].count,
            doing: res.response['1'].doing,
            waitingConfirm: res.response['1'].waitingConfirm,
            waitingUpload: res.response['1'].waitingUpload
          });
          taskSurvey.push({
            name: '检查',
            count: 0,
            doing: 0,
            waitingConfirm: 0,
            waitingUpload: 0
          });
          taskSurvey.push({
            name: '保养',
            count: 0,
            doing: 0,
            waitingConfirm: 0,
            waitingUpload: 0
          });
          taskSurvey.push({
            name: '维修',
            count: 0,
            doing: 0,
            waitingConfirm: 0,
            waitingUpload: 0
          });
          taskSurvey.push({
            name: '检测',
            count: 0,
            doing: 0,
            waitingConfirm: 0,
            waitingUpload: 0
          });
          this.taskSurvey = taskSurvey;
          localStorage.setItem('taskSurvey', JSON.stringify(taskSurvey));
        }
      })
    },
    // 我的任务
    saferMissonList(date) {
      if (this.$store.state.xuncha) {
        this.$store.dispatch('clearXunChaTimer');
        this.$store.unregisterModule('xuncha');
      }
      if (this.$store.state.zhiban) {
        this.$store.dispatch('clearZhiBanTimer');
        this.$store.unregisterModule('zhiban');
      }
      api.getMyTask({
        date: moment(date).format("YYYY-MM-DD")
      }).then(res => {
        let taskData = [];
        Indicator.close();
        if (!res) {
          if (localStorage.getItem('CacheTasks')) {
            taskData = JSON.parse(localStorage.getItem('CacheTasks'));
            this.resError = false;
          } else {
            this.resError = true;
            taskData = [];
          }
        }else {
          if (res.code == 0){
            localStorage.setItem('CacheTasks', JSON.stringify(res.response));
            taskData = res.response;
          }
        }
        this.initTaskData(taskData);
      });
    },
    onChangeDateEvent(date) {
      this.dateTime = date;
      Indicator.open({
        spinnerType: 'fading-circle'
      });
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.listType == 0) {
            this.adminMissonList(date)
          } else {
            this.saferMissonList(date)
          }
        }, 1000);
      });
    },
    onChangeDate() {
      Indicator.open({
        spinnerType: 'fading-circle'
      });
      if (this.dateTime == '' || this.dateTime == null) {
        this.dateTime = new Date();
      }
      this.$nextTick(() => {
        this.$refs.DateNavbar.selDate(new Date(this.dateTime));
        // setTimeout(() => {
        //   if (this.listType == 0) {
        //     this.adminMissonList(this.dateTime)
        //   } else {
        //     this.saferMissonList(this.dateTime)
        //   }
        // }, 1000);
      })
    },
    tab(index) {
      this.$store.commit(types.APPSTATE_CHANGE_LAST_TABINDEX, index);
      this.headerBtnItems.forEach((item) => {
        if (index == this.headerBtnItems.indexOf(item)) {
          item.class = 'btn-actived'
        } else {
          item.class = ''
        }
      })
      if (index == 0) {
        this.adminMissonList(this.dateTime);
      } else {
        this.saferMissonList(this.dateTime);
      }
      this.listType = index;
    },
    openCalendarView() {
      this.$nextTick(() => {
        this.$refs.calendar.popupVisible = this.$refs.calendar.popupVisible ? false : true;
      })
    },
    initTaskData(tasks) {
      let xunchaTasks = [];
      let zhibanTasks = [];
      for (let task of tasks) {
        if (task.taskType == 2) {
          xunchaTasks.push(task);
        } else if (task.taskType == 1) {
          zhibanTasks.push(task);
        }
      }
      let tmpTasks = [];
      if (xunchaTasks.length > 0) {
        tmpTasks.push({
          name: '巡查任务',
          tasks: xunchaTasks
        })
      }

      if (zhibanTasks.length > 0) {
        tmpTasks.push({
          name: '值班任务',
          tasks: zhibanTasks
        })
      }
      if (tmpTasks.length <= 0) {
        this.notData = true;
        this.tasks = [];
      } else {
        this.notData = false;
        this.tasks = tmpTasks;
      }
    }
  },
  components: {
    NoData,
    DateNavbar,
    MyTask,
    TaskSurvey,
    Tabs,
    ResError
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../config.less";
.admin-mission-wrap {
  margin: 40px + @headerTop 0 0 0;
  padding: 0 0 50px 0;
  .header-btn-wrap {
    position: fixed;
    top: 5px + @headerTop;
    left: 50%;
    transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
    z-index: 100;
    width: 204px;
    font-size: 0;
    .header-btn {
      display: inline-block;
      /*width: 102px;*/
      height: 29px;
      padding: 4px 21px 4px 22px;
      border: 1px solid #fff;
      font-size: 14px;
      color: #fff;
      background: @mainBlue;
      letter-spacing: 0;
      &.btn-actived {
        background: #fff;
        color: @mainBlue;
      }
      &:first-child {
        border-top-left-radius: @radiusM;
        border-bottom-left-radius: @radiusM;
      }
      &:last-child {
        border-left: 0;
        border-top-right-radius: @radiusM;
        border-bottom-right-radius: @radiusM;
      }
    }
  }
}

.icon-wrap {
  .icon-data-count {
    display: block;
    width: 22px;
    height: 22px;
    background: url('/static/icons/resource.png') -132px -174px no-repeat;
    background-size: 892px auto;
  }
}

.calendar-wrap {
  margin: 0;
  position: relative;
  .calendar-seleter {
    background-color: rgba(44, 171, 255, 0);
    border-style: none;
    height: 40px;
    color: rgba(44, 171, 255, 0);
    width: 24px;
    margin: 0 0 0 0;
  }
  .calendar-icon {
    background: url('/static/icons/resource.png') -110px -173.5px no-repeat;
    background-size: @bg-size;
    width: 22px;
    height: 22px;
    position: absolute;
    top: 9px;
    z-index: -1;
  }
}
</style>
