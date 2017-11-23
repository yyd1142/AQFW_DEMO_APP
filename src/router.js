import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({
    showSpinner: false,
    easing: 'ease',
    speed: 1000,
    template: '<div class="page-progress-bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
}); //进度条配置

//登陆
const login = resolve => require(['views/login/login.vue'], resolve)
//首页
const Enter = resolve => require(['./views/enter/enter.vue'], resolve)
const Home = resolve => require(['./views/home/home.vue'], resolve)
//新闻
const newsInfo = resolve => require(['views/news/newsInfo.vue'], resolve)
//消息
const message = resolve => require(['./views/message/message.vue'], resolve)
const messageDetail = resolve => require(['views/message/info.vue'], resolve)
//通知公告
const noticeList = resolve => require(['views/notice/noticeList.vue'], resolve)
const noticeDetail = resolve => require(['views/notice/info.vue'], resolve)
//通讯录
const mailList = resolve => require(['./views/address/address.vue'], resolve)
const addressDetail = resolve => require(['./views/address/addressDetail.vue'], resolve)
const addUser = resolve => require(['views/address/addUser.vue'], resolve);
const addUserSucc = resolve => require(['views/address/addUserSucc.vue'], resolve);
//个人信息
const my = resolve => require(['./views/person/person.vue'], resolve)
const personData = resolve => require(['views/person/personData.vue'], resolve)
//设置
const config = resolve => require(['views/config/config.vue'], resolve)
const configPwd = resolve => require(['views/config/configPwd.vue'], resolve)
const cacheDebugView = resolve => require(['./views/config/cacheDebugView'], resolve)
//单位信息
const basicInfoIndex = resolve => require(['views/basicInfomation/basicInfoIndex.vue'], resolve)
const unitInformation = resolve => require(['views/basicInfomation/unitInformation.vue'], resolve)
const buildList = resolve => require(['views/basicInfomation/buildList.vue'], resolve)
const buildInfo = resolve => require(['views/basicInfomation/buildInfo.vue'], resolve)
const addBuild = resolve => require(['views/basicInfomation/addBuild.vue'], resolve)
const ZRUnitIndex = resolve => require(['./views/basicInfomation/ZRUnitIndex.vue'], resolve)
const ZRUnitList = resolve => require(['views/basicInfomation/ZRUnitList.vue'], resolve)
const ZRUnitInfo = resolve => require(['views/basicInfomation/ZRUnitInfo.vue'], resolve)
//安全评分
const score = resolve => require(['./views/score/score.vue'], resolve)
const pastScoreList = resolve => require(['./views/score/pastScoreList.vue'], resolve)
const pastScoreDetail = resolve => require(['./views/score/pastScoreDetail.vue'], resolve)
//数据统计
const DataCount = resolve => require(['./views/DataCount/DataCount.vue'], resolve)
//考试
const trainList = resolve => require(['views/train/train.vue'], resolve)
const pastScore = resolve => require(['views/train/pastScore.vue'], resolve)
const exam = resolve => require(['views/train/exam.vue'], resolve)
const scoreInfo = resolve => require(['./views/train/info.vue'], resolve)
const simulationExam = resolve => require(['./views/train/simulationExam.vue'], resolve)
const examRule = resolve => require(['./views/train/examRule.vue'], resolve)
const examResult = resolve => require(['./views/train/examResult.vue'], resolve)
//设施设备和安装点
const deviceList = resolve => require(['views/device/deviceList.vue'], resolve)
const deviceLogs = resolve => require(['./views/device/_deviceLogs.vue'], resolve)
const deviceDetail = resolve => require(['views/device/deviceDetail/dvcInfo.vue'], resolve)
const deviceLogList = resolve => require(['views/device/log/deviceLogList.vue'], resolve)
// const editDevice = resolve => require(['./views/device/deviceDetail/_dvcEdit.vue'], resolve)
const spotInfo = resolve => require(['./views/device/spot/spotInfo.vue'], resolve)
const spotAdd = resolve => require(['./views/device/spotAdd/spotAdd.vue'], resolve)
const spotAddOnDvc = resolve => require(['./views/device/spotAdd/spotAddOnDvc.vue'], resolve)
//安全活动
const safeActivity = resolve => require(['views/safeActivity/index.vue'], resolve)
const safeActivityDetail = resolve => require(['views/safeActivity/safeActivityDetail.vue'], resolve)
//风险管理
const hiddenDangerList = resolve => require(['views/hiddenDanger/hiddenDangerList.vue'], resolve)
const hiddenDangerDetail = resolve => require(['views/hiddenDanger/info.vue'], resolve)
const editHiddenDanger = resolve => require(['views/hiddenDanger/editHiddenDanger.vue'], resolve)
//风险上报
const CheckHideDanger = resolve => require(['views/hiddenDanger/CheckHideDanger.vue'], resolve); //安全员-巡查时
const hiddenDangerCheck = resolve => require(['./views/hiddenDangerCheck/main.vue'], resolve);  //管理员
//任务
const Tasks = resolve => require(['./views/tasks/index.vue'], resolve)
const TaskListStatus = resolve => require(['./views/tasks/TaskListStatus.vue'], resolve)
//任务管理
const tasksManage = resolve => require(['./views/tasksManage/index.vue'], resolve)
const tasksRepo = resolve => require(['./views/tasksManage/tasksRepo.vue'], resolve)
const xcManage = resolve => require(['./views/tasksManage/xuncha/index.vue'], resolve)
const xcRepoList = resolve => require(['./views/tasksManage/xuncha/repo/xcRepoList.vue'], resolve)
const xcSpotList = resolve => require(['./views/tasksManage/xuncha/xcSpotList.vue'], resolve)
const xcTaskAdd = resolve => require(['./views/tasksManage/xuncha/taskAdd/xcTaskAdd.vue'], resolve)
const xcTaskEdit = resolve => require(['./views/tasksManage/xuncha/taskEdit/xcTaskEdit.vue'], resolve)
//巡查
const xuncha = resolve => require(['./views/tasks/xuncha/index.vue'], resolve)
const startXuncha = resolve => require(['./views/tasks/xuncha/components/startXuncha.vue'], resolve)
const qiandaoXuncha = resolve => require(['./views/tasks/xuncha/components/qiandaoXuncha.vue'], resolve)
const deviceXuncha = resolve => require(['./views/tasks/xuncha/components/deviceXuncha.vue'], resolve)
const reviewXunCha = resolve => require(['./views/tasks/xuncha/components/reviewXuncha.vue'], resolve)
const reviewQiaoDaoXuncha = resolve => require(['./views/tasks/xuncha/components/reviewQiandaoXuncha.vue'], resolve)
const reviewDeviceXuncha = resolve => require(['./views/tasks/xuncha/components/reviewDeviceXuncha.vue'], resolve)
const inputDataXuncha = resolve => require(['./views/tasks/xuncha/components/inputData.vue'], resolve)
//值班
const zhiban = resolve => require(['./views/tasks/zhiban/index.vue'], resolve)
const AdminZhibanInfo = resolve => require(['./views/tasks/zhiban/AdminZhibanInfo.vue'], resolve)
const SaferZhibanInfo = resolve => require(['./views/tasks/zhiban/SaferZhibanInfo.vue'], resolve)
//消防责任单位
const addXFZRUnit = resolve => require(['./views/basicInfomation/XFZRUnit/add.vue'], resolve)
const editXFZRUnit = resolve => require(['./views/basicInfomation/XFZRUnit/edit.vue'], resolve)

