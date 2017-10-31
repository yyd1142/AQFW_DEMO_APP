<template>
  <div class="no-data-wrap">
    <div class="no-data-sign"></div>
    <span class="no-data-text">{{text || '暂无内容'}}</span>
  </div>
</template>

<script>
  export default {
    props: ['text']
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../config.less";

  .no-data-wrap {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    .no-data-sign {
      margin: 0 auto 8px;
      width: 35px;
      height: 50px;
      background: url('/static/icons/resource.png') -668px -237px no-repeat;
      background-size: @bg-size;
      display: block;
    }
    .no-data-text {
      font-size: 12px;
      color: #A8AEBB;
      letter-spacing: 0;
    }
  }
</style>
