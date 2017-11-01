<template>
    <div class="AdminZhibanInfo">
        <div class="placeholder-item"></div>
        <mko-header :title="$route.query.name" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <task-summary :task-info="taskInfo" :status="status">
                <div class="xuncha-review-btn blue" @click.stop="checkRepo" v-if="isAdmin && status == 5 && !isFormTask && needReview">
                    <span>审核报告</span>
                </div>
            </task-summary>
            <div class="title" v-if="status > 1 && zhibanRecord.length > 0">值班日志详情</div>
            <ul class="record-wrap" v-if="status > 1">
                <li class="record-cell" v-for="item in zhibanRecord">
                    <div class="dingding icon-device-succ">
                        <span></span>
                    </div>
                    <div class="headImage icon-head-image-small"></div>
                    <div class="padding">
                        <div class="description" v-text="item.description"></div>
                        <div class="time">{{item.createTime | formatDate('YYYY-MM-DD HH:mm')}}</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import api from 'api'
import { TaskSummary } from 'components'
import { Toast } from 'mint-ui'
import moment from 'moment'

export default {
    data() {
        return {
            statusInfo: {},
            zhibanRecord: [],
            currentTask: '',
            taskInfo: []
        }
    },
    mounted() {
        this.currentTask = JSON.parse(localStorage.getItem('lastReviewZhiBanData'));
        this.statusInfo = {
            status: this.currentTask.status,
            name: this.currentTask.executorName || '暂无',
            startTime: this.currentTask.startTime,
            endTime: this.currentTask.endTime
        }
        this.taskInfo = [{
            key: '执行人员', value: this.currentTask.executorName || '暂无'
        }, {
            key: '执行日期', value: moment(this.currentTask.startTime).format('YYYY-MM-DD HH:mm')
        }, {
            key: '截止日期', value: moment(this.currentTask.endTime).format('YYYY-MM-DD HH:mm')
        }, {
            key: '任务描述', value: this.currentTask.description || '暂无'
        }]
        this.$nextTick(() => {
            this.zhibanTaskLogs()
        })
    },
    computed: {
        status() {
            return this.currentTask.status;
        },
        isAdmin() {
            return this.$store.state.user.isAdmin;
        },
        isFormTask() {
            if (this.$route.query.formTask)
                return parseInt(this.$route.query.formTask);
        },
        needReview() {
            if (this.$route.query.needReview === undefined || this.$route.query.needReview === 'undefined') {
                return true;
            } else {
                return parseInt(this.$route.query.needReview);
            }
        }
    },
    methods: {
        checkRepo() {
            this.$MKODialog({
                title: '提示',
                msg: `<div class="center">确定审核该报告？</div>`,
                cancelBtn: true,
                cancelText: '取消'
            }).then(msg => {
                if (msg == 'confirm') {
                    api.changeTaskStatusByTaskId({
                        taskId: this.currentTask.taskId,
                        status: 6
                    }).then(res => {
                        if (!res) return false;
                        if (res.code != 0) {
                            Toast(res.msg);
                            return false;
                        }
                        sessionStorage.setItem('repoInfoIsUpdate', true);
                        setTimeout(() => {
                            Toast('审核成功');
                            this.$MKOPop();
                        }, 500);
                    })
                }
            })
        },
        back() {
            this.$MKOPop();
        },
        // 值班日志
        zhibanTaskLogs() {
            let params = {
                taskId: this.currentTask.taskId
            }
            api.getZbTaskLogs(params).then(res => {
                if (!res)
                    return;
                if (res.code != 0) {
                    this.$MKODialog({msg:res.msg});
                    return;
                }
                this.zhibanRecord = res.response;
            })
        }
    },
    components: {
        TaskSummary
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "../../../config.less";

.AdminZhibanInfo {
    .info-wrap {
        margin-top: 14px;
        .border-btm(@borderGray);
        font-size: 14px;
        .info {
            .mint-cell {
                min-height: 44px;
                .mint-cell-wrapper {
                    padding: @cellPadding;
                    font-size: 14px;
                    .mint-cell-value {
                        color: @textLB;
                    }
                }
            }
        }
        .desc {
            padding: @cellPadding;
            line-height: 20px;
            background: #F7F7F8;
            &:after {
                display: table;
                content: "";
            }
            .title {
                margin: 0 0 2px 0;
                padding-top: 7px;
            }
            .content {
                margin: 0;
                min-height: 80px;
                color: @textGray;
            }
        }
    }
    .title {
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        line-height: 12px;
        width: 100%;
        padding: 0 14px;
        margin: 14px 0 0 0;
    }
    .record-wrap {
        width: 100%;
        background-color: #ffffff;
        margin-top: 8px;
        .record-cell {
            position: relative;
            height: 62px;
            padding: 0 0 0 96px;
            box-sizing: border-box;
            &:after {
                content: "";
                position: absolute;
                background: #EEEEEE;
                width: 2px;
                left: 22px;
                height: 100%;
                top: 30px;
                z-index: 1;
            }
            &:last-child:after {
                content: none;
            }
            &:last-child>.padding:after {
                content: none;
            }
            .dingding {
                position: absolute;
                left: 12px;
                top: 0;
                bottom: 0;
                margin: auto;
                z-index: 2;
            }
            .headImage {
                position: absolute;
                left: 46px;
                margin: auto;
                top: 0;
                bottom: 0;
            }
            .padding {
                width: 100%;
                padding: 0;
                position: relative;
                height: 62px;
                .border-btm(@borderGray);
                .description {
                    font-size: 14px;
                    color: #333333;
                    letter-spacing: 0;
                    width: 100%;
                    padding-top: 14px;
                }
            }
            .time {
                font-size: 12px;
                color: #999999;
                letter-spacing: 0;
                line-height: 12px;
                width: 100%;
                padding-top: 8px;
            }
        }
    }

    .footer-wrap {
        position: fixed;
        width: 100%;
        bottom: 0;
        .btn {
            background: @mainBlue;
            color: #fff;
        }
    }

    .zhiban-log-notdata {
        font-size: 14px;
        width: 100%;
        padding: 14px;
    }

    .xuncha-review-btn {
        width: 100%;
        height: 40px;
        text-align: center;
        display: table;
        border-radius: 4px;
        margin-top: 10px;
        &.blue {
            font-size: 16px;
            letter-spacing: 0px;
            line-height: 18px;
            background-color: #3399FF;
            color: #ffffff;
            margin-top: 30px;
        }
        &.yellow {
            font-size: 16px;
            letter-spacing: 0px;
            line-height: 40px;
            background-color: #FFBB00;
            color: #ffffff;
            margin-top: 30px;
        }
        span {
            font-size: 16px;
            letter-spacing: 0px;
            height: 40px;
            line-height: 40px;
            display: table-cell;
            vertical-align: middle;
        }
    }
}
</style>
