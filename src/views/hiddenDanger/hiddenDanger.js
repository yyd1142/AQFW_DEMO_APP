import api from 'api';
import { NoData, ResError } from 'components';
import { Indicator, Toast } from 'mint-ui';
import { formatDate } from 'filters';

var needUpdate = [
  {},
  { isupdate: true, datas: [], type: 1, bottomAllLoaded: false, page: 1 },
  { isupdate: true, datas: [], type: 2, bottomAllLoaded: false, page: 1 },
  { isupdate: true, datas: [], type: 3, bottomAllLoaded: false, page: 1 }];

export default {
  data() {
    return {
      notData: false,
      resError: false,
      hiddenDangers: [],
      tabs: [{ actived: 'actived', text: '未处置', type: 1 }, { actived: '', text: '处置中', type: 3 }, { actived: '', text: '已处置', type: 2 }],
      hiddenDangersType: 1,
      hiddenDangersDatas: [],
      autoFill: false,
      bottomAllLoaded: false,
      bottomStatus: ''
    }
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.isAdmin;
    }
  },
  activated() {
    window.addEventListener('scroll', this.handleScroll);
    this.$nextTick(() => {
      this.getData(1, this.hiddenDangersType);
    });
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    getData(page, type, isloadTop) {
      Indicator.open({ spinnerType: 'fading-circle' });
      api.getYhkList({
        groupId: this.$store.getters.groupId,
        status: type,
        page: 1,
        count: 10
      }).then(res => {
        Indicator.close();
        if (!res) {
          this.resError = true;
          return;
        }
        this.$refs.loadmore.onBottomLoaded();
        if (res.code === 0) {
          if (res.response.datas === undefined || res.response.datas.length == 0) {
            needUpdate[type] = { isupdate: false, type: type, datas: [], bottomAllLoaded: false, page: 1 };
            this.hiddenDangers = [];
            this.notData = true;
          } else {
            needUpdate[type] = { isupdate: false, type: type, datas: res.response.datas, bottomAllLoaded: true, page: res.response.page, pageCount: res.response.pageCount, count: res.response.count, countNumber: res.response.countNumber };
            this.hiddenDangers = res.response.datas;
            this.notData = false;
          }
          this.resError = false;
        }
      })
    },
    tab(item, index) {
      this.tabs.forEach((item) => {
        if (this.tabs.indexOf(item) == index) {
          item.actived = 'actived'
        } else {
          item.actived = ''
        }
      });
      this.notData = false;
      this.hiddenDangersType = item.type;
      this.bottomAllLoaded = needUpdate[item.type].bottomAllLoaded;
      if (needUpdate[item.type].datas.length <= 0) {
        this.getData(1, this.hiddenDangersType);
      } else {
        this.hiddenDangers = needUpdate[item.type].datas;
        if (this.hiddenDangers.length <= 0)
          this.notData = true;
      }
    },
    // 分页
    loadBottom() {
      setTimeout(() => {
        if (needUpdate[this.hiddenDangersType].page == needUpdate[this.hiddenDangersType].pageCount) {
          Toast({
            message: '暂无更多数据',
            position: 'middle',
            duration: 1500
          });
          this.bottomAllLoaded = true;
          this.$refs.loadmore.onBottomLoaded();
          return;
        }
        let page = needUpdate[this.hiddenDangersType].page;
        page = page + 1;
        api.getYhkList({
          groupId: this.$store.getters.groupId,
          status: this.hiddenDangersType,
          page: page,
          count: 10
        }).then(result => {
          this.bottomAllLoaded = true;
          this.$refs.loadmore.onBottomLoaded();
          if (result.code == 0) {
            if (result.response.datas === undefined || result.response.datas.length == 0) {
              Toast({
                message: '暂无更多数据',
                position: 'middle',
                duration: 1500
              });
            } else {
              Toast({
                message: '加载完成',
                position: 'middle',
                duration: 1500
              });
              this.hiddenDangers = this.hiddenDangers.concat(result.response.datas);
              needUpdate[this.hiddenDangersType] = {
                isupdate: false,
                type: this.hiddenDangersType,
                datas: this.hiddenDangers,
                bottomAllLoaded: true,
                page: result.response.page,
                pageCount: result.response.pageCount,
                count: result.response.count,
                countNumber: result.response.countNumber
              };
            }
          } else {

          }
        })
      }, 1500);
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    back() {
      this.$MKOPop()
    },
    linkPath(path) {
      if (this.bottomStatus == 'loading' || this.bottomStatus == 'drop') {
        return false;
      }
      this.$MKOPush(path)
    },
    goHiddenDangerCheck() {
      this.$MKOPush({
        path: '/hidden_danger_check'
      })
    },
    handleScroll() {
      this.$nextTick(() => {
        let totalHeight = document.getElementById('pageWrapper').offsetHeight;
        let scrollTop = document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
        let clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
          clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        } else {
          clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
        }
        let scrollBottom = totalHeight - scrollTop - clientHeight;
        this.bottomAllLoaded = scrollBottom <= 0 ? false : true;
      })
    }
  },
  components: {
    NoData,
    ResError
  }
}


