<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="消息详情" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap message-detail-wrap" v-if="messagesInfoShow">
            <div class="main-msg">
                <div class="content-msg" v-html="messageInfo.content"></div>
            </div>
            <div class="msg-btn" v-if="extentData.name != ''" @click="goInfo">
                <span>{{extentDataName(extentData.name)}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import {formatDate} from 'filters'
    import xuncha from 'store/modules/xuncha'
    import zhiban from 'store/modules/zhiban'
    import * as types from 'store/mutation-types'
    var _id = ''

    // task taskId
    // notice noticeId
    // yhk yhkId
    export default {
        data() {
            return {
                messageInfo: {},
                extentData: {
                    name: ''
                },
                messagesInfoShow: true,
                messageType: ''
            }
        },
        activated() {
            if (_id != this.$route.params.pid) {
                this.updateMessageStatus()
                this.getData()
            }
            setTimeout(() => {
                this.messagesInfoShow = true;
            }, 200)
        },
        deactivated() {
            this.messagesInfoShow = false;
        },
        methods: {
            getData() {
                api.getMsgInfo({
                    id: this.$route.params.pid
                }).then(res => {
                    _id = this.$route.params.pid
                    if (res.code === 0) {
                        this.messageInfo = res.response;
                        if (res.response.extentData != null && res.response.extentData.indexOf('}') > 0) {
                            this.extentData = JSON.parse(res.response.extentData)
                        } else {
                            this.extentData = {
                                name: ''
                            }
                        }
                    }
                })
            },
            updateMessageStatus() {
                if (this.$route.query.status == 0) {
                    sessionStorage.setItem('MESSAGEDETAIL_READ_STATUS', JSON.stringify({
                        id: this.$route.params.pid,
                        status: 1
                    }))
                }
            },
            back() {
                this.$MKOPop()
            },
            goTaskInfo(task) {
                let name = 'xuncha'
                if (task.taskType == 1)
                    name = "zhiban"

                if (name == 'xuncha') {
                    this.$store.registerModule('xuncha', xuncha);
                    this.$store.commit(types.XUNCHA_INIT_TASK_DATA, task);
                    localStorage.setItem('lastXunChaTaskId', task.taskId);
                }
                if (name == 'zhiban') {
                    this.$store.registerModule('zhiban', zhiban);
                    this.$store.commit(types.ZHIBAN_INIT_DATA, task);
                    localStorage.setItem('lastZhiBanTaskId', task.taskId);
                }

                this.$MKOPush({
                    name: name,
                    params: {
                        taskId: task.taskId
                    },
                    query: {
                        from: 'messageDetail',
                        isReview: false,
                        fromPath: this.$route.fullPath,
                        name: name === 'xuncha' ? '巡查任务' : '值班任务'
                    }
                })
            },
            reViewTask(task) {
                if (task.status == 1 || task.status == 2 || task.status == 3 || task.status == 4 || task.status == 7) {
                    if (this.$store.getters.userName === task.creater) {
                        this.$MKODialog({msg: '该任务还未执行，请在我的任务中执行'});
                    } else {
                        this.$MKODialog({msg: '不能查看未开始、执行中、已超期的任务详情'});
                    }
                    return;
                }
                let name = 'xuncha'
                if (task.taskType == 1)
                    name = "zhiban"

                if (name == 'xuncha') {
                    localStorage.setItem('lastReviewXunChaData', JSON.stringify(task));
                    localStorage.setItem('lastXunChaTaskId', task.taskId);
                    // this.$store.commit(types.XUNCHA_INIT_TASK_DATA, task);
                }
                if (name == 'zhiban') {
                    localStorage.setItem('lastReviewZhiBanData', JSON.stringify(task));
                    localStorage.setItem('lastZhiBanTaskId', task.taskId);
                    // this.$store.commit(types.ZHIBAN_INIT_TASK_DATA, task);
                }
                this.$route.query['name'] = 'messageDetail';
                this.$MKOPush({
                    name: name,
                    params: {
                        taskId: task.taskId
                    },
                    query: {
                        from: 'messageDetail',
                        isReview: true,
                        fromPath: this.$route.fullPath,
                        name: name === 'xuncha' ? '巡查任务' : '值班任务'
                    }
                })
            },
            linkPath(routeOption) {
                this.$MKOPush(routeOption)
            },
            extentDataName(val) {
                if (this.extentData.name == '') return false;
                if (this.extentData.name == 'yhk') {
                    this.messageType = 1;
                    return '查看风险';
                } else if (this.extentData.name == 'notice') {
                    this.messageType = 2;
                    return '查看通知公告';
                } else if (this.extentData.name == 'task') {
                    this.messageType = 3;
                    return '查看任务';
                } else if (this.extentData.name == 'safetyFile') {
                    this.messageType = 4;
                    return '查看安全活动';
                } else {
                    this.messageType = 0;
                }
            },
            getTaskInfo(id) {
                api.getTaskInfo({
                    taskId: id
                }).then(res => {
                    if (!res) return false;
                    if (res.code == 0) {
                        if (res.response.groupId == this.$store.getters.groupId) {
                            if (res.response.status == 5) {
                                this.reViewTask(res.response)
                            } else {
                                this.goTaskInfo(res.response)
                            }
                        } else {
                            this.$MKODialog({msg: '无法查看该任务'});
                        }
                    } else {
                        this.$MKODialog({msg: '无法查看该任务'});
                    }
                })
            },
            goInfo() {
                if (this.messageType == 1) {
                    this.linkPath({path: `/hidden_danger_info/${this.extentData.id}`})
                } else if (this.messageType == 2) {
                    this.linkPath({
                        path: `/notice/${this.extentData.noticeId}`,
                        query: {
                            from: 'notification'
                        }
                    })
                } else if (this.messageType == 3) {
                    this.getTaskInfo(this.extentData.id)
                } else if (this.messageType == 4) {
                    this.linkPath({path: `/safe_activity`})
                } else {

                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../config.less";

    .message-detail-wrap {
        padding-bottom: 0;
        background-color: #ffffff;
        height: 100vh;
        padding-top: 40px + @headerTop;
        margin-top: 0;
        .msg-btn {
            background-color: @blueColor;
            text-align: CENTER;
            font-size: 16px;
            color: #fff;
            position: fixed;
            width: 100%;
            bottom: 0;
            z-index: 10;
            display: table;
            span {
                line-height: 44px;
                height: 44px;
                display: table-cell;
                vertical-align: middle;
            }
        }
    }

    .message-title {
        width: 100%;
        margin: 0 auto;
        h3 {
            font-size: 18px;
            color: #232323;
            margin: 0;
            padding: 0;
        }
        .date {
            font-size: 14px;
            color: #B5B5B5;
            float: right;
            margin: -14px 0 0 0;
        }
    }

    .main-msg {
        width: 100%;
        padding: 16px 14px 14px 14px;
        box-sizing: border-box;
        margin: 0 auto 54px auto;
    }

    .content-msg {
        display: block;
        color: #888B8C;
        font-size: 14px;
        margin-top: 8px;
    }
</style>
