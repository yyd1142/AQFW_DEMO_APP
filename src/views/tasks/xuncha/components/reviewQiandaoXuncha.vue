<template>
    <div class="reviewQiandaoXuncha">
        <div class="placeholder-item"></div>
        <mko-header :title="qiaoDaoXunChaTitle" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <div class="review-task-info">
                <div class="padding">
                    <div class="item">
                        <span class="key">巡查人员</span>
                        <span class="value">{{statusInfo.name}}</span>
                    </div>
                    <div class="item">
                        <span class="key">巡查日期</span>
                        <span class="value">{{statusInfo.startTime | formatDate('YYYY-MM-DD')}}</span>
                    </div>
                    <div class="item">
                        <span class="key">巡查时间</span>
                        <span class="value">{{statusInfo.startTime | formatDate('HH:mm:ss')}}</span>
                    </div>
                </div>
            </div>
            <div class="camera-wrap" v-if="checkPointPhotos.length > 0">
                <div class="padding">
                    <div class="xuncha-item">
                        <span class="key">签到照片</span>
                    </div>
                </div>
                <photo-box max="8" :photo-list="checkPointPhotos" :read-only="true"></photo-box>
            </div>
            <transition name="fade">
                <div class="xuncha-device">
                    <ul class="xuncha-device-table-view" v-if="qiaoDaoXunChaData && qiaoDaoXunChaData.length > 0" v-for="(group, gIndex) in qiaoDaoXunChaData">
                        <li class="xuncha-device-table-cell" v-for="(device, deviceIndex) in group" @click="checkDevice(device)">
                            <div class="dingding-icon" :class="device | xunchaDeviceStatusStyle">
                                <span></span>
                            </div>
                            <span class="device-name">{{device.unitName}}</span>
                            <span class="end-time">{{device.status | xunchaDeviceStatusFilter}}</span>
                            <i class="icon icon-link-arrow"></i>
                        </li>
                    </ul>
                </div>
            </transition>
            <div class="no-data" v-if="qiaoDaoXunChaData.length <= 0">暂无设备</div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { XunChaStatus, PhotoBox, Loading, NoData } from 'components'
import { xunchaStatusICON, xunchaDeviceStatusFilter, formatDate, xunchaDeviceStatusStyle } from 'filters'
import api from 'api'
import * as types from 'store/mutation-types'
import apiconf from 'apiconf'

export default {
    data() {
        return {
            loading: true,
            qiaoDaoXunChaTitle: '',
            devices: '',
            checkPointPhotos: [],
            qiaoDaoXunChaData: '',
            taskStatus: ''
        }
    },
    computed: {
        statusInfo() {
            let statusInfo = JSON.parse(localStorage.getItem('lastReviewXunChaData'));
            return {
                status: statusInfo.status,
                name: statusInfo.executorName,
                startTime: statusInfo.startTime ? statusInfo.startTime : statusInfo.actualStartTime,
                endTime: statusInfo.endTime ? statusInfo.endTime : statusInfo.actualEndTime
            }
        }
    },
    beforeMount() {
        this.qiaoDaoXunChaTitle = this.$route.query.title;
        let resourceId = this.$route.query.resourceId;
        let positionId = this.$route.query.positionId;
        api.getXCTaskCheckPointDeviceResult({
            positionId: positionId
        }).then(res => {
            if (!res)
                return
            let groups = new Map();
            for (let device of res.response) {
                let devices = groups.get(device.unitId);
                if (!devices) {
                    devices = [device];
                    groups.set(device.unitId, devices);
                } else {
                    devices.push(device);
                }
            }
            let g = [];
            for (let k of groups.keys()) {
                g.push(groups.get(k));
            }
            this.qiaoDaoXunChaData = g;
        })

        let self = this;
        let imageId = this.$route.query.imageId;
        if (imageId && imageId.length > 0) {
            api.getByPath(`/info/${imageId}`)({}).then(res => {
                if (res.code != 0)
                    return;
                if (res.response && res.response.length > 0) {
                    for (let image of res.response) {
                        self.checkPointPhotos.push(`${apiconf.resourcesDomain}/${image.resouceId}`);
                    }
                }
            });
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.loading = false;
        });
    },
    methods: {
        checkDevice(device) {
            let lastXunChaTaskId = localStorage.getItem('lastXunChaTaskId');
            let nextPath = `/xuncha/${lastXunChaTaskId}/reviewDevice`;
            localStorage.setItem('lastReviewXunChaDeviceRules', device.attribute);
            this.$MKOPush({
                path: nextPath,
                query: {
                    unitId: device.unitId,
                    deviceId: device.deviceId,
                    status: device.status,
                    positionId: this.$route.query.positionId,
                    name: `${device.name}-${device.sSSBCode || '无设备号'}`
                }
            })
        },
        back() {
            this.$MKOPop()
        }
    },
    components: {
        XunChaStatus,
        PhotoBox,
        Loading,
        NoData
    }
}
</script>

<style lang="less" src="./../xuncha.less" scoped>

</style>
