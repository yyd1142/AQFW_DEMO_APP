<template>
  <div>
    <div class="placeholder-item"></div>
    <mko-header title="风险上报" left-icon="icon-back" @handleLeftClick="back"></mko-header>
    <div class="page-wrap check-hide-danger">
      <xun-cha-status :status-item="zhibanStatusInfo" v-if="zhibanStatusInfo != null"></xun-cha-status>
      <div class="info-wrap">
        <!--<mt-cell title="设备" value="暂无"></mt-cell>-->
        <mt-cell title="风险发生位置">
          <i class="selecet-icon"></i>
          <div @click="popupShow = true">
            <span class="cell-btn">选择</span>
          </div>
        </mt-cell>
        <div  v-if="formData.build">
          <mt-cell title="建筑" :value="selectedBuild"></mt-cell>
          <mt-cell title="楼层" :value="(formData.floor||'未选择')+'层'"  v-if="formData.build"></mt-cell>
          <div class="yhk-cell">
            <span class="title">详细地址</span>
            <input type="text" class="yhk-input" v-model="formData.address" placeholder="请输入风险地址" @input="bInputData = true" />
          </div>
        </div>
      </div>
      <div class="popup-wrap">
        <mt-popup v-model="popupShow" position="right">
          <div class="body-wrap">
            <div class="radio-wrap">
              <p class="title">建筑</p>
              <div @click="chooseJZ(item)" v-for="item in options.build">
                <mt-button class="radio" :class="{'checked': formData.build == item.value }"  size="large">
                  <span class="sign has-gutter"  v-show="formData.build==item.value"></span>{{item.label}}
                </mt-button>
              </div>
            </div>
            <div class="radio-wrap floor-radio-wrap">
              <p class="title">楼层</p>
              <div @click="formData.floor = item"  v-for="item in options.floor">
                <mt-button class="radio" :class="{'checked':formData.floor==item}">
                  <span class="sign"  v-show="formData.floor==item"></span>{{item}}层
                </mt-button>
              </div>
            </div>
          </div>
          <div class="footer-wrap">
            <mt-button class="reset" @click="resetData"> 重置 </mt-button>
            <mt-button class="confirm" @click="confirm">确定</mt-button>
          </div>
        </mt-popup>
      </div>
      <div class="content-wrap">
        <!--<div class="title">-->
        <!--<mt-field v-model="formData.title" placeholder="请输入标题"></mt-field>-->
        <!--</div>-->
        <div class="desc">
  
          <textarea v-model="formData.desc" placeholder="请输入风险描述" @input="bInputData = true"></textarea>
        </div>
        <photo-box max="8" :photo-list="photos" @removePhotoEvent="removePhoto" @addPhotoEvent="sheetShow = true">
        </photo-box>
      </div>
      <div ref="wrapper" :style="{ height: wrapperHeight - 40 - changedHeight + 'px'}"></div>
      <div class="footer-wrap" @click="submit">
        <mt-button class="btn bottom-btn yhk-submit-btn" size="large" :disabled="!formValid">提交风险</mt-button>
      </div>
    </div>
    <mt-actionsheet :actions="actions" v-model="sheetShow"></mt-actionsheet>
  </div>
</template>

<script src="./checkHideDanger.js">

</script>

