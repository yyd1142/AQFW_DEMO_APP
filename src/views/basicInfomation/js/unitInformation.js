import api from 'api'
import { NoData } from 'components'
import { dwJJSYZ, IDType } from 'filters'
import { Toast } from 'mint-ui'
var updateDatas = {};
var needUpdate = true;
var _groupId = ''
export default {
    data() {
        return {
            notData: false,
            dwJJSYZ: ['未知', '国有企业', '集体企业', '民营企业', '个体工商户', '中外合资企业', '外商独资企业', '股份制企业', '事业机关', '国家机关', '其它'],
            unitItem: {
                unit: {},
                dwTypes: []
            }
        }
    },
    computed: {
        unitAddress() {
            let unitItem = this.unitItem.unit;
            let dwProvinceName = unitItem.dwProvinceName == null ? '暂无' : unitItem.dwProvinceName;
            let dwCityName = unitItem.dwCityName == null ? '暂无' : unitItem.dwCityName;
            let dwAreaName = unitItem.dwAreaName == null ? '暂无' : unitItem.dwAreaName;
            if (dwProvinceName == '暂无' && dwCityName == '暂无' && dwAreaName == '暂无') {
                return '暂无'
            } else {
                return `${dwProvinceName}-${dwCityName}-${dwAreaName}`
            }
        },
        unitXZArea(){
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
        unitType(){
            let unitItem = this.unitItem.unit;
            let dwTypeName = unitItem.dwTypeName == null ? '暂无' : unitItem.dwTypeName;
            let dwSubTypeName = unitItem.dwSubTypeName == null ? '暂无' : unitItem.dwSubTypeName;
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
                return `${unit.dwSafeSubTypeName}(${unit.safetyName})`
            }
        }
    },
    activated() {
        this.$nextTick(() => {
            if (this.$route.query.update === 'true') {
                needUpdate = true;
            }
            if (!needUpdate) {
                this.notData = updateDatas.length <= 0 ? true : false;
                this.unitItem = updateDatas;
            } else {
                if(this.$store.getters.groupId != _groupId){
                    this.getDWInfo();
                }
            }
        })
    },
    methods: {
        getDWInfo() {
            let dwTypes = [
                { name: '', datas: [] }, { name: '设计单位', datas: [] }, { name: '施工单位', datas: [] }, { name: '维保单位', datas: [] }, { name: '检测单位', datas: [] }, { name: '运维单位', datas: [] }
            ];

            let params = {
                m: 'info',
                groupId: this.$store.getters.groupId
            }
            api.getUnitInfo(params).then(result => {
                _groupId = this.$store.getters.groupId
                if (result.code === 0) {
                    if (result.response.length <= 0) {
                        updateDatas = [];
                        this.notData = true;
                    } else {
                        result.response[1].forEach((item) => {
                            dwTypes[item.dwType].datas.push(item)
                        });
                        updateDatas = {
                            unit: result.response[0][0], dwTypes: dwTypes
                        };
                        this.unitItem = updateDatas;
                        this.notData = false;
                    }
                }
                needUpdate = false;
            });
        },
        goDwInfo(item) {
            sessionStorage.setItem('DWINFO_DATA', JSON.stringify(item));
            this.$MKOPush('/dw_info')
        }
    },
    components: {
        NoData
    }
}