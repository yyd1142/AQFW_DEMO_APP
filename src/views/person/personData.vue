<template>
  <div>
    <div class="placeholder-item"></div>
    <mko-header title="个人资料" left-icon="icon-back" @handleLeftClick="back" :right-icon-text="isEdit ? '取消' : '编辑'" @handleRightClick="editInfo">
      <div class="header-person-edit-btn" slot="custom" @click="saveInfo" v-if="isEdit">保存</div>
    </mko-header>
    <res-error v-if="resError"></res-error>
    <div class="page-wrap person-data-wrap" v-show="!resError">
      <div ref="wrapper">
        <mt-loadmore ref="loadmore" :top-method="loadTop" @top-status-change="handleTopChange" :auto-fill="autoFill">
          <div :style="{ height: wrapperHeight + 'px'}">
            <div class="com-data-wrap" :class="{'is-edit':isEdit}">
              <div class="disabled">
                <mt-cell title="头像">
                  <div class="avatar-wrap">
                    <div class="default"></div>
                    <!--<img class="avatar" src="./logo.png">-->
                  </div>
                </mt-cell>
              </div>
              <mt-cell title="姓名" :value="personData.employeeName">
                <span class="sign" v-if="isEdit">*</span>
                <input class="ipt" type="text" :placeholder="holderText" v-model="formData.employeeName" v-if="isEdit">
              </mt-cell>
              <mt-cell title="电话" :value="personData.phone">
                <a class="phone" :href="'tel:' + personData.phone" v-if="!isEdit&&personData.phone">{{personData.phone}}</a>
                <span class="sign" v-if="isEdit">*</span>
                <input class="ipt" type="text" :placeholder="holderText" v-model="formData.phone" v-if="isEdit">
              </mt-cell>
              <div @click="popupPickerShow('gender')">
                <span></span>
                <mt-cell title="性别" :value="isEdit?genderFilter(formData.gender):genderFilter(personData.gender)" :is-link="isEdit"></mt-cell>
              </div>
              <div @click="datePickerShow">
                <span></span>
                <mt-cell title="生日" :value="isEdit?formatDate(bornDate,'YYYY-MM-DD'):formatDate(personData.bornDate,'YYYY-MM-DD') || '暂无'" :is-link="isEdit"></mt-cell>

              </div>
              <mt-cell title="身份证号" :value="personData.IDNumber||'暂无'">
                <span class="sign" v-if="isEdit">*</span>
                <input class="ipt" type="text" :placeholder="holderText" v-model="personData.IDNumber" v-if="isEdit">
              </mt-cell>
              <!--<div @click="popupPickerShow('job-title')">-->
              <!--<span></span>-->
              <!--<mt-cell title="个人资质" :value="isEdit?formData.jobTitle:personData.jobTitle"-->
              <!--:is-link="isEdit"></mt-cell>-->
              <!--</div>-->
              <!--<div class="imgs-wrap">-->
              <!--<div class="title"><span>职业资格证书</span></div>-->
              <!--<photo-box :max="1" :read-only="!isEdit" :photo-list="images" @addPhotoEvent="sheetShow=true"-->
              <!--@removePhotoEvent="removePhoto()"></photo-box>-->
              <!--</div>-->
            </div>
            <div class="com-data-wrap" :class="{'is-edit':isEdit}">
              <mt-cell title="公司名称" :value="personData.dwName" class="disabled"></mt-cell>
              <mt-cell title="消防角色" :value="personData.role | roleFilter" class="disabled"></mt-cell>
              <mt-cell title="职责" :value="personData.roleRuls | roleRulsFilter" class="disabled"></mt-cell>
            </div>
          </div>
        </mt-loadmore>
      </div>
      <!--弹出框-->
      <mko-popup-bottom :title="popupName" v-model="selPopupShow" @save="selPickerVal" @cancel="selPopupClose">
        <mt-picker :slots="genderList" @change="onGenderChange" v-show="pickerShow=='gender'"></mt-picker>
        <div class="checkbox" v-if="pickerShow=='job-title'">
          <mt-button :class="{'active':history_jobTitle.indexOf(item)!=-1}" @click="onJobTitleChange(item)" v-for="item in jobTitleList">{{item}}
          </mt-button>
        </div>
      </mko-popup-bottom>
      <!--日期选择-->
      <mt-datetime-picker ref="bornDatePicker" type="date" :startDate="startDate" :end-date="new Date()" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" v-model="history_bornDate" @confirm="selDate()"></mt-datetime-picker>
    </div>
  </div>
