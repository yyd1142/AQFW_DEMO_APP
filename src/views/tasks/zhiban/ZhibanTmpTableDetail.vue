<template>
    <div class="ZhibanTmpTableDetail">
        <div class="placeholder-item"></div>
        <mko-header :title="bcDetail.description" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <task-summary :task-info="taskInfo" :status="bcDetail.status"></task-summary>
            <div class="report-file">
                <!-- 已于2017-09-09审核报告 -->
            </div>
        </div>
    </div>
</template>

<script>
import { TaskSummary } from 'components'
import moment from 'moment'
export default {
    data() {
        return {
            bcDetail: {},
            taskInfo: []
        }
    },
    activated() {
        this.$nextTick(() => {
            this.bcDetail = this.$route.query.bcDetail;
            this.taskInfo = [{
                key: '执行人员', value: this.bcDetail.executorName || '暂无'
            }, {
                key: '协同人员', value: this.bcDetail.collaboratorName || '暂无'
            }, {
                key: '执行日期', value: moment(this.bcDetail.startTime).format('YYYY-MM-DD HH:mm')
            }, {
                key: '截止日期', value: moment(this.bcDetail.endTime).format('YYYY-MM-DD HH:mm')
            }]
        })
    },
    methods: {
        back() {
            this.$MKOPop()
        },
        edit() {
            let nextPath = {
                name: 'EditTmpZhiban',
                params: {
                    id: this.$route.params.id
                },
                query: {
                    bcDetail: this.$route.query.bcDetail
                }
            }
            let from = `/zhibanTable/${this.$route.params.id}`
            this.$MKOPush(nextPath, from, true)
        },
        banciTimeFilter(time) {
            if (!time) return '选择';
            let startTime = time.substr(0, 5);
            let endTime = time.substring(9, 14);
            return `${startTime}~${endTime}`
        }
    },
    components: {
        TaskSummary
    }
}
</script>

<style lang="less">
@import "../../../config.less";
.ZhibanTmpTableDetail {
    width: 100%;
    .zhiban-item {
        width: 100%;
        display: table;
        min-height: 44px;
        background-color: #fff;
        span {
            min-height: 44px;
            line-height: 44px;
            display: table-cell;
            vertical-align: middle;
        }
        .key {
            width: 50%;
            font-size: 16px;
            padding-left: 14px;
        }
        .value {
            width: 50%;
            font-size: 14px;
            padding-right: 14px;
            text-align: right;
        }
    }
    .zhiban-desc {
        width: 100%;
        background: #Ffffff;
        .title {
            width: 100%;
            font-size: 16px;
            padding-left: 14px;
            line-height: 44px;
            height: 44px;
        }
        .textarea {
            width: 100%;
            padding: 0 14px;
            min-height: 100px;
            textarea {
                width: 100%;
                min-height: 100px;
                font-size: 14px;
                padding: 10px 0;
                box-sizing: border-box;
            }
        }
    }
    .report-file {
        width: 100%;
        text-align: center;
    }
    .task-info-wrap {
        width: 100%;
        padding: 14px;
        .padding {
            background: #FFFFFF;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
            border-radius: 4px;
            .upload-task {
                width: 100%;
                height: 30px;
                background: #CCCCCC;
                text-align: center;
                line-height: 30px;
                border-radius: 4px 4px 0 0;
                div {
                    width: 85px;
                    margin: 0 auto;
                    position: relative;
                    padding-left: 14px;
                    .icon {
                        position: absolute;
                        left: 0;
                        margin: auto;
                        top: 0;
                        bottom: 0;
                    }
                    .item {
                        font-size: 16px;
                        color: #FFFFFF;
                        letter-spacing: 0;
                        line-height: 16px;
                    }
                }
            }
            .task-item {
                padding: 14px;
                .item {
                    width: 100%;
                    min-height: 14px;
                    line-height: 14px;
                    margin-bottom: 12px;
                    &.desc {
                        .value {}
                    }
                    .key {
                        font-size: 14px;
                        color: #999999;
                        letter-spacing: 0px;
                        margin-right: 14px;
                    }
                    .value {
                        font-size: 14px;
                        color: #666666;
                        letter-spacing: 0px;
                        line-height: 14px;
                    }
                }
            }
        }
    }
}
</style>
