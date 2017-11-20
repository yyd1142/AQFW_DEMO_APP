<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="`${title}详情`"
                    :left-icon="isEdit?'':'icon-back'" :left-icon-text="isEdit?'取消':''" @handleLeftClick="back"
                    :right-icon="isEdit&&(dvcXfList.length+dvcAjList.length)==0?'icon-delete':''"
                    @handleRightClick="removeSpot">
            <div class="header-right sp-header-right" slot="custom" v-show="!isEdit">
                <div class="right-icon icon icon-edit-header" @click="edit" v-if="isAdmin"></div>
                <div class="right-icon icon icon-history" @click="history"></div>
            </div>
        </mko-header>

        <div class="page-wrap device-spot-info-wrap" ref="wrapper" :style="{ height: wrapperHeight + 'px'}">
            <mko-form-cell :title="`${title}名称`" :val="info.name" v-model="formData.name" type="text"
                           :edit="isEdit"></mko-form-cell>
            <!--<mko-form-cell :title="`${title}位置`" :val="jzInfo" type="sel" :edit="isEdit" @click="goSelSpot(true)"></mko-form-cell>-->
            <mko-form-cell :title="`${title}位置`" :val="jzInfo" type="sel"></mko-form-cell>
            <mko-form-cell title="需要巡查" :val="(isEdit?formData.isC:info.isC)?'是':'否'" type="sel" :edit="isEdit"
                           @click="goSelIsC"></mko-form-cell>
            <mko-form-cell title="绑定二维码" :val="isBindDevice ? '已绑定（'+ qrcode +'）' : '绑定'" type="sel" :edit="isEdit"
                           @click="bindQRCode"></mko-form-cell>

            <!--tab-->
            <div class="tab-wrap">
                <div class="cell" :class="{'active':tabI==i}" v-for="(text,i) in tabItems" @click="tab(i)">
                    <span v-text="text"></span>
                </div>
            </div>

            <!--title-->
            <div class="title-wrap" @click="sel()">
                <div class="title fl" :class="isEdit?'is-edit':''" @click="goDvcAdd">
                    <div class="icon text-middle-1 icon-plus-blue" v-show="isEdit"></div>
                    {{isEdit ? '添加设备' : listTitle}}
                    <div class="sign" :class="isSel?'icon-link-arrow-down':'icon-link-arrow-up'" v-show="!isEdit"></div>
                </div>
                <div class="fr" v-show="tabI==0">共{{dvcXfList.length}}个</div>
                <div class="fr" v-show="tabI==1">共{{dvcAjList.length}}个</div>
            </div>

            <!--列表-->
            <div class="sel-wrap" @click.self="isSel=false" v-show="isSel">
                <mko-cell class="sel-item" title="全部" @click="getDvcList">
                    <div class="icon-tick-blue-1 fr" v-show="isSelAll"></div>
                </mko-cell>
                <mko-cell class="sel-item" :class="t.isSel?'active':''" :title="`只看${t.unitName}`" @click="selDvcList(i)"
                          v-show="tabI==0" v-for="(t,i) in dvcXfTypeList">
                    <div class="icon-tick-blue-1 fr" v-show="t.isSel"></div>
                </mko-cell>
                <mko-cell class="sel-item" :class="t.isSel?'active':''" :title="`只看${t.unitName}`" @click="selDvcList(i)"
                          v-show="tabI==1" v-for="(t,i) in dvcAjTypeList">
                    <div class="icon-tick-blue-1 fr" v-show="t.isSel"></div>
                </mko-cell>
            </div>
            <div class="list-wrap" v-show="tabI==0">
                <mko-cell :title="`${d.unitName||'未知设备'}${d.SSSBCode||''}`" :icon="d.STATUS|deviceStatusIconFilter"
                          :is-link="!isEdit" @click="go('/device/' + d.sssbId)" v-for="d in dvcXfList">
                    <span :class="statusColor[d.STATUS]">{{statusText[d.STATUS]}}</span>
                </mko-cell>
            </div>
            <div class="list-wrap" v-show="tabI==1">
                <mko-cell :title="`${d.unitName||'未知设备'}${d.SSSBCode||''}`" :icon="d.STATUS|deviceStatusIconFilter"
                          :is-link="!isEdit" @click="go('/device/' + d.sssbId)" v-for="d in dvcAjList">
                    <span :class="statusColor[d.STATUS]">{{statusText[d.STATUS]}}</span>
                </mko-cell>
            </div>

            <!--按钮-->
            <mko-button class="footer-btn" size="large" :disabled="!valid" no-radius @click="send" v-if="isEdit">
                保存
            </mko-button>
            <!--选择-->
            <sel-spot @sel="selSpotOnList" :selected-form="formData" v-if="$route.query.sel"></sel-spot>
            <mko-popup-bottom :title="popupTitle" v-model="popupShow" @save="selPickerVal" @cancel="popupShow=false">
                <mt-picker :slots="isCList" value-key="text" @change="onIsCChange"
                           v-show="popupTitle === '需要巡查'"></mt-picker>
            </mko-popup-bottom>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import conf from 'config'
    import {levelFr} from 'filters'
    import {NoData} from 'components'
    import {Toast, Indicator} from 'mint-ui'
    import selSpot from './selSpot.vue'
    //    let _page = 1;
    //    let _pageCount = 1;
    //    let _count = 20;
    //    let _totalCount = 0;
    let _scoTop = 0;
    let _enter = true;
    let _valid = ['name', 'jzName', 'jzId', 'level'];

    let _historyIsC = 0;
    let _listKey = ['dvcXfList', 'dvcAjList'];
    let _typeKey = ['dvcXfTypeList', 'dvcAjTypeList'];
    export default {
        data() {
            return {
                title: '巡查点',
                listTitle: '全部',
                isSelAll: true,
                isSel: false,
                isEdit: false,
                popupShow: false,
                wrapperHeight: 0,
                //tab
                tabI: 0,
                tabItems: ['消防设备', '安监设备'],
                //设备列表
                noData: false,
                dvcXfList: [],
                dvcXfTypeList: [],
                dvcAjList: [],
                dvcAjTypeList: [],
                //巡查点详情
                info: {
                    name: '',
                    jzName: '',
                    jzId: '',
                    level: '',
                    isC: true
                },
                //form
                formData: {
                    name: '',
                    jzName: '',
                    jzId: '',
                    level: '',
                    isC: ''
                },
                valid: false,
                //config
                statusText: conf.deviceStatus,
                statusColor: conf.deviceStatusColor,
                isCList: [
                    {flex: 1, values: [{text: '否', value: false}, {text: '是', value: true}]}
                ],
                popupTitle: '',
                isBindDevice: false,
                qrcode: ''
            }
        },
        watch: {
            formData: {
                handler() {
                    this.validForm();
                },
                deep: true
            },
            selPopupShow: function (val) {
                if (!val) {
                    document.body.style.overflow = 'auto'
                } else {
                    document.body.style.overflow = 'hidden'
                }
            },
            tabI(){
                this.getDvcList();
            }
        },
        computed: {
            jzInfo() {
                let info_f = `${this.formData.jzName},${levelFr(this.formData.level)}层`;
                let info = `${this.info.jzName},${levelFr(this.info.level)}层`;
                return this.isEdit ? info_f : info;
            },
            isAdmin() {
                return this.$store.state.user.isAdmin;
            }
        },
        mounted() {
            this.wrapperHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight) - this.$refs.wrapper.getBoundingClientRect().top;

        },
        activated() {
            window.addEventListener('scroll', this.handleScroll);
            this.setBackButton();

            let info = JSON.parse(sessionStorage.getItem(`spotInfo${this.$route.params.pid}`));
            this.info = {
                name: info.pos,
                jzName: info.jzName,
                jzId: info.jzId,
                level: info.level,
                isC: info.isC == 1
            };
            this.title = info.isC == 1 ? '巡查点' : '安装点';

            if (_enter || JSON.parse(sessionStorage.getItem('spotInfoIsUpdate'))) {
                scrollTo(0, 0);
                this.noData = false;
                this.getDvcList();
            } else {
                scrollTo(0, _scoTop);
            }
            if(this.$route.query.from && this.$route.query.from === 'qrcode') {
                this.isBindDevice = true;
            } else {
                this.isBindDevice = false;
            }
        },
        deactivated() {
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
            window.removeEventListener('scroll', this.handleScroll)
        },
        destroyed() {
        },
        methods: {
            levelFr,
            tab(i){
                this.tabI = i;
            },
            sel() {
                if (this.isEdit) {
                    return;
                }
                this.isSel = !this.isSel;
            },
            removeSpot(){
                Indicator.open({spinnerType: 'fading-circle'});

                let params = {
                    id: this.$route.params.pid
                };
                api.removePosition(params).then(res => {
                    Indicator.close();
                    if (res && res.code == 0) {
                        this.$MKODialog({
                            msg: '删除成功！'
                        }).then(msg => {
                            _enter = true;
                            this.$MKOPop();
                        });
                        sessionStorage.setItem(`spotInfoIsUpdate`, true);
                        this.isEdit = false;
                    } else {
                        this.$MKODialog({
                            msg: '删除失败！'
                        });
                    }
                })
            },
            edit() {
                this.isEdit = !this.isEdit;
                if (this.isEdit) {
                    let form = this.formData;
                    for (let key in form) {
                        form[key] = this.info[key];
                    }
                }
            },
            validForm() {
                for (let key of _valid) {
                    if (!this.formData[key] && this.formData[key] !== 0) {
                        this.valid = false;
                        return false;
                    }
                }
                this.valid = true;
            },
            goSelSpot(bool) {
                if (!this.isEdit)
                    return;
                if (bool) {
                    let path = this.$route.fullPath;
                    this.$MKOPush(path + '?sel=spot');
                } else {
                    this.$MKOPop();
                }
            },
            selSpotOnList(item) {
                this.formData.jzName = item.jzName;
                this.formData.jzId = item.jzId;
                this.formData.level = item.jzLevel;
            },
            goSelIsC() {
                if (!this.isEdit)
                    return;
                _historyIsC = this.formData.isC;
                this.isCList[0].defaultIndex = this.formData.isC ? 1 : 0;
                this.popupShow = true;
                this.popupTitle = '需要巡查';
            },
            selPickerVal() {
                if (this.popupTitle === '需要巡查') {
                    this.formData.isC = _historyIsC;
                }
                this.popupShow = false;
            },
            onIsCChange(picker, vals) {
                if (vals[0])
                    _historyIsC = vals[0].value;
            },
            send() {
                Indicator.open({spinnerType: 'fading-circle'});

                let pos_id = this.$route.params.pid;
                let pas = {
                    id: pos_id,
                    groupId: this.$store.getters.groupId,
                    jzID: this.formData.jzId,
                    jzLevel: this.formData.level,
                    jzPosition: this.formData.name,
                    isCheckPoint: this.formData.isC ? 1 : 0
                };
                api.updateDvcPosition(pas).then(res => {
                    if (res && res.code == 0) {
                        for (let key in this.formData) {
                            this.info[key] = this.formData[key];
                        }
                        sessionStorage.setItem(`spotInfo${pos_id}`, JSON.stringify(this.formData));
                        sessionStorage.setItem(`spotInfoIsUpdate`, true);
                        this.isEdit = false;
                    }
                    Indicator.close();
                })
            },
            getDvcTypeList() {
                let list = this[_listKey[this.tabI]];
                let t_list = [];
                list.forEach(item => {
                    for (let i in t_list) {
                        if (t_list[i].SSSB_UnitID == item.SSSB_UnitID) {
                            return;
                        }
                    }
                    t_list.push({
                        unitName: item.unitName,
                        SSSB_UnitID: item.SSSB_UnitID,
                        isSel: false
                    });
                });
                this[_typeKey[this.tabI]] = t_list;
            },
            getDvcList(unit_id) {
                Indicator.open({spinnerType: 'fading-circle'});
                if (!unit_id)
                    this.isSelAll = true;

                let params = {
                    groupId: this.$store.getters.groupId,
                    isCheck: 1,
                    id: this.$route.params.pid,
                    unitId: unit_id,
                    dep: this.tabI + 1
                };
                let list = _listKey[this.tabI];
                api.getDvcPositionInfo(params).then(result => {
                    Indicator.close();
                    if (result && result.code == 0) {
                        this[list] = result.response;
                        if (!unit_id)
                            this.getDvcTypeList();

                        if (this[list].length <= 0)
                            this.noData = true;

                        this.isSel = false;
                        sessionStorage.setItem(`spotInfoIsUpdate`, false);
                        _enter = false;
                    }
                })
            },
            selDvcList(index) {
                this.isSelAll = false;
                let t_list = this[_typeKey[this.tabI]];
                for (let i in t_list) {
                    t_list[i].isSel = false;
                }
                t_list[index].isSel = true;
                this.getDvcList(t_list[index].SSSB_UnitID);
            },
            goDvcAdd() {
                if (!this.isEdit)
                    return;

                let path = '/spot_add/dvc/' + this.$route.params.pid;
                this.$MKOPush(path)
            },
            go(path) {
                if (!this.isEdit)
                    this.$MKOPush(path)
            },
            handleScroll() {
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
                if (this.isEdit) {
                    this.isEdit = false;
                    return;
                }
                this.$MKOPop();
                _enter = true;
            },
            history() {
                let nextPath = `/xuncha/${0}/checkPorintLogList`;
                this.$MKOPush({
                    path: nextPath,
                    query: {
                        qiaoDaoXunChaTitle: '巡查点日志',
                        fixedPositionId: parseInt(this.$route.params.pid),
                        isCheckPorintLogList: true,
                        from: 'home',
                        fromPath: this.$route.fullPath
                    }
                })
            },
            bindQRCode() {
                if (!this.isEdit) return false;
                if (!this.isBindDevice) {
                    this.$ScanQRCode(result => {
                        let data = result.response;
                        if (data.length === 17) {
                            this.readerQRCode(data);
                        } else {
                            this.$MKODialog({msg: '无效二维码'});
                        }
                    })
                } else {
                    this.$MKODialog({
                        title: "确定解除绑定吗？",
                        msg: '解除绑定后，设备二维码将永久失效，且无法绑定其他设备',
                        cancelBtn: true,
                        cancelText: "取消"
                    }).then(msg => {
                        if (msg == "confirm") {
                            this.isBindDevice = false;
                        }
                    });
                }
            },
            readerQRCode(data) {
                //WX: '地区', E2: '设备类型', A1: '供应商', 16623: '设备投入使用日期', 122: '拓展码', Y01: '唯一标识'
                let area = data.substring(0, 2);
                let deviceType = data.substring(2, 4);
                let supplier = data.substring(4, 6);
                let installDate = data.substring(6, 11);
                let expandCode = data.substring(11, 14);
                let code = data.substring(14, 17);
                if (code === 'Y04') {
                    this.$MKODialog({ msg: '绑定成功' });
                    this.isBindDevice = true;
                    this.qrcode = code;
                } else {
                    this.$MKODialog({ msg: '无法绑定该二维码' });
                }
            }
        },
        components: {
            NoData, selSpot
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

    .device-spot-info-wrap {
        padding-bottom: 40px;
        .mko-form-cell {
            .sel-button {
                position: absolute;
                right: 14px;
                top: 15px;
            }
        }

        .tab-wrap {
            margin-top: 10px;
            width: 100%;
            height: 32px;
            background-color: #ffffff;
            .cell {
                width: 50%;
                float: left;
                height: 24px;
                line-height: 24px;
                text-align: CENTER;
                color: @mainBlue;
                &.active {
                    span {
                        border-bottom: 2px solid @mainBlue;
                        display: block;
                        width: 56px;
                        margin-left: auto;
                        margin-right: auto;
                    }
                }
                span {
                    font-size: 14px;
                }
            }
        }

        > .title-top-wrap {
            height: 34px;
            padding: 14px 14px 8px;
            line-height: 12px;
            font-size: 12px;
            letter-spacing: 0;
            background-color: @baseBG01;
            .label {
                color: @baseText02;
            }
            .btn {
                padding-left: 10px;
                color: @mainBlue;
            }
            .value {
                color: @baseText03;
            }
        }
        > .title-wrap {
            padding: 0 14px;
            height: 44px;
            line-height: 44px;
            font-size: 16px;
            letter-spacing: 0;
            background-color: #fff;
            color: @baseText01;
            .icon {
                position: absolute;
                left: 0;
            }
            .title {
                position: relative;
                &.is-edit {
                    padding-left: 36px;
                    color: @mainBlue;
                }
                .sign {
                    position: relative;
                    left: 7px;
                    top: -2px;
                }
            }
        }
        .sel-wrap {
            position: fixed;
            z-index: 1;
            top: @headerHeight+@headerTop+262px;
            bottom: 0;
            width: 100%;
            background-color: @baseMasking;
            .sel-item {
                background-color: @baseBG02;
            }
        }

        .badge {
            width: 50px;
            height: 20px;
            font-size: 12px;
            color: #ffffff;
            position: absolute;
            text-align: center;
            line-height: 20px;
            top: 0;
            bottom: 0;
            right: 14px;
            margin: auto;
            border-radius: 2px;
            z-index: 10;
        }
        .footer-btn {
            position: fixed;
            bottom: 0;
        }
    }
</style>
