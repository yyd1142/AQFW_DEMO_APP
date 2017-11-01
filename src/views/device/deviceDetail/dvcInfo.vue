<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="设备详情" left-icon="icon-back" @handleLeftClick="back" @handleRightClick="edit">
            <div class="header-right sp-header-right" slot="custom">
                <div class="right-icon icon icon-setting" @click="handleAddButton"></div>
                <div class="right-icon icon icon-history" @click="goDeviceLogList"></div>
            </div>
        </mko-header>
        <div class="page-wrap device-info-wrap">
            <mko-dropdowns ref="dropDowns" :actions="actions"></mko-dropdowns>

            <mko-edit-card title="基础信息" :edit="isEdit" :validate="isValid" @edit="edit" @save="updateDvc">
                <mko-form-cell title="设备名称" :val="info.unitName" non-text="未填"></mko-form-cell>
                <mko-form-cell title="设备编号" :val="info.SSSBCode" v-model="formData.SSSBCode"
                               type="text" non-text="未填" :edit="isEdit"></mko-form-cell>
                <mko-form-cell title="品牌名称" :val="info.brand" v-model="formData.brand"
                               type="text" non-text="未知品牌" :edit="isEdit"></mko-form-cell>
                <mko-form-cell title="品牌型号" :val="info.model" v-model="formData.model"
                               type="text" non-text="未知型号" :edit="isEdit"></mko-form-cell>
                <mko-form-cell title="所属系统" :val="info.systemName"
                               type="text" non-text="未填"></mko-form-cell>
                <!--<mko-form-cell title="安装位置" :val="position"-->
                <!--type="sel" non-text="未填" :edit="isEdit" @click="isEdit&&goSelPage(true,'spot')"></mko-form-cell>-->
                <mko-form-cell title="安装日期" :val="installDate"
                               type="sel" non-text="未填" :edit="isEdit" @click="datePickerShow"></mko-form-cell>
                <mko-form-cell title="巡查频率" :val="rate"
                               type="sel" non-text="未填" :edit="isEdit" @click="popupPickerShow('patrol')">
                </mko-form-cell>
                <!--<mko-form-cell title="设备状态"-->
                <!--type="sel" non-text="未填" :edit="isEdit" @click="popupPickerShow('status')">-->
                <!--<span :class="dvcStatusColor">{{dvcStatus}}</span>-->
                <!--</mko-form-cell>-->
                <mko-form-cell title="设备状态" type="sel" non-text="未填" :edit="isEdit&&(info.status==2||info.status==3)"
                               @click="(isEdit&&(info.status==2||info.status==3))?goSelPage(true,'status'):''"
                               v-show="!isEdit">
                    <span :class="dvcStatusColor">{{dvcStatus}}</span>
                </mko-form-cell>
            </mko-edit-card>

            <!--当前故障详情-->
            <div class="logs-wrap" v-show="(info.status==2||info.status==3)&&!isEdit">
                <div class="attribute-card" v-show="!item.value" v-for="item in attribute">
                    <mko-cell :title="item.content" :icon="!item.value ? 'icon-device-warn' : 'icon-device-succ'">
                        <span :class="!item.value ? 'yellow-font' : null">{{item.needInputData == 1 ? item.dataValue : (item.value ? '正常' : '风险')}}</span>
                    </mko-cell>
                    <div class="desc">{{item.description || '无描述信息'}}</div>
                    <photo-box :photo-list="item.photos" :max="4" :read-only="true" v-show="item.photos!=0"></photo-box>
                </div>

                <mko-button type="danger" size="large" @click="(info.status==2||info.status==3)?goSelPage(true,'status'):''">
                    处理故障
                </mko-button>
            </div>

            <!--故障记录-->
            <div v-show="!isEdit&&!noLogs">
                <div class="line-title-wrap">
                    <div class="label">设备故障日志</div>
                </div>
                <mko-double-cell :icon="deviceStatusIcon[item.status]||'icon-device-danger'"
                                 :title="formatDate(new Date(item.executorTime),'YYYY年MM月DD日')"
                                 :label="`执行时间 ${formatDate(new Date(item.executorTime),'hh:mm')}`"
                                 :val="nameFr(item.executorName)" is-link
                                 @click="goDeviceLog(item)" v-for="item in logs"></mko-double-cell>
            </div>


            <!--选择-->
            <sel-spot @sel="selSpotOnList" :selected-form="formData" v-if="$route.query.sel=='spot'"></sel-spot>
            <edit-status @save="editStatus" :curStatus="info.status" v-if="$route.query.sel=='status'"></edit-status>

            <mko-popup-bottom :title="popupName" v-model="selPopupShow" @save="selPickerVal" @cancel="selPopupShow = false">
                <mko-select-box :selected="[history_patrol]" :options="patrolOptions" name-key="label" @select="onPatrolChange" v-show="pickerShow=='patrol'"></mko-select-box>
                <!--<mt-picker ref="picker-status" :slots="statusList" value-key="label" @change="onStatusChange" v-show="pickerShow=='status'"></mt-picker>-->
            </mko-popup-bottom>
            <!--日期选择-->
            <mt-datetime-picker ref="picker-date" type="date" :end-date="new Date()" year-format="{value} 年" month-format="{value} 月"
                                date-format="{value} 日" v-model="history_date" @confirm="selDate()"></mt-datetime-picker>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import apiconf from 'apiconf'
    import conf from 'config'
    import moment from 'moment'
    import { formatDate, levelFr, frequencyFr } from 'filters'
    import { Indicator, Toast } from 'mint-ui'
    import { PhotoBox } from 'components'
    import selSpot from './selSpot.vue'
    import editStatus from './editStatus.vue'

    let _id = null;
    let _enter = true;
    let _scoTop = 0;
    let hasHistory = false;
    let history_status = '';
    export default {
        data() {
            return {
                isEdit: false,
                isValid: true,
                notData: false,
                deviceStatusIcon: conf.deviceStatusIcon,
                info: {},
                formData: {
                    patrolFrequency: ''
                },
                actions: [
                    {name: '停用设备', icon: 'icon-disable', method: this.disableDvc},
                    {name: '删除设备', icon: 'icon-delete', method: this.removeDvc}
                ],
                //故障描述
                attribute: [],
                logs: [],
                noLogs: false,
                //弹出框
                selPopupShow: false,
                popupName: '',
                pickerShow: '',
                patrolList: [
                    {flex: 1, values: []}
                ],
                statusList: [
                    {flex: 1, values: []}
                ],
                history_date: '',
                history_patrol: '',
                form_date: '',
                op: [
                    {value: `2/0/1`, label: `每周1次`},
                    {value: `4/0/1`, label: `半月1次`},
                ]
            }
        },
        watch: {
            selPopupShow: function (val) {
                if (!val) {
                    this.pickerShow = '';
                    document.body.style.overflow = 'auto'
                } else {
                    document.body.style.overflow = 'hidden'
                }
            },
//            formData: {
//                handler() {
//                    this.validForm();
//                },
//                deep: true
//            }
        },
        computed: {
            dvcStatus: {
                cache: false,
                get: function () {
                    const status = conf.deviceStatus;
                    return this.isEdit ? status[this.formData.status] : status[this.info.status];
                }
            },
            dvcStatusColor(){
                const color = conf.deviceStatusColor;
                return this.isEdit ? color[this.formData.status] : color[this.info.status];
            },
            position: {
                cache: false,
                get: function () {
                    let pos_f = `${this.formData.jzName},${levelFr(this.formData.jzLevel)}层,${this.formData.jzPosition}`;
                    let pos = `${this.info.jzName},${levelFr(this.info.jzLevel)}层,${this.info.jzPosition}`;
                    return this.isEdit ? pos_f : pos;
                },
            },
            installDate: {
                cache: false,
                get: function () {
                    let fr = function (val) {
                        if (moment(val).format() == 'Invalid date') {
                            return '';
                        } else {
                            return moment(val).format("YYYY年MM月DD日");
                        }
                    };
                    return this.isEdit ? fr(this.form_date) : fr(this.info.installDate);
                }
            },
            rate: {
                cache: false,
                get: function () {
                    return this.isEdit ? frequencyFr(this.formData.patrolFrequency) : frequencyFr(this.info.patrolFrequency);
                }
            },
            patrolOptions() {
                let _l = [];
                _l.push({
                    value: '0/0/0', label: '无需巡查'
                })
                for (let i = 0; i < 3; i++) {
                    _l.push({
                        value: `1/1/${i + 1}`, label: `每日${i + 1}次`
                    })
                }
                for (let i = 1; i < 6; i++) {
                    _l.push({
                        value: `1/${(i + 1)}/1`, label: `${i + 1}天1次`
                    })
                }
                _l.push(
                    {value: `2/0/1`, label: `每周1次`},
                    {value: `4/0/1`, label: `半月1次`},
                    {value: `5/0/1`, label: `每月1次`},
                    {value: `3/0/1`, label: `每季度1次`}
                )
                return _l
            },
            statusOptions(){
                let _l = [];
                for (let i in conf.deviceStatus) {
                    if (i != 0)
                        _l.push({
                            value: i,
                            label: conf.deviceStatus[i]
                        })
                }
                return _l;
            },
        },
        mounted() {
            this.patrolList = [
                {flex: 1, values: this.patrolOptions}
            ];
            this.statusList = [
                {flex: 1, values: this.statusOptions}
            ]
        },
        activated() {
            window.addEventListener('scroll', this.handleScroll);
            this.setBackButton();

            if (_enter) {
                scrollTo(0, 0);
                Indicator.open({spinnerType: 'fading-circle'});
                this.resetData();
                this.dwFacilities();
                this.getLogList();
            } else {
                scrollTo(0, _scoTop);
            }
        },
        deactivated() {
            window.removeEventListener('scroll', this.handleScroll);
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;

            this.isEdit = false;
            Indicator.close();
        },
        methods: {
            levelFr,
            frequencyFr,
            formatDate,
            nameFr(names){
                if (names.indexOf('|') == -1) {
                    return names;
                } else {
                    return names.split('|')[1];
                }
            },
            handleAddButton(){
                this.$refs.dropDowns.open = true;
            },
            removeDvc(){
                this.$refs.dropDowns.open = false;

                this.$MKODialog({
                    msg: '此操作将永久删除该设备, 是否继续?',
                    cancelBtn: true
                }).then(msg => {
                    if (msg != 'confirm') {
                        return;
                    }
                    Indicator.open({spinnerType: 'fading-circle'});
                    this.isEdit = false;

                    let pas = {
                        id: this.info.id
                    };
                    api.removeDvc(pas).then(res => {
                        Indicator.close();
                        if (res && res.code == 0) {
                            Toast({
                                message: '删除设备成功',
                                position: 'middle',
                                duration: 1500
                            });
                            sessionStorage.setItem('spotInfoIsUpdate', true);
                            this.back();
                        } else {

                        }
                    });
                })
            },
            disableDvc(){
                this.formData.status = 4;
//                this.isEdit = false;
                this.updateDvcStatus();
                this.$refs.dropDowns.open = false;
            },
            edit(){
                this.isEdit = !this.isEdit;
                if (this.isEdit) {
                    let form = this.formData;
                    for (let key in this.info) {
                        form[key] = this.info[key];
                    }
                    this.form_date = this.formData.installDate;
                }
            },
            goSelPage(bool, type){
                if (bool) {
                    let path = this.$route.fullPath;
                    this.$MKOPush(path + '?sel=' + type);
                } else {
                    this.$MKOPop();
                }
            },
            selSpotOnList(form){
                let f = this.formData;
                f.jzID = form.jz.jzID;
                f.jzName = form.jz.jzName;
                f.jzLevel = form.jzLevel.value;
                f.jzPosition = form.spot.jzPosition;
                f.positionId = form.spot.positionId;
            },
            editStatus(res){
                let f = this.formData;
                f.status = JSON.parse(res.status);
                f.fixDescription = res.desc;
                this.updateDvcStatus();
            },
            datePickerShow() {
                if (this.isEdit) {
                    this.history_date = (this.formData.installDate && this.formData.installDate != '0000-00-00 00:00:00') ? new Date(this.formData.installDate) : new Date();
                    this.$refs['picker-date'].open();
                }
            },
            selDate() {
                this.form_date = this.formData.installDate = this.history_date;
            },
            popupPickerShow(picker){
                if (!this.isEdit)
                    return;

                let that = this;
                let fns = {
                    'patrol': function () {
//                        that.$refs['picker-patrol'].setSlotValue(0, that.formData.patrolFrequency)
                        that.history_patrol = that.formData.patrolFrequency;
                    },
                    'status': function () {
                        that.$refs['picker-status'].setSlotValue(0, that.formData.status)
                    }
                }
                if (fns[picker])
                    fns[picker]();
                this.selPopupShow = true;
                this.pickerShow = picker;
            },
            onPatrolChange(val){
                this.history_patrol = val;
            },
            onStatusChange(picker, val){
                history_status = val[0];
            },
            selPickerVal(){
                let that = this;
                let f = this.formData;
                let fns = {
                    'patrol': function () {
                        f.patrolFrequency = that.history_patrol.value;
                    },
                    'status': function () {
                        f.status = history_status.value;
                    }
                }
                if (fns[this.pickerShow])
                    fns[this.pickerShow]();
                this.selPopupShow = false;
            },
            updateDvc(){
                Indicator.open({spinnerType: 'fading-circle'});
                let params = {
                    id: this.info.id,
                    groupId: this.$store.getters.groupId,
//                    SSSB_SystemID: this.formData.SSSB_SystemID,
//                    SSSB_UnitID: this.formData.SSSB_UnitID,
                    SSSBCode: this.formData.SSSBCode,
                    brand: this.formData.brand,
                    model: this.formData.model,
//                    jzID: this.formData.jzID,
//                    jzName: this.formData.jzName,
//                    jzLevel: this.formData.jzLevel,
//                    jzPosition: this.formData.jzPosition,
//                    positionId: this.formData.positionId,
//                    installDate: this.formData.installDate,
                    patrolFrequency: this.formData.patrolFrequency,
                    status: this.formData.status,
                };
                if (moment(this.formData.installDate).format() != 'Invalid date')
                    params.installDate = moment(this.formData.installDate).format('YYYY-MM-DD');

                api.updateDwFacilitie(params).then(result => {
                    Indicator.close();
                    if (!result) return false;
                    if (result.code === 0) {
                        for (let key in this.formData) {
                            this.info[key] = JSON.parse(JSON.stringify(this.formData[key]));
                        }
                        this.isEdit = false;

                        Toast({
                            message: '编辑成功',
                            position: 'middle',
                            duration: 1500
                        });
                        sessionStorage.setItem('spotInfoIsUpdate', true);
//                        this.resetData()
                    } else {
                        Toast({
                            message: '编辑失败',
                            position: 'middle',
                            duration: 1500
                        });
                    }
                })
            },
            updateDvcStatus(){
                Indicator.open({spinnerType: 'fading-circle'});
                api.updateDeviceStatusFn({
                    id: this.info.id,
                    positionId: this.info.positionId,
                    SSSBStatus: this.formData.status,
                    fixDescription: this.formData.fixDescription
                }).then(result => {
                    Indicator.close();
                    if (!result) return false;
                    if (result.code == 0) {
                        this.info.status = this.formData.status;
                        this.info.fixDescription = this.formData.fixDescription;
                        Toast({
                            message: '设备状态更改成功',
                            position: 'middle',
                            duration: 1500
                        });
                        sessionStorage.setItem('spotInfoIsUpdate', true);
                    } else {
                        Toast({
                            message: '设备状态修改失败',
                            position: 'middle',
                            duration: 1500
                        });
                    }
                })
            },
            dwFacilities() {
                let params = {
                    m: 'info',
                    id: this.$route.params.pid
                };
                api.dwFacilitiesInfo(params).then(result => {
                    _id = this.$route.params.pid;
                    if (!result) return false;
                    if (result.code == 0) {
                        if (result.response) {
                            this.info = result.response;
                            this.notData = false;
                        } else {
                            this.notData = true;
                        }
                    }
                })
            },
            getLogList() {
                let pas = {
                    deviceId: this.$route.params.pid
//                    deviceId: 12,
//                    status: 2
                };
                api.getDeviceFaultLogList(pas).then(res => {
                    if (res && res.code == 0) {
                        if (res.response) {
                            if (res.response.length <= 0) {
                                this.noLogs = true;
                            } else {
                                res.response.forEach((item) => {
                                    item.attribute = JSON.parse(item.attribute)
                                });
                                res.response.sort(function (a, b) {
                                    return b.executorTime - a.executorTime
                                });
                                this.attribute = res.response[0].attribute;
                                this.attribute.forEach(item => {
                                    item.photos = this.getFiles(item.imageId);
                                });
                                this.logs = res.response;
                                this.noLogs = false;
                                _enter = false;
                            }
                        } else {
                            this.noLogs = true;
                        }
                    }
                    Indicator.close();
                });
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
            resetData() {
                hasHistory = false;
                this.notData = false;
                this.info = {};
                this.attribute = [];
                this.noLogs = true;
                this.logs = {};
            },
            goDeviceLogList(){
                let path = `/device_log_list/${this.info.id}?name=${this.info.unitName}${this.info.SSSBCode || ''}`;
                this.$MKOPush(path)
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
            back() {
                _enter = true;
                this.$MKOPop()
            },
        },
        components: {
            PhotoBox, selSpot, editStatus
        }
    }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .sp-header-right {
        .right-icon + .right-icon {
            right: 48px !important;
        }
    }
</style>
<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .device-info-wrap {
        width: 100%;
        margin-bottom: 15px;
        .mko-form-cell .cell {
            .title {
                flex: 0 0 95px;
                -webkit-flex: 0 0 95px;
                width: 95px;
            }
        }
        .logs-wrap {
            margin: 14px 0;
            letter-spacing: 0;
            .attribute-card {
                position: relative;
                padding-bottom: 14px;
                background-color: @baseBG02;
                &:before {
                    content: '';
                    position: absolute;
                    top: 37px;
                    right: 20.9px;
                    width: 14px;
                    height: 14px;
                    transform: rotate(315deg);
                    -webkit-transform: rotate(315deg);
                    background-color: @baseBG02;
                }
                .desc {
                    margin: 14px 14px 0 14px;
                    padding: 8px 10px;
                    height: 80px;
                    border: 1px solid @baseBorder;
                    border-radius: 4px;
                    line-height: 18px;
                    font-size: 14px;
                    color: @baseText02;
                    background-color: @baseBG01;
                }
                .photo-wrap {
                    background: @baseBG02;
                }
            }
            .mko-button {
                margin-top: 14px;
            }
        }

        .line-title-wrap {
            margin: 14px;
            margin-bottom: 8px;
            line-height: 12px;
            font-size: 12px;
            letter-spacing: 0;
            color: @baseText02;
        }
    }
</style>
