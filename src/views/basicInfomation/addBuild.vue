<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="新增建筑信息" left-icon="icon-back" right-icon-text="保存" @handleLeftClick="back" @handleRightClick="saveInfo" :right-font-color="{'disabled-btn':!isValidate}"></mko-header>
        <div class="page-wrap dw-data-wrap">
            <div class="com-data-wrap card is-edit">
                <div class="title-wrap">
                    <div class="title fl">基础信息</div>
                </div>
                <mt-cell title="建筑名称">
                    <span class="sign">*</span>
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData.jzName">
                </mt-cell>
                <mt-cell title="建筑编号">
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData.jzCode">
                </mt-cell>
                <div class="sel-cell-wrap" @click="popupPickerShow('location','base')">
                    <span class="sign">*</span>
                    <mt-cell title="建筑区域" :value="jzLocation" is-link></mt-cell>
                </div>
                <mt-cell title="详细地址">
                    <span class="sign">*</span>
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData.jzAddress">
                </mt-cell>
                <mt-cell title="地理坐标">
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData.gps">
                </mt-cell>
                <div class="sel-cell-wrap" @click="popupPickerShow('jz-type','base')">
                    <span class="sign">*</span>
                    <mt-cell title="建筑类型" :value="jzType" is-link></mt-cell>
                </div>
                <div class="sel-cell-wrap" @click="popupPickerShow('jz-struc','base')">
                    <span class="sign">*</span>
                    <mt-cell title="建筑结构" :value="jzStructures[formData.jzStructure]" is-link></mt-cell>
                </div>
                <div @click="popupPickerShow('jz-gm')">
                    <span></span>
                    <mt-cell title="建筑层数分类" :value="jzGM[formData.jzGM]" is-link></mt-cell>
                </div>
                <div @click="popupPickerShow('jz-cq')">
                    <span></span>
                    <mt-cell title="产权及使用情况" :value="jzChanQuans[formData.jzChanQuan]" is-link></mt-cell>
                </div>
                <div @click="popupPickerShow('jz-fire')">
                    <span></span>
                    <mt-cell title="耐火等级" :value="jzFireLevel[formData.jzFireLevel]" is-link></mt-cell>
                </div>
            </div>
            <div class="com-data-wrap card is-edit">
                <div class="title-wrap">
                    <div class="title fl">详细信息</div>
                </div>
                <mt-cell title="建筑高度">
                    <span class="sign">*</span>
                    <input class="ipt" type="number" placeholder="单位：米" v-model.number="formData.jzHeight">
                </mt-cell>
                <mt-cell title="建筑面积">
                    <span class="sign">*</span>
                    <input class="ipt" type="number" placeholder="单位：平方米" v-model.number="formData.jzArea">
                </mt-cell>
                <mt-cell title="占地面积">
                    <input class="ipt" type="number" placeholder="单位：平方米" v-model.number="formData.jzFloorArea">
                </mt-cell>
                <mt-cell title="标准层面积">
                    <input class="ipt" type="number" placeholder="单位：平方米" v-model.number="formData.jzStdFloorArea">
                </mt-cell>
                <mt-cell title="地上层数">
                    <span class="sign">*</span>
                    <input class="ipt" type="number" placeholder="单位：层" v-model.number="formData.jzDSNumber">
                </mt-cell>
                <mt-cell title="地上层面积">
                    <input class="ipt" type="number" placeholder="单位：平方米" v-model.number="formData.jzDSArea">
                </mt-cell>
                <mt-cell title="地下层数">
                    <span class="sign">*</span>
                    <input class="ipt" type="number" placeholder="单位：层" v-model.number="formData.jzDXNumber">
                </mt-cell>
                <mt-cell title="地下层面积">
                    <input class="ipt" type="number" placeholder="单位：平方米" v-model.number="formData.jzDXArea">
                </mt-cell>
                <mt-cell title="避难层数量">
                    <input class="ipt" type="number" placeholder="单位：个" v-model.number="formData.jzBiNanNumber">
                </mt-cell>
                <mt-cell title="避难层总面积">
                    <input class="ipt" type="number" placeholder="单位：平方米" v-model.number="formData.jzBiNanTotalArea">
                </mt-cell>
                <mt-cell title="可容纳最大人数">
                    <input class="ipt" type="number" placeholder="单位：个" v-model.number="formData.jzMaxPepole">
                </mt-cell>
                <mt-cell title="消控室数量">
                    <input class="ipt" type="number" placeholder="单位：个" v-model.number="formData.jzXiaoKongNumber">
                </mt-cell>
                <mt-cell title="消防电梯数量">
                    <input class="ipt" type="number" placeholder="单位：个" v-model.number="formData.jzDianTiNumber">
                </mt-cell>
            </div>
            <div class="com-data-wrap card is-edit">
                <div class="title-wrap">
                    <div class="title fl">其他信息</div>
                </div>
                <mt-cell title="毗邻建筑情况">
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData.jzInfo">
                </mt-cell>
                <div @click="datePickerShow">
                    <span></span>
                    <mt-cell title="竣工时间" :value="formatDate(jzCreatedDate,'YYYY-MM-DD')" is-link></mt-cell>
                </div>
                <div @click="popupPickerShow('jz-status')">
                    <span></span>
                    <mt-cell title="建筑状态"
                             :value="(!formData.jzStatusValue&&formData.jzStatusValue!==0)?'':jzStatus[formData.jzStatusValue]"
                             is-link></mt-cell>
                </div>
                <mt-cell title="建筑管理单位">
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData.jzManagerOrg">
                </mt-cell>
                <mt-cell title="建筑设计单位">
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData.jzDesignOrg">
                </mt-cell>
                <mt-cell title="建筑施工单位">
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData.jzShiGongOrg">
                </mt-cell>
                <div class="jz-plan">
                    <div class="jz-plan-title"><span>建筑平面图</span></div>
                    <photo-box :max="1" :photo-list="images" @addPhotoEvent="sheetShow=true"
                               @removePhotoEvent="removePhoto()"></photo-box>
                </div>
            </div>

            <!--弹出框-->
            <mko-popup-bottom :title="popupName" v-model="selPopupShow" @save="selPickerVal" @cancel="selPopupClose">
                <mt-picker :slots="locationList" value-key="Name" @change="onLocationChange"
                           v-show="pickerShow=='location'"></mt-picker>
                <mt-picker :slots="jzTypeList" value-key="jzTypeName" @change="onJzTypeChange"
                           v-show="pickerShow=='jz-type'"></mt-picker>
                <mt-picker :slots="jzStrucList" @change="onJzStrucChange" v-show="pickerShow=='jz-struc'"></mt-picker>
                <mt-picker :slots="jzGMList" @change="onJzGMChange" v-show="pickerShow=='jz-gm'"></mt-picker>
                <mt-picker :slots="jzCQList" @change="onJzCQChange" v-show="pickerShow=='jz-cq'"></mt-picker>
                <mt-picker :slots="jzFireList" @change="onJzFireChange" v-show="pickerShow=='jz-fire'"></mt-picker>
                <mt-picker :slots="jzStatusList" @change="onJzStatusChange" v-show="pickerShow=='jz-status'"></mt-picker>
            </mko-popup-bottom>
            <!--日期选择-->
            <mt-datetime-picker ref="createDatePicker" type="date" :startDate="startDate" :end-date="new Date()"
                                year-format="{value} 年"
                                month-format="{value} 月" date-format="{value} 日" v-model="datePickerVal"
                                @confirm="selDate()"></mt-datetime-picker>
            <!--添加图片-->
            <mt-actionsheet :actions="actions" v-model="sheetShow"></mt-actionsheet>
        </div>
        <no-data v-if="notData"></no-data>
    </div>
