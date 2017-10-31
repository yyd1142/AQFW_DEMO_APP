/**
 * Created by enjoyzhou on 17-2-16.
 */
import { httpGet, httpPost, httpPath, readFile } from './requestService'
import { provinceCache, cityCache, areaCache } from '../cache/LocationCache'
import Conf from '../apiconf'

export default {
    getJSON: httpGet('/repositories'),
    postJSON: httpPost('/api/home'),
    login: httpGet('/auth?m=login', Conf.loginDomain, true),
    //位置接口
    getProvinceList: provinceCache,
    getCityList: cityCache,
    getAreaList: areaCache,
    // 任务相关
    getTaskReports: httpGet('/taskManager/reports', Conf.taskDomain),
    getMyTask: httpGet('/myTask', Conf.taskDomain),
    getXCTaskPosition: httpGet('/XCTaskPosition', Conf.taskDomain),
    getXCTaskDeviceByPosition: httpGet('/deviceListByPosition', Conf.taskDomain),
    getXCTaskDeviceCheckRulesByUnitId: httpGet('/deviceCheckRules', Conf.taskDomain),
    changeTaskStatusByTaskId: httpGet('/changeTaskStatus', Conf.taskDomain, true),
    changeRoutineTaskStatusByTaskId: httpGet('/taskManager/auditRoutineTask', Conf.taskDomain),
    getTaskSurveyByGroupId: httpGet('/group/tasksSurvey', Conf.taskDomain),
    getTasksByGroupId: httpGet('/group/taskByDate', Conf.taskDomain),
    getTasksByGroupIdAndTaskType: httpGet('/group/taskByDateAndTaskType', Conf.taskDomain),
    disposeXunChaTask: httpGet('/disposeXunChaTask', Conf.taskDomain),
    addZBTaskLogs: httpPost('/addZBTaskLogs', Conf.taskDomain), //添加值班日志
    getZbTaskLogs: httpGet('/zbTaskLogs', Conf.taskDomain), //值班日志列表
    getTaskOfRecent: httpGet('/taskOfRecent', Conf.taskDomain, true),
    getXCTaskPositionCheckResult: httpGet('/XCTaskPositionCheckResult', Conf.taskDomain),
    getXCTaskCheckPointDeviceResult: httpGet('/XCTaskCheckPointDeviceResult', Conf.taskDomain),
    getXCTaskChangeDeviceStatus: httpGet('/XCTaskChangeDeviceStatus', Conf.taskDomain),
    getTaskInfo: httpGet('/taskInfo', Conf.taskDomain),
    getRoutineTaskInfo: httpGet('/routine/taskInfo', Conf.taskDomain),
    getSystemsList: httpGet('/facilities', Conf.platformDomain),
    addAndUpdateZBRule: httpPost('/addAndUpdateZBRule', Conf.taskDomain),
    addAndUpdateZBBanci: httpPost('/addAndUpdateZBBanci', Conf.taskDomain),
    getTaskZBRule: httpGet('/taskRuleInfo', Conf.taskDomain),
    getTaskRuleInfo: httpGet('/taskRuleInfo', Conf.taskDomain),
    removeZBBanci: httpGet('/remocveTaskZBBanci', Conf.taskDomain),
    removeZBRule: httpGet('/remocveTaskZBRule', Conf.taskDomain),
    getZhiBanTasksList: httpGet('/taskRuleList', Conf.taskDomain),
    addZhibanTask: httpPost('/createZBTask', Conf.taskDomain),
    updateZBRecord: httpPost('/addAndUpdateZBRecord', Conf.taskDomain),
    getZhiBanTmpTasksList: httpGet('/taskZBGrupBydescription', Conf.taskDomain),
    getTodayZBRule: httpGet('/taskList', Conf.taskDomain),
    getPositionsByRule: httpGet('/routine/my/positions', Conf.taskDomain),
    deviceByPostionId: httpGet('/routine/my/deviceByPostionId', Conf.taskDomain),
    getTaskList: httpGet('/group/tasks', Conf.taskDomain),
    checkPointDeviceResultByHasRisk: httpGet('/routine/checkPointDeviceResultByHasRisk', Conf.taskDomain),
    getListByPositionId: httpGet('/devices/listByPosition', Conf.taskDomain), //获取巡查点需要巡查的设备-Web
    //巡查
    addTemporaryXuncha: httpPost('/createXCTask', Conf.taskDomain), //新增临时巡查
    addRoutineXuncha: httpPost('/routine/addCheckPointRule', Conf.taskDomain), //新增日常巡查
    editRoutineXuncha: httpPost('/routine/editCheckPointRule', Conf.taskDomain), //编辑日常巡查
    removeRoutineXuncha: httpGet('/routine/removeCheckPointRule', Conf.taskDomain), //删除日常巡查
    getXunchaSpotList: httpGet('/routine/getPositionsByRule?ruleId=0', Conf.taskDomain),
    getXunchaSpotListByTask: httpGet('/routine/getPositionsByRule', Conf.taskDomain),
    getRoutineXunchaList: httpGet('/routine/rules', Conf.taskDomain), //日常巡查任务列表
    // getTpyTaskList: httpGet('/group/tasks', Conf.taskDomain), //临时巡查任务列表
    getRoutineMyList: httpGet('/routine/my', Conf.taskDomain), //我的日常巡查列表-App
    uploadTaskData: httpPost('/routine/my/uploadTaskData', Conf.taskDomain), //上传巡查数据-App
    getRecordsByRoutineTask: httpGet('/routine/my/recordsByRoutineTask', Conf.taskDomain), //日常巡查任务-我的执行记录-App
    getRecordsByTpyTask: httpGet('/recordsByMyTask', Conf.taskDomain), //临时任务-我的执行记录-App
    xunChaRecordsByPosition: httpGet('/routine/xunChaRecordsByPosition', Conf.taskDomain),
    getTaskCheckPointDeviceResult: httpGet('/routine/taskCheckPointDeviceResult', Conf.taskDomain), //任务审核-日常任务详情-设备列表
    getRoutineTaskInfo: httpGet('/routine/taskInfo', Conf.taskDomain), //任务审核-日常任务-详情
    //个人资料
    getPersonInfo: httpGet('/person?m=appInfo', Conf.domain),
    postPerson: httpPost('/person?'), //添加 人员
    getUserData: httpGet('/person?m=info'), //用户信息
    resetPasswrod: httpGet('/person'), //修改密码
    //
    getVersion: readFile('/version.json'),
    activaDW: httpGet('/dwInfo'), //激活企业单位账号
    //通讯录
    getUuid: httpGet('/uuid', Conf.directoriesDomain),
    getAddressList: httpGet('/list', Conf.directoriesDomain),
    getAddressInfo: httpGet('/detail', Conf.directoriesDomain),
    //消息
    getMsgList: httpGet('/message?m=list', Conf.appDomain),
    getMsgInfo: httpGet('/message?m=info', Conf.appDomain),
    updateMessageStatus: httpGet('/message', Conf.appDomain),
    //风险管理
    getYhkList: httpGet('/yhk?m=list', Conf.appDomain),
    getYhkInfo: httpGet('/yhk?m=info', Conf.appDomain),
    updateYhk: httpPost('/yhk?m=update', Conf.appDomain),
    //新闻
    getNewsList: httpGet('/information/list', Conf.newsDomain),
    getNewsDetail: httpGet('/information/info', Conf.newsDomain),
    //通知公告
    getNoticesList: httpGet('/dwNotice', Conf.domain),
    getNoticesDetail: httpGet('/dwNotice', Conf.domain),
    noticeIsRead: httpGet('/dwNotice', Conf.domain),
    noticeReply: httpPost('/dwNotice?m=reply', Conf.domain),
    getReplyInfo: httpGet('/dwNotice', Conf.domain),
    getXFSafetyFilesList: httpGet('/dwInfo/xfSafetyFile', Conf.domain),
    getExamsList: httpGet('/exam', Conf.appDomain),
    startExam: httpGet('/exam', Conf.appDomain),
    examResult: httpPost('/exam?m=examResult', Conf.appDomain),
    getPastScoreList: httpGet('/exam', Conf.appDomain),
    examScoreDetail: httpGet('/exam', Conf.appDomain),
    //单位信息
    getUnitInfo: httpGet('/dwInfo', Conf.appDomain),
    getUnitType: httpGet('/dwlx?m=dwlxList', Conf.platformDomain),  //获得所有企业类型
    updateUnitInfo: httpPost('/dwInfo?m=update'),
    getEmployeeList: httpGet('/person', Conf.domain),
    // 建筑信息
    getJZList: httpGet('/jzInfo', Conf.domain),
    getJzType: httpGet('/jzInfo?m=jzType'),  //菜单 建筑类型
    addBuildData: httpPost('/jzInfo?m=add'),  //新增/更新 建筑信息
    addBuildDataOnSpot: httpPost('/jzInfo?m=add&addSpot=true', Conf.domain),  //新增 建筑信息
    updateBuildData: httpPost('/jzInfo?m=update', Conf.domain),  //更新 建筑信息
    searchBuild: httpGet('/queryDW?m=queryJZ', Conf.platformDomain), //建筑模糊查询 不分页
    //
    getDwlxList: httpGet('/dwlx', Conf.platformDomain),
    getJZDetail: httpGet('/jzInfo', Conf.domain),
    getResourcesInfo: httpPath('/info/', Conf.resourcesDomain), //获取资源信息 列表
    uploadHideDanger: httpPost('/yhk?m=add'), //风险上报
    getQyList: httpGet('/jg/user/jurisdiction', Conf.qyDomain),
    addYhk: httpPost('/yhk?m=add', Conf.domain),
    getJGList: httpGet('/dwInfo', Conf.domain),
    getZRDWInfo: httpGet('/dwInfo/ZRDW', Conf.domain),
    getScoreList: httpGet('/dwScore', Conf.scoreDomain),
    getHistoryScoreList: httpGet('/dwScore', Conf.scoreDomain),
    getHistoryScoreDetail: httpGet('/dwScore', Conf.scoreDomain),
    hasNewMessage: httpGet('/message', Conf.appDomain), // 判断首页小红点提示，是否有新消息
    getQYDWInfo: httpGet('/dwInfo', Conf.domain),
    addZRDWUnit: httpPost('/dwInfo/ZRDW?m=add', Conf.domain),
    updateZRDWUnit: httpPost('/dwInfo/ZRDW?m=update', Conf.domain),
    removeZRDWUnit: httpGet('/dwInfo/ZRDW', Conf.domain),
    //设备设施
    getJzPosition: httpGet('/jzInfo?m=jzPosition', Conf.domain),
    getDvcPositionInfo: httpGet('/dwFacilities?m=positionInfo', Conf.domain), //安装点详情 包含设备列表
    getDvcByPosition: httpGet('/routine/my/deviceByPostionId', Conf.taskDomain),
    addDvcPositionInAll: httpPost('/dwFacilities?m=addCheckPointByBuildAndPositionAndDevices', Conf.domain),//打包创建安装点
    // addDvcPositionInAll:httpPost('/dwFacilities?m=addCheckPointByBuildAndPositionAndDevices','http://10.0.1.82:3000'),//打包创建安装点
    addDvcPosition: httpPost('/dwFacilities?m=addPosition', Conf.domain), //新增安装点巡查点
    updateDvcPosition: httpPost('/dwFacilities?m=updatePosition', Conf.domain), //更新安装点巡查点
    removePosition: httpGet('/dwFacilities?m=removePosition', Conf.domain),//删除安装点
    addDvc: httpPost('/dwFacilities?m=addsSSSB', Conf.domain), //批量添加设施设备
    removeDvc: httpGet('/dwFacilities?m=remove', Conf.domain), //删除设施设备
    searchDvc: httpGet('/queryDW?m=unitList', Conf.platformDomain),
    getDeviceSystemsList: httpGet('/facilities?m=systemList', Conf.platformDomain),//设施设备系统列表
    getDevicePartsList: httpGet('/facilities?m=unitList', Conf.platformDomain), //设备部件名称列表
    dwFacilities: httpGet('/dwFacilities', Conf.domain), //消防设备列表
    // dwFacilities: httpGet('/dwFacilities', 'http://10.0.1.82:3000'), //消防设备列表
    dwFacilitiesInfo: httpGet('/dwFacilities'), //消防设备详情
    addDwFacilities: httpPost('/dwFacilities?m=adds'), //新增 消防设施设备
    updateDwFacilitie: httpPost('/dwFacilities?m=update'),//更新 消防设施设备
    dwFacilitieHistory: httpGet('/dwFacilities?m=history'),//列表 消防设施设备历史记录
    updateDeviceStatusFn: httpGet('/dwFacilities?m=statusUpdate'),//更新 消防设施设备故障记录,
    getDeviceLogList: httpGet('/devices/xunChaRecordsByDevcies', Conf.taskDomain),
    getDeviceFaultLogList: httpGet('/devices/faultRecordsByDevcies', Conf.taskDomain),
    getPointDetail: httpGet('/dwFacilities', Conf.domain),
    getAppState: httpGet('/'), //获取APP状态
    // PATH 形式访问
    getByPath: function (path) {
        return httpGet(path, Conf.resourcesDomain)
    }
}
