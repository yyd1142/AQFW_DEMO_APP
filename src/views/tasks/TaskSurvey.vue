<template>
  <div style="margin-top: 48px;">
    <mt-tab-container>
      <mt-tab-container-item>
        <ul class="mission-table">
          <li class="cell"  v-for="item in taskSurvey">
            <a @click="viewTasksByName(item.name)">
              <div class="title">
                {{item.name}}
                <span class="count">({{item.count}})</span>
              </div>
              <div class="info-wrap">
                <span class="info state-warning">执行中：
                  <span class="num">{{item.doing}}</span>
                </span>
                <span class="info state-red">待审核：
                  <span class="num">{{item.waitingConfirm}}</span>
                </span>
                <span class="info state-succ">未上传：
                  <span class="num">{{item.waitingUpload}}</span>
                </span>
              </div>
            </a>
          </li>
        </ul>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: ['taskSurvey', 'currentDate'],
  methods: {
    viewTasksByName(taskTypeName) {
      let query = {
        date: this.currentDate,
        title: taskTypeName
      }
      if (taskTypeName == '值班') {
        query.taskType = 1;
        this.$MKOPush({
          path: '/taskListStatus',
          query: query
        }, {
            path: '/enter/tasks?listType=0'
          })
      } else if (taskTypeName == '巡查') {
        query.taskType = 2;
        this.$MKOPush({
          path: '/taskListStatus',
          query: query
        }, {
            path: '/enter/tasks?listType=0'
          })
      }
    }
  }
}

</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../config.less";

.mission-table {
  padding: 0;
  margin: 17px 14px 0 13px;
  list-style: none;
  .cell {
    box-sizing: border-box;
    height: 79px;
    margin-bottom: 10px;
    padding-top: 10px;
    background: @bgWhite;
    a {
      display: block;
    }
    .title {
      padding: 0 0 11px 9px;
      height: 36px;
      .border-btm(@bgColor);
      font-size: 18px;
      color: #333;
      .count {
        font-size: 14px;
        letter-spacing: 0;
        color: #5E5E5E;
      }
    }
    .info-wrap {
      display: table;
      .info {
        display: table-cell;
        vertical-align: middle;
        padding: 0 5px 0 9px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        .num {
          /*color: #f00;*/
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
</style>
