<template>
    <div class="AlarmRecord">
        <div class="title-wrap-a">
            <div class="left">
                <div class="title">飞鹰-A522</div>
            </div>
            <div class="right">共10条记录</div>
        </div>
        <mko-double-cell :title="titleFilter(item)" label="A栋|B1|131（消防通道）" is-link v-for="item in 10">
            <span class="blue">未处理</span>
        </mko-double-cell>
    </div>
</template>
<script>
    export default {
        data() {
            return {

            }
        },
        methods: {
            titleFilter(item) {
                return `<span class='dingding'>${6}</span>消防通道堵塞监测`
            }
        }
    }
</script>
<style lang="less">
    @import "../../config.less";

    .AlarmRecord {
        margin-top: -14px;
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
        .blue {
            color: #3CA0E8;
        }
        .dingding {
            color: #ffffff;
            background-color: #ff0008;
            font-size: 12px;
            width: 24px;
            height: 14px;
            text-align: center;
            display: inline-block;
            border-radius: 3px;
            line-height: 17px;
            margin-right: 6px;
        }
    }
</style>
