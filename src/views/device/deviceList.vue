<template>
    <div>
        <div class="placeholder-item"></div>
        <!--<mko-header title="设施设备" left-icon="icon-back" right-icon="icon-add" @handleLeftClick="back"-->
        <!--@handleRightClick="linkPath('/spot_add?from=device')"></mko-header>-->

        <mko-search-bar v-model="searchValue" is-header :hint-text="headerBtnItems[tabI].searchText">
            <div slot="left-button" class="icon-back fl text-middle" @click="back"></div>
            <div slot="right-button" class="icon-add fr text-middle" @click="linkPath('/spot_add?from=device')"></div>
        </mko-search-bar>
        <div class="page-wrap device-list-wrap" id="pageWrapper">

            <!--头部按钮-->
            <mko-nav-bar>
                <mko-tab-item :label="item.text" :activied="item.actived" @handleTabClick="tab"
                              v-for="(item,i) in headerBtnItems"></mko-tab-item>
            </mko-nav-bar>

            <!--筛选-->
            <!--<div class="device-selecetd" @click="popupShow = true">-->
            <!--<i class="selected-icon"></i>-->
            <!--<div v-if="!isSelected[tabI]" class="selected-text">筛选</div>-->
            <!--<div class="selected-text" v-else>-->
            <!--<span class="system-text">{{text[tabI].systemText || '全部'}}</span>-{{text[tabI].jzLevelText || '全部'}}<span-->
            <!--v-show="tabI==0">-{{text[tabI].statusText || '全部'}}</span>-->
            <!--</div>-->
            <!--</div>-->

            <!--数据-->
            <device-list-by-spot :search="searchValue" v-model="enter" :cur="tabI" v-show="tabI==0"></device-list-by-spot>
            <device-list-by-dvc :search="searchValue" v-model="enter" :cur="tabI" v-show="tabI==1"></device-list-by-dvc>
        </div>

        <!--弹出框-->
        <mko-popup-right v-model="popupShow" @reset="resetData()" @confirm="confirm()" v-if="tabI==1">
            <mko-select-box title="建筑单位" :options="options.jzInfos" :selected="[formData[0].jzID]" @select="chooseJzInfo"
                            name-key="jzName" value-key="jzID" :column="1"></mko-select-box>
            <mko-select-box title="楼层" :options="options.jzLevels[0]" :selected="[formData[0].jzLevel]"
                            @select="chooseJzLevel"
                            name-key="label" :column="4" v-if="isSelectedJZ[0]"></mko-select-box>
            <mko-select-box title="设备状态" :options="options.status" :selected="[formData[0].status]" @select="chooseStatus"
                            name-key="label" :column="4"></mko-select-box>

        </mko-popup-right>
        <mko-popup-right v-model="popupShow" @reset="resetData()" @confirm="confirm()" v-if="tabI==0">
            <mko-select-box title="建筑单位" :options="options.jzInfos" :selected="[formData[1].jzID]" @select="chooseJzInfo"
                            name-key="jzName" value-key="jzID" :column="1"></mko-select-box>
            <mko-select-box title="楼层" :options="options.jzLevels[1]" :selected="[formData[1].jzLevel]"
                            @select="chooseJzLevel"
                            name-key="label" :column="4" v-if="isSelectedJZ[1]"></mko-select-box>

        </mko-popup-right>
    </div>
</template>

