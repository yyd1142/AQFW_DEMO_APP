<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="风险上报" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap hdc-main-wrap" v-show="onPage==='main'">

            <div class="data-wrap">
                <mko-cell title="风险单位" :val="userData.dwName"></mko-cell>
                <mko-form-cell title="风险位置" :val="formData.yhPosition"
                               type="sel" edit @click="changePage('selPosition')"></mko-form-cell>
                <mko-form-cell title="详细地址" v-model="formData.yhPositionDetail"
                               type="text" edit @input="onInputData" v-show="formData.yhPosition"></mko-form-cell>
            </div>
            <div class="content-wrap">
                <mko-textarea v-model="formData.yhDesc" type="outer" placeholder="请输入风险描述" @input="onInputData"></mko-textarea>
                <photo-box :photo-list="photoList" :max='8' @addPhotoEvent="sheetShow=true" @removePhotoEvent="removePhoto()"></photo-box>
            </div>
        </div>
        <div class="footer-wrap" v-show="onPage==='main'">
            <mko-button type="danger" size="large" :disabled="!formValid" no-radius @click="postHideDanger">确认故障</mko-button>
        </div>

        <!--选择页面-->
        <sel-position :dwId="groupId" @sel="selPosition" @changePage="backMainPage" v-if="onPage==='selPosition'"></sel-position>
        <!--<sel-level @changePage="onPage='main'" v-show="onPage==='selLevel'"></sel-level>-->
        <!--日期选择器-->
        <mt-datetime-picker ref="picker" type="date" :startDate="startDate" v-model="pickerVal" @confirm="getLimitedTime"></mt-datetime-picker>
        <!--添加图片-->
        <mt-actionsheet :actions="actions" v-model="sheetShow"></mt-actionsheet>
    </div>
</template>


