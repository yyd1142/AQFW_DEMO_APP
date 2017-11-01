<template>
    <div class="ReviewTmpDeviceXunch">
        <div class="placeholder-item"></div>
        <mko-header :title="$route.query.name" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <task-summary :task-info="taskInfo" :status="status"></task-summary>
            <ul class="device-table-view">
                <li class="device-table-cell" v-for="(item, index) in checkRules">
                    <div class="padding">
                        <div class="device-item" :class="item.value ? 'border-bottom' : null">
                            <div class="dingding-icon" :class="item.value ? 'green-icon' : 'red-icon'"><span></span></div>
                            <span class="title" v-text="item.content"></span>
                            <span class="value" :class="item.value ? null : 'yellow-font'">{{item.needInputData == 1 ? item.dataValue : (!item.value ? '风险' : '正常')}}</span>
                        </div>
                    </div>
                    <div class="desc-wrap jiantou" v-if="!item.value">
                        <div class="text">
                            <div class="desc">{{item.description || '暂无描述'}}</div>
                        </div>
                        <photo-box max="8" :read-only="true" :photo-list="images[index]" @onPopup="setBackButton()" v-if="images[index].length > 0"></photo-box>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import api from 'api'
import apiconf from 'apiconf'
import { TaskSummary, PhotoBox } from 'components'
export default {
    data() {
        return {
            images: []
        }
    },
    activated() {
        this.setBackButton();
        let images = [];
        for (let i = 0; i < this.checkRules.length; i++) {
            images.push([]);
        }
        for (let i = 0; i < this.checkRules.length; i++) {
            let rule = this.checkRules[i];
            if (rule.imageId && rule.imageId.length > 0) {
                api.getByPath(`/info/${rule.imageId}`)({

                }).then(res => {
                    if (res.code != 0)
                        return;
                    if (res.response && res.response.length > 0) {
                        for (let image of res.response) {
                            images[i].push(`${apiconf.resourcesDomain}/${image.resouceId}`);
                        }
                    }
                });
            }
        }
        this.images = images;
    },
    deactivated() {
        sessionStorage.removeItem('lastReviewTaskSummary');
    },
    computed: {
        status() {
            return this.$route.query.status ? this.$route.query.status : 0;
        },
        taskInfo() {
            let taskInfo = this.$route.query.taskInfo;
            if (sessionStorage.getItem('lastReviewTaskSummary')) {
                taskInfo = JSON.parse(sessionStorage.getItem('lastReviewTaskSummary'));
            }
            return taskInfo;
        },
        checkRules() {
            let checkRules = this.$route.query.attribute ? JSON.parse(this.$route.query.attribute) : [];
            return checkRules;
        }
    },
    methods: {
        back() {
            this.$MKOPop()
        },
        setBackButton() {
            let self = this
            window.mkoBackButton = {}
            window.mkoBackButton.bInputData = true
            window.mkoBackButton.callback = function() {
                try {
                    window.MKODialogShow = false
                } catch (err) {
                    alert(err)
                }
                window.mkoBackButton.bInputData = false;
                self.$MKOPop();
            }
        }
    },
    components: {
        TaskSummary,
        PhotoBox
    }
}
</script>

