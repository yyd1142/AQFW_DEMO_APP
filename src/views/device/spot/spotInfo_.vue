<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="`${title}详情`" :left-icon="isEdit?'':'icon-back'" :left-icon-text="isEdit?'取消':''"
                    :right-icon-text="isEdit?'':'编辑'"
                    @handleLeftClick="back" @handleRightClick="edit"></mko-header>

        <div class="page-wrap spot-info-wrap" ref="wrapper" :style="{ height: wrapperHeight + 'px'}">
            <!--<mko-cell title="巡查记录" val="14条" @click="go(`/xc_repo_list/${$route.params.pid}`)" is-link></mko-cell>-->

            <mko-form-cell :title="`${title}名称`" :val="info.name" v-model="formData.name"
                           type="text" :edit="isEdit"></mko-form-cell>
            <mko-form-cell :title="`${title}位置`" :val="jzInfo" type="sel" :edit="isEdit" @click="goSelSpot(true)"></mko-form-cell>
            <mko-form-cell title="需要巡查" :val="(isEdit?formData.isC:info.isC)?'是':'否'"
                           type="sel" :edit="isEdit" @click="goSelIsC"></mko-form-cell>

            <!--<div class="title-top-wrap">-->
            <!--<div class="label fl">设备列表</div>-->
            <!--<div class="btn fl" @click="goDvcAdd">添加设备</div>-->
            <!--<div class="value fr">设备状态</div>-->
            <!--</div>-->
            <div class="title-wrap" @click="sel()">
                <div class="title fl" :class="isEdit?'is-edit':''" @click="goDvcAdd">
                    {{isEdit ? '添加设备' : listTitle}}
                    <div class="sign" :class="isSel?'icon-link-arrow-down':'icon-link-arrow-up'" v-show="!isEdit"></div>
                </div>
                <div class="fr">共{{totalCount}}个</div>
            </div>
            <div class="sel-wrap" v-show="isSel">

            </div>
            <mt-loadmore ref="loadmore" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange"
                         :bottom-all-loaded="bottomAllLoaded" :auto-fill="autoFill">
                <div class="list-wrap">
                    <mko-cell :title="`${d.unitName||'未知设备'}${d.SSSBCode||''}`" @click="go('/device/' + d.id)" :is-link="!isEdit" v-for="d in dvcList">
                        <span :class="statusColor[d.status]" v-text="statusText[d.status]"></span>
                    </mko-cell>
                </div>

            </mt-loadmore>
            <mko-button class="footer-btn" size="large" :disabled="!valid" no-radius @click="send" v-if="isEdit">
                保存
            </mko-button>
            <!--选择-->
            <sel-spot @sel="selSpotOnList" :selected-form="formData" v-if="$route.query.sel"></sel-spot>
            <mko-popup-bottom title="需要巡查" v-model="popupShow" @save="selPickerVal" @cancel="popupShow=false">
                <mt-picker :slots="isCList" value-key="text" @change="onIsCChange" v-if="popupShow"></mt-picker>
            </mko-popup-bottom>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import { levelFr } from 'filters'
    import { NoData } from 'components'
    import { Toast, Indicator } from 'mint-ui'
    import selSpot from './selSpot.vue'
    let _page = 1;
    let _pageCount = 1;
    let _count = 20;
    let _totalCount = 0;
    let _scoTop = 0;
    let _enter = true;
    let _valid = ['name', 'jzName', 'jzId', 'level'];

    let _historyIsC = 0;
    export default {
        data () {
            return {
                title: '巡查点',
                listTitle: '全部',
                isSel: false,
                isEdit: false,
                popupShow: false,
                wrapperHeight: 0,
                //load-more
                autoFill: false,
                bottomAllLoaded: false,
                topStatus: '',
                bottomStatus: '',
                //数据
                noData: false,
                totalCount: 0,
                dvcList: [],
                dvcTypeList: [],
                info: {
                    name: '',
                    jzName: '',
                    jzId: '',
                    level: '',
                    isC: ''
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
                statusText: ['未知', '正常', '故障', '维修', '停用'],
                statusColor: ['', 'base-text-01', 'text-danger', 'text-warning', 'base-text-03'],
                isCList: [
                    {flex: 1, values: [{text: '否', value: false}, {text: '是', value: true}]}
                ],
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
        },
        computed: {
            jzInfo(){
                let info_f = `${this.formData.jzName},${levelFr(this.formData.level)}层`;
                let info = `${this.info.jzName},${levelFr(this.info.level)}层`;
                return this.isEdit ? info_f : info;
            },
        },
        mounted() {
            this.wrapperHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight) - this.$refs.wrapper.getBoundingClientRect().top;

        },
        activated(){
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

            if (_enter || JSON.parse(sessionStorage.getItem('spotInfoIsUpdate'))) {
                scrollTo(0, 0);
                this.bottomAllLoaded = false;
                this.noData = false;
                _page = 1;
                this.getDvcList();
            } else {
                scrollTo(0, _scoTop);
            }
        },
        deactivated() {
            this.isEdit = false;
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
            window.removeEventListener('scroll', this.handleScroll)
        },
        destroyed(){
        },
        methods: {
            levelFr,
            sel(){
                if (this.isEdit) {
                    return;
                }
                this.isSel = !this.isSel;
            },
            edit(){
                this.isEdit = !this.isEdit;
                if (this.isEdit) {
                    let form = this.formData;
                    for (let key in form) {
                        form[key] = this.info[key];
                    }
                }
            },
            validForm(){
                for (let key of _valid) {
                    if (!this.formData[key] && this.formData[key] !== 0) {
                        this.valid = false;
                        return false;
                    }
                }
                this.valid = true;
            },
            goSelSpot(bool){
                if (!this.isEdit)
                    return;
                if (bool) {
                    let path = this.$route.fullPath;
                    this.$MKOPush(path + '?sel=spot');
                } else {
                    this.$MKOPop();
                }
            },
            selSpotOnList(item){
                this.formData.jzName = item.jzName;
                this.formData.jzId = item.jzId;
                this.formData.level = item.jzLevel;
            },
            goSelIsC(){
                if (!this.isEdit)
                    return;
                _historyIsC = this.formData.isC;
                this.isCList[0].defaultIndex = this.formData.isC ? 1 : 0;
                this.popupShow = true;
            },
            selPickerVal(){
                this.formData.isC = _historyIsC;
                this.popupShow = false;
            },
            onIsCChange(picker, vals){
                _historyIsC = vals[0].value;
            },
            send(){
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
            getDvcTypeList(){

            },
            getDvcList(){
                let params = {
                    m: 'list',
                    page: _page,
                    count: _count,
                    groupId: this.$store.getters.groupId,
                    positionId: this.$route.params.pid
                };

                if (_page == 1)
                    Indicator.open({spinnerType: 'fading-circle'});

                api.dwFacilities(params).then(result => {
                    this.$refs.loadmore.onTopLoaded();
                    Indicator.close();
                    if (result && result.code == 0) {

                        if (_page == 1) {
                            this.dvcList = result.response.datas;
                        } else {
                            result.response.datas.forEach(item => {
                                this.dvcList.push(item)
                            })
                        }

                        if (this.dvcList.length <= 0)
                            this.noData = true;

//                        _page = parseInt(result.response.page);
//                        _pageCount = JSON.parse(result.response.pageCount);
                        sessionStorage.setItem(`spotInfoIsUpdate`, false);
                        this.totalCount = parseInt(result.response.countNumber);
                        if (this.dvcList.length >= this.totalCount)
                            this.bottomAllLoaded = true;

                        _enter = false;
                    }
                })
            },
            loadBottom() {
                if (this.dvcList.length >= this.totalCount) {
                    Toast({
                        message: '暂无更多数据',
                        position: 'middle',
                        duration: 1500
                    });
                    this.bottomAllLoaded = true;
                    this.$refs.loadmore.onBottomLoaded();
                    return false;
                }
                _page++;
                this.getDvcList();
            },
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            handleScroll() {
                this.$nextTick(() => {
                    _scoTop = document.documentElement.scrollTop || document.body.scrollTop;
                    let totalHeight = this.$refs['pageWrapper'].offsetHeight;
                    let scrollTop = document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
                    let clientHeight = 0;
                    if (document.body.clientHeight && document.documentElement.clientHeight) {
                        clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
                    } else {
                        clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
                    }
                    let scrollBottom = totalHeight - scrollTop - clientHeight;
                    this.bottomAllLoaded = scrollBottom <= 0 ? false : true;
                })
            },
            goDvcAdd(){
                if (!this.isEdit)
                    return;

                let path = '/spot_add/dvc/' + this.$route.params.pid;
                this.go(path);
            },
            go(path){
                if (this.bottomStatus == 'drop' || this.bottomStatus == 'loading') {
                    return false;
                }
                this.$MKOPush(path)
            },
            setBackButton() {
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                if (window.mkoBackButton.bInputData) {
                    window.mkoBackButton.callback = this.back;
                }
            },
            back(){
                if (this.isEdit) {
                    this.isEdit = false;
                    return;
                }
                this.$MKOPop();
                _enter = true;
            }
        },
        components: {
            NoData, selSpot
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .spot-info-wrap {
        padding-bottom: 0;
        .mko-form-cell {
            .sel-button {
                position: absolute;
                right: 14px;
                top: 15px;
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
            margin-top: 10px;
            padding: 0 14px;
            height: 44px;
            line-height: 44px;
            font-size: 16px;
            letter-spacing: 0;
            background-color: #fff;
            color: @baseText01;
            .title {
                position: relative;
                &.is-edit {
                    padding-left: 36px;
                    color: @mainBlue;
                }
                .sign {
                    position: absolute;
                    right: -19px;
                    top: 14px;
                }
            }

        }
        .sel-wrap {
            position: fixed;
            z-index: 1;
            top: @headerHeight+@headerTop+186px;
            bottom: 0;
            width: 100%;
            background-color: @baseMasking;
            .masking {

            }

        }
        .list-wrap {
            position: relative;
            z-index: -1;
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
