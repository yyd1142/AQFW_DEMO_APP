<template>
  <div style="min-height: 50px">
    <nav class="status-bav-wrap" :class="statusBgColor.mainBgColor">
      <div class="item">
        <div class="name">
          <span>{{statusItem.name}}</span>
        </div>
        <div class="date">
          <span>{{statusItem.startTime | formatDate}}到{{statusItem.endTime | formatDate}}</span>
        </div>
      </div>
      <div class="status-image button">
        <div class="status-text">
          <span>{{statusFilter}}</span>
          <i :class="statusBgColor.iconfont"></i>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { xunchaStatusColor, formatDate } from 'filters';
export default {
  props: ['statusItem'],
  data() {
    return {

    }
  },
  //任务状态 1: 待执行，2: 执行中，3: 已完成，未上传 4: 已上传，处理中 5: 处理完成，待审核，6: 通过审核（已完成） 7: 已超期
  computed: {
    statusFilter() {
      let status = this.statusItem.status;
      let statusText = ['未开始', '未开始', '进行中', '未上传', '处理中', '待审核', '已完成', '已超期', '等待中'];
      return statusText[status];
    },
    statusBgColor() {
      let status = this.statusItem.status;
      let colors = {};
      let colorsArray = [
        { mainBgColor: 'weikaishi-bg', iconfont: 'jinxingzhong-icon' },
        { mainBgColor: 'weikaishi-bg', iconfont: 'jinxingzhong-icon' },
        { mainBgColor: 'black-bg', iconfont: 'jinxingzhong-icon' },
        { mainBgColor: 'black-bg', iconfont: 'complete-icon' },
        { mainBgColor: 'shenhe-bg', iconfont: 'complete-icon' },
        { mainBgColor: 'shenhe-bg', iconfont: 'complete-icon' },
        { mainBgColor: 'complete-bg', iconfont: 'complete-icon' },
        { mainBgColor: 'weikaishi-bg', iconfont: 'complete-icon' },
        { mainBgColor: 'black-bg', iconfont: 'jinxingzhong-icon' }]
      return colorsArray[status];
    }
  },
  mounted() {

  }
}

</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../config.less";
.status-bav-wrap {
  width: 100%;
  position: fixed;
  top: 39px + @headerTop;
  height: 50px;
  background-color: #7CCE2D;
  z-index: 10;
  .item {
    width: 70%;
    color: #ffffff;
    float: left;
    height: 50px;
    padding-left: 14px;
    .name,
    .date {
      display: table;
      width: 100%;
      span {
        display: table-cell;
        vertical-align: middle;
      }
    }
    .name {
      span {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
      }
    }
    .date {
      span {
        height: 20px;
        line-height: 20px;
        font-size: 12px;
      }
    }
  }
}

.status-image {
  width: 30%;
  float: right;
  background-color: #80D92A;
  color: #fff;
  position: relative;
  height: 50px;
  .status-text {
    text-align: center;
    height: 16px;
    line-height: 16px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: AUTO;
    span {
      font-size: 18px;
    }
    i {
      width: 16px;
      height: 16px;
      display: -webkit-inline-box;
    }
  }
}

.weikaishi-bg {
  background-color: #ADBAC1;
  .button {
    background-color: #B4C1CA;
  }
}

.shenhe-bg {
  background-color: #FFB224;
  .button {
    background-color: #FFBD19;
  }
}

.blue-bg {
  background-color: #A613C1;
  .button {
    background-color: #B431CA;
  }
}

.black-bg {
  background-color: #7CCE2D;
  .button {
    background-color: #80D92A;
  }
}

.chaoqi-bg {
  background-color: #ffffff;
  .button {
    background-color: #AA31CA;
  }
}

.complete-bg {
  background-color: #ADBAC1;
  .button {
    background-color: #B4C1CA;
  }
}

.jinxingzhong-icon {
  background: url('/static/icons/resource.png') -774px 0 no-repeat;
  background-size: 892px auto;
}

.complete-icon {
  background: url('/static/icons/resource.png') -790px 0 no-repeat;
  background-size: 892px auto;
}
</style>