<style lang="less" rel="stylesheet/less">
@import "../../config.less";
.check-hide-danger {
  padding-bottom: 0;
  .info-wrap {
    margin-top: 14px;
    .mint-cell-wrapper {
      padding: @cellPadding;
      font-size: 14px;
      .mint-cell-value {
        color: @textLB;
        .icon {
          margin-right: 5px;
          color: @textBlue;
        }
        .cell-btn {
          color: @textBlue;
        }
      }
    }
  }
  .popup-wrap {
    position: relative;
    .mint-popup-right {
      width: 284px;
      height: 100%;
    }
    .body-wrap {
      overflow: scroll;
      padding: 34px 7px 100px;
      max-height: 700px;
      bottom: 100px;
      &:after {
        display: table;
        content: "";
      }
      .radio-wrap {
        margin-bottom: 10px;
        font-size: 12px;
        .radio {
          padding: 0 4px;
          margin-bottom: 6px;
          height: 30px;
          border-radius: @radiusS;
          background: #f0f2f5;
          color: @textBase;
          &.checked {
            background: #fff;
            border: 1px solid @textBlue;
            color: @textBlue;
          }
          .mint-button-text {
            font-size: 12px;
            .sign {
              display: inline-block;
              position: relative;
              top: 1px;
              padding: 9px 12px 0 0;
              background: url(/static/icons/resource.png) -44px -61px no-repeat;
              background-size: 356px auto;
              &.has-gutter {
                right: 5px;
              }
            }
          }
        }
        .title {
          margin: 0 0 10px;
        }
        &.floor-radio-wrap {
          .radio {
            float: left;
            width: 50px;
            height: 30px;
            margin-right: 4px;
            font-size: 13px;
          }
        }
        &+.radio-wrap {
          margin-top: 20px;
          padding-top: 20px;
          .border-top(#D8D8D8);
        }
      }
    }
    .footer-wrap {
      display: flex;
      display: -webkit-flex;
      position: absolute;
      bottom: 0;
      width: 100%;
      .mint-button {
        flex: 1;
        -webkit-flex: 1;
        width: 50%;
        height: 39px;
        border-radius: 0;
        opacity: 0.73;
        &.reset {
          border: 1px solid #EDEEF1;
          background: #fff;
          color: @textBlue;
        }
        &.confirm {
          background: #0398FF;
          color: #fff;
        }
      }
    }
  }
  .content-wrap {
    margin-top: 14px;
    padding: 11px 0 16px;
    background: @bgWhite;
    .desc {
      margin-bottom: 28px;
      padding: 0 14px;
      textarea {
        width: 100%;
        height: 104px;
        font-size: 14px;
        display: block;
        box-sizing: border-box;
        border: 1px solid rgba(216, 216, 216, 0.48);
        border-radius: 3px; 
        outline: none
      }
      .mint-cell-value {
        textarea {
          min-height: 100px;
          border: 1px solid rgba(216, 216, 216, 0.48);
          border-radius: 3px;
          outline: none
        }
      }
    }
    .photo-wrap {
      .photo-list {
        display: flex;
        display: -webkit-flex;
        flex-wrap: wrap;
        .photo {
          flex: 0 0 25%;
          -webkit-flex: 0 0 25%;
          position: relative;
          min-height: 80px;
          margin-bottom: 10px;
          text-align: center;
          >img {
            width: 78px;
            height: 78px;
          }
          .btn {
            position: absolute;
            left: 50%;
            transform: translate(-50%, 0);
            -webkit-transform: translate(-50%, 0);
            width: 80px;
            height: 80px;
            background: url(/static/icons/resource.png) -110px 0 no-repeat;
            background-size: @bg-size;
          }
        }
      }
    }
  }
  .footer-wrap {
    position: static;
    width: 100%;
    bottom: 0;
    .btn {
      background: @redColor;
      color: @bgWhite;
      &.is-disabled {
        background: lighten(@redColor, 10%);
        opacity: 1;
      }
    }
  }
}

.yhk-submit-btn {
  position: static !important;
  &::after {
    position: static;
  }
}

.selecet-icon {
  background: url('/static/icons/resource.png') -836px 0 no-repeat;
  background-size: @bg-size;
  display: inline-block;
  width: 14px;
  height: 14px;
  margin: 0 2px 0 0;
}

.yhk-cell {
  position: relative;
  width: 100vw;
  height: 44px;
  background-color: #ffffff;
  line-height: 44px;
  padding: 0 0 0 14px;
  border-top: 1px solid #ececec;
  .title {
    width: 30vw;
    font-size: 14px;
    float: left;
    color: #050505;
  }
  .yhk-input {
    width: 70vw - 14px;
    border-style: none;
    height: 40px;
    float: right;
    font-size: 14px;
    TEXT-ALIGN: RIGHT;
    PADDING-RIGHT: 14PX;
  }
}
</style>
