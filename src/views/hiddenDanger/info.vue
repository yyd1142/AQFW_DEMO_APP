<template>
  <div>
    <div class="placeholder-item"></div>
    <mko-header title="风险详情" left-icon="icon-back" @handleLeftClick="back"></mko-header>
    <res-error  v-if="resError"></res-error>
    <no-data  v-if="noData"></no-data>
    <div class="page-wrap"  v-show="!resError">
      <div v-if="hiddenDanger">
        <div class="hd-info">
          <div class="left">
            <span style="margin-top: 9px;">{{yhkInfo.yhPosition}}</span>
            <span>上报人：{{yhkInfo.employeeName}}</span>
          </div>
          <div class="right">
            <span>{{yhkInfo.createDate | formatDate('YYYY-MM-DD')}}</span>
            <span>处置期限：{{yhkInfo.limitedTime | formatDate('YYYY-MM-DD') || '无'}}</span>
          </div>
        </div>
        <div class="cell-phone">
          <span class="name">联系上报人</span>
          <a :href="'tel:' + yhkInfo.phone" class="cell-icon-wrap">
            <span class="cell-icon"></span>
          </a>
          <span class="cell">{{yhkInfo.phone || '暂无'}}</span>
        </div>
        <div class="hd-filed">
          <div class="hd-desc">{{yhkInfo.yhDesc || '无描述'}}</div>
        </div>
        <div v-if="photos.length > 0">
          <photo-box max="8" :read-only="true" :photo-list="photos"></photo-box>
        </div>
        <div class="hd-filed">
          <div class="hd-desc">{{yhkInfo.changedDesc || '暂无处置需求'}}</div>
        </div>
        <div class="record-wrap">
          <div class="record" v-for="(item, index) in yhkInfo.situation">
            <i class="sign" :class="yhkInfo.situation.length - 1 == index ? 'btn-red' : 'btn-primary'"></i>
            <div class="text">
              {{item.updateDate | formatDate}} 风险状态：{{filtersStatus(item.yhStatus)}}
              <br> 说明：{{item.yhExplain || '暂无'}}
              <br> 处置责任人：{{item.userName || '暂无'}}
            </div>
          </div>
        </div>
        <div @click="routerLink()">
          <mt-button type="primary" size="large" class="btn-red bottom-btn">更新风险状态</mt-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from 'api';
  import apiconf from 'apiconf';
  import { NoData, ResError, PhotoBox } from 'components';
  import { Indicator } from 'mint-ui';
  import { formatDate } from 'filters';
  var _id = ''
  export default {
    data() {
      return {
        //提示
        resError: false,
        noData: false,
        hiddenDanger: true,
        //数据
        yhkInfo: {},
        photos: []
      }
    },
    activated() {
      this.getData();
      setTimeout(() => {
        this.hiddenDanger = true
      }, 200);
    },
    deactivated() {
      this.hiddenDanger = false
    },
    methods: {
      getData() {
        api.getYhkInfo({
          id: this.$route.params.pid
        }).then(res => {
          _id = this.$route.params.pid
          if (!res) {
            this.resError = true;
            return;
          }
          this.yhkInfo = res.response;
          if (!this.yhkInfo) {
            this.noData = true;
          } else {
            this.photos = []
            this.fetchImages(this.yhkInfo.yhFilesID);
          }
        })
      },
      getPhoto(fileListId) {
        if (!fileListId)
          return;
        let that = this;
        api.getResourcesInfo(fileListId).then(res => {
          if (!res)
            return;
          let list = res.response;
          list.forEach(item => {
            getFileInfo(item.resouceId);
          });
        });
        let getFileInfo = function (fileId) {
          let path = `${apiconf.resourcesDomain}/${fileId}`;
          that.photoList.push(path);
        }
      },
      routerLink() {
        this.$MKOPush(`/edit_hidden_danger?yhkId=${this.$route.params.pid}&yhStatus=${this.yhkInfo.yhStatus}`)
      },
      fetchImages(resourceId) {
        if (resourceId && resourceId.length > 0) {
          api.getByPath(`/info/${resourceId}`)({}).then(res => {
            if (res.code != 0)
              return;
            if (res.response && res.response.length > 0) {
              for (let image of res.response) {
                this.photos.push(`${apiconf.resourcesDomain}/${image.resouceId}`);
              }
            }
          });
        }
      },
      filtersStatus(val) {
        if (!val)
          return '';
        let type = ['未处置', '已处置', '处置中'];
        return type[val - 1];
      },
      back() {
        this.$MKOPop()
      }
    },
    components: {
      NoData,
      ResError,
      PhotoBox
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  @import '../../config.less';

  .hd-info {
    width: 100%;
    background-color: #FF7F5B;
    position: absolute;
    top: 0;
    height: 50px;
    z-index: 10;
    color: #ffffff;
    .left {
      font-size: 14px;
      width: 60%;
      margin-right: auto;
      height: 50px;
      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        display: block;
        padding-left: 14px;
      }
      span:last-child {
        font-size: 12px;
        margin-top: 2px;
      }
    }
    .right {
      text-align: right;
      font-size: 14px;
      width: 40%;
      margin: -50px 0 0 auto;
      height: 50px;
      padding-right: 14px;
      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        display: block;
      }
      span:last-child {
        font-size: 12px;
        margin-top: 2px;
      }
    }
  }

  .hd-filed {
    width: 100%;
    background-color: #fff;
    padding: 12px 14px;
    margin: 14px 0 0 0;
    display: table;
    .hd-desc {
      width: 100%;
      font-size: 14px;
      color: #6B6B6B;
      line-height: 20px;
      display: table-cell;
      vertical-align: middle;
    }
    .photo-table-view {
      width: 100%;
      list-style: none;
      margin-top: 26px;
      .photo-table-cell {
        width: 25%;
        display: inline-block;
        box-sizing: border-box;
        padding: 0 5px 5px 0;
        height: 25%;
        overflow: hidden;
        img {
          /*width: 100%;*/
          height: 100%;
          display: block;
        }
      }
    }
  }

  .hd-upload {
    width: 100%;
    list-style: none;
    padding: 0;
    margin: 15px 0 0 0;
    display: block;
  }

  .hd-upload-cell {
    width: 33%;
    height: 33%;
    display: inline-block;
    box-sizing: border-box;
    padding: 5px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .cell-phone {
    width: 100%;
    background-color: #ffffff;
    height: 44px;
    margin-top: 50px;
    position: relative;
    display: table;
    .cell-icon-wrap {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 43px;
      right: 0;
      margin: auto;
    }
    .cell-icon {
      display: block;
      margin: 15px auto 0;
      width: 14px;
      height: 14px;
      background: url('/static/icons/resource.png') -822px -28px no-repeat;
      background-size: @bg-size;
    }
    .name {
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      color: #232323;
      padding-left: 14px;
      display: table-cell;
      vertical-align: middle;
      width: 84px;
    }
    .cell {
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      color: #606060;
      display: table-cell;
      vertical-align: middle;
    }
  }

  .record-wrap {
    min-height: 300px;
    padding: 25px 14px 25px 31px;
    font-size: 12px;
    .record {
      position: relative;
      margin-bottom: 31px;
      &:last-child::after {
        background: none;
      }
      &::after {
        content: '';
        height: 85px;
        position: absolute;
        background-color: #dee0e2;
        width: 1px;
        left: -11px;
        margin: auto;
        top: 14px;
      }
      .sign {
        position: absolute;
        top: 4px;
        left: -16px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .text {
        vertical-align: baseline;
      }
    }
  }
</style>
