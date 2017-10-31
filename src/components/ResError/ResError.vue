<template>
  <div class="res-err-wrap">
    <div class="sign"></div>
    <div class="text">网络异常</div>
    <div @click="refresh()">
      <mt-button class="btn">重新加载</mt-button>
    </div>
  </div>
</template>

<style lang="less" rel="stylesheet/less">
@import "../../config.less";
.res-err-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  text-align: center;
  letter-spacing: 0;
  .sign {
    margin: 0 auto;
    width: 100px;
    height: 100px;
    background: url(/static/icons/resource.png) -569px -186px no-repeat;
    background-size: @bg-size;
  }
  .text {
    margin: 12px auto 10px;
    font-size: 14px;
    color: #A8AEBB;
  }
  .btn {
    height: 30px;
    border-radius: 4px;
    font-size: 14px;
    background: #299FFF;
    color: #FFFFFF;
  }
}
</style>

<script>
import { Indicator } from 'mint-ui';
export default {
  data() {
    return {}
  },
  methods: {
    refresh() {
      let path = this.$route.fullPath;
      Indicator.open({ spinnerType: 'fading-circle' });
      let timer = setTimeout(() => {
        Indicator.close();
        clearTimeout(timer);
        let MKOPop = this.$MKOPop();
        this.$nextTick(() => {
          if (MKOPop == null) {
            this.$router.go(0);
          } else {
            this.$MKOPush(path);
          }
        })
      }, 1000);
    }
  }
}

</script>
