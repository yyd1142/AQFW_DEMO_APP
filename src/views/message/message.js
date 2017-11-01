import api from 'api';
import { NoData, ResError } from 'components'
import { formatDate } from 'filters';
import { Indicator, Toast } from 'mint-ui';

var _userName = ''
var count = 15;
var loadMorecount = 10;
export default {
  data() {
    return {
      page: 1,
      systemMessages: [],
      //提示
      resError: false,
      notData: false,
      autoFill: false,
      bottomAllLoaded: false,
      bottomStatus: '',
      pageItem: {},
      topStatus: ''
    }
  },
  activated() {
    window.addEventListener('scroll', this.handleScroll);
    if (this.resError || new Date(sessionStorage.getItem(`KEEP_ALIVE_RESET_TIME_message`)) < new Date() || _userName != this.$store.getters.userName) {
      this.getData();
    }
    if (sessionStorage.getItem('MESSAGEDETAIL_READ_STATUS')) {
      let msgItem = JSON.parse(sessionStorage.getItem('MESSAGEDETAIL_READ_STATUS'))
      this.systemMessages.forEach((item) => {
        item.status = item.id == msgItem.id ? msgItem.status : item.status;
      })
    }
  },
  deactivated() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    getData() {
      this.resError = false;
      this.systemMessages = [];
      api.getMsgList({
        userName: this.$store.getters.userName,
        page: 1,
        count: count
      }).then(res => {
        _userName = this.$store.getters.userName;
        Indicator.close();
        this.$refs.loadmore.onTopLoaded();
        if (!res) {
          this.resError = true;
          return;
        }
        if (res.code === 0) {
          this.$APPUpdateTime('message') //记录该页面本次请求接口的时间
          if (res.response.datas === undefined || res.response.datas.length == 0) {
            this.notData = true;
          } else {
            this.systemMessages = res.response.datas
            this.pageItem = {
              "page": res.response.page,
              "pageCount": res.response.pageCount,
              "count": res.response.count,
              "countNumber": res.response.countNumber
            }
            this.notData = false;
            if (res.response.datas.length < count)
              this.bottomAllLoaded = true;
          }
        }
      })
    },
    linkPath(item) {
      if (this.bottomStatus == 'drop' || this.bottomStatus == 'loading' || this.topStatus == 'drop' || this.topStatus == 'loading') {
        return false;
      }
      let isRead = item.isRead == 0 ? false : true;
      this.$MKOPush({
        path: `/message/${item.id}`,
        query: {
          status: item.status
        }
      })
    },
    back() {
      this.$MKOPop()
    },
    // 分页
    loadBottom() {
      setTimeout(() => {
        if (this.pageItem.page == this.pageItem.pageCount) {
          Toast({
            message: '暂无更多数据',
            position: 'middle',
            duration: 1500
          });
          this.bottomAllLoaded = true;
          this.$refs.loadmore.onBottomLoaded();
          return false;
        }
        this.pageItem.page = this.pageItem.page + 1;
        api.getMsgList({
          userName: this.$store.getters.userName,
          page: this.pageItem.page,
          count: count
        }).then(res => {
          this.bottomAllLoaded = true;
          this.$refs.loadmore.onBottomLoaded();
          if (!res) {
            this.resError = true;
            return;
          }
          if (res.code === 0) {
            if (res.response.datas === undefined || res.response.datas.length == 0) {
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
              this.systemMessages = this.systemMessages.concat(res.response.datas);
              this.pageItem = {
                page: res.response.page,
                pageCount: res.response.pageCount,
                count: res.response.count,
                countNumber: res.response.countNumber
              }
            }
          }
        })
      }, 1500);
    },
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    handleTopChange(status) {
      this.topStatus = status;
    },
    refresh() {
      Indicator.open({ spinnerType: 'fading-circle' });
      setTimeout(() => {
        sessionStorage.removeItem('MESSAGEDETAIL_READ_STATUS')
        this.bottomAllLoaded = false
        this.getData()
        Toast({
          message: '刷新完成',
          position: 'middle',
          duration: 1500
        });
      }, 1500)
    },
    titleFilters(val) {
      let strLength = val.length;
      if (strLength >= 13) {
        val = `${val.substring(0, 13)}...`;
      }
      return val;
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
        if(scrollTop === 0) {
          //刷新
        }
        this.bottomAllLoaded = scrollBottom <= 0 ? false : true;
      })
    }
  },
  components: {
    NoData,
    ResError
  }
}
