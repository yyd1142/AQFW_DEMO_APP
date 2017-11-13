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
    export default {
        data() {
            return {}
        },
        activated() {
            this.$ScanQRCode(result => {
                if (result.response.indexOf('deviceDetail') === 0) {
                    this.goDeviceDetail(result.response) //设备
                } else if(result.response.indexOf('BindDevice') === 0){
                    this.goBindDevice(result.response)
                } else {
                    this.errorQRCode()
                }
            });
        },
        methods: {
            back() {
                this.$MKOPop()
            },
            dialog() {
                this.$MKODialog({
                    title: "提示",
                    msg: '检测到该设备所在巡查点正在进行巡查任务，需要查看吗？',
                    cancelBtn: true,
                    confirmText: '查看设备详情',
                    cancelText: "查看巡查点"
                }).then(msg => {
                    if (msg == "confirm") {
                        this.viewQiandao();
                    } else {
//                        this.goDeviceDetail();
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
                let from = '/enter/home';
                this.$MKOPush(nextPath, from, true);
            },
            getTaskBuilds(taskId)
            {
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
                    console.log(builds);
                })
            }
            ,
            viewQiandao(item, buildIndex, floorIndex)
            {
//                if (this.status == 1) {
//                    Toast({message: "请先开始巡查任务!", duration: 2000});
//                    return false;
//                }
//                if (item.status == 1 && this.status == 3) {
//                    Toast({message: "未巡查，无巡查数据!", duration: 2000});
//                    return false;
//                }
//                this.$MKOPush({
//                    path: `/qiandaoDailyXuncha/${this.$route.params.id}`,
//                    query: {
//                        positionId: item.positionId,
//                        buildIndex: buildIndex,
//                        floorIndex: floorIndex,
//                        name: item.name
//                    }
//                });
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
                let from = '/enter/home';
                this.$MKOPush(nextPath, from, true);
            },
            errorQRCode() {

            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

</style>