</template>

<script>
    import api from 'api'
    import apiconf from 'apiconf'
    import { NoData, PhotoBox } from 'components'
    import { formatDate } from 'filters'
    import { Indicator, Toast } from 'mint-ui'
    import moment from 'moment'
    let history_prov = {};
    let history_city = {};
    let history_area = {};
    let history_jzType = {};
    let history_jzSubType = {};
    let history_jzStruc = 0;
    let history_jzGM = 0;
    let history_jzCQ = 0;
    let history_jzFire = 0;
    let history_jzStatus = 0;
    let valid_key = ['jzName', 'jzType', 'jzSubType', 'province', 'city', 'area', 'jzAddress', 'jzDSNumber', 'jzDXNumber'];

    export default {
        data() {
            return {
                notData: false,
                jzStructures: ['木结构', '砖木结构', '砖混结构', '钢筋混凝土结构', '钢结构', '其它结构'],
                jzChanQuans: ["未知", '独立产权，独立使用', '独立产权，多家使用', '多家产权，多家使用'],
                jzGM: ['未知', '单、多层建筑', '高层建筑', '地下建筑', '其他建筑'],
                jzFireLevel: ['未知', '一级', '二级', '三级', '四级'],
                jzStatus: ['已使用', '未使用'],
                //编辑
                imagesIsChange: false,
                addressIsChange: false,
                jzTypeIsChange: false,
                startDate: new Date(1970, 0, 1),
                datePickerVal: new Date(),
                jzCreatedDate: '',

                isValidate: false,
                holderText: '请完善信息',
                selPopupShow: false,
                pickerShow: '',
                images: [],
                formData: {
                    jzName: '',
                    jzType: '',
                    jzSubType: '',
                    province: '',
                    city: '',
                    area: '',
                    jzAddress: '',
                    jzDSNumber: '',
                    jzDXNumber: ''
                },
                locationList: [
                    {flex: 1, values: [], className: 'picker-left'},
                    {flex: 1, values: [], className: 'picker-mid'},
                    {flex: 1, values: [], className: 'picker-right'}
                ],
                jzTypeList: [
                    {flex: 1, values: [], className: 'picker-left'},
                    {flex: 1, values: [], className: 'picker-right'}
                ],
                jzStrucList: [{flex: 1, values: []}],
                jzGMList: [{flex: 1, values: []}],
                jzCQList: [{flex: 1, values: []}],
                jzFireList: [{flex: 1, values: []}],
                jzStatusList: [{flex: 1, values: ['已使用', '未使用']}],
                //控制
                sheetShow: false,
                actions: [],
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
            formData: {
                handler() {
                    this.validForm();
                },
                deep: true
            }
        },
        computed: {
            popupName(){
                let names = {
                    'location': '建筑区域',
                    'jz-type': '建筑类型',
                    'jz-struc': '建筑结构',
                    'jz-gm': '建筑层数分类',
                    'jz-cq': '产权及使用情况',
                    'jz-fire': '耐火等级',
                    'jz-status': '建筑状态',
                };
                return names[this.pickerShow] || ''
            },
            jzLocation() {
                if (this.addressIsChange) {
                    let form = this.formData;
                    let jzProvinceName = !form.provinceName ? '暂无' : form.provinceName;
                    let jzCityName = !form.cityName ? '暂无' : form.cityName;
                    let jzAreaName = !form.areaName ? '暂无' : form.areaName;
                    this.addressIsChange = false;
                    if (jzProvinceName == '暂无' && jzCityName == '暂无' && jzAreaName == '暂无') {
                        return ''
                    } else {
                        return `${jzProvinceName}-${jzCityName}-${jzAreaName}`
                    }
                }
            },
            jzType() {
                if (this.jzTypeIsChange) {
                    let form = this.formData;
                    let jzTypeName = !form.jzTypeName ? '暂无' : form.jzTypeName;
                    let jzSubTypeName = !form.jzSubTypeName ? '暂无' : form.jzSubTypeName;
                    this.jzTypeIsChange = false;
                    if (jzTypeName == '暂无' && jzSubTypeName == '暂无') {
                        return ''
                    } else {
                        return `${jzTypeName}(${jzSubTypeName})`
                    }
                }
            },
        },
        mounted() {
            this.$nextTick(() => {
                this.jzStrucList[0].values = this.jzStructures;
                this.jzGMList[0].values = this.jzGM;
                this.jzCQList[0].values = this.jzChanQuans;
                this.jzFireList[0].values = this.jzFireLevel;
                this.actions = [
                    {name: '拍照', method: this.takePhoto},
                    {name: '从相册中选择', method: this.choosePhoto}
                ];
                this.getLocationData();
                this.getJzTypeData();
            })
        },
        activated() {
            this.onInputData();
        },
        destroyed(){
            window.mkoBackButton.bInputData = false;
            document.body.style.overflow = 'auto';
        },
        methods: {
            formatDate,
            getLocationData(provId, cityId, areaId){
                api.getProvinceList().then(res => {
                    if (res && res.response) {
                        this.locationList[0].values = res.response;
                    }
                });
                api.getCityList({provinceID: provId}).then(res => {
                    if (res && res.response) {
                        this.locationList[1].values = res.response;
                    }
                });
                api.getAreaList({cityID: cityId}).then(res => {
                    if (res) {
                        this.locationList[2].values = res.response;
                    }
                });
            },
            getJzTypeData(typeId, subTypeId){
                let that = this;
                let fn = function (id) {
                    api.getJzType({jzSubTypeID: id || ''}).then(res => {
                        if (res) {
                            let i = id ? 1 : 0;
                            that.jzTypeList[i].values = res.response;
                        }
                    })
                };
                fn();
                fn(typeId);
            },
            //提交表单
            validForm(){
                for (let key of valid_key) {
                    if (!this.formData[key] && this.formData[key] !== 0) {
                        this.isValidate = false;
                        return false;
                    }
                }
                this.isValidate = true;
            },
            saveInfo(){
                if (!this.isValidate)
                    return false;

                let self = this;
                let form = {};
                for (let key in this.formData) {
                    form[key] = this.formData[key]
                }
                form.jzSubType = form.jzSubType + '';
                form.jzcreatedDate = moment(form.jzcreatedDate).format("YYYY-MM-DD 00:00");
                form.groupId = this.$store.getters.groupId;
                let doUploadSuccess = function (resourceId) {
                    if (resourceId != '') {
                        form.jzPlan = resourceId;
                    }
                    api.addBuildData(form).then(res => {
                        if (res && res.code == 0) {
                            self.imagesIsChange = false;
                            Toast({
                                message: '添加成功！',
                                duration: 1000
                            });
                            self.$MKOPop();
                            self.$destroy();
                        } else {
                            Toast({
                                message: '修改失败！',
                                duration: 1000
                            });
                        }
                    });
                };
                let doDumpData = function () {
                    if (self.images.length <= 0) {
                        doUploadSuccess('');
                        return;
                    }
                    let uploadURL = `${apiconf.resourcesDomain}/uploads`;
                    self.$uploadImages(self.images, uploadURL, function (result) {
                        if (result.error && result.error.length > 0) {
                            Toast({
                                message: '图片上传失败',
                                duration: 1000
                            });
                            return false;
                        }
                        if (result.resourceId && result.resourceId.length > 0) {
                            doUploadSuccess(result.resourceId);
                        }
                    });
                };
                if (this.imagesIsChange) {
                    this.$getMobileNetworkType(function (result) {
                        if (result == "unknown") {
                            self.$MKODialog({
                                msg: '当前网络不可用，请确保网络正常...'
                            });
                            return;
                        } else if (result == "3G/4G") {
                            let opts = {
                                title: '提示',
                                msg: '当前3G/4G网络，提交图片数据会消耗流量，建议WIFI环境下上传。',
                                cancelBtn: true,
                                cancelText: '稍后提交',
                                confirmText: '立即提交',
                            };
                            self.$MKODialog(opts).then(action => {
                                if (action != 'confirm')
                                    return;
                                doDumpData();
                            });
                        } else if (result == "wifi") {
                            doDumpData();
                        }
                    });
                } else {
                    doUploadSuccess('');
                }

            },
            //弹出框
            selPopupClose(){
                this.selPopupShow = false;
            },
            popupPickerShow(picker){
                let that = this;
                let calcDefaultVal = function (list, keyName, id) {
                    if (id)
                        for (let key in list.values) {
                            if (list.values[key][keyName] == id) {
                                list.defaultIndex = parseInt(key);
                            }
                        }
                };
                let fns = {
                    'location': function () {
                        calcDefaultVal(that.locationList[0], 'ID', that.formData.province);
                        calcDefaultVal(that.locationList[1], 'ID', that.formData.city);
                        calcDefaultVal(that.locationList[2], 'ID', that.formData.area);
                    },
                    'jz-type': function () {
                        calcDefaultVal(that.jzTypeList[0], 'jzTypeID', that.formData.jzType);
                        calcDefaultVal(that.jzTypeList[1], 'jzTypeID', that.formData.jzSubType);
                    },
                    'jz-struc': function () {
                        that.jzStrucList[0].defaultIndex = that.formData.jzStructure;
                    },
                    'jz-gm': function () {
                        that.jzGMList[0].defaultIndex = that.formData.jzGM;
                    },
                    'jz-cq': function () {
                        that.jzCQList[0].defaultIndex = that.formData.jzChanQuan;
                    },
                    'jz-fire': function () {
                        that.jzFireList[0].defaultIndex = that.formData.jzFireLevel;
                    },
                    'jz-status': function () {
                        that.jzStatusList[0].defaultIndex = that.formData.jzStatusValue;
                    }
                };
                if (fns[picker])
                    fns[picker]();
                this.selPopupShow = true;
                this.pickerShow = picker;
            },
            selPickerVal(){
                let that = this;
                let form = this.formData;
                let Fns = {
                    'location': function () {
                        that.addressIsChange = true;
                        form.province = history_prov.ID;
                        form.provinceName = history_prov.Name;
                        form.city = history_city.ID;
                        form.cityName = history_city.Name;
                        form.area = history_area.ID;
                        form.areaName = history_area.Name;
                    },
                    'jz-type': function () {
                        that.jzTypeIsChange = true;
                        form.jzType = history_jzType.jzTypeID;
                        form.jzTypeName = history_jzType.jzTypeName;
                        form.jzSubType = history_jzSubType.jzTypeID;
                        form.jzSubTypeName = history_jzSubType.jzTypeName;
                    },
                    'jz-struc': function () {
                        form.jzStructure = history_jzStruc;
                    },
                    'jz-gm': function () {
                        form.jzGM = history_jzGM;
                    },
                    'jz-cq': function () {
                        form.jzChanQuan = history_jzCQ;
                    },
                    'jz-fire': function () {
                        form.jzFireLevel = history_jzFire;
                    },
                    'jz-status': function () {
                        form.jzStatusValue = history_jzStatus;
                    }
                };
                if (Fns[this.pickerShow])
                    Fns[this.pickerShow]();
                this.selPopupShow = false;
                this.pickerShow = '';
            },
            datePickerShow(){
                if (this.formData.jzcreatedDate)
                    this.datePickerVal = new Date(this.formData.jzcreatedDate);
                this.$refs.createDatePicker.open();
            },
            selDate(){
                this.jzCreatedDate = this.formData.jzcreatedDate = this.datePickerVal;
            },
            //联动
            onLocationChange(picker, vals){
                let prov = vals[0];
                let city = vals[1];
                let area = vals[2];
                if (prov && prov.ID != history_prov.ID) {
                    history_prov = prov;
                    api.getCityList({provinceID: prov.ID}).then(res => {
                        if (res)
                            this.locationList[1].values = res.response;
                    });
                    return;
                }
                if (city && city.ID != history_city.ID) {
                    history_city = city;
                    api.getAreaList({cityID: city.ID}).then(res => {
                        if (res)
                            this.locationList[2].values = res.response;
                    });
                    return;
                }
                history_area = area;
            },
            onJzTypeChange(picker, vals){
                let type = vals[0];
                let sub = vals[1];
                if (type && type.jzTypeID != history_jzType.jzTypeID) {
                    history_jzType = type;
                    api.getJzType({jzSubTypeID: type.jzTypeID || ''}).then(res => {
                        if (res)
                            this.jzTypeList[1].values = res.response;
                    });
                    return;
                }
                history_jzSubType = sub;
            },
            onJzStrucChange(picker, vals){
                let list = this.jzStrucList[0].values;
                for (let i = 0; i < list.length; i++) {
                    if (list[i] == vals[0])
                        history_jzStruc = i;
                }
            },
            onJzGMChange(picker, vals){
                let list = this.jzGMList[0].values;
                for (let i = 0; i < list.length; i++) {
                    if (list[i] == vals[0])
                        history_jzGM = i;
                }
            },
            onJzCQChange(picker, vals){
                let list = this.jzCQList[0].values;
                for (let i = 0; i < list.length; i++) {
                    if (list[i] == vals[0])
                        history_jzCQ = i;
                }
            },
            onJzFireChange(picker, vals){
                let list = this.jzFireList[0].values;
                for (let i = 0; i < list.length; i++) {
                    if (list[i] == vals[0])
                        history_jzFire = i;
                }
            },
            onJzStatusChange(picker, vals){
                let list = this.jzStatusList[0].values;
                for (let i = 0; i < list.length; i++) {
                    if (list[i] == vals[0])
                        history_jzStatus = i;
                }
            },
            //照片
            takePhoto() {
                this.$takePhoto((photo) => {
                    this.images.push(photo.url);
                    this.imagesIsChange = true;
                });
            },
            choosePhoto() {
                this.$choosePhoto((photos) => {
                    if(photos.length == 9) photos.splice(8, 1);
                    for (let photo of photos) {
                        this.images.push(photo.url);
                        this.imagesIsChange = true;
                    }
                });
            },
            removePhoto(index) {
                this.images.splice(index, 1);
                this.imagesIsChange = true;
            },
            back() {
                for (let key in this.formData) {
                    if (this.formData[key] || this.formData[key] === 0) {
                        this.$MKODialog({
                            title: '真的要返回吗',
                            msg: '此页面信息将被清空',
                            cancelBtn: true,
                        }).then(action => {
                            if (action === 'confirm') {
                                this.$MKOPop();
                                this.$destroy();
                            }
                        });
                        return;
                    }
                }
                this.$MKOPop();
                this.$destroy();
            },
            onInputData() {
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                window.mkoBackButton.callback = this.back;
            }
        },
        components: {
            NoData,
            PhotoBox
        }
    }
</script>

<style lang="less" src="./index.less"></style>
<style lang="less">
    @import "../../config";

    .jz-plan {
        padding: @cellPaddingL;
        background-color: #ffffff;
        .jz-plan-title {
            width: 100%;
            font-size: 14px;
            display: table;
            span {
                height: 48px;
                line-height: 48px;
                display: table-cell;
                vertical-align: middle;
            }
        }
    }

</style>

