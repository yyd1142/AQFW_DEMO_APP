<template>
    <div class="AlarmRecord">
        <div class="title-wrap-a" v-if="datas.length > 0">
            <div class="left">
                <div class="title" v-text="address"></div>
            </div>
            <div class="right">共{{datas.length}}条记录</div>
        </div>
        <no-data v-if="datas.length <= 0" text="暂无记录"></no-data>
        <mko-double-cell :title="titleFilter(item)" :label="address" v-for="item in datas">
            <span>{{statusFilter[item.status]}}</span>
        </mko-double-cell>
    </div>
</template>
<script>
    import {NoData} from 'components'
    export default {
        props: ['address'],
        data() {
            return {
                statusFilter: ['', '已通知', '待处理', '已确认正常']
            }
        },
        computed: {
            datas() {
               let datas = [{
                    address: 'A栋|B1|131（应急出口）',
                    count: 0,
                    name: '应急出口堵塞监测',
                    status: 1
                }, {
                    address: 'A栋|B1|89（安全出口）',
                    count: 6,
                    name: '安全出口堵塞监测',
                    status: 3
                }]
                if(this.$route.params.id != 1) datas = [];
                return datas;
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
        },
        components: {
            NoData
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
        .no-data-wrap {
            top: 400px;
        }
    }
</style>
