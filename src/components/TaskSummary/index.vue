<template>
    <div class="TaskSummary">
        <div class="task-info-wrap">
            <div class="padding">
                <div class="task-header" :style="{backgroundColor: statusStyleFilter(status)}" v-if="status">
                    <div>
                        <i class="icon" :class="statusIconFilter(status)"></i>
                        <span class="item">{{status | taskStatusFilter}}</span>
                    </div>
                </div>
                <div class="task-item">
                    <div class="item" v-for="item, index in taskInfo">
                        <span class="key fl" v-text="item.key"></span>
                        <span class="value fl" :class="taskInfo.length == (index + 1) ? null : 'no-overflow'" v-text="item.value"></span>
                    </div>
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { taskStatusFilter } from 'filters'
export default {
    props: ['taskInfo', 'status'],
    methods: {
        statusIconFilter(status) {
            // [1: 待执行，2: 执行中，3: 已完成，未上传 4: 已上传，处理中  5: 处理完成，待审核，6: 通过审核（已完成） 7: 已超期]
            let icons = ['', 'icon-not-start', 'icon-clock', 'icon-upload-task', 'icon-not-start', 'icon-not-review', 'icon-is-finish', 'icon-time-up', 'icon-clock']
            return icons[status]
        },
        statusStyleFilter(status) {
            let colors = ['', '#CCCCCC', '#3399FF', '#3399FF', '#CCCCCC', '#FFBB00', '#57DA6D', '#FF6666', '#3399FF'];
            return colors[status];
        }
    }
}
</script>

<style lang="less">
@import "../../config.less";
.TaskSummary {
    .task-info-wrap {
        width: 100%;
        padding: 14px;
        .padding {
            background: #FFFFFF;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
            border-radius: 4px;
            .task-header {
                width: 100%;
                height: 30px;
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
                    min-height: 14px;
                    display: table;
                    width: 100%;
                    margin-bottom: 12px;
                    span {
                        vertical-align: middle;
                        display: table-cell;
                        line-height: 14px;
                    }
                    .key {
                        font-size: 14px;
                        color: #999999;
                        letter-spacing: 0;
                        width: 70px;
                    }
                    .value {
                        max-width: 70%;
                        font-size: 14px;
                        color: #666666;
                        letter-spacing: 0;
                        line-height: 14px;
                        white-space: normal;
                        word-break: break-all;
                    }
                }
                .item-btn {
                    width: 100%;
                    height: 40px;
                    text-align: center;
                    display: table;
                    box-shadow: inset 0px 0px 0px 1px #299FFF;
                    border-radius: 4px;
                    margin-top: 10px;
                    color: #3399FF;
                    &.blue {
                        font-size: 16px;
                        letter-spacing: 0px;
                        line-height: 18px;
                        background-color: #3399FF;
                        color: #ffffff;
                        margin-top: 18px;
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
        }
    }
}
</style>
