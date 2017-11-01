<template>
    <div class="DailyXunchaHistory">
        <div class="placeholder-item"></div>
        <mko-header title="历史记录" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <mko-cell title="执行频率" :val="patrolFrequency"></mko-cell>
            <div class="xuncha-history">
                <mko-cell :title="executorTimeFilter(item.executorTime)" :val="executorNameFilter(item.executorName)" v-for="item in deviceLogs"></mko-cell>
            </div>
        </div>
        <no-data v-if="deviceLogs.length <= 0"></no-data>
    </div>
</template>

<script>
import { NoData } from 'components'
import moment from 'moment'
export default {
    data() {
        return {
            deviceLogs: [],
            patrolFrequency: ''
        }
    },
    activated() {
        this.deviceLogs = this.$route.query.deviceLogs ? this.$route.query.deviceLogs : [];
        this.patrolFrequency = this.$route.query.patrolFrequency ? this.$route.query.patrolFrequency : ''
    },
    methods: {
        back() {
            this.$MKOPop()
        },
        executorTimeFilter(time) {
            if (time) {
                return moment(time).format('YYYY-MM-DD')
            } else {
                return '未知时间'
            }
        },
        executorNameFilter(name) {
            if (name.indexOf('|') < 0) {
                return name ? name : '未知执行人'
            } else {
                if (name) {
                    return name.split('|')[1];
                } else {
                    return '未知执行人'
                }
            }
        }
    },
    components: {
        NoData
    }
}
</script>

<style lang="less">
@import "../../../../config.less";
.DailyXunchaHistory {
    .xuncha-history {
        margin: 10px 0 0 0;
    }
}
</style>
