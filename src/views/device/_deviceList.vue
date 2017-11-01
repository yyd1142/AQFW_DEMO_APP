<template>
  <div>
    <div class="placeholder-item"></div>
    <mko-header title="设施设备" left-icon="icon-back" right-icon-text="刷新" @handleLeftClick="back"
                @handleRightClick="loadTop"></mko-header>
    <div class="page-wrap device-sel-wrap" id="pageWrapper">

      <!--头部按钮-->
      <!--<mko-nav-bar is-header>-->
        <!--<mko-tab-item is-header :label="item.text" :activied="item.actived" @handleTabClick="tab"-->
                      <!--v-for="(item,i) in headerBtnItems"></mko-tab-item>-->
      <!--</mko-nav-bar>-->


      <!--筛选-->
      <div class="device-selecetd" @click="popupShow = true">
        <i class="selected-icon"></i>
        <div v-if="!isSelected" class="selected-text">筛选</div>
        <div class="selected-text" v-else>
          <span
            class="system-text">{{text.systemText || '全部'}}</span>-{{text.jzLevelText || '全部'}}-{{text.statusText || '全部'}}
        </div>
      </div>
      <!--数据-->
      <mt-loadmore :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                   :bottom-all-loaded="bottomAllLoaded" ref="loadmore" :auto-fill="autoFill">
        <ul class="device-table-view" v-show="tabI==0">
          <li class="device-table-cell" @click="linkPath('/device/' + item.id)"
              v-for="(item, index) in dwFacilitiesDatas">
            <span
              class="code">{{item.systemName || '未知设备'}}-{{item.brand || '未知品牌'}}/{{item.model || '未知型号'}}-{{item.SSSBCode || '暂无设备号'}}</span>
            <span
              class="address">{{item.jzName || '暂无'}}-{{item.jzLevel + '楼' || '暂无'}}-{{item.jzPosition || '暂无'}}</span>
            <span class="badge" :style="{ backgroundColor: statusColor[item.status] }"
                  v-text="statusText[item.status]"></span>
          </li>
        </ul>
        <div v-show="tabI==1">
          <mko-double-cell v-for="item in mountPointDatas"></mko-double-cell>
        </div>
      </mt-loadmore>
    </div>
    <no-data class="not-data-wrap" v-show="noData"></no-data>
    <!--弹出框-->
    <mko-popup-right v-model="popupShow" @reset="resetData(1)" @confirm="confirm(1)" v-if="tabI==1">
      <mko-select-box title="建筑单位" :options="options.jzInfos" :selected="[formData.jzID]" @select="chooseJzInfo"
                      name-key="jzName" value-key="jzID" :column="1" show-value></mko-select-box>
      <mko-select-box title="楼层" :options="options.jzLevels" :selected="[formData.jzLevel]" @select="chooseJzLevel"
                      name-key="label" :column="4" v-if="isSelectedJZ" show-value></mko-select-box>

    </mko-popup-right>
    <div class="popup-wrap" v-if="tabI==0">
      <mt-popup v-model="popupShow" position="right">
        <div class="body-wrap">
          <!--<div class="radio-wrap">-->
          <!--<p class="title">所属设备系统</p>-->
          <!--<div @click="chooseSystems(item)" v-for="item in options.systemsDatas">-->
          <!--<mt-button class="radio jzyh-radio" :class="{'checked' : formData.systemID == item.systemID }" -->
          <!--size="large">-->
          <!--<span class="sign has-gutter" -->
          <!--v-show="formData.systemID == item.systemID"></span>{{item.systemName}}-->
          <!--</mt-button>-->
          <!--</div>-->
          <!--</div>-->
          <div class="radio-wrap">
            <p class="title">建筑单位</p>
            <div @click="chooseJzInfo(item)" v-for="item in options.jzInfos">
              <mt-button class="radio jzyh-radio" :class="{'checked' : formData.jzID == item.jzID}" size="large">
                <span class="sign" v-show="formData.jzID == item.jzID"></span>{{item.jzName}}
              </mt-button>
            </div>
          </div>
          <div class="radio-wrap floor-radio-wrap" v-if="isSelectedJZ">
            <p class="title">楼层</p>
            <div @click="chooseJzLevel(item)" v-for="item in options.jzLevels" class="button-wrap">
              <mt-button class="radio" :class="{'checked' : formData.jzLevel == item.value}">
                <span class="sign" v-show="formData.jzLevel == item.value"></span>{{item.label}}
              </mt-button>
            </div>
          </div>
          <div class="radio-wrap floor-radio-wrap">
            <p class="title">设备状态</p>
            <div @click="chooseStatus(item)" v-for="item in options.status" class="button-wrap">
              <mt-button class="radio" :class="{'checked' : formData.status == item.value}">
                <span class="sign" v-show="formData.status == item.value"></span>{{item.label}}
              </mt-button>
            </div>
          </div>
        </div>
        <div class="footer-wrap">
          <mt-button class="reset" @click="resetData(0)"> 重置 </mt-button>
          <mt-button class="confirm" @click="confirm(0)">确定</mt-button>
        </div>
      </mt-popup>
    </div>

  </div>