const appNotification = resolve => require(['./views/enter/appNotification.vue'], resolve)
const TaskComply = resolve => require(['./views/tasks/TaskComply.vue'], resolve)
const TaskHistory = resolve => require(['./views/tasks/TaskHistory.vue'], resolve)
const ZhibanList = resolve => require(['./views/tasks/zhiban/ZhibanList.vue'], resolve)
const CreateZhibanTable = resolve => require(['./views/tasks/zhiban/CreateZhibanTable.vue'], resolve)
const CreateTmpZhibanTask = resolve => require(['./views/tasks/zhiban/CreateTmpZhibanTask.vue'], resolve)
const CreateBanci = resolve => require(['./views/tasks/zhiban/CreateBanci.vue'], resolve)
const ZhibanTable = resolve => require(['./views/tasks/zhiban/ZhibanTable.vue'], resolve)
const EditZhibanTable = resolve => require(['./views/tasks/zhiban/EditZhibanTable.vue'], resolve)
const ZhibanTableDetail = resolve => require(['./views/tasks/zhiban/ZhibanTableDetail.vue'], resolve)
const EditBanci = resolve => require(['./views/tasks/zhiban/EditBanci.vue'], resolve)
const StartDailyXuncha = resolve => require(['./views/tasksManage/xuncha/dailyXuncha/StartDailyXuncha.vue'], resolve)
const ReviewDailyXuncha = resolve => require(['./views/tasksManage/xuncha/dailyXuncha/ReviewDailyXuncha.vue'], resolve)
const QiandaoDailyXuncha = resolve => require(['./views/tasksManage/xuncha/dailyXuncha/QiandaoDailyXuncha.vue'], resolve)
const DeviceDailyXuncha = resolve => require(['./views/tasksManage/xuncha/dailyXuncha/DeviceDailyXuncha.vue'], resolve)
const InputDeviceValue = resolve => require(['./views/tasksManage/xuncha/dailyXuncha/InputDeviceValue.vue'], resolve)
const DailyXunchaHistory = resolve => require(['./views/tasksManage/xuncha/dailyXuncha/DailyXunchaHistory.vue'], resolve)
const ZhibanTmpTable = resolve => require(['./views/tasks/zhiban/ZhibanTmpTable.vue'], resolve)
const EditTmpZhiban = resolve => require(['./views/tasks/zhiban/EditTmpZhiban.vue'], resolve)
const ZhibanTmpTableDetail = resolve => require(['./views/tasks/zhiban/ZhibanTmpTableDetail.vue'], resolve)
const ReviewTmpXuncha = resolve => require(['./views/tasksManage/xuncha/tmpXuncha/ReviewTmpXuncha.vue'], resolve)
const HandleYHK = resolve => require(['./views/hiddenDanger/HandleYHK.vue'], resolve)
const CheckPorintLogList = resolve => require(['./views/tasksManage/xuncha/log/CheckPorintLogList.vue'], resolve)
const ReviewTmpQiandaoXuncha = resolve => require(['./views/tasksManage/xuncha/tmpXuncha/ReviewTmpQiandaoXuncha.vue'], resolve)
const ReviewTmpDeviceXunch = resolve => require(['./views/tasksManage/xuncha/tmpXuncha/ReviewTmpDeviceXunch.vue'], resolve)
const ReviewDailyXunchaQiandao = resolve => require(['./views/tasksManage/xuncha/dailyXuncha/ReviewDailyXunchaQiandao.vue'], resolve)
const ReviewDailyXunchaDevice = resolve => require(['./views/tasksManage/xuncha/dailyXuncha/ReviewDailyXunchaDevice.vue'], resolve)
const AlarmDetail = resolve => require(['./views/monitorVideo/AlarmDetail.vue'], resolve)
const LiveVideoDetail = resolve => require(['./views/monitorVideo/LiveVideoDetail.vue'], resolve)
const ChoosePerson = resolve => require(['./components/ChoosePerson/index.vue'], resolve)
//视频监控
const monitorVideo = resolve => require(['./views/monitorVideo/index.vue'], resolve);
//电气监测
const monitorDq = resolve => require(['./views/monitorDq/index.vue'], resolve);
const monitorDqDeviceDetail = resolve => require(['./views/monitorDq/DeviceDetail/index.vue'], resolve);
const monitorDqDeviceChart = resolve => require(['./views/monitorDq/DeviceDetail/ChartModule.vue'], resolve);
const monitorDqAlarmDetail = resolve => require(['./views/monitorDq/AlarmDetail/index.vue'], resolve);
const monitorDqAlarmDetailSelPerson = resolve => require(['./views/monitorDq/AlarmDetail/SelPerson.vue'], resolve);
//水系统监测
const monitorSxt = resolve => require(['./views/monitorSxt/index.vue'], resolve);
const monitorSxtDeviceDetail = resolve => require(['./views/monitorSxt/DeviceDetail/index.vue'], resolve);
const monitorSxtDeviceChart = resolve => require(['./views/monitorSxt/DeviceDetail/ChartModule.vue'], resolve);
const monitorSxtAlarmDetail = resolve => require(['./views/monitorSxt/AlarmDetail/index.vue'], resolve);
const monitorSxtAlarmDetailSelPerson = resolve => require(['./views/monitorSxt/AlarmDetail/SelPerson.vue'], resolve);
const QRCode = resolve => require(['./views/qrcode/index.vue'], resolve);
const BindDevice = resolve => require(['./views/qrcode/BindDevice.vue'], resolve);
Vue.use(Router)

