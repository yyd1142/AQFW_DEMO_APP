<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="扫描二维码" left-icon="icon-back" @handleLeftClick="back">
        </mko-header>
        <div class="page-wrap">

        </div>
    </div>
</template>

<script>
    import api from 'api'
    import {Toast} from 'mint-ui'
    import xuncha from 'store/modules/xuncha'
    import * as types from 'store/mutation-types'
    import cloneDeep from 'lodash/cloneDeep'
    var taskId = 'U1883019q965';
    var deviceQRCodeString = 'WXE2A116623122Z83'; //WX: '地区', E2: '设备类型', A1: '供应商', 16623: '设备投入使用日期', 122: '拓展码', Z83: '唯一标识'
    var posationQRCodeString = 'WXD2T1343299098K';
    function compare(property) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    }
    export default {
        data() {
            return {}
        },
        activated() {
            if (this.$store.state.xuncha) {
                this.$store.dispatch('clearXunChaTimer');
                this.$store.unregisterModule('xuncha');
            }
//            this.goDeviceDetail('deviceDetail_161580');
//            this.goSpotInfo('spotInfo_16792');
//            this.dialog('xunchaTaskDevice_161580');
            this.$ScanQRCode(result => {
                let response = result.response;
                if (response.indexOf('deviceDetail') === 0) {
                    this.goDeviceDetail(response) //设备
                } else if (response.indexOf('BindDevice') === 0) {
                    this.goBindDevice(response)
                } else if (response.indexOf('xunchaTaskDevice') === 0) {
                    this.dialog(response);
                } else if(response.indexOf('spotInfo') === 0) {
                    this.goSpotInfo(response);
                } else {
                    alert('无法识别此二维码')
                }
            });
        },
        deactivated() {
            try {
                window.MKODialogShow = false
            } catch (err) {
                alert(err)
            }
        },
        methods: {
            back() {
                this.$MKOPop()
            },
            dialog(result) {
                this.$MKODialog({
                    title: "提示",
                    msg: '检测到该设备所在巡查点正在进行巡查任务，需要查看吗？',
                    cancelBtn: true,
                    confirmText: '查看设备详情',
                    cancelText: "查看巡查点"
                }).then(msg => {
                    if (msg == "confirm") {
                        this.goDeviceDetail(result);
                    } else {
                        this.getTaskBuilds();
                    }
                });
            },
            goDeviceDetail(result) {
                result = result.split('_');
                let id = result[1];
                let nextPath = {
                    name: 'deviceDetail',
                    params: {
                        pid: id
                    },
                    query: {
                        from: 'qrcode'
                    }
                }
                let from = this.$route.query.fromPath ? this.$route.query.fromPath : '/enter/home';
                this.$MKOPush(nextPath, from, true);
            },
            goSpotInfo(result) {
                result = result.split('_');
                let id = result[1];
                let nextPath = {
                    name: 'spotInfo',
                    params: {
                        pid: id
                    },
                    query: {
                        from: 'qrcode'
                    }
                }
                let from = this.$route.query.fromPath ? this.$route.query.fromPath : '/enter/home';
                this.$MKOPush(nextPath, from, true);
            },
            getTaskBuilds() {
                api.getXCTaskPosition({
                    taskId: taskId
                }).then(res => {
                    let positions = res.response;
                    let checkPoints = {};
                    let builds = [];
                    let status = 0;
                    for (let p of positions) {
                        let v = p.positionName.split('|');
                        let v2 = p.positionValue.split('|');
                        let k = `${v[0]}${v[1]}`
                        let obj = checkPoints[k];
                        if (!p.status) {
                            status = 0;
                        } else {
                            status = state.status == 6 ? p.status : 0;
                        }
                        if (obj) {
                            obj.positions.push({
                                positionId: p.positionId,
                                fixedPositionId: p.fixedPositionId,
                                name: v[2],
                                status: status,
                                level: parseInt(v2[1])
                            });
                        } else {
                            obj = {
                                jzId: parseInt(v2[0]),
                                title: k,
                                level: parseInt(v2[1]),
                                positions: [{
                                    positionId: p.positionId,
                                    fixedPositionId: p.fixedPositionId,
                                    name: v[2],
                                    status: status,
                                    level: parseInt(v2[1])
                                }],
                                status: 0
                            };
                            checkPoints[k] = obj;
                        }
                    }
                    for (let k of Object.keys(checkPoints)) {
                        builds.push(checkPoints[k]);
                    }
                    builds.forEach((item) => {
                        let level = item.positions[0].level;
                        item['level'] = level;
                    });
                    builds.sort(compare('level'));
                    this.getTaskInfo();
                })
            },
            getTaskInfo() {
                api.getTaskInfo({
                    taskId: taskId
                }).then(res => {
                    if (!res) return false;
                    if (res.code == 0) {
                        if (res.response.groupId == this.$store.getters.groupId) {
                            if (res.response.status == 5) {
                                this.$MKODialog({msg: '无法查看该任务'});
                            } else {
                                this.goXunchaTask(res.response);
                            }
                        } else {
                            this.$MKODialog({msg: '无法查看该任务'});
                        }
                    } else {
                        this.$MKODialog({msg: '无法查看该任务'});
                    }
                })
            },
            goXunchaTask(task) {
                if (task.status == 5 || task.status == 6) {
                    let name = 'xuncha'
                    localStorage.setItem('lastReviewXunChaData', JSON.stringify(task));
                    localStorage.setItem('lastXunChaTaskId', task.taskId);
                    this.$MKOPush({
                        name: name,
                        params: {
                            taskId: task.taskId
                        },
                        query: {
                            from: 'home',
                            fromQuery: this.$route.query,
                            isReview: true
                        }
                    })
                    return;
                }
                if (task.status == 4) {
                    this.$MKODialog({title: '提示', msg: '数据正在处理中，请稍后查看...'})
                    return;
                }
                let routerPath = {};
                let taskData = cloneDeep(task);
                this.$store.registerModule('xuncha', xuncha);
                this.$store.commit(types.XUNCHA_INIT_TASK_DATA, taskData);
                localStorage.setItem('lastXunChaTaskId', task.taskId);
                routerPath = {
                    name: 'xuncha',
                    params: {
                        taskId: task.taskId
                    },
                    query: {
                        from: 'home',
                        fromPath: '/enter/home',
                        name: task.description,
                        taskDescribe: task.taskDescribe ? task.taskDescribe : task.description,
                        to: 'qiandao'
                    }
                }
                this.$MKOPush(routerPath, {
                    path: '/enter/home'
                });
            },
            goBindDevice(result) {
                result = result.split('_');
                let id = result[1];
                let nextPath = {
                    name: 'BindDevice',
                    params: {
                        id: id
                    },
                    query: {
                        from: 'qrcode'
                    }
                }
                let from = this.$route.query.fromPath ? this.$route.query.fromPath : '/enter/home';
                this.$MKOPush(nextPath, from, true);
            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

</style>
