<template>
  <div class="popup-picker">
    <div class="sel-wrap" @click="ctlPopup(true)">
      <mt-cell :title="title" :value="formValue" is-link></mt-cell>
    </div>
    <div class="popup-wrap">
      <mt-popup v-model="popupShow" position="bottom">
        <div class="popup-btn">
          <span class="btn" @click="ctlPopup(false)">取消</span>
          <span class="btn btn-yes" @click="pickValue()">确定</span>
        </div>
        <mt-picker :slots="valueList" @change="onValuesChange"></mt-picker>
      </mt-popup>
    </div>
  </div>
</template>

<style lang="less" rel="stylesheet/less">
  .popup-picker {
    .sel-wrap {
      .mint-cell-title {
        flex: none;
        -webkit-flex: none;
        width: 105px;
        .mint-cell-text {
          vertical-align: baseline;
        }
      }
    }
    .popup-wrap {
      .popup-btn {
        .btn {
          display: inline-block;
          padding: 15px;
        }
        .btn-yes {
          float: right;
          color: #0089dc;
        }
      }
      .mint-popup {
        width: 100%;
      }
    }
  }
</style>

<script>
  export default {
    data() {
      return {
        popupShow: false,
        currentValue: '',
        valueList: [{
          flex: 1,
          values: [],
        }]
      }
    },
    props: [
      'title', 'values', 'formValue'
    ],
    mounted() {
      this.valueList = this.values;
    },
    methods: {
      ctlPopup(bool) {
        this.popupShow = bool;
      },
      onValuesChange(picker, val) {
        if (val.length === 1) {
          this.currentValue = val[0];
        } else {
          this.currentValue = val[0];
          //          console.log(val);
        }
      },
      pickValue() {
        this.$emit('get', this.currentValue);
        this.popupShow = false
      }
    }
  }
</script>

<!--父组件使用：-->
<!--<popup-picker title="部门" :values="contactTeams" :formValue="formData.team" v-on:get="pickTeam"></popup-picker>-->
