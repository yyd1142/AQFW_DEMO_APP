<template>
    <div class="AlarmDetail">
        <div class="placeholder-item"></div>
        <mko-header title="报警详情" left-icon="icon-back" @handleLeftClick="back" right-icon="icon-message-prompt-no"
                    @handleRightClick="liveVideo"></mko-header>
        <div class="page-wrap">
            <div class="title-wrap-a">
                <div class="left">
                    <div class="title" v-text="$route.query.address"></div>
                </div>
                <div class="right">共{{$route.query.count}}条记录</div>
            </div>
            <ul class="surveillance-table-view">
                <li class="surveillance-table-cell" v-for="item in $route.query.count">
                    <div class="padding">
                        <img src="/static/WX20171101-165733.png"/>
                        <div class="time">
                            <span>2017-11-11</span>
                            <span>09:18</span>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="title-bar">
                <div class="label">警情处理状态跟踪</div>
            </div>
            <div class="alarm-record-wrap">
                <!--<mko-double-cell icon="icon-device-succ" title="已确认正常" label="2017-11-08 14:30"></mko-double-cell>-->
                <mko-double-cell icon="icon-device-warn" :title="'已通知负责人：' + personFilter(choosePersonResults.datas)" :label="timeFomat(choosePersonResults.time)" v-if="choosePersonResults.datas.length > 0"></mko-double-cell>
                <mko-double-cell icon="icon-device-danger" title="待处理" label="2017-11-08 12:30"></mko-double-cell>
            </div>
            <div class="btn" v-if="$route.query.status == 2">
                <mko-button size="large" @click="choosePerson">通知责任人</mko-button>
                <mko-button class="paichu" size="large" plain @click="submit">排除风险</mko-button>
            </div>
        </div>
    </div>
</template>
<script>
    import { Toast } from 'mint-ui'
    import moment from 'moment'
    export default {
        data() {
            return {
                choosePersonResults: {
                    datas: [],
                    time: ''
                }
            }
        },
        activated() {
            let CacheKey = `videoDeviceAlarmDetail_${this.$route.params.id}`;
            if(sessionStorage.getItem(CacheKey)) {
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
                    title: "提示",
                    msg: '确定排除风险吗？',
                    cancelBtn: true,
                    cancelText: "取消"
                }).then(msg => {
                    if (msg === "confirm") {
                        let json = JSON.parse(sessionStorage.getItem('videoDeviceDatas'));
                        for(let [index, item] of json.deviceAlarmDatas.entries()) {
                            if(item.id === this.$route.params.id) {
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
                for(let item of datas) {
                    text.push(item.name);
                }
                return text.join(',');
            }
        }
    }
</script>
<style lang="less">
    @import "../../config.less";

    .AlarmDetail {
        .page-wrap {
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
                width: 100%;
                margin-top: 14px;
                .paichu {
                    margin-top: 10px;
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
    }
</style>
