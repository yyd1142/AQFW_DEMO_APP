<template>
    <div class="AlarmDetail">
        <div class="placeholder-item"></div>
        <mko-header title="报警详情" left-icon="icon-back" @handleLeftClick="back" right-icon="icon-alarm-video"
                    @handleRightClick="liveVideo"></mko-header>
        <div class="page-wrap">
            <div class="title-card">
                <div class="cell clear">
                    <div class="title">报警部件</div>
                    <div class="value">{{$route.query.name}}</div>
                </div>
                <div class="cell clear">
                    <div class="title">安装位置</div>
                    <div class="value">{{$route.query.address}}</div>
                </div>
                <div class="cell clear">
                    <div class="title">首次报警</div>
                    <div class="value">2017-11-08 13:33</div>
                </div>
                <div class="cell clear">
                    <div class="title">最近报警</div>
                    <div class="value">2017-11-08 13:33</div>
                </div>
                <div class="cell clear">
                    <div class="title">报警次数</div>
                    <div class="value">{{$route.query.count}}</div>
                </div>
            </div>
            <div class="title-bar">
                <div class="label">警情处理状态跟踪</div>
            </div>
            <div class="alarm-record-wrap">
                <!--<mko-double-cell icon="icon-device-succ" title="已确认正常" label="2017-11-08 14:30"></mko-double-cell>-->
                <mko-double-cell icon="icon-device-warn" :title="'已通知负责人：' + personFilter(choosePersonResults.datas)"
                                 :label="timeFomat(choosePersonResults.time)"
                                 v-if="choosePersonResults.datas.length > 0"></mko-double-cell>
                <mko-double-cell icon="icon-device-danger" title="待处理" :label="'2017-11-08 13:33 ' + dangerFilter($route.query.name)" v-for="item in $route.query.count" @click="popupShow = true;">
                    <img class="alarm-img" :src="$route.query.type === 1 ? '/static/duse.jpg' : '/static/minghuo.jpg'"/>
                </mko-double-cell>
            </div>
            <div class="btn" v-if="$route.query.status == 2">
                <mko-button size="large" @click="choosePerson">通知责任人</mko-button>
                <mko-button class="paichu" size="large" plain @click="submit">确认正常</mko-button>
            </div>
        </div>
        <div class="photo-preview">
            <mt-popup v-model="popupShow">
                <div class="photo">
                    <img :src="$route.query.type === 1 ? '/static/duse.jpg' : '/static/minghuo.jpg'" width="350" height="350">
                </div>
            </mt-popup>
        </div>
    </div>
</template>
<script>
    import {Toast} from 'mint-ui'
    import moment from 'moment'
    export default {
        data() {
            return {
                choosePersonResults: {
                    datas: [],
                    time: ''
                },
                popupShow: false
            }
        },
        watch: {
            popupShow: function (val) {
                if(val) {
                    this.setBackButton()
                }
            }
        },
        activated() {
            let CacheKey = `videoDeviceAlarmDetail_${this.$route.params.id}`;
            if (sessionStorage.getItem(CacheKey)) {
                this.choosePersonResults = JSON.parse(sessionStorage.getItem(CacheKey));
            } else {
                this.choosePersonResults = {
                    datas: [],
                    time: ''
                }
            }
        },
        methods: {
            back() {
                this.$MKOPop();
            },
            liveVideo() {
                this.$MKOPush({
                    name: 'LiveVideoDetail',
                    params: {
                        id: this.$route.params.id
                    },
                    query: {
                        status: this.$route.query.status,
                        address: this.$route.query.address
                    }
                })
            },
            choosePerson() {
                this.$MKOPush({
                    name: 'ChoosePerson',
                    params: {
                        id: this.$route.params.id
                    },
                    query: {
                        from: 'monitorVideo'
                    }
                })
            },
            submit() {
                this.$MKODialog({
                    title: "排除风险吗",
                    msg: '排除风险后，该设备状态将恢复为正常',
                    cancelBtn: true,
                    cancelText: "取消"
                }).then(msg => {
                    if (msg === "confirm") {
                        let json = JSON.parse(sessionStorage.getItem('videoDeviceDatas'));
                        for (let [index, item] of json.deviceAlarmDatas.entries()) {
                            if (item.id === this.$route.params.id) {
                                json.deviceAlarmDatas.splice(index, 1);
                            }
                        }
                        sessionStorage.setItem('videoDeviceDatas', JSON.stringify(json));
                        Toast({message: "已排除风险", duration: 2000});
                        this.back();
                    }
                });
            },
            timeFomat(time) {
                return moment(time).format('YYYY-MM-DD HH:mm');
            },
            personFilter(datas) {
                let text = []
                for (let item of datas) {
                    text.push(item.name);
                }
                return text.join(',');
            },
            dangerFilter(name) {
                if(name === '消防通道堵塞监测') {
                    return '消防通道堵塞'
                } else if (name === '明火监测'){
                    return '监测到明火'
                } else {

                }
            },
            setBackButton() {
                let self = this;
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                window.mkoBackButton.callback = function () {
                    if(window.mkoBackButton.bInputData && self.popupShow) {
                        window.mkoBackButton.bInputData = false;
                        self.popupShow = false;
                    }
                }

            }
        }
    }
