<template>
  <div>
    <div class="banner-wrap">
      <div class="banner-bg">
        <img :src="`/static/banner/info_bg_${calcBannerBg(unitScore)}.png`"/>
      </div>
      <div class="banner-content score-circle" :class="`score-${calcBannerCircle(unitScore)}`">
        <div class="score-text">{{calcScoreText(unitScore) || '暂无'}}</div>
        <div class="score">{{unitScore ? parseFloat(unitScore).toFixed(1) : '-'}}</div>
        <div class="name no-overflow">{{unitInfo.dwName}}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" rel="stylesheet/less" scoped>
  @import "../../config.less";

  .banner-wrap {
    width: 100%;
    min-height: 280px;
    max-height: 360px;
    padding: 0;
    position: relative;
    .banner-bg {
      img {
        width: 100%;
        min-height: 280px;
        max-height: 360px;
        display: block;
        margin: 0 auto;
      }
    }
    .banner-content {
      width: 274px;
      height: 186px;
      position: absolute;
      top: 40px;
      left: 50%;
      transform: translate(-50%, 0);
      -webkit-transform: translate(-50%, 0);
      color: #fff;
      text-align: center;
      .score-text {
        margin-top: 40px;
        font-size: 24px;
      }
      .score {
        margin: 10px auto;
        font-size: 60px;
      }
      .name {
        width: 224px;
        margin: auto;
        font-size: 16px;
      }
      &.score-null {
        background-image: url('/static/banner/circle_null.png');
      }
    }
  }
</style>

<script>
  import {calcScoreText, calcBannerCircle, calcBannerBg} from 'filters'
  export default {
    props: ['unitInfo', 'unitScore'],
    data() {
      return {}
    },
    methods: {
      calcScoreText,
      calcBannerCircle,
      calcBannerBg,
    }
  }
</script>
