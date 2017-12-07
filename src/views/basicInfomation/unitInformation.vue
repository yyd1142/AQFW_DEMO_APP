<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="单位信息" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap" v-if="!notData">

            <mko-edit-card edit-disabled>
                <mko-form-cell title="账号信息" :val="unitItem.unit.userName"></mko-form-cell>
                <mko-form-cell title="单位编码" :val="groupId"></mko-form-cell>
            </mko-edit-card>

            <mko-edit-card title="基础信息" :edit="isEdit.base" :validate="isValidate.base" @edit="editInfo('base')"
                           @save="saveInfo('base')">
                <mko-form-cell required title="单位名称" :val="unitItem.unit.dwName" :edit="isEdit.base"
                               type="text" v-model="formData.dwName" non-text="暂无"></mko-form-cell>
                <mko-form-cell required title="单位简称" :val="unitItem.unit.dwShortName" :edit="isEdit.base"
                               type="text" v-model="formData.dwShortName" non-text="暂无"></mko-form-cell>
                <mko-form-cell required title="组织机构代码" :val="unitItem.unit.dwCode" :edit="isEdit.base"
                               type="text" v-model="formData.dwCode" non-text="暂无"></mko-form-cell>
                <mko-form-cell required title="单位地址" :val="unitAddress" :edit="isEdit.base"
                               type="sel" @click="popupPickerShow('location','base')" non-text="暂无"></mko-form-cell>
                <mko-form-cell required title="详细地址" :val="unitItem.unit.dwAddress" :edit="isEdit.base"
                               type="text" v-model="formData.dwAddress" non-text="暂无"></mko-form-cell>
                <mko-form-cell required title="单位类型" :val="unitType" :edit="isEdit.base"
                               type="sel" @click="popupPickerShow('unit-type','base')" non-text="暂无"></mko-form-cell>
                <mko-form-cell title="经济所有制" :val="isEdit.base?dwJJSYZ[formData.dwJJSYZ]:dwJJSYZ[unitItem.unit.dwJJSYZ]"
                               :edit="isEdit.base"
                               type="sel" @click="popupPickerShow('jjsyz','base')" non-text="暂无"></mko-form-cell>

                <mko-form-cell title="单位其他属性" :val="unitItem.unit.dwAttribute" non-text="暂无"></mko-form-cell>
                <mko-form-cell title="消防管辖" :val="unitItem.unit.gxDWName" non-text="暂无"></mko-form-cell>
                <mko-form-cell title="监督员" :val="unitItem.unit.dwSupervisor" non-text="暂无"></mko-form-cell>
                <mko-form-cell title="消防安全等级" :val="XFSafeLevelFilter + '(' + unitItem.unit.safetyName + ')'"
                               non-text="暂无"></mko-form-cell>
                <mko-form-cell title="其他监管部门" :val="unitItem.unit.xzDWName" non-text="暂无"></mko-form-cell>
            </mko-edit-card>

            <mko-edit-card title="联络信息" :edit="isEdit.contact" :validate="isValidate.contact" @edit="editInfo('contact')"
                           @save="saveInfo('contact')">
                <mko-form-cell required title="消防安全管理人" :val="unitItem.unit.dwManager" :edit="isEdit.contact"
                               type="text" v-model="formData.dwManager" non-text="暂无"></mko-form-cell>
                <mko-form-cell required phone title="联系电话" :val="unitItem.unit.dwManagerPhone" :edit="isEdit.contact"
                               type="number" v-model="formData.dwManagerPhone" non-text="暂无"></mko-form-cell>
                <mko-form-cell required title="消防安全责任人" :val="unitItem.unit.dwZRPerson" :edit="isEdit.contact"
                               type="text" v-model="formData.dwZRPerson" non-text="暂无"></mko-form-cell>
                <mko-form-cell required phone title="联系电话" :val="unitItem.unit.dwZRPhone" :edit="isEdit.contact"
                               type="number" v-model="formData.dwZRPhone" non-text="暂无"></mko-form-cell>
                <mko-form-cell title="企业法人" :val="unitItem.unit.dwFaRen" :edit="isEdit.contact"
                               type="text" v-model="formData.dwFaRen" non-text="暂无"></mko-form-cell>
                <mko-form-cell phone title="联系电话" :val="unitItem.unit.dwFaRenPhone" :edit="isEdit.contact"
                               type="number" v-model="formData.dwFaRenPhone" non-text="暂无"></mko-form-cell>

                <mko-form-cell title="法人证件类型"
                               :val="(isEdit.contact?formData.dwFaRenIDType:unitItem.unit.dwFaRenIDType) | IDType"
                               :edit="isEdit.contact" type="sel" @click="popupPickerShow('id-type','contact')"
                               non-text="暂无"></mko-form-cell>

                <mko-form-cell title="法人证件号" :val="unitItem.unit.dwFaRenID" :edit="isEdit.contact"
                               type="text" v-model="formData.dwFaRenID" non-text="暂无"></mko-form-cell>
                <mko-form-cell phone title="单位电话" :val="unitItem.unit.dwPhone" :edit="isEdit.contact"
                               type="number" v-model="formData.dwPhone" non-text="暂无"></mko-form-cell>

                <mko-form-cell title="单位传真" :val="unitItem.unit.dwFax" :edit="isEdit.contact"
                               type="text" v-model="formData.dwFax" non-text="暂无"></mko-form-cell>
                <mko-form-cell title="邮政编码" :val="unitItem.unit.dwPostcode" :edit="isEdit.contact"
                               type="text" v-model="formData.dwPostcode" non-text="暂无"></mko-form-cell>
            </mko-edit-card>
            <!--弹出框-->
            <mko-popup-bottom :title="popupName" v-model="selPopupShow" @save="selPickerVal" @cancel="selPopupClose">
                <mt-picker :slots="locationList" value-key="Name" @change="onLocationChange"
                           v-show="pickerShow=='location'"></mt-picker>
                <mt-picker :slots="unitTypeList" value-key="dwTypeName" @change="onUnitTypeChange"
                           v-show="pickerShow=='unit-type'"></mt-picker>
                <mt-picker :slots="dwJJSYZList" @change="onJJSYZChange" v-show="pickerShow=='jjsyz'"></mt-picker>
                <mt-picker :slots="idTypeList" @change="onIdTypeChange" v-show="pickerShow=='id-type'"></mt-picker>
            </mko-popup-bottom>
            <!--<mko-popup-right v-model="selPopupShow"></mko-popup-right>-->
        </div>
        <no-data v-if="notData"></no-data>
    </div>
