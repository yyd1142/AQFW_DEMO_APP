<template>
    <div class="reviewDeviceXuncha">
        <div class="placeholder-item"></div>
        <mko-header :title="$route.query.name" left-icon="icon-back" @handleLeftClick="back"></mko-header>
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
            <ul class="device-table-view">
                <li class="device-table-cell" :class="!item.value ? 'device-table-border' : null" v-for="(item, index) in checkRules">
                    <div class="padding">
                        <div class="device-item" :class="item.value ? 'border-bottom' : null">
                            <div class="dingding-icon" :class="!item.value ? 'yellow-icon' : 'green-icon'">
                                <span></span>
                            </div>
                            <span class="title" v-text="item.content"></span>
                            <span class="value" :class="!item.value ? 'yellow-font' : null">{{item.needInputData == 1 ? item.dataValue : (item.value ? '正常' : '风险')}}</span>
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
            <div class="review-bottom-btn" v-if="statusInfo.status == 5 && isAdmin == true">
                <mko-button size="large" @click="excludeYH()">排除故障</mko-button>
                <mko-button class="paichu" size="large" @click="confirmYH()" plain>上报故障</mko-button>
            </div>
        </div>
    </div>
</template>

<script>
import { XunChaStatus, XunChaSwitch, PhotoBox, Loading } from 'components'
import api from 'api'
import { mapGetters } from 'vuex'
import * as types from 'store/mutation-types'
import apiconf from 'apiconf'
export default {
    data() {
        return {
            loading: true,
            images: [],
            checkRules: '',
            status: '',
            conclusionYesLabel: '',
            conclusionNoLabel: '',
        }
    },
    computed: {
        isAdmin() {
            return this.$store.state.user.isAdmin;
        },
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
    mounted() {
        this.setBackButton();
        this.$nextTick(() => {
            this.loading = false;
        });
        this.status = this.$route.query.status;
        this.conclusionYesLabel = "符合";
        this.conclusionNoLabel = "不符合";
        if (this.status == 6) {
            this.conclusionYesLabel = "符合";
            this.conclusionNoLabel = "已排除";
        } else if (this.status == 7) {
            this.conclusionYesLabel = "符合";
            this.conclusionNoLabel = "处置中";
        }
        let rules = localStorage.getItem('lastReviewXunChaDeviceRules');
        if (rules && rules.length > 0) {
            let self = this;
            try {
                rules = JSON.parse(rules);
                this.checkRules = rules;
                for (let i = 0; i < this.checkRules.length; i++) {
                    this.images.push([]);
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
                                    self.images[i].push(`${apiconf.resourcesDomain}/${image.resouceId}`);
                                }
                            }
                        });
                    }
                }

            } catch (e) { }
        }
    },
    methods: {
        back() {
            this.$MKOPop()
        },
        confirmYH() {
            let self = this;
            this.$MKODialog({
                title: '提示',
                msg: '故障处置完成后请在PC端修改设备状态，确认上报吗？',
                cancelBtn: true,
                cancelText: '取消'
            }).then(msg => {
                if (msg == 'confirm') {
                    api.getXCTaskChangeDeviceStatus({
                        positionId: this.$route.query.positionId,
                        deviceId: this.$route.query.deviceId,
                        status: 7
                    }).then(res => {
                        self.$MKOPop();
                    })
                }
            })
        },
        excludeYH() {
            let self = this;
            this.$MKODialog({
                title: '提示',
                msg: '排除故障后设备状态将标为正常，确认排除吗？',
                cancelBtn: true,
                cancelText: '取消'
            }).then(msg => {
                if (msg == 'confirm') {
                    api.getXCTaskChangeDeviceStatus({
                        positionId: this.$route.query.positionId,
                        deviceId: this.$route.query.deviceId,
                        status: 6
                    }).then(res => {
                        self.$MKOPop();
                    })
                }
            })
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
        XunChaStatus,
        XunChaSwitch,
        PhotoBox,
        Loading
    }
}
</script>

<style lang="less" src="./../xuncha.less" scoped>

</style>
