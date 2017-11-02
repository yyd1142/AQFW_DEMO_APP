<template>
    <div class="AlarmDetail">
        <div class="placeholder-item"></div>
        <mko-header title="报警详情" left-icon="icon-back" @handleLeftClick="back" right-icon="icon-message-prompt-no"
                    @handleRightClick="liveVideo"></mko-header>
        <div class="page-wrap">
            <ul class="surveillance-table-view">
                <li class="surveillance-table-cell" v-for="item in 10">
                    <div class="padding">
                        <img src="/static/WX20171101-165733.png"/>
                        <div class="name">消防通道堵塞监测</div>
                        <div class="address">杨子康 已确认正常</div>
                        <div class="time">2017-11-11 09:11</div>
                    </div>
                </li>
            </ul>
            <div class="btn submit">
                <div class="cell" @click="choosePerson">通知负责人</div>
                <div class="cell border" @click="submit">确认正常</div>
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
                    msg: '确定排除报警吗？',
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
        .surveillance-table-view {
            width: 100%;
            background-color: #ffffff;
            margin-bottom: 45px;
            .surveillance-table-cell {
                width: 100%;
                position: relative;
                background-color: #ffffff;
                box-sizing: border-box;
                .padding {
                    .border-btm(@borderGray);
                    img {
                        width: 100%;
                    }
                    .name {
                        width: 100%;
                    }
                    .address {
                        width: 100%;
                    }
                    .time {
                        width: 100%;
                    }
                }
            }
        }
        .btn {
            width: 100%;
            position: fixed;
            bottom: 0;
            height: 44px;
            z-index: 20;
            &.submit {
                background-color: #3CA0E8;
            }
            .cell {
                width: 50%;
                float: left;
                line-height: 44px;
                height: 44px;
                color: #ffffff;
                text-align: CENTER;
                &.border {
                    width: 49%;
                    border-left: 1px solid #ffffff;
                }
            }
        }
    }
</style>