<script>
    import api from 'api'
    import { NoData } from 'components'
    import { Toast, Indicator } from 'mint-ui'
    import { levelFr } from 'filters'
    import deviceListBySpot from './deviceListBySpot.vue'
    import deviceListByDvc from './deviceListByDvc.vue'

    export default {
        data() {
            return {
                enter: true,
                tabI: 0,
                headerBtnItems: [
                    {text: '安装点', searchText: '可搜索安装点名称', actived: true},
                    {text: '故障设备', searchText: '可搜索设备名', actived: false}
                ],
                searchValue: '',
                //筛选
                popupShow: false,
                isSelected: [false, false],
                isSelectedJZ: [false, false],
                formData: [
                    {systemID: '', jzID: '', jzLevel: '', status: ""},
                    {systemID: '', jzID: '', jzLevel: ''}
                ],
                text: [
                    {systemText: '', jzLevelText: '', statusText: ''},
                    {systemText: '', jzLevelText: ''}
                ],
                //信息
                options: {
                    systemsDatas: [],
                    jzLevels: [[], []],
                    jzInfos: [],
                    status: [
                        {value: 1, label: '正常'},
                        {value: 2, label: '故障'},
                        {value: 3, label: '维修中'},
                        {value: 4, label: '停用'}
                    ]
                },
                statusText: ['未知', '正常', '故障', '维修中', '停用'],
                statusColor: ['#ffffff', '#00E460', '#ef4f4f', '#ffb224', '#a0a0a0'],
            }
        },
        watch: {
            popupShow: function (val) {
                if (val) {
                    document.body.style.overflow = 'hidden'
                } else {
                    document.body.style.overflow = 'auto'
                }
            }
        },
        mounted() {

        },
        activated() {
            this.setBackButton();
            this.$nextTick(() => {

                if (this.enter) {
                    this.isSelected = [false, false];
                    this.isSelectedJZ = [false, false];
                    this.formData = [
                        {systemID: '', jzID: '', jzLevel: '', status: ""},
                        {systemID: '', jzID: '', jzLevel: ''}
                    ];
                    this.text = [
                        {systemText: '', jzLevelText: '', statusText: ''},
                        {systemText: '', jzLevelText: ''}
                    ]
                }

//                api.getJZList({
//                    m: 'list',
//                    groupId: this.$store.getters.groupId
//                }).then(result => {
//                    if (result.code === 0) {
//                        if (result.response.length > 0) {
//                            this.options.jzInfos = result.response;
//                        } else {
//                            this.options.jzInfos = []
//                        }
//                    } else {
//                        this.options.jzInfos = []
//                    }
//                });
            })
        },
        deactivated() {
            this.searchValue = '';
            document.body.style.overflow = 'auto';
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
        },
        methods: {
            levelFr,
            tab(label){
                this.headerBtnItems.forEach((item, i) => {
                    item.actived = false;
                    if (item.text == label) {
                        item.actived = true;
                        this.tabI = i;
                        this.searchValue = '';
                    }
                });
            },
            //筛选
            resetData() {
                let ti = this.tabI;
                for (let key in this.formData[ti]) {
                    this.formData[ti][key] = '';
                }
                this.isSelected[ti] = false;
                this.popupShow = false;
                this.dwFacilities(ti);
            },
            confirm() {
                let ti = this.tabI;
                this.isSelected[ti] = true;
                this.bottomAllLoaded = _data[ti].bal = false;
                this.popupShow = false;
                this.dwFacilities(ti, 'sel');
            },
            chooseSystems(item) {
                this.text[this.tabI].systemText = item.systemName;
                this.formData[this.tabI].systemID = item.systemID;
            },
            chooseJzInfo(item) {
                this.formData[this.tabI].jzLevel = ''
                let jzDSNumber = item.jzDSNumber >= 100 ? 100 : item.jzDSNumber;
                let jzDXNumber = item.jzDXNumber;
                let arr1 = [];
                let arr2 = [];
                for (let i = 1; i <= jzDSNumber; i++) {
                    arr1.push({
                        label: `${i}楼`,
                        value: i
                    });
                }
                for (let i = 1; i <= jzDXNumber; i++) {
                    arr2.push({
                        label: `负${i}楼`,
                        value: -i
                    });
                }
                this.formData[this.tabI].jzID = item.jzID;
                this.options.jzLevels[this.tabI] = arr2.concat(arr1);
                this.isSelectedJZ[this.tabI] = true;
                this.text[this.tabI].systemText = item.jzName
                this.text[this.tabI].jzLevelText = '';
            },
            chooseJzLevel(item) {
                this.text[this.tabI].jzLevelText = item.label;
                this.formData[this.tabI].jzLevel = item.value
            },
            chooseStatus(item) {
                this.text[this.tabI].statusText = item.label;
                this.formData[this.tabI].status = item.value
            },
            linkPath(path) {
                this.$MKOPush(path)
            },
            setBackButton() {
                let self = this;
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                if (window.mkoBackButton.bInputData) {
                    let popupFn = function () {
                        self.popupShow = false;
                    };
                    window.mkoBackButton.callback = this.popupShow ? popupFn : this.back;
                }
            },
            back() {
                this.enter = true;
                this.$MKOPop();
            },
        },
        components: {
            NoData, deviceListBySpot, deviceListByDvc
        }
    }
</script>


<style lang="less">
    @import "../../config.less";

    .device-list-wrap {
        padding-bottom: 0;

        .build-info {
            height: 34px;
            padding: 14px 14px 8px;
            line-height: 12px;
            font-size: 12px;
            letter-spacing: 0;
            background-color: @baseBG01;
            color: @baseText02;
        }

        .device-selecetd {
            width: 100%;
            color: @blueColor;
            background-color: #fff;
            margin-bottom: 14px;
            display: table;
            .selected-icon {
                background: url('/static/icons/resource.png') 0 0 no-repeat;
                background-size: 892px auto;
            }
            .selected-text {
                font-size: 14px;
                line-height: 40px;
                height: 40px;
                text-align: center;
                display: table-cell;
                vertical-align: middle;
            }
            .system-text {
                min-width: 20px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-flex;
            }
        }
    }


</style>