</script>
<style lang="less">
    @import "../../config.less";

    .AlarmDetail {
        .page-wrap {
            .title-card {
                margin: 14px;
                padding: 8px 14px;
                border-radius: 4px;
                box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
                letter-spacing: 0;
                background-color: #FFFFFF;
                .cell {
                    padding: 6px 0;
                    line-height: 14px;
                    .title {
                        float: left;
                        width: 24%;
                        margin-right: 14px;
                        font-size: 14px;
                        color: @baseText03;
                    }
                    .value {
                        float: left;
                        width: 70%;
                        font-size: 14px;
                        color: @baseText02;
                    }
                }
            }
            .title-wrap-a {
                width: 100%;
                height: 44px;
                padding: 0 14px;
                .left {
                    width: 200px;
                    float: left;
                    .title,
                    .all-checked {
                        display: inline;
                        font-size: 12px;
                        letter-spacing: 0px;
                        line-height: 44px;
                        height: 44px;
                    }
                    .title {
                        margin-right: 14px;
                        color: #999999;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .all-checked {
                        color: #3399FF;
                    }
                }
                .right {
                    float: right;
                    font-size: 12px;
                    color: #999999;
                    letter-spacing: 0px;
                    line-height: 44px;
                    height: 44px;
                }
            }
            .surveillance-table-view {
                width: 100%;
                box-sizing: border-box;
                padding: 0 14px;
                .surveillance-table-cell {
                    width: 50%;
                    position: relative;
                    box-sizing: border-box;
                    display: -webkit-inline-box;
                    margin-bottom: 14px;
                    &:nth-child(even) > .padding {
                        padding-left: 7px;
                    }
                    &:nth-child(odd) > .padding {
                        padding-right: 7px;
                    }
                    .padding {
                        position: relative;
                        img {
                            width: 100%;
                        }
                        .time {
                            width: 100%;
                            position: absolute;
                            bottom: 0;
                            color: #ffffff;
                            height: 24px;
                            line-height: 24px;
                            padding: 0 10px;
                            font-size: 12px;
                            span:first-child {
                                float: left;
                            }
                            span:last-child {
                                float: right;
                            }
                        }
                    }
                }
            }
            .btn {
                position: fixed;
                bottom: 0;
                width: 100%;
                background-color: #fff;
                padding: 14px 0;
                .mko-button + .mko-button {
                    margin-top: 14px;
                }
            }
        }
        .title-bar {
            height: 34px;
            padding: 14px 14px 8px;
            line-height: 12px;
            font-size: 12px;
            letter-spacing: 0;
            background-color: @baseBG01;
            .label {
                color: @baseText02;
            }
        }
        .alarm-record-wrap {
            .alarm-img {
                width: auto;
                height: 43px;
            }
            .mko-double-cell + .mko-double-cell {
                position: relative;
                &:after {
                    content: '';
                    position: absolute;
                    left: 23px;
                    top: -19px;
                    height: 38px;
                    width: 3px;
                    background-color: @baseBorder;
                }
            }
        }
        .photo-preview {
            .mint-popup {
                padding-top: 30px;
                background: none;
                .photo {
                    img {
                        border-radius: 4px;
                    }
                }
                .cancel {
                    position: absolute;
                    right: 0;
                    top: -10px;
                    font-size: 36px;
                    font-weight: 600;
                    color: #fff;
                }
                .delete {
                    margin-top: 20px;
                }
            }
            .v-modal {
                opacity: .8;
                background: #565656;
            }
        }
    }
</style>
