import api from 'api'
import { Indicator, Toast } from 'mint-ui'
import { formatDate } from 'filters'
import { NoData } from 'components'

var updateDatas = [];
var needUpdate = true;
var _userName = ''
var count = 10;
var loadMorecount = 10;
export default {
    data() {
        return {
            list: [],
            notices: [],
            autoFill: false,
            bottomAllLoaded: false,
            notData: false,
            bottomStatus: '',
            page: 1,
            pageItem: {}
        }
    },
    activated() {
        window.addEventListener('scroll', this.handleScroll);
        if (new Date(sessionStorage.getItem(`KEEP_ALIVE_RESET_TIME_notice`)) < new Date() || _userName != this.$store.getters.userName) {
            this.noticeList();
        }
        if (sessionStorage.getItem('NOTICEDETAIL_READ_STATUS')) {
            let noticeItem = JSON.parse(sessionStorage.getItem('NOTICEDETAIL_READ_STATUS'))
            this.notices.forEach((item) => {
                item.status = item.id == noticeItem.id ? noticeItem.status : item.status;
            })
        }
    },
    deactivated() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        linkPath(item) {
            if (this.bottomStatus == 'drop' || this.bottomStatus == 'loading' || this.topStatus == 'drop' || this.topStatus == 'loading') {
                return false;
            }
            this.$MKOPush({
                path: `/notice/${item.id}`,
                query: {
                    status: item.status
                }
            })
        },
        noticeList() {
            let params = {
                m: 'list',
                userName: this.$store.getters.userName,
                page: 1,
                count: count
            }
            this.notices = []
            api.getNoticesList(params).then(result => {
                _userName = this.$store.getters.userName
                this.$refs.loadmore.onTopLoaded();
                if (!result) {
                    this.notData = true;
                    Indicator.close()
                    return false;
                }
                if (result.code == 0) {
                    this.$APPUpdateTime('notice') //记录该页面本次请求接口的时间
                    if (result.response.datas === undefined || result.response.datas.length == 0) {
                        updateDatas = [];
                        this.notices = [];
                        this.notData = true;
                    } else {
                        updateDatas = result.response.datas;
                        this.pageItem = {
                            "page": result.response.page, "pageCount": result.response.pageCount, "count": result.response.count, "countNumber": result.response.countNumber
                        }
                        this.notices = result.response.datas;
                        this.notData = false;
                    }
                } else {
                    this.notData = true;
                }
                needUpdate = false;
                Indicator.close()
            })
        },
        handleBottomChange(status) {
            this.bottomStatus = status;
        },
        // 分页
        loadBottom() {
            setTimeout(() => {
                if (this.pageItem.pageCount == this.pageItem.page) {   //总页数少于1页，不支持分页功能
                    Toast({
                        message: '暂无更多数据',
                        position: 'middle',
                        duration: 1500
                    });
                    this.bottomAllLoaded = true;
                    this.$refs.loadmore.onBottomLoaded();
                    return;
                }
                this.pageItem.page = this.pageItem.page + 1
                let params = {
                    m: 'list',
                    userName: this.$store.getters.userName,
                    page: this.pageItem.page,
                    count: count
                }
                api.getNoticesList(params).then(result => {
                    this.bottomAllLoaded = true;
                    this.$refs.loadmore.onBottomLoaded();
                    if (result.code == 0) {
                        if (result.response.datas.length <= 0) {
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
                            if (!needUpdate) {
                                updateDatas = updateDatas.concat(result.response.datas);
                                this.notices = updateDatas;
                            } else {
                                this.notices = this.notices.concat(result.response.datas);
                            }
                        }
                    } else {

                    }
                })
            }, 1500);
        },
        back() {
            this.$MKOPop()
        },
        refresh() {
            Indicator.open({ spinnerType: 'fading-circle' });
            setTimeout(() => {
                sessionStorage.removeItem('NOTICEDETAIL_READ_STATUS')
                this.bottomAllLoaded = false
                this.notices = [];
                this.noticeList()
                Toast({
                    message: '刷新完成',
                    position: 'middle',
                    duration: 1500
                });
            }, 1500)
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
                this.bottomAllLoaded = scrollBottom  <= 0 ? false : true;
            })
        }
    },
    components: {
        NoData
    }
}
