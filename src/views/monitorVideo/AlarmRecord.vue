<template>
    <div class="AlarmRecord">
        <div class="title-wrap-a">
            <div class="left">
                <div class="title">万象城C座L1</div>
            </div>
            <div class="right">共{{datas.length}}条记录</div>
        </div>
        <mko-double-cell :title="titleFilter(item)" :label="item.address" v-for="item in datas">
            <span>{{statusFilter[item.status]}}</span>
        </mko-double-cell>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                datas: [{
                    address: 'A栋|B1|131（应急出口）',
                    count: 0,
                    name: '应急出口堵塞监测',
                    status: 1
                }, {
                    address: 'A栋|B1|122（电压房）',
                    count: 5,
                    name: '电压房堵塞监测',
                    status: 2
                }, {
                    address: 'A栋|B1|89（安全出口）',
                    count: 6,
                    name: '安全出口堵塞监测',
                    status: 3
                }],
                statusFilter: ['', '已通知', '待处理', '已确认正常']
            }
        },
        methods: {
            titleFilter(item) {
                if (item.count == 0) {
                    return item.name;
                } else {
                    return `<span class='dingding'>${item.count}</span>${item.name}`;
                }
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
                    text-overflow: ellipsis;
                    overflow: hidden;
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