<style lang="less">
@import "../../../../config.less";
.ReviewTmpDeviceXunch {
    .top-header-wrap {
        width: 100%;
        box-sizing: border-box;
        padding: 12px 8px;
        height: 60px;
        background-color: #ffffff;
        .border-btm(@borderGray);
        .padding {
            width: 100%;
            height: 36px;
            background: #FFFFFF;
            border: 1px solid #DDDDDD;
            box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.05);
            border-radius: 100px;
            text-align: center;
            line-height: 30px;
            position: relative;
            span {
                font-size: 12px;
                color: #999999;
                letter-spacing: 0px;
            }
            .icon-small-right-arrow {
                position: absolute;
                right: 14px;
                top: 0;
                bottom: 0;
                margin: auto;
            }
        }
    }
    .device-table-view {
        width: 100%;
        .device-table-cell {
            width: 100%;
            background-color: #f8f8f8;
            .padding {
                width: 100%;
                padding: 0 0 0 50px;
                background-color: #fff;
                .device-item {
                    width: 100%;
                    height: 44px;
                    line-height: 44px;
                    position: relative;
                    &.border-bottom {
                        .border-btm(@borderGray);
                    }
                    .dingding-icon {
                        width: 22px;
                        height: 22px;
                        border-radius: 50%;
                        position: absolute;
                        left: -36px;
                        top: 0;
                        bottom: 0;
                        margin: AUTO;
                        span {
                            width: 14px;
                            height: 14px;
                            border-radius: 50%;
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            margin: auto;
                            left: 0;
                            right: 0;
                        }
                    }
                    .yellow-icon {
                        background: rgba(255, 170, 68, 0.2);
                        span {
                            background: #FFAA44;
                        }
                    }
                    .green-icon {
                        background: rgba(85, 204, 51, 0.2);
                        span {
                            background: #55CC33;
                        }
                    }
                    .red-icon {
                        background: rgba(255, 102, 102, 0.2);
                        span {
                            background: #FF6666;
                        }
                    }
                    .title {
                        font-size: 16px;
                        color: #333333;
                        letter-spacing: 0px;
                        width: 100%;
                        float: left;
                        height: 44px;
                        line-height: 44px;
                        padding-right: 70px;
                        box-sizing: border-box;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .value {
                        font-size: 14px;
                        color: #666666;
                        letter-spacing: 0px;
                        position: absolute;
                        padding-right: 14px;
                        right: 0;
                        padding-right: 14px;
                    }
                    .icon {
                        position: absolute;
                        right: 14px;
                        bottom: 16px;
                        z-index: 20;
                    }
                    .cancel-btn {
                        font-size: 14px;
                        color: #3399FF;
                        letter-spacing: 0px;
                        position: absolute;
                        z-index: 22;
                        right: 14px;
                        width: 40px;
                        text-align: right;
                    }
                    .device-status {
                        font-size: 14px;
                        color: #666666;
                        letter-spacing: 0px;
                        position: ABSOLUTE;
                        right: 14px;
                        &.red-font {
                            color: #FF6666;
                        }
                    }
                }
            }
            .desc-wrap {
                width: 100%;
                &.jiantou {
                    position: relative;
                    &::before {
                        content: "";
                        width: 18px;
                        height: 18px;
                        background-color: #f8f8f8;
                        position: absolute;
                        right: 18px;
                        top: -7px;
                        transform: rotate(45deg);
                        -ms-transform: rotate(45deg);
                        /* IE 9 */
                        -moz-transform: rotate(45deg);
                        /* Firefox */
                        -webkit-transform: rotate(45deg);
                        /* Safari 和 Chrome */
                        -o-transform: rotate(45deg);
                    }
                }
                .text {
                    width: 100%;
                    padding: 14px 14px 0 14px;
                    position: relative;
                    height: 94px;
                    textarea {
                        width: 100%;
                        height: 80px;
                        background: #F2F2F2;
                        border: 1px solid #EEEEEE;
                        border-radius: 4px;
                        padding: 8px;
                        box-sizing: border-box;
                    }
                    .word-number {
                        font-size: 12px;
                        color: #999999;
                        letter-spacing: 0px;
                        position: absolute;
                        bottom: 6px;
                        right: 24px;
                        .red-font {
                            color: #ff4949;
                        }
                    }
                    .desc {
                        opacity: 0.72;
                        background: #FFFFFF;
                        border: 1px solid #CCCCCC;
                        border-radius: 4px;
                        height: 80px;
                        font-size: 14px;
                        color: #666666;
                        letter-spacing: 0px;
                        line-height: 18px;
                        padding: 8px
                    }
                }
                .photo-wrap {
                    background: none;
                }
            }
        }
    }
    .device-submit-btn {
        height: 40px;
        width: 100%;
        display: table;
        padding: 0 14px;
        margin: 14px 0;
        span {
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0px;
            background: #3399FF;
            border-radius: 4px;
            width: 100%;
            height: 40px;
            line-height: 40px;
            vertical-align: middle;
            display: table-cell;
            text-align: center;
            box-sizing: border-box;
        }
    }
}
</style>
