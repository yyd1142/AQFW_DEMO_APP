<template>
    <div class="AlarmDetail">
        <div class="placeholder-item"></div>
        <mko-header title="报警详情" left-icon="icon-back" @handleLeftClick="back" right-icon="icon-message-prompt-no"
                    @handleRightClick="liveVideo"></mko-header>
        <div class="page-wrap">
            <div class="title-wrap-a">
                <div class="left">
                    <div class="title">深圳湾体育中心-游泳馆，2层，西南角巡查点</div>
                </div>
                <div class="right">共10条记录</div>
            </div>
            <ul class="surveillance-table-view">
                <li class="surveillance-table-cell" v-for="item in 11">
                    <div class="padding">
                        <img src="/static/WX20171101-165733.png"/>
                        <div class="time">
                            <span>2017-11-11</span>
                            <span>09:18</span>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="btn">
                <mko-button size="large" @click="choosePerson">通知责任人</mko-button>
                <mko-button class="paichu" size="large" plain @click="submit">排除风险</mko-button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
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
                    }
                })
            },
            choosePerson() {
                this.$MKOPush('/choosePerson')
            },
            submit() {
                this.$MKODialog({
                    title: "提示",
                    msg: '确定排除风险吗？',
                    cancelBtn: true,
                    cancelText: "取消"
                }).then(msg => {
                    if (msg == "confirm") {

                    }
                });
            }
        }
    }
</script>
<style lang="less">
    @import "../../config.less";

    .AlarmDetail {
        .page-wrap {
            background-color: #ffffff;
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
                background-color: #ffffff;
                margin-bottom: 45px;
                box-sizing: border-box;
                padding: 0 14px;
                .surveillance-table-cell {
                    width: 50%;
                    position: relative;
                    background-color: #ffffff;
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
    }
</style>
