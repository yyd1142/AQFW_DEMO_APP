<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="jzItem.jzName||''" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <div class="com-data-wrap card" :class="{'is-edit':isEdit.base}">
                <div class="title-wrap">
                    <div class="title fl">基础信息</div>
                    <div class="btn fr" @click="editInfo('base')">{{isEdit.base ? '取消' : '编辑'}}</div>
                    <div class="btn fr" :class="{'disabled-btn':!isValidate.base}" @click="saveInfo('base')" v-show="isEdit.base">
                        保存
                    </div>
                </div>
                <mt-cell title="建筑名称" :value="jzItem.jzName || '暂无'">
                    <span class="sign" v-if="isEdit.base">*</span>
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData_base.jzName" v-if="isEdit.base">
                </mt-cell>
                <mt-cell title="建筑编号" :value="jzItem.jzCode || '暂无'">
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData_base.jzCode" v-if="isEdit.base">
                </mt-cell>
                <div class="sel-cell-wrap" @click="popupPickerShow('location','base')">
                    <span class="sign">{{isEdit.base ? '*' : ''}}</span>
                    <mt-cell title="建筑区域" :value="jzLocation" :is-link="isEdit.base"></mt-cell>
                </div>
                <mt-cell title="详细地址" :value="jzItem.jzAddress || '暂无'">
                    <span class="sign" v-if="isEdit.base">*</span>
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData_base.jzAddress" v-if="isEdit.base">
                </mt-cell>
                <mt-cell title="地理坐标" :value="jzItem.gps || '暂无'">
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData_base.gps" v-if="isEdit.base">
                </mt-cell>
                <div class="sel-cell-wrap" @click="popupPickerShow('jz-type','base')">
                    <span class="sign">{{isEdit.base ? '*' : ''}}</span>
                    <mt-cell title="建筑类型" :value="jzType" :is-link="isEdit.base"></mt-cell>
                </div>
                <div class="sel-cell-wrap" @click="popupPickerShow('jz-struc','base')">
                    <span class="sign">{{isEdit.base ? '*' : ''}}</span>
                    <mt-cell title="建筑结构"
                             :value="isEdit.base?jzStructures[formData_base.jzStructure]:jzStructures[jzItem.jzStructure]"
                             :is-link="isEdit.base">
                    </mt-cell>
                </div>
                <div @click="popupPickerShow('jz-gm','base')">
                    <span></span>
                    <mt-cell title="建筑层数分类" :value="isEdit.base?jzGM[formData_base.jzGM]:jzGM[jzItem.jzGM] || '暂无'"
                             :is-link="isEdit.base"></mt-cell>
                </div>
                <div @click="popupPickerShow('jz-cq','base')">
                    <span></span>
                    <mt-cell title="产权及使用情况"
                             :value="isEdit.base?jzChanQuans[formData_base.jzChanQuan]:jzChanQuans[jzItem.jzChanQuan] || '暂无'"
                             :is-link="isEdit.base"></mt-cell>
                </div>
                <div @click="popupPickerShow('jz-fire','base')">
                    <span></span>
                    <mt-cell title="耐火等级"
                             :value="isEdit.base?jzFireLevel[formData_base.jzFireLevel]:jzFireLevel[jzItem.jzFireLevel]"
                             :is-link="isEdit.base"></mt-cell>
                </div>
            </div>
            <div class="com-data-wrap card" :class="{'is-edit':isEdit.detail}">
                <div class="title-wrap">
                    <div class="title fl">详细信息</div>
                    <div class="btn fr" @click="editInfo('detail')">{{isEdit.detail ? '取消' : '编辑'}}</div>
                    <div class="btn fr" :class="{'disabled-btn':!isValidate.detail}" @click="saveInfo('detail')"
                         v-show="isEdit.detail">保存
                    </div>
                </div>
                <mt-cell title="建筑高度" :value="jzItem.jzHeight?(jzItem.jzHeight + '米'):'暂无'">
                    <span class="sign" v-if="isEdit.detail">*</span>
                    <input class="ipt" type="number" placeholder="单位：米" v-model.number="formData_detail.jzHeight"
                           v-if="isEdit.detail">
                </mt-cell>
                <mt-cell title="建筑面积" :value="jzItem.jzArea?(jzItem.jzArea + '平方米'):'暂无'">
                    <span class="sign" v-if="isEdit.detail">*</span>
                    <input class="ipt" type="number" placeholder="单位：平方米" v-model.number="formData_detail.jzArea"
                           v-if="isEdit.detail">
                </mt-cell>
                <mt-cell title="占地面积" :value="jzItem.jzFloorArea?(jzItem.jzFloorArea + '平方米'):'暂无'">
                    <input class="ipt" type="number" placeholder="单位：平方米" v-model.number="formData_detail.jzFloorArea"
                           v-if="isEdit.detail">
                </mt-cell>
                <mt-cell title="标准层面积" :value="jzItem.jzStdFloorArea?(jzItem.jzStdFloorArea + '平方米'):'暂无'">
                    <input class="ipt" type="number" placeholder="单位：平方米" v-model.number="formData_detail.jzStdFloorArea"
                           v-if="isEdit.detail">
                </mt-cell>
                <mt-cell title="地上层数" :value="levelNumFr(jzItem.jzDSNumber)">
                    <span class="sign" v-if="isEdit.detail">*</span>
                    <input class="ipt" type="number" placeholder="单位：层" v-model.number="formData_detail.jzDSNumber"
                           v-if="isEdit.detail">
                </mt-cell>
                <mt-cell title="地上层面积" :value="jzItem.jzDSArea?(jzItem.jzDSArea + '平方米'):'暂无'">
                    <input class="ipt" type="text" placeholder="单位：平方米" v-model="formData_detail.jzDSArea" v-if="isEdit.detail">
                </mt-cell>
                <mt-cell title="地下层数" :value="levelNumFr(jzItem.jzDXNumber)">
                    <span class="sign" v-if="isEdit.detail">*</span>
                    <input class="ipt" type="number" placeholder="单位：层" v-model.number="formData_detail.jzDXNumber"
                           v-if="isEdit.detail">
                </mt-cell>
                <mt-cell title="地下层面积" :value="jzItem.jzDXArea?(jzItem.jzDXArea + '平方米'):'暂无'">
                    <input class="ipt" type="number" placeholder="单位：平方米" v-model.number="formData_detail.jzDXArea"
                           v-if="isEdit.detail">
                </mt-cell>
                <mt-cell title="避难层数量" :value="jzItem.jzBiNanNumber?(jzItem.jzBiNanNumber + '个'):'暂无'">
                    <input class="ipt" type="number" placeholder="单位：个" v-model.number="formData_detail.jzBiNanNumber"
                           v-if="isEdit.detail">
                </mt-cell>
                <mt-cell title="避难层总面积" :value="jzItem.jzBiNanTotalArea?(jzItem.jzBiNanTotalArea + '平方米'):'暂无'">
                    <input class="ipt" type="number" placeholder="单位：平方米" v-model.number="formData_detail.jzBiNanTotalArea"
                           v-if="isEdit.detail">
                </mt-cell>
                <mt-cell title="可容纳最大人数" :value="jzItem.jzMaxPepole?(jzItem.jzMaxPepole + '个'):'暂无'">
                    <input class="ipt" type="number" placeholder="单位：个" v-model.number="formData_detail.jzMaxPepole"
                           v-if="isEdit.detail">
                </mt-cell>
                <mt-cell title="消控室数量" :value="jzItem.jzXiaoKongNumber?(jzItem.jzXiaoKongNumber + '个'):'暂无'">
                    <input class="ipt" type="number" placeholder="单位：个" v-model.number="formData_detail.jzXiaoKongNumber"
                           v-if="isEdit.detail">
                </mt-cell>
                <mt-cell title="消防电梯数量" :value="jzItem.jzDianTiNumber?(jzItem.jzDianTiNumber + '个'):'暂无'">
                    <input class="ipt" type="number" placeholder="单位：个" v-model.number="formData_detail.jzDianTiNumber"
                           v-if="isEdit.detail">
                </mt-cell>
            </div>
            <div class="com-data-wrap card" :class="{'is-edit':isEdit.other}">
                <div class="title-wrap">
                    <div class="title fl">其他信息</div>
                    <div class="btn fr" @click="editInfo('other')">{{isEdit.other ? '取消' : '编辑'}}</div>
                    <div class="btn fr" @click="saveInfo('other')" v-show="isEdit.other">保存</div>
                </div>
                <mt-cell title="毗邻建筑情况" :value="jzItem.jzInfo || '暂无'">
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData_other.jzInfo"
                           v-if="isEdit.other">
                </mt-cell>
                <div @click="datePickerShow">
                    <span></span>
                    <mt-cell title="竣工时间"
                             :value="isEdit.other?formatDate(jzCreatedDate,'YYYY-MM-DD'):formatDate(jzItem.jzcreatedDate,'YYYY-MM-DD')"
                             :is-link="isEdit.other"></mt-cell>
                </div>
                <div @click="popupPickerShow('jz-status','other')">
                    <span></span>
                    <mt-cell title="建筑状态"
                             :value="(isEdit.other?formData_other.jzStatusValue:jzItem.jzStatusValue)==1?'未使用' : '已使用'"
                             :is-link="isEdit.other"></mt-cell>
                </div>
                <mt-cell title="建筑管理单位" :value="jzItem.jzManagerOrg ||'暂无'">
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData_other.jzManagerOrg"
                           v-if="isEdit.other">
                </mt-cell>
                <mt-cell title="建筑设计单位" :value="jzItem.jzDesignOrg ||'暂无'">
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData_other.jzDesignOrg"
                           v-if="isEdit.other">
                </mt-cell>
                <mt-cell title="建筑施工单位" :value="jzItem.jzShiGongOrg ||'暂无'">
                    <input class="ipt" type="text" :placeholder="holderText" v-model="formData_other.jzShiGongOrg"
                           v-if="isEdit.other">
                </mt-cell>
                <div class="jz-plan">
                    <div class="jz-plan-title"><span>建筑平面图</span></div>
                    <photo-box :max="1" :read-only="!isEdit.other" :photo-list="images" @addPhotoEvent="sheetShow=true"
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
                                month-format="{value} 月" date-format="{value} 日" v-model="history_jzCreatedDate"
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
    let _id = '';
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
    let valid_key = {
        base: ['jzName', 'jzType', 'jzSubType', 'province', 'city', 'area', 'jzAddress'],
        detail: ['jzHeight', 'jzArea', 'jzDSNumber', 'jzDXNumber']
    };
    export default {
        data() {
            return {
                jzStructures: ['木结构', '砖木结构', '砖混结构', '钢筋混凝土结构', '钢结构', '其它结构'],
                jzChanQuans: ["未知", '独立产权，独立使用', '独立产权，多家使用', '多家产权，多家使用'],
                jzGM: ['未知', '单、多层建筑', '高层建筑', '地下建筑', '其他建筑'],
                jzFireLevel: ['未知', '一级', '二级', '三级', '四级'],
                notData: false,
                jzItem: {},
                images: [],
                //编辑
                holderText: '请完善信息',
                startDate: new Date(1970, 0, 1),
                selPopupShow: false,
                pickerShow: '',
                isEdit: {base: false, detail: false, other: false},
                isValidate: {base: false, detail: false, other: true},
                imagesIsChange: false,
                addressIsChange: false,
                jzTypeIsChange: false,
                history_jzCreatedDate: new Date(),
                jzCreatedDate: '',
                formData_base: {
                    jzName: '',
                    jzCode: '',
                    province: '', city: '', area: '',
                    provinceName: '', cityName: '', areaName: '',
                    jzAddress: '',
                    gps: '',
                    jzType: '', jzTypeName: '', jzSubType: '', jzSubTypeName: '',
                    jzStructure: '',
                    jzGM: '',
                    jzChanQuan: '',
                    jzFireLevel: ''
                },
                formData_detail: {
                    jzHeight: '',
                    jzArea: '',
                    jzFloorArea: '',
                    jzStdFloorArea: '',
                    jzDSNumber: '',
                    jzDSArea: '',
                    jzDXNumber: '',
                    jzDXArea: '',
                    jzBiNanNumber: '',
                    jzBiNanTotalArea: '',
                    jzMaxPepole: '',
                    jzXiaoKongNumber: '',
                    jzDianTiNumber: '',
                },
                formData_other: {
                    jzInfo: '',
                    jzcreatedDate: '',
                    jzStatusValue: '',
                    jzManagerOrg: '',
                    jzDesignOrg: '',
                    jzShiGongOrg: '',
//          jzPlan:''
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
            formData_base: {
                handler() {
                    this.validForm('base');
                },
                deep: true
            },
            formData_detail: {
                handler() {
                    this.validForm('detail');
                },
                deep: true
            },
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
            jzLocation: {
                cache: false,
                get: function () {
                    let jzItem = this.jzItem;
                    let form = this.formData_base;
                    let jzProvinceName = !jzItem.provinceName ? '暂无' : jzItem.provinceName;
                    let jzCityName = !jzItem.cityName ? '暂无' : jzItem.cityName;
                    let jzAreaName = !jzItem.areaName ? '暂无' : jzItem.areaName;
                    if (this.addressIsChange || this.isEdit.base) {
                        jzProvinceName = !form.provinceName ? '暂无' : form.provinceName;
                        jzCityName = !form.cityName ? '暂无' : form.cityName;
                        jzAreaName = !form.areaName ? '暂无' : form.areaName;
                        this.addressIsChange = false;
                    }
                    if (jzProvinceName == '暂无' && jzCityName == '暂无' && jzAreaName == '暂无') {
                        return '暂无'
                    } else {
                        return `${jzProvinceName}-${jzCityName}-${jzAreaName}`
                    }
                }
            },
            jzType: {
                cache: false,
                get: function () {
                    let jzItem = this.jzItem;
                    let form = this.formData_base;
                    let jzTypeName = !jzItem.jzTypeName ? '暂无' : jzItem.jzTypeName;
                    let jzSubTypeName = !jzItem.jzSubTypeName ? '暂无' : jzItem.jzSubTypeName;
                    if (this.jzTypeIsChange || this.isEdit.base) {
                        jzTypeName = !form.jzTypeName ? '暂无' : form.jzTypeName;
                        jzSubTypeName = !form.jzSubTypeName ? '暂无' : form.jzSubTypeName;
                        this.jzTypeIsChange = false;
                    }
                    if (jzTypeName == '暂无' && jzSubTypeName == '暂无') {
                        return '暂无'
                    } else {
                        return `${jzTypeName}(${jzSubTypeName})`
                    }
                },
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
            })
        },
        activated() {
            this.$nextTick(() => {
                this.getJZDetail();
                this.onInputData();
            })
        },
        deactivated() {
            window.mkoBackButton.bInputData = false;
            document.body.style.overflow = 'auto';
            this.$refs.createDatePicker.close();
            this.selPopupShow = false;
            this.sheetShow = false;
            this.imagesIsChange = false;
            this.isEdit = {base: false, detail: false, other: false};
            this.isValidate = {base: false, detail: false, other: true};
        },
        methods: {
            formatDate,
            levelNumFr(val){
                return (val || val === 0) ? val + '层' : '暂无';
            },
            getJZDetail() {
                let params = {
                    m: 'info',
                    jzID: this.$route.params.jzId
                };
                this.images = [];
                api.getJZDetail(params).then(result => {
                    _id = this.$route.params.jzId;
                    if (result.code === 0) {
                        if (result.response.length <= 0) {
                            this.notData = true;
                        } else {
                            let data = this.jzItem = result.response;
                            this.jzCreatedDate = data.jzcreatedDate;
                            data.jzSubTypeName = data.jzSubType ? data.jzSubType[0].jzTypeName : null;
                            data.jzSubType = data.jzSubType ? data.jzSubType[0].jzTypeID : '';
                            this.getLocationData(data.province, data.city, data.area);
                            this.getJzTypeData(data.jzType, data.jzSubType);
                            let that = this;
                            let matchFormData = function (type) {
                                let form = that[`formData_${type}`];
                                for (let key in form) {
                                    form[key] = data[key];

                                }
                            };
                            matchFormData('base');
                            matchFormData('detail');
                            matchFormData('other');
                            this.notData = false;
                            this.getFiles(data.jzPlan);
                        }
                    }
                });
            },
            getFiles(id) {
                if (id == '' || id == null) return false;
                api.getByPath(`/info/${id}`)({}).then(res => {
                    if (res.code != 0)
                        return;
                    if (res.response && res.response.length > 0) {
                        for (let i = 0; i < res.response.length; i++) {
                            let item = res.response[i]
                            this.images.push(`${apiconf.resourcesDomain}/${item.resouceId}`)
                        }
                    }
                });
            },
            getLocationData(provId, cityId, areaId){
                history_prov = {ID: provId, Name: this.jzItem.provinceName};
                history_city = {ID: cityId, Name: this.jzItem.cityName};
                history_area = {ID: areaId, Name: this.jzItem.areaName};
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
                history_jzType = {jzTypeID: typeId, jzTypeName: this.jzItem.jzTypeName};
                history_jzSubType = {jzTypeID: subTypeId, jzTypeName: this.jzItem.jzSubTypeName};
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
            //编辑按钮
            editInfo(type){
                let form = this[`formData_${type}`];
                if (!this.isEdit[type]) {
                    if (type == 'other')
                        this.jzCreatedDate = form.jzcreatedDate;
                    this.validForm(type);
                    this.isEdit[type] = true;
                    return false;
                }

                if (type == 'base') {
                    this.addressIsChange = true;
                }
                if (type == 'other' && this.imagesIsChange) {
                    this.images = [];
                    this.getFiles(this.jzItem.jzPlan);
                    this.imagesIsChange = false;
                }
                for (let key in form) {
                    form[key] = this.jzItem[key];
                }
                if (type == 'other')
                    this.jzCreatedDate = form.jzcreatedDate;
                this.isEdit[type] = false;
            },
            validForm(type){
                if (type == 'other')
                    return;

                for (let key of valid_key[type]) {
                    if (!this[`formData_${type}`][key] && this[`formData_${type}`][key] !== 0) {
                        this.isValidate[type] = false;
                        return false;
                    }
                }
                this.isValidate[type] = true;
            },
            saveInfo(type){
                if (!this.isValidate[type])
                    return false;

                let self = this;
                let form = {};
                for (let key in this[`formData_${type}`]) {
                    form[key] = this[`formData_${type}`][key]
                }
                form.groupId = this.jzItem.groupId;
                form.jzID = this.$route.params.jzId;
//                form.groupId=
                if (type == 'other')
                    form.jzcreatedDate = moment(form.jzcreatedDate).format("YYYY-MM-DD 00:00");

                let doUploadSuccess = function (resourceId) {
                    if (resourceId != '') {
                        form.jzPlan = resourceId;
                    }
                    api.updateBuildData(form).then(res => {
                        if (res && res.code == 0) {
                            for (let key in form) {
                                self.jzItem[key] = form[key];
                            }
                            if (type == 'other')
                                self.imagesIsChange = false;
                            Toast({
                                message: '修改成功！',
                                duration: 1000
                            });
                        } else {
//                            Toast({
//                                message: '修改失败！',
//                                duration: 1000
//                            });
                        }
                    });
                };
                let doDumpData = function () {
                    if (self.images.length <= 0) {
                        doUploadSuccess('');
                        this.isEdit[type] = false;
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
                            self.isEdit[type] = false;
                        }
                    });
                };

                if (type == 'other' && this.imagesIsChange) {
                    this.$getMobileNetworkType(function (result) {
                        if (result == "unknown") {
                            self.$MKODialog({msg: '当前网络不可用，请确保网络正常...'});
                            return;
                        } else if (result == "3G/4G") {
                            let opts = {
                                title: '提示',
                                msg: '当前3G/4G网络，提交图片数据会消耗流量，建议WIFI环境下上传。',
                                cancelBtn: true,
                                confirmText: '立即提交',
                                cancelText: '稍后提交'
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
                    this.isEdit[type] = false;
                }

            },
            //弹出框
            selPopupClose(){
                this.selPopupShow = false;
            },
            popupPickerShow(picker, type){
                if (this.isEdit[type]) {
                    let that = this;
                    let calcDefaultVal = function (list, keyName, id) {
                        for (let key in list.values) {
                            if (list.values[key][keyName] == id) {
                                list.defaultIndex = parseInt(key);
                            }
                        }
                    };
                    let fns = {
                        'location': function () {
                            calcDefaultVal(that.locationList[0], 'ID', that.formData_base.province);
                            calcDefaultVal(that.locationList[1], 'ID', that.formData_base.city);
                            calcDefaultVal(that.locationList[2], 'ID', that.formData_base.area);
                        },
                        'jz-type': function () {
                            calcDefaultVal(that.jzTypeList[0], 'jzTypeID', that.formData_base.jzType);
                            calcDefaultVal(that.jzTypeList[1], 'jzTypeID', that.formData_base.jzSubType);
                        },
                        'jz-struc': function () {
                            that.jzStrucList[0].defaultIndex = that.formData_base.jzStructure;
                        },
                        'jz-gm': function () {
                            that.jzGMList[0].defaultIndex = that.formData_base.jzGM;
                        },
                        'jz-cq': function () {
                            that.jzCQList[0].defaultIndex = that.formData_base.jzChanQuan;
                        },
                        'jz-fire': function () {
                            that.jzFireList[0].defaultIndex = that.formData_base.jzFireLevel;
                        },
                        'jz-status': function () {
                            that.jzStatusList[0].defaultIndex = that.formData_other.jzStatusValue;
                        }
                    };
                    if (fns[picker])
                        fns[picker]();
                    this.selPopupShow = true;
                    this.pickerShow = picker;
                }
            },
            selPickerVal(){
                let that = this;
                let form_base = this.formData_base;
                let Fns = {
                    'location': function () {
                        that.addressIsChange = true;
                        form_base.province = history_prov.ID;
                        form_base.provinceName = history_prov.Name;
                        form_base.city = history_city.ID;
                        form_base.cityName = history_city.Name;
                        form_base.area = history_area.ID;
                        form_base.areaName = history_area.Name;
                    },
                    'jz-type': function () {
                        that.jzTypeIsChange = true;
                        form_base.jzType = history_jzType.jzTypeID;
                        form_base.jzTypeName = history_jzType.jzTypeName;
                        form_base.jzSubType = history_jzSubType.jzTypeID;
                        form_base.jzSubTypeName = history_jzSubType.jzTypeName;
                    },
                    'jz-struc': function () {
                        form_base.jzStructure = history_jzStruc;
                    },
                    'jz-gm': function () {
                        form_base.jzGM = history_jzGM;
                    },
                    'jz-cq': function () {
                        form_base.jzChanQuan = history_jzCQ;
                    },
                    'jz-fire': function () {
                        form_base.jzFireLevel = history_jzFire;
                    },
                    'jz-status': function () {
                        that.formData_other.jzStatusValue = history_jzStatus;
                    }
                };
                if (Fns[this.pickerShow])
                    Fns[this.pickerShow]();
                this.selPopupShow = false;
                this.pickerShow = '';
            },
            datePickerShow(){
                if (this.isEdit.other) {
                    this.history_jzCreatedDate = this.formData_other.jzcreatedDate ? new Date(this.formData_other.jzcreatedDate) : new Date();
                    this.$refs.createDatePicker.open();
                }
            },
            selDate(){
                this.jzCreatedDate = this.formData_other.jzcreatedDate = this.history_jzCreatedDate;
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
                    if (photos.length == 9) photos.splice(8, 1);
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
                for (let key in this.isEdit) {
                    if (this.isEdit[key]) {
                        this.$MKODialog({
                            title: '真的要返回吗',
                            msg: '编辑信息还未保存',
                            cancelBtn: true,
                        }).then(action => {
                            if (action === 'confirm') {
                                this.$MKOPop();
                            }
                        });
                        return;
                    }
                }
                this.$MKOPop();
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

<!--<style lang="less" src="./index.less"></style>-->
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

