<template>
  <div class="search-wrap">
    <div class="box">
      <input class="ipt" type="text" v-model="value" @focus="inputOnFocus" @blur="inputOnBlur">
      <i class="mintui mintui-field-error cancel-xx" v-if="iptHasValue" @click="clearText"></i>
    </div>
    <div class="sign" v-if="!iptHasValue">
      <i class="icon"></i>{{hintText || '搜索'}}
    </div>
    <div class="cancel" @click="inputReset" v-if="iptHasValue">
      取消
    </div>
  </div>
</template>

<script>
export default {
  props: ['hintText', 'reset'],
  data() {
    return {
      value: '',
      iptHasValue: false
    }
  },
  watch: {
    value: function (val) {
      if (!val) {
        this.iptHasValue = false;
      } else {
        this.iptHasValue = true;
      }
      this.$emit('input', val);
    }
  },
  methods: {
    inputReset() {
      this.value = '';
      this.$emit('onCancelSearch');
    },
    inputOnFocus() {
      // console.log('focus');
      this.$emit('onFocus', true);
    },
    inputOnBlur() {
      // console.log('blur');
      // this.$emit('onFocus', false);
    },
    clearText() {
      this.value = '';
      this.$emit('onClearSearch');
    }
  },
  components: {}
}
</script>

<style lang="less" rel="stylesheet/less">
@import "../../config.less";

.search-wrap {
  position: relative;
  height: 44px;
  padding: 8px;
  background: #C9C9CE;
  .box {
    height: 28px;
    padding: 0 5px;
    border-radius: 5px;
    background: #FFFFFF;
    .ipt {
      width: 98%;
      height: 20px;
      border: none;
      font-size: 14px;
    }
    .cancel-xx {
      position: absolute;
      right: 50px;
      color: #c9c9ce;
      background: none;
      width: 14px;
      height: 14px;
      top: 0;
      bottom: 0;
      margin: AUTO;
    }
  }
  .sign {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    font-size: 14px;
    color: #9E9E9E;
    letter-spacing: 0.87px;
    .icon {
      position: relative;
      top: -5px;
      right: 7px;
      font-size: 0;
      padding: 6px;
      background: url('/static/icons/resource.png') -822px 0 no-repeat;
      background-size: @bg-size;
    }
  }
  .cancel {
    position: absolute;
    right: 0;
    top: 0;
    width: 44px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    background: #C9C9CE;
    color: @textBlue;
  }
}
</style>
