<template>
  <div style="margin-top: 48px;">
    <mt-tab-container class="container">
      <mt-tab-container-item>
        <ul class="mission-table">
          <li class="cell"  v-for="group in tasks">
            <div class="type">
              {{group.name}}
            </div>
            <div class="list-wrap">
              <ul class="list">
                <li class="item"  v-for="task in group.tasks" @click="viewTaskDetail($event, task)">
                  <div class="content">
                    <div class="title">
                      {{task.description}}
                    </div>
                    <div class="desc">
                      开始时间：{{task.startTime | formatDate}}
                    </div>
                    <div class="state">
                      <!-- <mt-badge class="badge task-number" size="small">1</mt-badge> -->
                      <span class="text" :class="task.status | xunchaStatusColor">
                        {{task.status | taskStatusFilter}}
                        <i class="icon iconfont icon-xiangyoujiantou"></i>
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </mt-tab-container-item>
    </mt-tab-container>
    <div class="not-task-data"  v-if="notData">
      <div class="main">
        <i class="not-data-icon"></i>
        <span>暂无内容</span>
      </div>
    </div>
  </div>
</template>

<script>
import { xunchaStatusFilter, xunchaStatusColor, zhibanStatusFilter, zhibanStatusColor, formatDate } from 'filters';
import api from 'api'
import * as types from '../../store/mutation-types'
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import xuncha from 'store/modules/xuncha'
import zhiban from 'store/modules/zhiban'

export default {
  props: ['tasks', 'notData'],
  data() {
    return {
      xunchaList: []
    }
  },
  mounted() {
    if (this.$store.state.xuncha) {
      this.$store.dispatch('clearXunChaTimer');
      this.$store.unregisterModule('xuncha');
    }
    if (this.$store.state.zhiban) {
      this.$store.dispatch('clearZhiBanTimer');
      this.$store.unregisterModule('zhiban');
    }
  },
  deactivated() {
  },
  methods: {
    changeDate(val) {
      this.getMyTask(val)
    },
    goAdminPage() {
      this.$emit('sel', 1);
    },
    viewTaskDetail(e, task) {
      if (task.status == 5 || task.status == 6) {
        let name = 'xuncha'
        if (task.taskType == 1) name = "zhiban"
        if (name == 'xuncha') {
          localStorage.setItem('lastReviewXunChaData', JSON.stringify(task));
          localStorage.setItem('lastXunChaTaskId', task.taskId);
        }
        if (name == 'zhiban') {
          localStorage.setItem('lastReviewZhiBanData', JSON.stringify(task));
          localStorage.setItem('lastZhiBanTaskId', task.taskId);
        }
        this.$MKOPush({
          name: name,
          params: {
            taskId: task.taskId
          },
          query: {
            from: 'tasks',
            fromQuery: this.$route.query,
            isReview: true
          }
        })
        return;
      }
      if (task.status == 4) {
        this.$MKODialog({msg:'数据正在处理中，请稍后查看...'});
        return;
      }
      let routerPath = {};
      let taskData = cloneDeep(task);
      if (task.taskType == 2) {
        this.$store.registerModule('xuncha', xuncha);
        this.$store.commit(types.XUNCHA_INIT_TASK_DATA, taskData);
        localStorage.setItem('lastXunChaTaskId', task.taskId);
        routerPath = {
          name: 'xuncha',
          params: {
            taskId: task.taskId
          },
          query: {
            from: 'tasks'
          }
        }
      } else if (task.taskType == 1) {
        this.$store.registerModule('zhiban', zhiban);
        this.$store.commit(types.ZHIBAN_INIT_DATA, taskData);
        localStorage.setItem('lastZhiBanTaskId', task.taskId);

        routerPath = {
          name: 'zhiban',
          params: {
            taskId: task.taskId
          },
          query: {
            from: 'tasks'
          }
        }
      }
      this.$MKOPush(routerPath, {
        path: `/enter/tasks?listType=1`
      });
    },
    getXCTaskStatusFromCache(taskId) {
      let key = `CACHE_XUNCHA_TASKDATA_${taskId}`;
      let pValue = localStorage.getItem(key);
      if (pValue && pValue.length > 0) {
        pValue = JSON.parse(pValue);
        return pValue.status;
      }
      return -1;
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../config.less";
.container {
  margin-top: 14px;
  .border-top(@borderGray);
  .mission-table {
    width: 100%;
    padding: 0;
    list-style: none;
    .cell {
      position: relative;
      /*border-bottom: 1px solid #ddd;*/
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
      .list-wrap {
        background: @bgWhite;
        .list {
          padding: 0;
          margin: 0;
          .item {
            .border-btm(@borderColor);
            .content {
              flex: 1;
              -webkit-flex: 1;
              position: relative;
              padding: 6px 14px;
              .title {
                line-height: 20px;
                font-size: 14px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding-right: 54px;
              }
              .desc {
                line-height: 17px;
                font-size: 12px;
                color: @textGray;
              }
            }
            .state {
              height: 14px;
              width: 90px;
              font-size: 12px;
              text-align: right;
              margin-left: auto;
              position: absolute;
              top: 0;
              bottom: 0;
              right: 24px;
              margin: auto;
              .badge {
                background: @redColor;
              }
              .task-number {
                padding: 2px 8px;
                border-radius: 10px;
              }
              .text {
                position: relative;
                line-height: 17px;
                font-size: 14px;
                .icon {
                  position: absolute;
                  top: 1px;
                  right: -16px;
                  font-size: 12px;
                  font-weight: 700;
                }
              }
            }
          }
        }
      }
    }
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
    font-size: 14px;
    color: #ffffff;
    display: block;
  }
}

.not-task-data {
  width: 100%;
  margin: -96px auto 0 auto;
  text-align: center;
  height: 100vh;
  .main {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    width: 200px;
    height: 88px;
    top: 200px;
    .not-data-icon {
      margin: 0 auto 8px;
      width: 35px;
      height: 50px;
      background: url('/static/icons/resource.png') -668px -237px no-repeat;
      background-size: @bg-size;
      display: block;
    }
    span {
      font-size: 12px;
      color: #A8AEBB;
    }
  }
}
</style>