<script>
    import { Indicator, Toast } from 'mint-ui';
    import moment from 'moment'
    import api from 'api'
    import apiconf from 'apiconf'
    import { PhotoBox } from 'components';
    import selPosition from './selPosition.vue';
    import * as types from '../../store/mutation-types'

    var isClick = false;
    export default {
        data() {
            return {
                //控制
                sheetShow: false,
                actions: [],
                onPage: this.$route.query.page || 'main',
                //数据
                photoList: [],
                formValid: false,
                bInputData: false,
                formData: {
                    yhPosition: '',
                    yhPositionDetail: '',
                    //          limitedTime: '',
                    yhDesc: '',
                    yhFilesID: '',
                    yhType: 1,
                    //          xtSupervise: '',
                    //          xtDWName: '',
                },
                showData: {
                    dwName: ''
                },
                xtFormData: {
                    xtId: [],
                    xtName: []
                },
                //日期选择
                pickerVal: '',
                startDate: new Date(),
                isOverflow: false
            }
        },
        watch: {
            onPage: function (page) {
                window.mkoBackButton.bInputData = page == 'main';
            },
            formData: {
                handler: function () {
                    this.formValidFn();
                },
                deep: true
            },
            $route() {
                this.onPage = this.$route.query.page || 'main';
            }
        },
        computed: {
            groupId() {
                return this.$store.getters.groupId;
            },
            userData() {
                let local = localStorage['USER_DATA'];
                if (local && local.length > 0) {
                    return JSON.parse(local);
                } else {
                    return false
                }

            }
        },
        mounted() {
            this.actions = [{
                name: '拍照',
                method: this.takePhoto
            }, {
                name: '从相册中选择',
                method: this.choosePhoto
            }];
        },
        deactivated() {
            window.mkoBackButton.bInputData = false;
        },
        methods: {
            //选择
            selDw(val) {
                this.formData.yhPosition = '';
                this.formData.xtSupervise = '';
                this.formData.xtDWName = '';
                this.formData.groupId = val.groupId;
                this.showData.dwName = val.dwName;
            },
            selPosition(val) {
                this.formData.yhPosition = val.build + '' + val.floor;
            },
            selXt(form) {
                this.xtFormData = JSON.parse(JSON.stringify(form));
                this.formData.xtSupervise = form.xtId.join(',');
                this.formData.xtDWName = form.xtName.join(',');
            },
            changePage(page) {
                this.$MKOPush(`/hidden_danger_check?page=${page}`);
                this.onInputData()
            },
            onXtPage() {
                this.onPage = 'selXt';
                let xtPage = this.$refs.selXtPage;
                if (xtPage.xtList.length === 0) {
                    xtPage.getData();
                } else {
                    xtPage.checkSelItem();
                }
            },
            ctrlDatePicker() {
                this.$refs.picker.open();
            },
            getLimitedTime() {
                this.formData.limitedTime = moment(this.pickerVal).format("YYYY-MM-DD");
            },
            //照片
            takePhoto() {
                this.$takePhoto((photo) => {
                    this.photoList.push(photo.url);
                })
                this.onInputData()
                if (!this.isOverflow && this.photoList.length >= 4) {
                    this.isOverflow = true;
                }
            },
            choosePhoto() {
                this.$choosePhoto((photos) => {
                    for (let photo of photos) {
                        this.photoList.push(photo.url);
                    }
                })
                this.onInputData()
                if (!this.isOverflow && this.photoList.length >= 4) {
                    this.isOverflow = true;
                }
            },
            removePhoto(index) {
                this.photoList.splice(index, 1);
                if (this.isOverflow && this.photoList.length <= 4) {
                    this.isOverflow = false;
                }
            },
            //filters
            formatDate(date) {
                if (!date) {
                    return ''
                }
                date = moment(date).format('YYYY-MM-DD');
                return date;
            },
            //表单
            formValidFn() {
                let data = this.formData;
                let NonValid = {
                    yhFilesID: 1,
                    xtSupervise: 1,
                    xtDWName: 1
                };
                for (let key in data) {
                    if (!NonValid[key] && data[key] === "") {
                        this.formValid = false;
                        return;
                    }
                }
                this.formValid = true;
            },
            postHideDanger() {
                let form = this.formData;
                for (let i in form) {
                    if (i != 'yhFilesID') {
                        if (form[i] == '') {
                            return false;
                        }
                    }
                }
                if (this.photoList.length == 0) {
                    Toast({
                        message: '请拍照上传',
                        duration: 1000
                    });
                    return false;
                }
                if (isClick) {
                    return false;
                }
                isClick = true;
                let self = this;
                form['groupId'] = this.groupId;
                form["yhPosition"] = `${form.yhPosition},${form.yhPositionDetail}`
                form['userName'] = this.$store.getters.userName
                form['sbGroupId'] = this.$store.getters.groupId
                let doUploadSuccess = function (resourceId) {
                    if (resourceId != '') {
                        form['yhFilesID'] = resourceId;
                    }
                    api.addYhk(form).then(res => {
                        Indicator.close();
                        if (res) {
                            self.$MKODialog({
                                msg: '上报成功'
                            }).then(res => {
                                if (res === 'confirm') {
                                    window.mkoBackButton.bInputData = false;
                                    self.resetData();
                                    self.$MKOJump('/enter/home');
                                }
                            });
                        } else {
                            Toast({
                                message: '提交失败',
                                duration: 1000
                            });
                        }
                    });
                };
                let doDumpYHKData = function () {
                    if (self.photoList.length <= 0) {
                        doUploadSuccess('');
                        return;
                    }
                    let uploadURL = `${apiconf.resourcesDomain}/uploads`;
                    self.$uploadImages(self.photoList, uploadURL, function (result) {
                        isClick = false;
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
                // doUploadSuccess('');
                this.$getMobileNetworkType(function (result) {
                    if (result == "unknown") {
                        self.$MKODialog({msg: '当前网络不可用，请确保网络正常...'});
                        return;
                    } else if (result == "3G/4G") {
                        let opts = {
                            title: '提示',
                            msg: '当前3G/4G网络，提交数据会消耗流量，建议WIFI环境下上传。',
                            cancelBtn: true,
                            confirmText: '立即提交',
                            cancelText: '稍后提交'
                        }
                        self.$MKODialog(opts).then(action => {
                            if (action != 'confirm')
                                return;
                            doDumpYHKData();
                        });
                    } else if (result == "wifi") {
                        doDumpYHKData();
                    }
                });
            },
            back() {
                for (let key in this.formData) {
                    if (key != 'yhType') {
                        if (this.formData[key] != '') {
                            this.bInputData = true
                            break
                        }
                    }
                }
                if (this.bInputData == false) {
                    this.resetData();
                    this.$MKOPop();
                } else {
                    this.$MKODialog({
                        title: '确定要返回吗?',
                        msg: '此页面信息将被清空',
                        cancelBtn: true,
                    }).then(action => {
                        if (action === 'confirm') {
                            window.mkoBackButton.bInputData = false;
                            this.resetData();
                            this.$MKOPop();
                        }
                    });
                }
            },
            backMainPage() {
                this.onPage = 'main'
            },
            resetData() {
                isClick = false;
                this.isOverflow = false;
                this.bInputData = false
                this.photoList = [];
                this.formData = {
                    yhPosition: '',
                    yhPositionDetail: '',
                    yhDesc: '',
                    yhFilesID: '',
                    yhType: 1
                }
            },
            onInputData() {

                let self = this;
                this.bInputData = true;
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                window.mkoBackButton.callback = function (action) {
                    self.$MKODialog({
                        title: '真的要返回吗',
                        msg: '此页面信息将被清空',
                        cancelBtn: true,
                    }).then(action => {
                        if (action === 'confirm') {
                            window.mkoBackButton.bInputData = false;
                            self.resetData();
                            self.$MKOPop();
                        }
                    });
                }
            }
        },
        components: {
            selPosition,
            PhotoBox
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .hdc-main-wrap {
        padding-bottom: 0;
        .content-wrap {
            margin-top: 10px;
            .mko-text-area {
                padding-bottom: 0;
            }
        }
    }

    .footer-wrap {
        width: 100%;
        bottom: 0;
        position: fixed;
        z-index: 20;
        margin: AUTO;
    }
</style>