</template>

<script>
import api from 'api';
import { ResError, PhotoBox } from 'components'
import { Toast} from 'mint-ui'
import { formatDate, roleFilter, genderFilter } from 'filters';
import moment from 'moment'
import conf from '../../config.js'
let history_gender = 0;
let valid_key = ['employeeName', 'phone', 'IDNumber'];
export default {
  data() {
    return {
      //提示
      resError: false,
      //loadMore
      wrapperHeight: 0,
      autoFill: false,
      topStatus: '',
      //数据
      personData: {},
      images: [],
      //编辑
      holderText: '请完善信息',
      startDate: new Date(1970, 0, 1),
      selPopupShow: false,
      pickerShow: '',
      isEdit: false,
      isValidate: false,
      imagesIsChange: false,
      history_bornDate: new Date(),
      history_jobTitle: '',
      bornDate: '', //与formData.bornDate同步
      formData: {
        employeeName: '',
        phone: ''
      },
      genderList: [{ flex: 1, values: ['男', '女'] }],
      jobTitleList: conf.jobTitleList,
      //控制
      sheetShow: false,
      actions: [],
    }
  },
  watch: {
    selPopupShow: function(val) {
      if (!val) {
        this.pickerShow = '';
        document.body.style.overflow = 'auto'
      } else {
        document.body.style.overflow = 'hidden'
      }
    },
    formData: {
      handler() {
        this.validForm();
      },
      deep: true
    }
  },
  computed: {
    popupName() {
      let names = {
        'gender': '性别',
        'job-title': '个人资质',
      };
      return names[this.pickerShow] || ''
    },
  },
  mounted() {
    this.wrapperHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight) - this.$refs.wrapper.getBoundingClientRect().top;
    this.actions = [
      { name: '拍照', method: this.takePhoto },
      { name: '从相册中选择', method: this.choosePhoto }
    ];
  },
  activated() {
    this.$nextTick(() => {
      this.getLocalData();
      this.onInputData();
    });
  },
  deactivated() {
    window.mkoBackButton.bInputData = false;
    document.body.style.overflow = 'auto';
    this.selPopupShow = false;
    this.$refs.bornDatePicker.close();
    this.isEdit = false;
    this.isValidate = false;
  },
  methods: {
    formatDate,
    roleFilter,
    genderFilter,
    getLocalData() {
      let local = localStorage['USER_DATA'];
      if (local && local.length > 0) {
        try {
          this.personData = JSON.parse(local);
        } catch (err) {
        }
        let data = this.personData;
        this.bornDate = data.bornDate;
        for (let key in data) {
          this.formData[key] = data[key]
        }
      } else {
        this.UpdateData();
      }
    },
    UpdateData() {
      api.getUserData({
        userName: this.$store.getters.userName
      }).then(res => {
        this.$refs.loadmore.onTopLoaded();
        if (!res)
          return;
        try {
          localStorage.setItem('USER_DATA', JSON.stringify(res.response));
        } catch (err) {
        }
        this.personData = res.response;
        let data = this.personData;
        for (let key in data) {
          this.formData[key] = data[key]
        }
      });
    },
    loadTop() {
      let timer = setTimeout(() => {
        this.UpdateData();
        clearTimeout(timer);
      }, 1000);
    },
    handleTopChange(status) {
      this.topStatus = status;
    },
    //编辑按钮
    editInfo() {
      let form = this.formData;
      if (!this.isEdit) {
        this.bornDate = form.bornDate;
        this.validForm();
        this.isEdit = true;
        return false;
      }

      for (let key in form) {
        form[key] = this.personData[key];
      }
      this.bornDate = form.bornDate;
      this.isEdit = false;
    },
    validForm() {
      for (let key of valid_key) {
        if (!this.formData[key] && this.formData[key] !== 0) {
          this.isValidate = false;
          return false;
        }
      }
      this.isValidate = true;
    },
    saveInfo() {
      if (!this.isValidate)
        return false;

      let form = {};
      for (let key in this.formData) {
        form[key] = this.formData[key]
      }
      form.bornDate = moment(form.bornDate).format("YYYY-MM-DD 00:00");
      api.postPerson(form, { m: 'update' }).then(res => {
        if (res && res.code == 0) {
          for (let key in form) {
            this.personData[key] = form[key];
          }
          try {
            sessionStorage.setItem('USER_DATA', JSON.stringify(this.personData));
          } catch (err) {
          }
          Toast({ message: '修改成功！', duration: 1000 });
        } else {
          Toast({ message: '修改失败！', duration: 1000 });
        }
      });
      this.isEdit = false;
    },
    //弹出框
    selPopupClose() {
      this.selPopupShow = false;
    },
    popupPickerShow(picker) {
      if (this.isEdit) {
        let that = this;
        let fns = {
          'gender': function() {
            that.genderList[0].defaultIndex = that.formData.gender - 1;
          },
          'job-title': function() {
            that.history_jobTitle = that.formData.jobTitle;
          }
        };
        if (fns[picker])
          fns[picker]();
        this.selPopupShow = true;
        this.pickerShow = picker;
      }
    },
    selPickerVal() {
      let that = this;
      let form = this.formData;
      let Fns = {
        'gender': function() {
          form.gender = history_gender;
        },
        'job-title': function() {
          form.jobTitle = that.history_jobTitle;
        }
      };
      if (Fns[this.pickerShow])
        Fns[this.pickerShow]();
      this.selPopupShow = false;
    },
    //时间
    datePickerShow() {
      if (this.isEdit) {
        this.history_bornDate = this.formData.bornDate ? new Date(this.formData.bornDate) : new Date();
        this.$refs.bornDatePicker.open();
      }
    },
    selDate() {
      this.bornDate = this.formData.bornDate = this.history_bornDate;
    },
    //联动
    onGenderChange(picker, vals) {
      let list = this.genderList[0].values;
      for (let i = 0; i < list.length; i++) {
        if (list[i] == vals[0])
          history_gender = i + 1;
      }
    },
    onJobTitleChange(val) {
      let arr = [];
      if (this.history_jobTitle)
        arr = this.history_jobTitle.split(',');
      (function() {
        for (let key in arr) {
          if (arr[key] == val) {
            arr.splice(key, 1);
            return;
          }
        }
        arr.push(val);
      })();
      this.history_jobTitle = arr.join(',');
    },
    //照片
    takePhoto() {
      this.$takePhoto((photo) => {
        this.images.push(photo.url);
        this.imagesIsChange = true;
      });
    },
    choosePhoto() {
      this.$choosePhoto((photos) => {
        for (let photo of photos) {
          this.images.push(photo.url);
          this.imagesIsChange = true;
        }
      });
    },
    removePhoto(index) {
      this.images.splice(index, 1);
      this.imagesIsChange = true;
    },
    //
    back() {
      if (this.isEdit) {
        this.$MKODialog({
          title: '真的要返回吗',
          msg: '编辑信息还未保存',
          cancelBtn: true,
        }).then(action => {
          if (action === 'confirm') {
            this.$MKOPop();
          }
        });
        return;
      }
      this.$MKOPop();
    },
    onInputData() {
      window.mkoBackButton = {};
      window.mkoBackButton.bInputData = true;
      window.mkoBackButton.callback = this.back;
    }
  },
  components: {
    ResError, PhotoBox
  }
}
</script>

<style lang="less" rel="stylesheet/less">
@import "../../config.less";
.header-person-edit-btn {
  position: absolute;
  right: 59px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  z-index: 10;
}

.header-item.edit {
  margin-left: 10px;
}

.person-data-wrap {
  padding-bottom: 0;
  .avatar-wrap {
    margin: 10px 0;
    width: 60px;
    height: 60px;
    .default {
      height: 100%;
      background: url(/static/icons/resource.png) -654px 0 no-repeat;
      background-size: 892px auto;
    }
    .avatar {
      width: 100%;
    }
  }
  .mint-popup-bottom .p-body {
    /*overflow: scroll;*/
    .checkbox .mint-button {
      width: 100%;
      margin: 0;
      margin-bottom: 5px;
    }
  }
}
</style>
