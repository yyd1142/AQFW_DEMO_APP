<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="设备巡查日志" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap device-log-list-wrap">
            <div class="device-info" v-if="!noData">{{deviceName}}</div>
            <no-data v-if="noData"></no-data>
            <mko-double-cell :icon="deviceStatusIcon[item.status]||'icon-device-danger'"
                             :title="formatDate(new Date(item.executorTime),'YYYY年MM月DD日')||'--'"
                             :label="`执行时间 ${formatDate(new Date(item.executorTime),'hh:mm')||'--'}`"
                             :val="nameFr(item.executorName)" is-link
                             @click="goDeviceLog(item)"
                             v-for="item in list"></mko-double-cell>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import conf from 'config'
    import moment from 'moment'
    import { formatDate, levelFr, frequencyFr } from 'filters'
    import { Indicator, Toast } from 'mint-ui'
    import { PhotoBox, NoData } from 'components'

    let _enter = true;
    let _scoTop = 0;
    export default {
        data () {
            return {
                noData: false,
                deviceName: '',
                list: [],
                deviceStatusIcon: conf.deviceStatusIcon,
            }
        },
        watch: {},
        computed: {},
        mounted() {
        },
        activated(){
            window.addEventListener('scroll', this.handleScroll);
            this.setBackButton();

            this.deviceName = this.$route.query.name;
            if (_enter) {
                scrollTo(0, 0);
                this.getLogList();
            } else {
                scrollTo(0, _scoTop);
            }
        },
        deactivated() {
            window.removeEventListener('scroll', this.handleScroll);
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
        },
        destroyed(){
        },
        methods: {
            formatDate,
            nameFr(names){
                if (names.indexOf('|') == -1) {
                    return names;
                } else {
                    return names.split('|')[1];
                }
            },
            getLogList(){
                Indicator.open({spinnerType: 'fading-circle'});

                let pas = {
                    deviceId: this.$route.params.id
//                    deviceId: 12,
                };
                api.getDeviceLogList(pas).then(res => {
                    if (res && res.code == 0) {
                        res.response.forEach(item => {
                            item.attribute = JSON.parse(item.attribute)
                        });
                        this.list = res.response;
                        this.list.sort(function (a, b) {
                            return b.executorTime - a.executorTime
                        });

                        this.noData = false;
                        if (this.list.length == 0)
                            this.noData = true;

                        _enter = false;
                    }
                    Indicator.close();
                })
            },
            getFiles(id) {
                let images = [];
                if (id == '' || id == null) return images;
                api.getByPath(`/info/${id}`)({}).then(res => {
                    if (res.code != 0) return;
                    if (res.response && res.response.length > 0) {
                        for (let i = 0; i < res.response.length; i++) {
                            let item = res.response[i]
                            images.push(`${apiconf.resourcesDomain}/${item.resouceId}`)
                        }
                    } else {
                    }
                });
                return images;
            },
            goDeviceLog(item) {
                let taskInfo = [{
                    key: '巡查人员', value: item.executorName || '暂无'
                }, {
                    key: '巡查日期', value: formatDate(new Date(item.executorTime), 'YYYY年MM月DD日') || '暂无'
                }, {
                    key: '巡查时间', value: formatDate(new Date(item.executorTime), 'hh:mm') || '暂无'
                }];
                this.$MKOPush({
                    name: 'ReviewTmpDeviceXunch',
                    params: {
                        id: 0
                    },
                    query: {
                        attribute: JSON.stringify(item.attribute),
                        taskInfo: taskInfo,
                        name: item.name
                    }
                })
            },
            handleScroll(){
                _scoTop = document.documentElement.scrollTop || document.body.scrollTop;
            },
            setBackButton() {
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                if (window.mkoBackButton.bInputData) {
                    window.mkoBackButton.callback = this.back;
                }
            },
            back(){
                _enter = true;
                this.$MKOPop();
            }
        },
        components: {
            NoData
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .device-log-list-wrap {
        .device-info {
            height: 34px;
            padding: 14px 14px 8px;
            line-height: 12px;
            font-size: 12px;
            letter-spacing: 0;
            background-color: @baseBG01;
            color: @baseText02;
        }
    }
</style>
