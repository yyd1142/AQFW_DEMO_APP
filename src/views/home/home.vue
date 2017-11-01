<template>
  <div style="margin-bottom: 64px;">
    <div class="placeholder-item" :class="isAdmin ? '' : 'home-purple-color'" :style="{backgroundColor:calcHeadColor(score)}"></div>
    <mko-header title="安全服务云" :background-color="calcHeadColor(score)" :right-icon="hasMessageDataClass" @handleRightClick="goMessage"></mko-header>
    <mt-loadmore style="margin-top: 40px;" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="bottomAllLoaded" ref="loadmore" :auto-fill="autoFill">
      <div class="page-wrap home-wrap" ref="wrapper" :style="{ marginTop: 0 }" v-if="!resError">
        <div class="tasks-home-wrap"  v-if="!isAdmin" @click="goTaskInfo()">
          <img src="/static/icons/banner_bg.png" />
          <div class="tasks-item">
            <div class="tasks-date-wrap"><span class="tasks-date">{{ todayTasksItem.today }}</span></div>
            <div class="tasks-main">
              <div class="tasks-name" :class="todayTasksItem.data.notTask ? 'not-task-item' : null ">
                <span :class="todayTasksItem.class" v-text="todayTasksItem.data.description"></span>
                <span v-if="!todayTasksItem.notData">{{todayTasksItem.data.startTime | formatDate('HH:mm')}}</span>
              </div>
              <div class="tasks-time">
                <span v-text="todayTasksItem.text"></span>
                <span v-if="!todayTasksItem.notData">{{todayTasksItem.time}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--安全得分-->
        <div @click="goScoreInfo()"  v-if="isAdmin">
          <score-banner :unit-info="unitInfo" :unit-score="score" v-if="isAdmin"></score-banner>
        </div>
        <!--<div class="home-banner-wrap"  v-if="isAdmin" @click="goScoreInfo()">
            <img src="/static/score-banner.png" />
        </div>-->
        <div class="today-todo-wrap"  v-if="isAdmin">
          <div class="main-admin">
            <div class="action-cell"  v-for="item in adminActions" @click="goAdminAction(item.url)">
              <i class="action-image" :class="item.class"></i>
              <span class="action-font" v-text="item.text"></span>
            </div>
          </div>
        </div>
        <!--管理员功能区-->
        <ul class="actions-table-view"  v-if="isAdmin">
          <li class="actions-table-cell"  v-for="item in actions" @click="routerLink(item)">
            <i :class="item.class"></i>
            <span v-text="item.text"></span>
          </li>
        </ul>
        <!--安全员功能区-->
        <div class="today-todo-wrap"  v-if="!isAdmin">
          <div class="main">
            <div class="today-xuncha" @click="viewToDayTask()">
              <i class="today-image" :class="hasTasks ? 'today-tasks-icon' : 'today-not-tasks-icon'"></i>
              <span class="today-font">今日任务</span>
            </div>
            <div class="today-zhiban" @click="goHiddenDangerCheck()">
                <i class="today-image" :class="hasYH ? 'today-yh-icon' : 'today-not-yh-icon'"></i>
                <span class="today-font">风险上报</span>
            </div>
          </div>
        </div>
        <ul class="actions-table-view"  v-if="!isAdmin">
          <li class="actions-table-cell"  v-for="(item, index) in aq_actions" @click="routerLink(item)">
            <i :class="item.class"></i>
            <span class="today-font" v-text="item.text"></span>
          </li>
        </ul>
        <ul class="news-table-view">
          <li class="news-table-cell" :class="item.selected"  v-for="(item, index) in newsTabs" @click="tab(item, index)">
            <span v-text="item.text"></span>
          </li>
        </ul>
        <ul class="page-infinite-list">
          <li v-for="item in newsDatas" class="page-infinite-listitem" @click="goNewsInfo(item)">
            <img v-lazy="domain + item.fileId"/>
            <div class="news-title" v-text="titleFilters(item.title)"></div>
            <div class="news-date">{{item.createDate | formatDate('YYYY-MM-DD')}}</div>
          </li>
          <li class="not-data-home"  v-if="newsDatas.length == 0">暂无内容</li>
        </ul>
      </div>
    </mt-loadmore>
    <tabs actived="home"></tabs>
    <res-error v-if="resError"></res-error>
  </div>
</template>

<script src="./home.js">

</script>

<style lang="less" src="./home.less" scoped>

</style>