const routers = {
    mode: 'history',
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
    },
    routes: [
        //登陆
        {
            path: '/login',
            component: login,
            name: 'login'
        },
        //入口首页
        {
            path: '/',
            redirect: '/enter',
            component: login
        },
        {
            path: '/enter',
            component: Enter,
            title: '首页-TAB',
            redirect: '/enter/home',
            name: 'Enter',
            children: [
                {
                    path: 'home',
                    component: Home,
                    title: '首页',
                    name: 'home'
                },
                {
                    path: 'tasks',
                    component: Tasks,
                    title: '任务',
                    name: 'Tasks'
                },
                {
                    path: 'mail_list',
                    component: mailList,
                    title: '通讯录',
                    name: 'mailList'
                },
                {
                    path: 'my',
                    component: my,
                    title: '我的',
                    name: 'my'
                },
            ]
        },
        //新闻
        {
            path: '/news_info/:pid',
            component: newsInfo,
            name: 'newsInfo'
        },
        //消息
        {
            path: '/message',
            component: message,
            title: '消息',
            name: 'message'
        },
        {
            path: '/message/:pid',
            component: messageDetail,
            title: '消息详情',
            name: 'messageDetail'
        },
        //通知公告
        {
            path: '/data_count',
            component: DataCount,
            name: 'DataCount'
        },
        {
            path: '/taskListStatus',
            name: 'taskListStatus',
            component: TaskListStatus
        },
        {
            path: '/xuncha/:taskId',
            title: '巡查',
            name: 'xuncha',
            component: xuncha,
            children: [{
                path: 'start',
                component: startXuncha,
                title: '开始巡查'
            }, {
                path: 'qiandao',
                component: qiandaoXuncha,
                title: '巡查签到',
            }, {
                path: 'device',
                component: deviceXuncha,
                title: '巡查设备'
            }, {
                path: 'review',
                title: '审核报告',
                component: reviewXunCha
            }, {
                path: 'reviewQiaoDaoXuncha',
                title: '审核签到',
                component: reviewQiaoDaoXuncha
            }, {
                path: 'reviewDevice',
                title: '审核设备',
                component: reviewDeviceXuncha
            }, {
                path: 'checkPorintLogList',
                name: 'CheckPorintLogList',
                component: CheckPorintLogList
            }, {
                path: 'inputDataXuncha',
                name: 'inputDataXuncha',
                component: inputDataXuncha
            }
            ]
        },
        {
            path: '/zhiban',
            title: '值班',
            name: 'zhiban',
            component: zhiban,
            children: [{
                path: 'review',
                component: AdminZhibanInfo,
                title: '值班详情',
                name: 'zhibanAdmin'
            }, {
                path: 'start',
                component: SaferZhibanInfo,
                title: '值班详情',
                name: 'zhibanSafer'
            }]
        },
        {
            path: '/score',
            component: score,
            name: 'score'
        },
        {
            path: '/past_score_list',
            component: pastScoreList,
            name: 'pastScoreList'
        },
        {
            path: '/notice',
            component: noticeList,
            name: 'noticeList'
        },
        {
            path: '/notice/:pid',
            component: noticeDetail,
            name: 'noticeDetail'
        },
        //通讯录
        {
            path: '/address_detail/:pid',
            component: addressDetail,
            name: 'addressDetail'
        },
        {
            path: '/add_user',
            component: addUser
        },
        {
            path: '/add_user_succ',
            component: addUserSucc
        },
        //个人信息
        {
            path: '/person_data',
            component: personData,
            name: 'personData'
        },
        //设置
        {
            path: '/config',
            component: config,
            name: 'config'
        },
        {
            path: '/config/pwd',
            component: configPwd,
            name: 'configPwd'
        },
        {
            path: '/cacheDebug',
            component: cacheDebugView,
            name: 'cacheDebugView'
        },
        //单位信息
        {
            path: '/basic_info',
            component: basicInfoIndex,
            name: 'basicInfoIndex'
        },
        {
            path: '/unit_info',
            component: unitInformation,
            name: 'unitInformation'
        },
        {
            path: '/jz_info',
            component: buildList,
            name: 'buildList'
        },
        {
            path: '/jz_info/:jzId',
            component: buildInfo,
            name: 'buildInfo'
        },
        {
            path: '/add_jz',
            component: addBuild,
            name: 'addBuild'
        },
        {
            path: '/xfzr_unit',
            component: ZRUnitIndex,
            name: 'ZRUnitIndex'
        },
        {
            path: '/xfzr_list',
            component: ZRUnitList,
            name: 'ZRUnitList'
        },
        {
            path: '/dw_info/:pid',
            component: ZRUnitInfo,
            name: 'ZRUnitInfo'
        },
        //安全评分
        {
            path: '/score',
            component: score,
            name: 'score'
        },
        {
            path: '/past_score_list',
            component: pastScoreList,
            name: 'pastScoreList'
        },
        {
            path: '/past_score_detail',
            component: pastScoreDetail,
            name: 'pastScoreDetail'
        },
        //数据统计
        {
            path: '/data_count',
            component: DataCount,
            name: 'DataCount'
        },
        //考试
        {
            path: '/train',
            component: trainList,
            name: 'trainList'
        },
        {
            path: '/exam/:pid',
            component: exam,
            name: 'exam'
        },
        {
            path: '/simulation_exam/:pid',
            component: simulationExam
        },
        {
            path: '/exam_rule',
            component: examRule
        },
        {
            path: '/exam_result',
            component: examResult
        },
        {
            path: '/past_score',
            component: pastScore,
            name: 'pastScore'
        },
        {
            path: '/score_info/:pid',
            component: scoreInfo,
            name: 'scoreInfo'
        },
        //风险管理
        {
            path: '/hidden_danger',
            component: hiddenDangerList,
            name: 'hiddenDangerList'
        },
        {
            path: '/hidden_danger_info/:pid',
            component: hiddenDangerDetail,
            name: 'hiddenDangerDetail'
        },
        {
            path: '/edit_hidden_danger',
            component: editHiddenDanger,
            name: 'editHiddenDanger'
        },
        //风险上报
        {
            path: '/hidden_danger_check',
            component: hiddenDangerCheck
        },
        {
            path: '/check_hideDanger/:zbId',
            component: CheckHideDanger,
            name: 'CheckHideDanger'
        },
        //设施设备
        {
            path: '/device',
            component: deviceList,
            name: 'deviceList'
        },
        {
            path: '/device/:pid',
            component: deviceDetail,
            name: 'deviceDetail'
        },
        {
            path: '/device_log_list/:id',
            name: deviceLogs,
            component: deviceLogList
        },
        {
            path: '/deviceLogs',
            name: deviceLogs,
            component: deviceLogs
        },
        {
            path: '/spot_info/:pid',
            name: 'spotInfo',
            component: spotInfo,
        },
        {
            path: '/spot_add',
            name: 'spotAdd',
            component: spotAdd,
        },
        {
            path: '/spot_add/dvc',
            name: 'spotAddOnDvc',
            component: spotAddOnDvc,
        },
        {
            path: '/spot_add/dvc/:spotId',
            name: 'spotAddOnDvc',
            component: spotAddOnDvc,
        },
        //安全活动
        {
            path: '/safe_activity',
            component: safeActivity,
            name: 'safeActivity'
        },
        {
            path: '/safe_activity/:id',
            component: safeActivityDetail,
            name: 'safeActivityDetail'
        },
        //任务
        {
            path: '/taskListStatus',
            name: 'taskListStatus',
            component: TaskListStatus,
        },
        //任务管理
        {
            path: '/enter/tasks_manage',
            name: 'tasksManage',
            component: tasksManage,
        },
        {
            path: '/tasks_repo',
            name: 'tasksRepo',
            component: tasksRepo,
        },
        {
            path: '/xc_manage',
            name: 'xcManage',
            component: xcManage,
        },
        {
            path: '/xc_repo_list/:id',
            name: 'xcRepoList',
            component: xcRepoList,
        },
        {
            path: '/xc_spot_list',
            name: 'xcSpotList',
            component: xcSpotList,
        },
        {
            path: '/xc_task_add/:type',
            name: 'xcTaskAdd',
            component: xcTaskAdd,
        },
        {
            path: '/xc_task_edit/:type',
            name: 'xcTaskEdit',
            component: xcTaskEdit,
        },
        //任务执行
        {
            path: '/xuncha/:taskId',
            title: '巡查',
            name: 'xuncha',
            component: xuncha,
            children: [{
                path: 'start',
                component: startXuncha,
                title: '开始巡查'
            }, {
                path: 'qiandao',
                component: qiandaoXuncha,
                title: '巡查签到',
            }, {
                path: 'device',
                component: deviceXuncha,
                title: '巡查设备'
            }, {
                path: 'review',
                title: '审核报告',
                component: reviewXunCha
            }, {
                path: 'reviewQiaoDaoXuncha',
                title: '审核签到',
                component: reviewQiaoDaoXuncha
            }, {
                path: 'reviewDevice',
                title: '审核设备',
                component: reviewDeviceXuncha
            }
            ]
        },
        {
            path: '/zhiban',
            title: '值班',
            name: 'zhiban',
            component: zhiban,
            children: [{
                path: 'review',
                component: AdminZhibanInfo,
                title: '值班详情',
                name: 'zhibanAdmin'
            }, {
                path: 'start',
                component: SaferZhibanInfo,
                title: '值班详情',
                name: 'zhibanSafer'
            }]
        },
        {
            path: '/addXFZRUnit',
            name: 'addXFZRUnit',
            component: addXFZRUnit
        },
        {
            path: '/editXFZRUnit',
            name: 'editXFZRUnit',
            component: editXFZRUnit
        },
        {
            path: '/appNotification',
            name: 'appNotification',
            component: appNotification
        },
        {
            path: '/test',
            name: 'test',
            component: resolve => require(['./views/test.vue'], resolve)
        },
        {
            path: '/taskComply',
            name: 'TaskComply',
            component: TaskComply
        },
        {
            path: '/taskHistory',
            name: 'TaskHistory',
            component: TaskHistory
        },
        {
            path: '/zhibanList',
            name: 'ZhibanList',
            component: ZhibanList
        },
        {
            path: '/createZhibanTable',
            name: 'CreateZhibanTable',
            component: CreateZhibanTable
        },
        {
            path: '/createTmpZhibanTask',
            name: 'CreateTmpZhibanTask',
            component: CreateTmpZhibanTask
        },
        {
            path: '/createBanci',
            name: 'CreateBanci',
            component: CreateBanci
        },
        {
            path: '/zhibanTable/:id',
            name: 'ZhibanTable',
            component: ZhibanTable
        },
        {
            path: '/editZhibanTable',
            name: 'EditZhibanTable',
            component: EditZhibanTable
        },
        {
            path: '/zhibanTableDetail/:id',
            name: 'ZhibanTableDetail',
            component: ZhibanTableDetail
        },
        {
            path: '/editBanci/:id',
            name: 'EditBanci',
            component: EditBanci
        },
        {
            path: '/startDailyXuncha/:id',
            name: 'StartDailyXuncha',
            component: StartDailyXuncha
        },
        {
            path: '/qiandaoDailyXuncha/:id',
            name: 'QiandaoDailyXuncha',
            component: QiandaoDailyXuncha
        },
        {
            path: '/deviceDailyXuncha/:id',
            name: 'DeviceDailyXuncha',
            component: DeviceDailyXuncha
        },
        {
            path: '/inputDeviceValue',
            name: 'InputDeviceValue',
            component: InputDeviceValue
        },
        {
            path: '/dailyXunchaHistory',
            name: 'DailyXunchaHistory',
            component: DailyXunchaHistory
        },
        {
            path: '/ZhibanTmpTable',
            name: 'ZhibanTmpTable',
            component: ZhibanTmpTable
        },
        {
            path: '/editTmpZhiban:id',
            name: 'EditTmpZhiban',
            component: EditTmpZhiban
        },
        {
            path: '/zhibanTmpTableDetail/:id',
            name: 'ZhibanTmpTableDetail',
            component: ZhibanTmpTableDetail
        },
        {
            path: '/reviewDailyXuncha/:id',
            name: 'ReviewDailyXuncha',
            component: ReviewDailyXuncha
        },
        {
            path: '/reviewTmpXuncha/:id',
            name: 'ReviewTmpXuncha',
            component: ReviewTmpXuncha
        },
        {
            path: '/handleYHK/:taskId',
            name: 'HandleYHK',
            component: HandleYHK
        },
        {
            path: '/checkPorintLogList/:id',
            name: 'CheckPorintLogList',
            component: CheckPorintLogList
        },
        {
            path: '/reviewTmpQiandaoXuncha/:id',
            name: 'ReviewTmpQiandaoXuncha',
            component: ReviewTmpQiandaoXuncha
        },
        {
            path: '/reviewTmpDeviceXunch/:id',
            name: 'ReviewTmpDeviceXunch',
            component: ReviewTmpDeviceXunch
        },
        {
            path: '/reviewDailyXunchaQiandao/:id',
            name: 'ReviewDailyXunchaQiandao',
            component: ReviewDailyXunchaQiandao
        },
        {
            path: '/reviewDailyXunchaDevice/:id',
            name: 'ReviewDailyXunchaDevice',
            component: ReviewDailyXunchaDevice
        },
        //视频监控
        {
            path: '/monitorVideo',
            name: 'MonitorVideo',
            component: monitorVideo
        },
        //电气监测
        {
            path: '/monitorDq',
            name: 'MonitorDq',
            component: monitorDq
        },
        {
            path: '/monitorDqDeviceDetail/:id',
            name: 'monitorDqDeviceDetail',
            component: monitorDqDeviceDetail
        },
        {
            path: '/monitorDqDeviceChart/:id',
            name: 'monitorDqDeviceChart',
            component: monitorDqDeviceChart
        },
        {
            path: '/monitorDqAlarmDetail/:id',
            name: 'monitorDqAlarmDetail',
            component: monitorDqAlarmDetail
        },
        {
            path: '/monitorDqAlarmDetailSelPerson/:id',
            name: 'monitorDqAlarmDetailSelPerson',
            component: monitorDqAlarmDetailSelPerson
        },
        //水系统监测
        {
            path: '/monitorSxt',
            name: 'MonitorSxt',
            component: monitorSxt
        },
        {
            path: '/monitorSxtDeviceDetail/:id',
            name: 'monitorSxtDeviceDetail',
            component: monitorSxtDeviceDetail
        },
        {
            path: '/monitorSxtDeviceChart/:id',
            name: 'monitorSxtDeviceChart',
            component: monitorSxtDeviceChart
        },
        {
            path: '/monitorSxtAlarmDetail/:id',
            name: 'monitorSxtAlarmDetail',
            component: monitorSxtAlarmDetail
        },
        {
            path: '/monitorSxtAlarmDetailSelPerson/:id',
            name: 'monitorSxtAlarmDetailSelPerson',
            component: monitorSxtAlarmDetailSelPerson
        },
        //视频监控
        {
            path: '/alarmDetail/:id',
            name: 'AlarmDetail',
            component: AlarmDetail
        },
        {
            path: '/liveVideoDetail/:id',
            name: 'LiveVideoDetail',
            component: LiveVideoDetail
        },
        {
            path: '/choosePerson/:id',
            name: 'ChoosePerson',
            component: ChoosePerson
        },
        {
            path: '/QRCode',
            name: 'QRCode',
            component: QRCode
        },
        {
            path: '/bind_device/:id',
            name: 'BindDevice',
            component: BindDevice
        }
    ]
};

const router = new Router(routers);

router.beforeEach((to, from, next) => {
    if (to.name == 'home' || to.name == 'score' || to.name == 'login' || to.name == 'pastScoreDetail') {
        NProgress.remove();
    } else {
        NProgress.start();
    }
    next();
})
router.afterEach(transition => {
    NProgress.done();
});

export default router;