</template>

<script>
  import api from 'api'
  import { NoData } from 'components'
  import { Toast, Indicator } from 'mint-ui'
  let _enter = true;
  let _data = [
    {bal: false, noData: false, scoTop: 0, page: 1, pageCount: 1, formData: {}, text: {}},
    {bal: false, noData: false, scoTop: 0, page: 1, pageCount: 1, formData: {}, text: {}},
  ];
  let _count = 15;
  export default {
    data() {
      return {
        tabI: 0,
        headerBtnItems: [
          {text: '设施设备', actived: true},
          {text: '安装点', actived: false}
        ],
//        筛选
        popupShow: false,
        isSelected: false,
        isSelectedJZ: false,
        formData: {
          systemID: '',
          jzID: '',
          jzLevel: '',
          status: ""
        },
        text: {systemText: '', jzLevelText: '', statusText: ''},
        //location: [],
//        数据
        noData: false,
        dwFacilitiesDatas: [],  //设施设备
        mountPointDatas: [],  //安装点
        pageItem: {},
//        load-more
        autoFill: false,
        bottomAllLoaded: false,
        topStatus: '',
        bottomStatus: '',
//        固定信息
        options: {
          systemsDatas: [],
          jzLevels: 0,
          jzInfos: [],
          status: [
            {value: 1, label: '正常'},
            {value: 2, label: '故障'},
            {value: 3, label: '维修中'},
            {value: 4, label: '停用'}
          ]
        },
        statusText: ['未知', '正常', '故障', '维修中', '停用'],
        statusColor: ['#ffffff', '#00E460', '#ef4f4f', '#ffb224', '#a0a0a0'],
      }
    },
    watch: {
      popupShow: function (val) {
        this.onPopupShow(val);
        if (val) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = 'auto'
        }
      }
    },
    mounted() {

    },
    activated() {
      window.addEventListener('scroll', this.handleScroll);

      this.$nextTick(() => {

        if (_enter) {
          scrollTo(0, 0);
          this.dwFacilities();
          this.mountPoint();
          this.isSelected = false;
          this.formData = {
            systemID: '',
            jzID: '',
            jzLevel: '',
            status: ''
          };
          this.text = {
            systemText: '',
            jzLevelText: '',
            statusText: ''
          }
        }else{
          scrollTo(0, _data[this.tabI].scoTop);
        }

        api.getJZList({
          m: 'list',
          groupId: this.$store.getters.groupId
        }).then(result => {
          if (result.code === 0) {
            if (result.response.length > 0) {
              this.options.jzInfos = result.response;
            } else {
              this.options.jzInfos = []
            }
          } else {
            this.options.jzInfos = []
          }
        });
      })
    },
    deactivated() {
      document.body.style.overflow = 'auto';
      window.mkoBackButton.bInputData = false;
      window.mkoBackButton.callback = null;
      window.removeEventListener('scroll', this.handleScroll)

    },
    methods: {
      tab(label){
        this.headerBtnItems.forEach((item, i) => {
          item.actived = false;
          if (item.text == label) {
            item.actived = true;
            this.tabI = i;
            this.bottomAllLoaded = _data[i].bal;
            this.noData = _data[i].noData;
            this.$nextTick(() => {
              scrollTo(0, _data[i].scoTop);
            });
          }
        });
      },
      mountPoint(){
        this.noData = _data[1].noData = true;
      },
      dwFacilities(type) {
        let params = {
          page: 1,
          count: _count,
          m: 'list',
          groupId: this.$store.getters.groupId
        };
        if (type == 'sel') {
          params['systemID'] = this.formData.systemID;
          params['status'] = this.formData.status
          if (this.formData.jzLevel != '') {
            params['jzLevel'] = this.formData.jzLevel;
          }
        }
        api.dwFacilities(params).then(result => {
          this.$refs.loadmore.onTopLoaded();
          Indicator.close();
          this.popupShow = false;
          if (result.code == 0) {
            if (result.response.datas === undefined || result.response.datas.length <= 0) {
              this.dwFacilitiesDatas = [];
              this.noData = _data[0].noData = true;
              return false;
            }
            if (result.response.datas.length > 0) {
              this.dwFacilitiesDatas = result.response.datas;
              this.noData = _data[0].noData = false;
            } else {
              this.dwFacilitiesDatas = [];
            }
            _data[0].page = JSON.parse(result.response.page);
            _data[0].pageCount = JSON.parse(result.response.pageCount);
            _enter = false;
          }
        })
      },
//      筛选
      resetData() {
        this.formData = {
          systemID: '',
          jzLevel: '',
          status: "",
          jzID: ''
        };
        this.isSelected = false;
        this.dwFacilities();
      },
      confirm() {
        this.isSelected = true;
        this.bottomAllLoaded = _data[this.tabI].bal = false;
        this.dwFacilities('sel');
      },
      chooseSystems(item) {
        this.text.systemText = item.systemName;
        this.formData.systemID = item.systemID;
      },
      chooseJzInfo(item) {
        this.formData.jzLevel = ''
        let jzDSNumber = item.jzDSNumber >= 100 ? 100 : item.jzDSNumber;
        let jzDXNumber = item.jzDXNumber;
        let arr1 = [];
        let arr2 = [];
        for (let i = 1; i <= jzDSNumber; i++) {
          arr1.push({
            label: `${i}楼`,
            value: i
          });
        }
        for (let i = 1; i <= jzDXNumber; i++) {
          arr2.push({
            label: `负${i}楼`,
            value: -i
          });
        }
        this.formData.jzID = item.jzID;
        this.options.jzLevels = arr2.concat(arr1);
        this.isSelectedJZ = true;
        this.text.systemText = item.jzName
        this.text.jzLevelText = '';
      },
      chooseJzLevel(item) {
        this.text.jzLevelText = item.label;
        this.formData.jzLevel = item.value
      },
      chooseStatus(item) {
        this.text.statusText = item.label;
        this.formData.status = item.value
      },
//      loadmore
      loadTop() {
        Indicator.open({spinnerType: 'fading-circle'});
        setTimeout(() => {
          this.resetData()
          //          this.dwFacilities()
          this.bottomAllLoaded = _data[this.tabI].bal = false;
          Toast({
            message: '刷新完成',
            position: 'middle',
            duration: 1500
          });
        }, 1500)
      },
      loadBottom() {
        let _ti = this.tabI;
        if (_data[_ti].page == _data[_ti].pageCount) {
          Toast({
            message: '暂无更多数据',
            position: 'middle',
            duration: 1500
          });
          this.bottomAllLoaded = _data[_ti].bal = true;
          this.$refs.loadmore.onBottomLoaded();
          return false;
        }
        _data[_ti].page = _data[_ti].page + 1;

        if (_ti == 0) {
          let params = {
            page: _data[0].page,
            count: _count,
            m: 'list',
            groupId: this.$store.getters.groupId
          };
          if (this.formData.jzLevel != '') {
            params['jzLevel'] = this.formData.jzLevel;
          }
          if (this.formData.systemID != '') {
            params['systemID'] = this.formData.systemID;
          }
          if (this.formData.status != '') {
            params['status'] = this.formData.status;
          }
          api.dwFacilities(params).then(result => {
            this.bottomAllLoaded = _data[0].bal = true;
            this.$refs.loadmore.onBottomLoaded();
            this.popupShow = false;
            if (result.code == 0) {
              if (result.response.datas === undefined || result.response.datas.length <= 0) {
                Toast({
                  message: '暂无更多数据',
                  position: 'middle',
                  duration: 1500
                });
                this.bottomAllLoaded = _data[0].bal = true;
                return false;
              }
              if (result.response.datas.length > 0) {
                this.dwFacilitiesDatas = this.dwFacilitiesDatas.concat(result.response.datas);
              }
              _data[0].page = JSON.parse(result.response.page);
              _data[0].pageCount = JSON.parse(result.response.pageCount);
            }
          })
        } else if (_ti == 1) {

        }
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
//      center
      onPopupShow(bool) {
        let self = this;
        window.mkoBackButton = {};
        window.mkoBackButton.bInputData = bool;
        if (window.mkoBackButton.bInputData)
          window.mkoBackButton.callback = function () {
            self.popupShow = false;
          }
      },
      handleScroll() {
        this.$nextTick(() => {
          _data[this.tabI].scoTop = document.documentElement.scrollTop || document.body.scrollTop;
          let totalHeight = document.getElementById('pageWrapper').offsetHeight;
          let scrollTop = document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
          let clientHeight = 0;
          if (document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
          } else {
            clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
          }
          let scrollBottom = totalHeight - scrollTop - clientHeight;
          this.bottomAllLoaded = _data[this.tabI].bal = scrollBottom <= 0 ? false : true;
        })
      },
      back() {
        this.$MKOPop();
        _enter = true;
      },
      linkPath(path) {
        if (this.topStatus == 'loading' || this.bottomStatus == 'drop' || this.bottomStatus == 'loading') {
          return false;
        }
        this.$MKOPush(path)
      },
    },
    components: {
      NoData
    }
  }
