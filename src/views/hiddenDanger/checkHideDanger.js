import { Toast } from 'mint-ui';
import api from 'api'
import { PhotoBox, XunChaStatus } from 'components';
import { mapGetters } from 'vuex'
import * as types from '../../store/mutation-types'
import apiconf from 'apiconf'
import zhiban from 'store/modules/zhiban'
var _groupId = ''
var isClick = false;
export default {
    data() {
        return {
            popupShow: false,
            sheetShow: false,
            bInputData: false,
            location: [],
            options: {
                build: [],
                floor: []
            },
            formValid: false,
            formData: {
                jzInfo: {},
                build: "",
                floor: "",
                address: "",
                desc: '',
                photoId: []
            },
            actions: [],
            photos: [],
            wrapperHeight: '',
            changedHeight: 0,
            callback: '',
            button: null
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
        this.wrapperHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight) - this.$refs.wrapper.getBoundingClientRect().top;
    },
    activated() {
        this.wrapperHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight) - this.$refs.wrapper.getBoundingClientRect().top;
        this.$nextTick(() => {
            if (this.$store.getters.groupId != _groupId) {
                this.jzList()
            }
        });
    },
    deactivated() {
        this.bInputData = false;
        this.changedHeight = 0;
        window.mkoBackButton.bInputData = false;
    },
    watch: {
        formData: {
            handler: function () {
                this.formValidFn();
            },
            deep: true
        },
        'formData.build': function (val) {
            this.location.forEach(item => {
                if (item.id === val) {
                    this.options.floor = item.floor;
                }
            })
        },
        bInputData: function (val) {
            if (val) this.setBackButton()
        }
    },
    computed: {
        selectedBuild() {
            let build = "";
            this.location.forEach(item => {
                if (this.formData.build == item.id) {
                    build = item.build;
                }
            });
            return build;
        },
        zhibanStatusInfo() {
            if (this.$store.state.zhiban) {
                return this.$store.getters.zhibanStatusInfo;
            } else {
                return null;
            }
        }
    },
    methods: {
        // 拍照
        takePhoto() {
            this.$takePhoto((photo) => {
                this.setBackButton('input')
                this.photos.push(photo.url);
            })
        },
        // 选照片
        choosePhoto() {
            this.$choosePhoto((photos) => {
                if(photos.length == 9) photos.splice(8, 1);
                this.setBackButton('input');
                for (let photo of photos) {
                    this.photos.push(photo.url);
                }
            })
        },
        removePhoto(index) {
            this.photos.splice(index, 1);
        },
        chooseJZ(item) {
            this.changedHeight = 144;
            this.formData.build = item.value;
            this.formData.jzInfo = item;
        },
        formValidFn() {
            let data = this.formData;
            for (let key in data) {
                if (data[key] === "" && key != 'photoId') {
                    this.formValid = false;
                    return;
                }
            }
            this.formValid = true;
        },
        confirm() {
            this.popupShow = false;
            this.setBackButton('input');
        },
        submit() {
            for (let j in this.formData) {
                if (j != 'photoId') {
                    if (this.formData[j] == '') {
                        return false;
                    }
                }
            }
            if (this.photos.length <= 0) {
                Toast({
                    message: '请拍照上传',
                    duration: 1000
                });
                return false;
            }
            if (isClick) {
                return false;
            }
            isClick = true
            let self = this;
            let doUploadSuccess = function (resourceId) {
                let params = {
                    "groupId": self.$store.getters.groupId,
                    "yhType": 1,
                    "yhDesc": self.formData.desc,
                    "yhPosition": `${self.formData.jzInfo.label},${self.formData.floor}楼,${self.formData.address}`,
                    "userName": self.$store.getters.userName,
                    "sbGroupId": self.$store.getters.groupId,
                    "taskId": self.$route.params.zbId
                }
                if (resourceId != '') {
                    params['yhFilesID'] = resourceId;
                }
                api.uploadHideDanger(params).then(result => {
                    if (!result) return false
                    if (result.code == 0) {
                        Toast({
                            message: '提交成功',
                            duration: 1000
                        });
                        setTimeout(() => {
                            window.mkoBackButton.bInputData = false;
                            self.resetData()
                            self.$MKOPop();
                        }, 1500);
                    } else {
                        Toast({
                            message: '提交数据失败',
                            duration: 1000
                        });
                    }
                })
            };
            // doUploadSuccess('3d563907bfdd43b290e913679922c7c404000000')
            let doDumpYHKData = function () {
                if (self.photos.length <= 0) {
                    doUploadSuccess('');
                    return;
                }
                let uploadURL = `${apiconf.resourcesDomain}/uploads`;
                self.$uploadImages(self.photos, uploadURL, function (result) {
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
            }


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
        back(type) {
            if (!this.bInputData) {
                this.$MKOPop();
                return;
            }
            this.$MKODialog({
                title: '真的要返回吗?',
                msg: '此页面信息将被清空',
                cancelBtn: true,
            }).then(action => {
                if (action === 'confirm') {
                    window.mkoBackButton.bInputData = false;
                    this.resetData();
                    this.$MKOPop();
                }
            });
        },
        jzList() {
            let params = {
                m: 'list',
                groupId: this.$store.getters.groupId
            }
            api.getJZList(params).then(result => {
                _groupId = this.$store.getters.groupId
                if (!result)
                    return;
                let datas = result.response;
                datas.forEach((item) => {
                    let jzDSNumber = item.jzDSNumber;
                    let jzDXNumber = item.jzDXNumber;
                    let arr1 = [];
                    let arr2 = [];
                    for (let i = 1; i <= jzDSNumber; i++) {
                        arr1.push(i);
                    }
                    for (let i = 1; i <= jzDXNumber; i++) {
                        arr2.push(-i);
                    }
                    this.location.push({id: item.jzID, build: item.jzName, floor: arr2.concat(arr1)})
                })
                this.options.build = this.location.map(item => {
                    return {label: item.build, value: item.id};
                });
            })
        },
        resetData() {
            isClick = false;
            this.formValid = false;
            this.bInputData = false;
            this.formData = {
                jzInfo: {},
                build: "",
                floor: "",
                address: "",
                desc: '',
                photoId: []
            }
            this.photos = [];
            this.options.floor = []
        },
        setBackButton(type) {
            let self = this;
            window.mkoBackButton = {};
            if (!this.popupShow) {
                this.bInputData = true;
                window.mkoBackButton.callback = function (action) {
                    self.$MKODialog({
                        title: '确定要返回吗?',
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
            } else {
                window.mkoBackButton.callback = function () {
                    self.popupShow = false;
                }
            }
            window.mkoBackButton.bInputData = this.popupShow || this.bInputData;
        }
    },
    components: {
        PhotoBox,
        XunChaStatus
    }
}
