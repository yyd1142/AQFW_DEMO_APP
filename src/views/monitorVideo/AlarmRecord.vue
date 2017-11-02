<template>
    <div class="AlarmRecord">
        <div class="totalcount">报警总数：2</div>
        <ul class="record-table-view">
            <li class="record-table-cell" v-for="item in 10">
                <div class="padding">
                    <div class="alarm-item">消防通道堵塞</div>
                    <div class="address">A栋|负1楼</div>
                    <div class="status">已通知,待处理</div>
                    <div class="time">已通知,待处理</div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script></script>
<style lang="less">
    @import "../../config.less";
    .AlarmRecord {
        .totalcount {
            margin-top: 14px;
            width: 100%;
            height: 44px;
            line-height:44px;
            padding-left: 14px;
            color: #ff0008;
            font-size: 14px;
            background-color: #ffffff;
        }
        .record-table-view {
            width: 100%;
            margin-top: 14px;
            .record-table-cell {
                width: 100%;
                background-color: #ffffff;
                position: relative;
                background-color: #ffffff;
                box-sizing: border-box;
                padding-left: 14px;
                .padding {
                    .border-btm(@borderGray);
                    .alarm-item {
                        font-size: 14px;
                    }
                    .address {
                        font-size: 14px;
                    }
                    .status {
                        font-size: 14px;
                    }
                    .time {
                        font-size: 14px;
                    }
                }
            }
        }
    }
</style>
