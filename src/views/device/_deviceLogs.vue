<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="故障信息记录" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap device-wrap" ref="wrapper">
            <div class="logs-wrap">
                <mt-cell title="上报人" :value="logs.executor"></mt-cell>
            </div>
            <div class="logs-info" v-for="item in logs.attribute">
                <div class="logs-wrap">
                    <mt-cell title="上报时间" :value="item.createTime | formatDate"></mt-cell>
                </div>
                <div class="logs-wrap">
                    <mt-cell title="巡查内容" :value="item.content"></mt-cell>
                </div>
                <div class="logs-wrap">
                    <mt-cell title="故障描述" :value="item.description || '暂无'"></mt-cell>
                    <div v-if="item.imageId != ''">
                        <photo-box :max="8" :photo-list="item.images" :read-only="true"></photo-box>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from 'api'
import { PhotoBox } from 'components'
import { formatDate } from 'filters'

export default {
    data() {
        return {
            logs: {}
        }
    },
    activated() {
        setTimeout(() => {
            this.getLogs();
        }, 500)
    },
    methods: {
        getLogs() {
            this.$nextTick(() => {
                this.logs = this.$route.query.logs;;
            })
        },
        back() {
            this.$MKOPop()
        }
    },
    components: {
        PhotoBox
    }
}
</script>

<style lang="less" scoped>
@import "../../config.less";
.device-wrap {
    height: 100vh;
    .logs-wrap {
        width: 100%;
        .photo-wrap {
            width: 100%;
            min-height: 160px;
        }
    }

    .logs-info {
        width: 100%;
        margin: 18px 0 0 0;
    }
}
</style>