</script>


<style lang="less" scoped>
  @import "../../config.less";

  .device-sel-wrap {
    padding-bottom: 0;
    .sel-wrap {
      display: flex;
      display: -webkit-flex;
      .sel {
        flex: 1;
        -webkit-flex: 1;
        height: 30px;
        font-size: 14px;
        border-radius: 4px;
        color: #999;
      }
    }
  }

  .device-selecetd {
    width: 100%;
    color: @blueColor;
    background-color: #fff;
    margin-bottom: 14px;
    display: table;
    .selected-icon {
      background: url('/static/icons/resource.png') 0 0 no-repeat;
      background-size: 892px auto;
    }
    .selected-text {
      font-size: 14px;
      line-height: 40px;
      height: 40px;
      text-align: center;
      display: table-cell;
      vertical-align: middle;
    }
  }

  .device-table-view {
    list-style: none;
    display: block;
    margin: 0;
    width: 100%;
    background-color: #ffffff;
    box-sizing: border-box;
    padding: 0 0 0 14px;
    .device-table-cell:last-child {
      border-bottom: none !important;
    }
    .device-table-cell {
      width: 100%;
      margin: 0 auto;
      padding: 0;
      .border-btm(@borderColor);
      height: 60px;
      position: relative;
      .code {
        display: block;
        font-size: 14px;
        color: #232323;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        padding: 9px 75px 0 0;
      }
      .address {
        width: 100%;
        display: block;
        font-size: 12px;
        color: #606060;
        padding-top: 6px;
      }
      .badge {
        width: 50px;
        height: 20px;
        font-size: 12px;
        color: #ffffff;
        position: absolute;
        text-align: center;
        line-height: 20px;
        top: 0;
        bottom: 0;
        right: 14px;
        margin: auto;
        border-radius: 2px;
        z-index: 10;
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
      height: 100%;
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
          margin-bottom: 6px; // height: 30px;
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
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
            min-width: 50px; // height: 30px;
            margin-right: 4px;
            font-size: 13px;
          }
        }
        & + .radio-wrap {
          margin-top: 20px;
          padding-top: 20px;
          .border-top(#D8D8D8);
        }
      }
    }
    .footer-wrap {
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: #fff;
      .mint-button {
        float: left;
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

  .button-wrap {
    width: 25%;
    display: inline-block;
  }

  .jzyh-radio {
    font-size: 12px;
  }

  .system-text {
    min-width: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-flex;
  }
</style>
