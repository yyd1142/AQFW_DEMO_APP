<template>
  <div>
    <div class="placeholder-item"></div>
    <mko-header title="更新风险状态" left-icon="icon-back" @handleLeftClick="back"></mko-header>
    <div class="page-wrap">
      <div class="cell-phone">
        <span class="name">{{statusText}}</span>
        <div @click="sheetVisible = true">
          <span class="cell edit-yh-icon">{{filtersStatus(formData.yhStatus) || '选择'}}
            <i class="icon iconfont icon-youjiantou"></i>
          </span>
        </div>
      </div>
      <div class="hd-filed">
        <div class="shuoming">说明</div>
        <textarea class="hd-desc" v-model="formData.yhExplain" placeholder="请输入风险说明"></textarea>
      </div>
      <!--<div class="hd-filed">
                  <photo-box :photo-list="photoList" :max='8' @addPhotoEvent="sheetShow=true" @removePhotoEvent="removePhoto()"></photo-box>
                </div>-->
    </div>
    <div ref="hiddenWrap" :style="{ height: hiddenWrapHeight - 40 + 'px'}"></div>
    <div @click="submit()">
      <mt-button type="primary" size="large" class="btn-primary submit-btn" :disabled="!formValid">确定</mt-button>
    </div>
    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
    <mt-actionsheet :actions="photoActions" v-model="sheetShow"></mt-actionsheet>
  </div>
</template>

<script>
import api from 'api';
import { Indicator, Toast } from 'mint-ui'
import { PhotoBox } from 'components'

