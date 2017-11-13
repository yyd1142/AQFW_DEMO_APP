import api from 'api';
import moment from 'moment';
import { NoData, Tabs, ScoreBanner, ResError } from 'components';
import { Toast } from 'mint-ui';
import { formatDate, calcHeadColor } from 'filters'
import * as types from 'store/mutation-types'
import xuncha from 'store/modules/xuncha'
import zhiban from 'store/modules/zhiban'
import apiconf from 'apiconf'
import cloneDeep from 'lodash/cloneDeep'

var statusText = ['未开始', '未开始', '进行中', '未上传', '处理中', '待审核', '已完成', '已超期'];
var isloadTop = false;
var page = 1;
var needUpdate = [
    {},
    { isupdate: true, datas: [], type: 1, bottomAllLoaded: false, page: 1 },
    { isupdate: true, datas: [], type: 2, bottomAllLoaded: false, page: 1 },
    { isupdate: true, datas: [], type: 3, bottomAllLoaded: false, page: 1 },
    { isupdate: true, datas: [], type: 4, bottomAllLoaded: false, page: 1 }];
var needUpdateTodayTasks = true;
var updateTodayTasks = {};
let _scoTop = 0;
export default {
    data() {
        return {
            domain: `${apiconf.resourcesDomain}/`,
            todayTasksItem: {
                time: 0,
                today: 0,
                data: {},
                text: ''
            },
            zhibanId: 2,
            selected: '1',
            swipeable: true,
            actionClass: 'action-item',
            adminActions: [
                { class: 'task-icon ', text: '任务执行', url: '/taskComply' },
                { class: 'notice-icon ', text: '通知公告', url: '/notice' },  //admin-has-data-icon
                { class: 'activity-icon', text: '安全活动', url: '/safe_activity' }],
            actions: [
                // { class: 'jibenxinxi-icon', text: '基本信息', url: '/basic_info' },
                { class: 'peixun-icon', text: '教育培训', url: '/train' },
                { class: 'yinhuan-icon', text: '风险管理', url: '/hidden_danger' },
                { class: 'sheshi-icon', text: '设施设备', url: '/device' },
                { class: 'shipin-icon', text: '视频监控', url: '/monitorVideo' },
                { class: 'dianqi-icon', text: '电气监测', url: '/monitorDq' },
                { class: 'jibenxinxi-icon', text: '水系统监测', url: '/monitorSxt' }
                ],
            aq_actions: [
                { class: 'jibenxinxi-icon', text: '基本信息', url: '/basic_info' },
                { class: 'tongzhigonggao-icon', text: '通知公告', url: '/notice' },
                { class: 'peixun-icon', text: '教育培训', url: '/train' }],
            newsTabs: [{ text: '新闻通知', selected: 'news-table-actived', type: 1 }, {
                text: '安全知识',
                selected: false,
                type: 2
            }, { text: '法律法规', selected: false, type: 3 }, { text: '经典案例', selected: false, type: 4 }],
            newsType: 1,
            newsDatas: [],
            autoFill: false,
            bottomAllLoaded: false,
            bottomStatus: '',
            topAllLoaded: false,
            topStatus: '',
            taskOfRecentName: '',
            taskOfRecentTime: '',
            hasTasks: false,
            hasYH: false,
            unitInfo: '',
            score: 0,
            hasMessageDataClass: '',
            resError: false
        }
    },
    activated() {

        window.addEventListener('scroll', this.handleScroll);
        scrollTo(0, _scoTop);
        this.$nextTick(() => {
            this.resError = false;
            this.newsList(1, this.newsType);
            this.hasNewMessage()
            this.unitInfo = JSON.parse(localStorage.getItem('USER_DATA'))
            if (!this.isAdmin) {
                this.fetchTaskOfRecent();
                this.score = 0;
                if (this.$store.state.zhiban) {
                    this.$store.dispatch('clearZhiBanTimer');
                    this.$store.unregisterModule('zhiban', zhiban);
                }
            } else {
                this.safeScore();
            }
        })
    },
    deactivated() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    computed: {
        isAdmin() {
            return this.$store.state.user.isAdmin;
        }
    },
    methods: {
        tab(item, index) {
            this.newsTabs.forEach((obj) => {
                if (index == this.newsTabs.indexOf(obj)) {
                    obj.selected = 'news-table-actived';
                } else {
                    obj.selected = false;
                }
            })
            this.newsType = item.type;
            this.bottomAllLoaded = needUpdate[this.newsType].bottomAllLoaded;
            if (needUpdate[this.newsType].datas.length <= 0) {
                this.newsList(1, this.newsType);
            } else {
                this.newsDatas = needUpdate[this.newsType].datas
            }
        },
        safeScore() {
            let params = {
                m: 'list',
                groupId: this.$store.getters.groupId
            };
            api.getScoreList(params).then(result => {
                if (!result) {
                    if (localStorage.getItem("homeScore")) {
                        this.score = JSON.parse(localStorage.getItem("homeScore"));
                    }
                    return false;
                }
                if (result.code == 0) {
                    if (result.msg.length <= 0) {
                        this.score = 0;
                        return false;
                    }
                    this.score = result.msg[result.msg.length - 1].totalScore;
                    localStorage.setItem("homeScore", JSON.stringify(this.score));
                } else {
                    this.resError = true;
                }
            })
        },
        //新闻列表
        newsList(page, type) {
            if (!needUpdate[type].isupdate && needUpdate[type].type == type) {
                this.newsDatas = needUpdate[type].datas;
                return false;
            }
            let params = {
                informationType: type,
                page: needUpdate[type].page,
                count: 5
            };
            api.getNewsList(params).then(result => {
                if (!result) {
                    if (localStorage.getItem('newsDatas')) {
                        this.newsDatas = JSON.parse(localStorage.getItem('newsDatas'))[type].datas;
                        this.bottomAllLoaded = false;
                    }
                    return false;
                }
                if (result.code == 0) {
                    if (isloadTop) {
                        this.$refs.loadmore.onTopLoaded();
                        Toast({
                            message: '刷新成功',
                            position: 'middle',
                            duration: 1500
                        });
                    }
                    if (result.response.datas.length > 0) {
                        needUpdate[type] = {
                            isupdate: false, type: type,
                            datas: result.response.datas,
                            page: result.response.page,
                            pageCount: result.response.pageCount,
                            bottomAllLoaded: false
                        };
                        this.bottomAllLoaded = false;
                        this.newsDatas = result.response.datas;
                    } else {
                        needUpdate[type] = {
                            isupdate: false,
                            type: type,
                            datas: [],
                            page: result.response.page,
                            pageCount: result.response.pageCount,
                            bottomAllLoaded: true
                        };
                        this.newsDatas = []
                        this.bottomAllLoaded = true;
                    }
                    localStorage.setItem('newsDatas', JSON.stringify(needUpdate));
                } else {
                    this.resError = true;
                }
            })
        },
        // 分页
        loadBottom() {
            setTimeout(() => {
                if (needUpdate[this.newsType].page == needUpdate[this.newsType].pageCount) {
                    Toast({
                        message: '暂无更多数据',
                        position: 'middle',
                        duration: 1500
                    });
                    needUpdate[this.newsType].bottomAllLoaded = true
                    this.bottomAllLoaded = needUpdate[this.newsType].bottomAllLoaded;
                    this.$refs.loadmore.onBottomLoaded();
                    return false;
                }
                needUpdate[this.newsType].page = needUpdate[this.newsType].page + 1
                let params = {
                    informationType: this.newsType,
                    page: needUpdate[this.newsType].page,
                    count: 5
                };
                api.getNewsList(params).then(result => {
                    this.$refs.loadmore.onBottomLoaded();
                    if (result.code == 0) {
                        if (result.response.datas.length == 0) {
                            Toast({
                                message: '暂无更多数据',
                                position: 'middle',
                                duration: 1500
                            });
                            needUpdate[this.newsType].bottomAllLoaded = true;
                            this.bottomAllLoaded = needUpdate[this.newsType].bottomAllLoaded;
                        } else {
                            Toast({
                                message: '加载完成',
                                position: 'middle',
                                duration: 1500
                            });
                            this.newsDatas = this.newsDatas.concat(result.response.datas);
                            this.bottomAllLoaded = false;
                            needUpdate[this.newsType] = {
                                isupdate: false,
                                type: this.newsType,
                                datas: this.newsDatas,
                                page: result.response.page,
                                pageCount: result.response.pageCount,
                                bottomAllLoaded: false
                            }
                        }
                    } else {
                        this.resError = true;
                    }
                })
            }, 1500);
        },
        loadTop() {
            isloadTop = true;
            let type = this.newsType;
            needUpdate[type].isupdate = true;
            this.newsList(1, this.newsType);
        },
        handleBottomChange(status) {
            this.bottomStatus = status;
        },
        handleTopChange(status) {
            this.topStatus = status;
        },
        routerLink(item) {
            if (item.url == 'disabled') {
                Toast({
                    message: '功能未开放',
                    position: 'middle',
                    duration: 1500
                });
                return false;
            }
            this.$nextTick(() => {
                if (item.url == '/enter/tasks') {
                    this.$MKOJump(item.url);
                } else {
                    this.$MKOPush(item.url);
                }
            })
        },
        viewToDayTask() {
            this.$MKOJump(`/taskComply`)
        },
        goNewsInfo(item) {
            if (this.bottomStatus == 'drop' || this.bottomStatus == 'loading') {
                return false;
            }
            this.$MKOPush({
                name: "newsInfo",
                params: {
                    pid: item.id
                },
                query: {
                    type: item.informationType
                }
            })
        },
        goHiddenDangerCheck() {
            this.$MKOPush({
                path: '/hidden_danger_check'
            })
        },
        fetchTaskOfRecent() {
            api.getTaskOfRecent({
                userName: this.$store.state.user.user.userName
            }).then(res => {
                if (!res) {
                    if (localStorage.getItem('todayTasksItem')) {
                        this.todayTasksItem = JSON.parse(localStorage.getItem('todayTasksItem'))
                    }
                    if (localStorage.getItem('hasTasks')) {
                        this.hasTasks = JSON.parse(localStorage.getItem('hasTasks'))
                    }
                    return false;
                }
                if (res.code == 0) {
                    let text = '';
                    let time = '';
                    let s = res.response.startTime - Date.now();
                    let hour = 0;
                    if (s > 3600000) {
                        hour = parseInt(s / 3600000);
                        s = s - (hour * 3600000);
                    }
                    let min = 0;
                    if (s >= 60000) {
                        min = parseInt(s / 60000);
                        s = s - (min * 60000);
                    }
                    if (Date.now() < res.response.startTime) {
                        text = '距离开始还有';
                        time = `${hour}小时${min}分`;
                    } else {
                        if (res.response.status == 1) {
                            text = '请尽快开始任务';
                            time = '';
                        } else {
                            text = `任务状态：${statusText[res.response.status]}`;
                            time = '';
                        }

                    }
                    this.hasTasks = true;
                    this.todayTasksItem = {
                        time: time,
                        today: moment(new Date()).format("YYYY年MM月DD日"),
                        data: res.response,
                        text: text,
                        class: null,
                        notData: false
                    };
                    needUpdateTodayTasks = false;
                    updateTodayTasks = res.response;
                } else if (res.code == 8) {
                    this.todayTasksItem = {
                        time: '',
                        today: moment(new Date()).format("YYYY年MM月DD日"),
                        data: { description: '今日暂无任务', notTask: true },
                        text: '',
                        class: 'not-task-item',
                        notData: true
                    };
                    this.hasTasks = false;
                } else {
                    this.hasTasks = false;
                    this.resError = true;
                }
                localStorage.setItem('todayTasksItem', JSON.stringify(this.todayTasksItem));
                localStorage.setItem('hasTasks', JSON.stringify(this.hasTasks));
            });
        },
        //过滤器
        calcHeadColor,
        //路由
        goScoreInfo() {
            if (this.topStatus != 'loading' && this.score != 0) {
                this.$MKOPush(`/score`)
            } else {
                this.$MKODialog({msg:'暂无安全评分'});
            }
        },
        goTaskInfo() {
            let task = this.todayTasksItem.data;
            if (task.notTask) {
                this.$MKODialog({msg:task.description});
                return false;
            }
            let name = 'xuncha'
            if (task.taskType == 1)
                name = "zhiban"

            if (name == 'xuncha') {
                this.$store.registerModule('xuncha', xuncha);
                this.$store.commit(types.XUNCHA_INIT_TASK_DATA, task);
                localStorage.setItem('lastXunChaTaskId', task.taskId);
                this.$MKOPush({
                    name: name,
                    params: { taskId: task.taskId },
                    query: { from: 'home', isReview: false, fromPath: '/enter/home', name: task.description, }
                })
                return false;
            }
            if (name == 'zhiban') {
                let routerPath = {};
                let taskData = cloneDeep(task);
                this.$store.registerModule('zhiban', zhiban);
                this.$store.commit(types.ZHIBAN_INIT_DATA, taskData);
                localStorage.setItem('lastZhiBanTaskId', task.taskId);
                routerPath = {
                    name: 'zhiban',
                    params: {
                        taskId: task.taskId
                    },
                    query: {
                        from: 'home',
                        fromPath: this.$route.fullPath,
                        name: task.description
                    }
                }
                this.$MKOPush(routerPath, {
                    path: `/home`
                });
                return false;
            }
        },
        goMessage() {
            this.$MKOPush('/message')
        },
        goAdminAction(path) {
            this.$MKOPush(path)
        },
        hasNewMessage() {
            api.hasNewMessage({
                m: 'prompt',
                type: 1
            }).then(result => {
                if (!result) {
                    if (localStorage.setItem('hasNewMessage')) {
                        let data = JSON.parse(localStorage.setItem('hasNewMessage'))
                        this.adminActions[0].class = data.task > 0 ? 'task-icon admin-has-data-icon' : 'task-icon'
                        this.adminActions[1].class = data.notice > 0 ? 'notice-icon admin-has-data-icon' : 'notice-icon'
                        this.aq_actions[1].class = data.notice > 0 ? 'has-tongzhigonggao-icon' : 'tongzhigonggao-icon'
                        this.hasMessageDataClass = data.message > 0 ? 'icon-message-prompt-has' : 'icon-message-prompt-no'
                        this.actions[1].class = data.dwYHK > 0 ? "has-yinhuan-icon" : 'yinhuan-icon'
                        this.resError = false;
                    }
                    return false;
                }
                if (result.code == 0) {
                    let data = result.response;
                    this.adminActions[0].class = data.task > 0 ? 'task-icon admin-has-data-icon' : 'task-icon'
                    this.adminActions[1].class = data.notice > 0 ? 'notice-icon admin-has-data-icon' : 'notice-icon'
                    this.aq_actions[1].class = data.notice > 0 ? 'has-tongzhigonggao-icon' : 'tongzhigonggao-icon'
                    this.hasMessageDataClass = data.message > 0 ? 'icon-message-prompt-has' : 'icon-message-prompt-no'
                    this.actions[1].class = data.dwYHK > 0 ? "has-yinhuan-icon" : 'yinhuan-icon'
                    localStorage.setItem('hasNewMessage', JSON.stringify(data))
                } else {
                    this.resError = true;
                }
            })
        },
        titleFilters(val) {
            let strLength = val.length;
            if (strLength >= 20) {
                val = `${val.substring(0, 20)}...`
            }
            return val;
        },
        handleScroll() {
            this.$nextTick(() => {
                _scoTop = document.documentElement.scrollTop || document.body.scrollTop;
            })
        },
        QRCode() {
            this.$MKOPush({
                path: '/QRCode'
            })
            // this.$ScanQRCode(result => {
            //
            // })
        }
    },
    components: {
        NoData,
        Tabs,
        ScoreBanner,
        ResError
    }
}


