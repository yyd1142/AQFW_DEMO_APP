<template>
  <div>
    <div class="placeholder-item"></div>
    <mko-header :title="title" left-icon="icon-back" left-icon-text="任务" @handleLeftClick="back"></mko-header>
    <div class="page-wrap xuncha-page-wrap" v-if="taskListSatus">
      <ul class="mission-table">
        <li class="cell"  v-for="group of groups">
          <div class="type">
            {{group | taskStatusFilter}}
          </div>
          <ul class="list">
            <li class="item"  v-for="task in taskData[group]" @click="viewTask(task)">
              <div class="content">
                <div class="title">
                  {{descriptionFilter(task.description)}}
                </div>
                <div class="desc">
                  {{task.executorName}} 开始时间 {{task.startTime | formatDate}}
                </div>
              </div>
              <div class="state">
                <mt-badge class="badge" size="small"  v-if="task.badge">{{task.badge}}</mt-badge>
                <span class="text" :class="task.status | taskStatusColorFilter">
                  {{task.status | taskStatusFilter}}
                  <i class="icon iconfont icon-xiangyoujiantou"  v-if="task.status == 5 || task.status == 6"></i>
                </span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <no-data class="not-data-wrap"  v-if="notData"></no-data>
  </div>
</template>

<script>
import api from 'api';
import { NoData } from 'components'
import { taskStatusFilter, xunchaStatusColor, taskStatusColorFilter } from 'filters';
import { Toast } from 'mint-ui';
import * as types from '../../store/mutation-types'
import xuncha from 'store/modules/xuncha'

export default {
  data() {
    return {
      taskListSatus: true,
      notData: false,
      title: '',
      groups: [],
      taskData: {}
    }
  },
  activated() {
    if (this.$store.state.xuncha) {
      this.$store.dispatch('clearXunChaTimer');
      this.$store.unregisterModule('xuncha');
    }
    this.taskListSatus = true;
    this.title = this.$route.query.title;
    this.$nextTick(() => {
      this.tasksByGroupIdAndTaskType()
    })
  },
  deactivated() {
    this.taskListSatus = false;
  },
  methods: {
    viewTask(task) {
      if (task.status == 1 || task.status == 2 || task.status == 3 || task.status == 4 || task.status == 7) {
        if (this.$store.getters.userName === task.creater) {
          this.$MKODialog({msg:'该任务还未执行，请在我的任务中执行'});
        } else {
            this.$MKODialog({msg:'不能查看未开始、执行中、已超期的任务详情'});
        }

        return;
      }
      let name = 'xuncha'
      if (task.taskType == 1)
        name = "zhiban"

      if (name == 'xuncha') {
        localStorage.setItem('lastReviewXunChaData', JSON.stringify(task));
        localStorage.setItem('lastXunChaTaskId', task.taskId);
        // this.$store.commit(types.XUNCHA_INIT_TASK_DATA, task);
      }
      if (name == 'zhiban') {
        localStorage.setItem('lastReviewZhiBanData', JSON.stringify(task));
        localStorage.setItem('lastZhiBanTaskId', task.taskId);
        // this.$store.commit(types.ZHIBAN_INIT_TASK_DATA, task);
      }
      this.$route.query['name'] = 'taskListSatus';
      this.$MKOPush({
        name: name,
        params: {
          taskId: task.taskId
        },
        query: {
          from: 'taskListSatus',
          fromQuery: this.$route.query,
          isReview: true
        }
      })
    },
    tasksByGroupIdAndTaskType() {
      let taskType = parseInt(this.$route.query.taskType);
      let currentDate = this.$route.query.date;
      api.getTasksByGroupIdAndTaskType({
        groupId: this.$store.getters.groupId,
        date: currentDate,
        taskType: taskType
      }).then(res => {
        let tasks = res.response;
        if (tasks.length <= 0) {
          this.groups = [];
          this.taskData = [];
          this.notData = true;
          return false;
        }
        let taskData = {};
        for (let taskType = 1; taskType <= 7; taskType++) {
          taskData[taskType] = [];
        }
        while (tasks.length > 0) {
          let task = tasks[0];
          task.badge = 0;
          let taskList = taskData[task.status];
          if (taskList) {
            taskList.push(task);
          }
          tasks.splice(0, 1);
        }
        let sortKey = [5, 7, 3, 2, 4, 1, 6];
        let groups = [];
        for (let s of sortKey) {
          if (taskData[s].length > 0) {
            groups.push(s);
          }
        }
        this.groups = groups;
        this.taskData = taskData;
        this.notData = false;
      })
    },
    back() {
      this.$MKOPop();
    },
    descriptionFilter(val) {
      if (val.length >= 25) {
        return `${val.substr(0, 25)}...`;
      } else {
        return val;
      }
    }
  },
  components: {
    NoData
  }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "../../config.less";
.xuncha-page-wrap {
  .mission-table {
    width: 100%;
    padding: 0;
    list-style: none;
    .cell {
      position: relative;
      .type {
        padding-left: 14px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        font-weight: @fontWeight;
        letter-spacing: 1.12px;
        background: @bgLGray;
      }
      /*.list-wrap {*/
      .list {
        background: @bgWhite;
        padding: 0;
        margin: 0;
        .item {
          // &:not(: last-child) > a {
          //   .border-btm(@borderColor);
          // }
          display: -webkit-flex;
          display: flex;
          display: box;
          display: -webkit-box;
          display: -ms-flexbox;
          box-sizing: border-box;
          min-height: 50px;
          padding: 6px 14px 6px;
          border-bottom: 1px solid @borderColor;
          position: relative;
          .content {
            flex: 1;
            -webkit-flex: 1;
            .title {
              line-height: 20px;
              font-size: 14px;
              word-break: break-all;
              padding: 0 54px 0 0;
            }
            .desc {
              line-height: 17px;
              font-size: 12px;
              color: @textGray;
            }
          }
          .state {
            -ms-flex: 0 0 100px;
            flex: 0 0 100px;
            -webkit-flex: 0 0 100px;
            width: 100px;
            margin-top: 10px;
            font-size: 12px;
            text-align: right;
            position: absolute;
            top: 0;
            right: 14px;
            bottom: 0;
            height: 30px;
            line-height: 30px;
            .badge {
              position: relative;
              bottom: 2px;
              background: @redColor;
            }
            .text {
              line-height: 17px;
              font-size: 14px;
              .icon {
                display: inline-block;
                font-size: 12px;
                font-weight: 700;
              }
            }
          }
        }
      }
      /*}*/
    }
  }
}
</style>