</template>

<script>
    import { IDType } from 'filters'
    import { NoData } from 'components'
    import { Toast} from 'mint-ui'
    import api from 'api'
    import { MkoFormCell, MkoEditCard, MkoPopupBottom } from 'mko-ui'
    let unitDatas = [];
    let history_prov = {};
    let history_city = {};
    let history_area = {};
    let history_unitType = {};
    let history_unitSubType = {};
    let history_jjsyz = 0;
    let history_idType = 0;
    let valid_key = {
        base: ['dwName', 'dwShortName', 'dwCode', 'dwProvince', 'dwProvinceName', 'dwCity', 'dwCityName', 'dwArea', 'dwAreaName', 'dwAddress', 'dwTypeID', 'dwTypeName', 'dwSubTypeID', 'dwSubTypeName'],
        contact: ['dwManager', 'dwManagerPhone', 'dwZRPerson', 'dwZRPhone']
    };
    let form_key = {
        base: ['dwName', 'dwShortName', 'dwCode', 'dwProvince', 'dwProvinceName', 'dwCity', 'dwCityName', 'dwArea', 'dwAreaName',
            'dwAddress', 'dwTypeID', 'dwTypeName', 'dwSubTypeID', 'dwSubTypeName', 'dwJJSYZ'],
        contact: ['dwManager', 'dwManagerPhone', 'dwZRPerson', 'dwZRPhone', 'dwFaRen', 'dwFaRenPhone', 'dwFaRenIDType', 'dwFaRenID', 'dwPhone', 'dwFax', 'dwPostcode']
    };
    export default {
        data() {
            return {
                //data
                notData: false,
                dwJJSYZ: ['未知', '国有企业', '集体企业', '民营企业', '个体工商户', '中外合资企业', '外商独资企业', '股份制企业', '事业机关', '国家机关', '其它'],
                unitItem: {unit: {}, dwTypes: []},
                //编辑
                holderText: '请完善信息',
                selPopupShow: false,
                pickerShow: '',
                isEdit: {base: false, contact: false,},
                isValidate: {base: true, contact: true},
                addressIsChange: false,
                unitTypeIsChange: false,
                formData: {
                    dwName: '',
                    dwShortName: '',
                    dwCode: '',
                    dwProvince: '', dwProvinceName: '', dwCity: '', dwCityName: '', dwArea: '', dwAreaName: '',
                    dwAddress: '',
                    dwTypeID: '', dwTypeName: '', dwSubTypeID: '', dwSubTypeName: '',
                    dwManager: '', dwManagerPhone: '', dwZRPerson: '', dwZRPhone: ''
                },
                locationList: [
                    {flex: 1, values: [], className: 'picker-left'},
                    {flex: 1, values: [], className: 'picker-mid'},
                    {flex: 1, values: [], className: 'picker-right'}
                ],
                unitTypeList: [
                    {flex: 1, values: [], className: 'picker-left'},
                    {flex: 1, values: [], className: 'picker-right'}
                ],
                dwJJSYZList: [
                    {
                        flex: 1,
                        values: ['未知', '国有企业', '集体企业', '民营企业', '个体工商户', '中外合资企业', '外商独资企业', '股份制企业', '事业机关', '国家机关', '其它']
                    }
                ],
                idTypeList: [
                    {flex: 1, values: ['未知', '身份证', '港澳侨胞证', '护照']}
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
                    'location': '单位地址',
                    'unit-type': '单位类型',
                    'jjsyz': '经济所有制',
                    'id-type': '证件类型',
                };
                return names[this.pickerShow] || ''
            },
            unitAddress() {
                let unitItem = this.unitItem.unit;
                let form = this.formData;
                let dwProvinceName = unitItem.dwProvinceName == null ? '暂无' : unitItem.dwProvinceName;
                let dwCityName = unitItem.dwCityName == null ? '暂无' : unitItem.dwCityName;
                let dwAreaName = unitItem.dwAreaName == null ? '暂无' : unitItem.dwAreaName;
                if (this.addressIsChange || this.isEdit.base) {
                    dwProvinceName = form.dwProvinceName == null ? '暂无' : form.dwProvinceName;
                    dwCityName = form.dwCityName == null ? '暂无' : form.dwCityName;
                    dwAreaName = form.dwAreaName == null ? '暂无' : form.dwAreaName;
                    this.addressIsChange = false;
                }
                if (dwProvinceName == '暂无' && dwCityName == '暂无' && dwAreaName == '暂无') {
                    return '暂无'
                } else {
                    return `${dwProvinceName}-${dwCityName}-${dwAreaName}`
                }
            },
            unitXZArea() {
                let unitItem = this.unitItem.unit;
                let dwXZProvinceName = unitItem.dwXZProvinceName == null ? '暂无' : unitItem.dwXZProvinceName;
                let dwXZCityName = unitItem.dwXZCityName == null ? '暂无' : unitItem.dwXZCityName;
                let dwXZAreaName = unitItem.dwXZAreaName == null ? '暂无' : unitItem.dwXZAreaName;
                if (dwXZProvinceName == '暂无' && dwXZCityName == '暂无' && dwXZAreaName == '暂无') {
                    return '暂无'
                } else {
                    return `${dwXZProvinceName}-${dwXZCityName}-${dwXZAreaName}`
                }
            },
            unitType() {
                let unitItem = this.unitItem.unit;
                let form = this.formData;
                let dwTypeName = unitItem.dwTypeName == null ? '暂无' : unitItem.dwTypeName;
                let dwSubTypeName = unitItem.dwSubTypeName == null ? '暂无' : unitItem.dwSubTypeName;
                if (this.unitTypeIsChange || this.isEdit.base) {
                    dwTypeName = form.dwTypeName == null ? '暂无' : form.dwTypeName;
                    dwSubTypeName = form.dwSubTypeName == null ? '暂无' : form.dwSubTypeName;
                    this.unitTypeIsChange = false;
                }
                if (dwTypeName == '暂无' && dwSubTypeName == '暂无') {
                    return '暂无'
                } else {
                    return `${dwTypeName}(${dwSubTypeName})`
                }
            },
            groupId() {
                return this.$store.getters.groupId;
            },
            XFSafeLevelFilter() {
                let unit = this.unitItem.unit;
                if (unit.dwSafeSubTypeName === undefined || unit.safetyName === undefined) {
                    return '暂无'
                } else {
                    return `${unit.dwSafeSubTypeName}`
                }
            }
        },
        mounted() {
        },
        activated() {
            if (sessionStorage.getItem('unitDatas')) {
                unitDatas = JSON.parse(sessionStorage.getItem('unitDatas'));
            }
            this.getDWInfo();
            this.onInputData();
        },
        deactivated() {
            window.mkoBackButton.bInputData = false;
            document.body.style.overflow = 'auto';
            this.selPopupShow = false;
            this.isEdit = {base: false, contact: false,};
            this.isValidate = {base: false, contact: false};
        },
        methods: {
            getDWInfo() {
                if (unitDatas.length <= 0) {
                    this.notData = true;
                } else {
                    this.unitItem = {
                        unit: unitDatas[0][0]
                    };
                    let data = this.unitItem.unit;
                    this.getLocationData(data.dwProvince, data.dwCity, data.dwArea);
                    this.getUnitTypeData(data.dwTypeID, data.dwSubTypeID);
                    history_jjsyz = data.dwJJSYZ;
                    history_idType = data.dwFaRenIDType;
                    for (let key in data) {
                        this.formData[key] = data[key];
                    }
                    this.notData = false;
                }
            },
            getLocationData(provId, cityId, areaId){
                history_prov = {ID: provId, Name: this.unitItem.unit.dwProvinceName};
                history_city = {ID: cityId, Name: this.unitItem.unit.dwCityName};
                history_area = {ID: areaId, Name: this.unitItem.unit.dwAreaName};
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
            getUnitTypeData(typeId, subTypeId){
                history_unitType = {dwTypeID: typeId, dwTypeName: this.unitItem.unit.dwTypeID};
                history_unitSubType = {dwTypeID: subTypeId, dwTypeName: this.unitItem.unit.dwSubTypeID};
                let that = this;
                let fn = function (id) {
                    api.getUnitType({dwParentTypeID: id || ''}).then(res => {
                        if (res) {
                            let i = id ? 1 : 0;
                            that.unitTypeList[i].values = res.response;
                        }
                    })
                };
                fn();
                fn(typeId);
            },
            //编辑按钮
            editInfo(type){
                if (!this.isEdit[type]) {
                    this.validForm();
                    this.isEdit[type] = true;
                    return false;
                }

                if (type == 'base') {
                    this.addressIsChange = true;
                    this.unitTypeIsChange = true;
                }

                let form = this.formData;
                for (let key in form) {
                    form[key] = this.unitItem.unit[key];
                }
                this.isEdit[type] = false;
            },
            validForm(){
                let that = this;
                let fn = function (type) {
                    for (let key of valid_key[type]) {
                        if (!that.formData[key] && that.formData[key] !== 0) {
                            that.isValidate[type] = false;
                            return false;
                        }
                    }
                    that.isValidate[type] = true;
                };
                fn('base');
                fn('contact');
            },
            saveInfo(type){
                if (!this.isValidate[type])
                    return false;

                let form = {};
                for (let key in this.unitItem.unit) {
                    form[key] = this.unitItem.unit[key];
                }
                for (let key of form_key[type]) {
                    form[key] = this.formData[key];
                }

                api.updateUnitInfo(form).then(res => {
                    if (res && res.code == 0) {
                        for (let key in form) {
                            this.unitItem.unit[key] = unitDatas[0][0][key] = form[key];
                        }
                        try {
                            sessionStorage.setItem('unitDatas', JSON.stringify(unitDatas));
                        } catch (err) {
                        }
                        Toast({message: '修改成功！', duration: 1000});
                    } else {
                        Toast({message: '修改失败！', duration: 1000});
                    }
                });
                this.isEdit[type] = false;
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
                            calcDefaultVal(that.locationList[0], 'ID', that.formData.dwProvince);
                            calcDefaultVal(that.locationList[1], 'ID', that.formData.dwCity);
                            calcDefaultVal(that.locationList[2], 'ID', that.formData.dwArea);
                        },
                        'unit-type': function () {
                            calcDefaultVal(that.unitTypeList[0], 'dwTypeID', that.formData.dwTypeID);
                            calcDefaultVal(that.unitTypeList[1], 'dwTypeID', that.formData.dwSubTypeID);
                        },
                        'jjsyz': function () {
                            that.dwJJSYZList[0].defaultIndex = that.formData.dwJJSYZ;
                        },
                        'id-type': function () {
                            that.idTypeList[0].defaultIndex = that.formData.dwFaRenIDType;
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
                let form = this.formData;
                let Fns = {
                    'location': function () {
                        that.addressIsChange = true;
                        form.dwProvince = history_prov.ID;
                        form.dwProvinceName = history_prov.Name;
                        form.dwCity = history_city.ID;
                        form.dwCityName = history_city.Name;
                        form.dwArea = history_area.ID;
                        form.dwAreaName = history_area.Name;
                    },
                    'unit-type': function () {
                        that.unitTypeIsChange = true;
                        form.dwTypeID = history_unitType.dwTypeID;
                        form.dwTypeName = history_unitType.dwTypeName;
                        form.dwSubTypeID = history_unitSubType.dwTypeID;
                        form.dwSubTypeName = history_unitSubType.dwTypeName;
                    },
                    'jjsyz': function () {
                        form.dwJJSYZ = history_jjsyz;
                    },
                    'id-type': function () {
                        form.dwFaRenIDType = history_idType;
                    }
                };
                if (Fns[this.pickerShow])
                    Fns[this.pickerShow]();
                this.selPopupShow = false;
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
            onUnitTypeChange(picker, vals){
                let type = vals[0];
                let sub = vals[1];
                if (type && type.dwTypeID != history_unitType.dwTypeID) {
                    history_unitType = type;
                    api.getUnitType({dwParentTypeID: type.dwTypeID || ''}).then(res => {
                        if (res)
                            this.unitTypeList[1].values = res.response;
                    });
                    return;
                }
                history_unitSubType = sub;
            },
            onJJSYZChange(picker, vals){
                let list = this.dwJJSYZList[0].values;
                for (let i = 0; i < list.length; i++) {
                    if (list[i] == vals[0])
                        history_jjsyz = i;
                }
            },
            onIdTypeChange(picker, vals){
                let list = this.idTypeList[0].values;
                for (let i = 0; i < list.length; i++) {
                    if (list[i] == vals[0])
                        history_idType = i;
                }
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
            NoData, MkoFormCell, MkoEditCard, MkoPopupBottom
        }
    }
</script>

<!--<style lang="less" src="./index.less"></style>-->