export default {
  data() {
    return {
      yhkId: this.$route.query.yhkId,
      formData: {
        yhStatus: '',
        yhExplain: ''
      },
      formValid: false,
      statusText: '状态',
      sheetVisible: false,
      actions: [],
      photoActions: [],
      photoList: [],
      sheetShow: false,
      hiddenWrapHeight: 0
    }
  },
  watch: {
    formData: {
      handler: function () {
        this.formValidFn();
      },
      deep: true
    },
  },
  mounted() {
    this.hiddenWrapHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight) - this.$refs.hiddenWrap.getBoundingClientRect().top;
  },
  activated() {
    this.actions = [{
      name: '未处置',
      method: this.weizhenggai
    }, {
      name: '处置中',
      method: this.zhenggaizhong
    }, {
      name: '已处置',
      method: this.yizhenggai
    }];
    this.formData.yhStatus = this.$route.query.yhStatus;
    this.photoActions = [{
      name: '拍照',
      method: this.takePhoto
    }, {
      name: '从相册中选择',
      method: this.choosePhoto
    }];
  },
  methods: {
    filtersStatus(val) {
      if (!val)
        return '';
      let type = ['未处置', '已处置', '处置中'];
      return type[val - 1];
    },
    weizhenggai() {
      this.formData.yhStatus = 1;
    },
    zhenggaizhong() {
      this.formData.yhStatus = 3;
    },
    yizhenggai() {
      this.formData.yhStatus = 2;
    },
    formValidFn() {
      let data = this.formData;
      for (let key in data) {
        if (!data[key]) {
          this.formValid = false;
          return;
        }
      }
      this.formValid = true;
    },
    submit() {
      Indicator.open({
        spinnerType: 'fading-circle'
      });
      this.yhkId = this.$route.query.yhkId;
      let params = {
        yhkID: this.$route.query.yhkId,
        userName: this.$store.getters.employeeName,
        yhStatus: this.formData.yhStatus,
        yhExplain: this.formData.yhExplain
      };
      api.updateYhk(params).then(res => {
        Indicator.close();
        if (!res)
          return;
        Toast({
          message: '更新成功',
          position: 'middle',
          duration: 1500
        });
        this.formData = {
          yhStatus: '',
          yhExplain: ''
        }
        this.$MKOPop()
      });
      // let self = this;
      // let doUploadSuccess = function(resourceId) {
      //   let params = {
      //     yhkID: self.$route.query.yhkId,
      //     userName: self.$store.getters.userName,
      //     yhStatus: self.formData.yhStatus,
      //     yhExplain: self.formData.yhExplain
      //   };
      //   if (resourceId != '') {
      //     params['yhFilesID'] = resourceId;
      //   }
      //   api.updateYhk(params).then(result => {
      //     if (!result) return false
      //     if (result.code == 0) {
      //       MessageBox.alert('更新成功').then(action => {
      //         setTimeout(() => {
      //           self.formData = {
      //             yhStatus: '',
      //             yhExplain: ''
      //           }
      //         }, 500);
      //       });
      //     } else {
      //       Toast({
      //         message: '更新失败',
      //         duration: 1000
      //       });
      //     }
      //   })
      // };

      // let doDumpYHKData = function() {
      //   if (self.photos.length <= 0) {
      //     doUploadSuccess('');
      //     return;
      //   }
      //   let uploadURL = `${apiconf.resourcesDomain}/uploads`;
      //   self.$uploadImages(self.photos, uploadURL, function(result) {
      //     if (result.error && result.error.length > 0) {
      //       Toast({
      //         message: '图片上传失败',
      //         duration: 1000
      //       });
      //       return false;
      //     }
      //     if (result.resourceId && result.resourceId.length > 0) {
      //       doUploadSuccess(result.resourceId);
      //     }
      //   });
      // }

      // this.$getMobileNetworkType(function(result) {
      //   if (result == "unknown") {
      //     MessageBox.alert('当前网络不可用，请确保网络正常...');
      //     return;
      //   } else if (result == "3G/4G") {
      //     let opts = {
      //       title: '提示',
      //       message: '当前3G/4G网络，提交风险会消耗流量，建议WIFI环境下上传。',
      //       showCancelButton: true,
      //       confirmButtonText: '立即提交',
      //       cancelButtonText: '稍后提交'
      //     }
      //     MessageBox(opts).then(action => {
      //       if (action != 'confirm')
      //         return;
      //       doDumpYHKData();
      //     });
      //   } else if (result == "wifi") {
      //     doDumpYHKData();
      //   }
      // });
    },
    back() {
      this.$MKOPop();
    },
    removePhoto(index) {
      this.photos.splice(index, 1);
    },
    // 拍照
    takePhoto() {
      this.$takePhoto((photo) => {
        this.photos.push(photo.url);
      })
    },
    // 选照片
    choosePhoto() {
      this.$choosePhoto((photos) => {
        for (let photo of photos) {
          this.photos.push(photo.url);
        }
      })
    }
  },
  components: {
    PhotoBox
  }
}
</script>

<style lang="less" scoped>
@import "../../config.less";
.hd-filed {
  width: 100%;
  background-color: #fff;
  padding: 12px 14px;
  margin: 14px 0 0 0;
  .shuoming {
    width: 100%;
    font-size: 14px;
    color: #232323;
  }
  .hd-desc {
    width: 100%;
    font-size: 14px;
    color: #6B6B6B;
    box-sizing: border-box;
    border: 1px solid rgba(216, 216, 216, 0.48);
    border-radius: 3px;
    outline: none;
    margin-top: 8px;
    min-height: 100px;
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
      height: 25vw;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
}

.cell-phone {
  width: 100%;
  background-color: #ffffff;
  height: 44px;
  display: table;
  .name {
    width: 50vw;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    color: #232323;
    padding-left: 14px;
    display: table-cell;
    vertical-align: middle;
  }
  .cell {
    width: 50vw;
    text-align: right;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    color: @blueColor;
    margin-right: 14px;
    display: table-cell;
    vertical-align: middle;
    padding-right: 14px;
    &.edit-yh-icon {
      i {
        font-size: 14px;
        margin-left: 4px;
      }
    }
  }
}

.submit-btn {
  border-radius: 0;
}
</style>
