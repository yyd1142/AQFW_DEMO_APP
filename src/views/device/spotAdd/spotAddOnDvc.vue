<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="`${title}信息`" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap xc-spot-add-dvc-wrap" ref="wrapper" :style="{ height: wrapperHeight + 'px'}">
            <div class="photo-wrap" v-show="!onlyDvc&&photo">
                <div class="photo" :style="{ background: 'url('+ photo +') 0 0 no-repeat' }">
                </div>
                <div class="btn" @click="takePhoto">重拍</div>
            </div>
            <spot-info ref="spot-info" :parentsForm="formData" v-model="spotInfoOnSelJz" @save="getSpotInfo" v-if="!onlyDvc"></spot-info>
            <dvc-type ref="dvc-type" :parentsForm="formData" @save="getDvcType"></dvc-type>
            <dvc-count ref="dvc-count" v-model="formData.dvc" :dvc-rate="formData.rate" @save="getDvcCount"></dvc-count>
            <mko-button size="large" @click="send" v-show="isConfirm">保存</mko-button>
        </div>
        <mt-actionsheet :actions="actions" v-model="sheetShow"></mt-actionsheet>
    </div>
</template>

<script>
    import api from 'api'
    import apiconf from 'apiconf'
    import { Indicator, Toast } from 'mint-ui'
    import spotInfo from './components/spotInfo.vue';
    import dvcType from './components/dvcType.vue';
    import dvcCount from './components/dvcCount.vue';

    let _errText = '新增信息出错，请重试！';
    export default {
        data () {
            return {
                title: '巡查点',
                wrapperHeight: 0,
                onlyDvc: false,
                spotInfoOnSelJz: false,
                formData: {
                    dvc: [],
                    rate: {}
                },
                confirm: [],
                isConfirm: false,
                //照片
                photo: '',
                actions: [],
                sheetShow: false,
            }
        },
        watch: {
//      confirm: {
//        handler(arr) {
//          for (let bool of arr) {
//            if (!bool)
//              return;
//          }
//          this.isConfirm = true;
//        },
//        deep: true
//      },
        },
        computed: {},
        mounted() {
            this.wrapperHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight) - this.$refs.wrapper.getBoundingClientRect().top;
            this.actions = [{
                name: '拍照',
                method: this.takePhoto
            }, {
                name: '从相册中选择',
                method: this.choosePhoto
            }];
        },
        activated(){
            this.setBackButton();
            this.onlyDvc = this.$route.params.spotId ? true : false;
            if (this.onlyDvc) {
                this.title = '设施设备';
                this.confirm = [false, false];
            } else {
                this.title = this.$route.query.from ? '安装点' : '巡查点';
                this.confirm = [false, false, false];
                this.photo = sessionStorage.getItem('xcSpotAddPhoto');
//                this.photo = '/static/icons/resource.png';
            }
        },
        deactivated() {
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
            sessionStorage.removeItem('xcSpotAddPhoto');
            Indicator.close();
        },
        destroyed(){
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
            sessionStorage.removeItem('xcSpotAddPhoto');
        },
        methods: {
            takePhoto(){
                this.$takePhoto((photo) => {
                    this.photo = photo.url;
                    sessionStorage.setItem('xcSpotAddPhoto', photo.url);
                })
            },
            choosePhoto(){
                this.$choosePhoto((photos) => {
                    this.photo = photos[0].url;
                    sessionStorage.setItem('xcSpotAddPhoto', photos[0].url);
                })
            },
            getSpotInfo(obj){
                for (let key in obj) {
                    this.formData[key] = obj[key];
                }
                this.confirm[0] = true;
                this.watchConfirm();
                this.$refs['dvc-type'].isFold = false;
            },
            getDvcType(obj){
                this.formData.rate = obj.rate;

                let f_dvc = [];
                obj.dvc.forEach(item => {
                    item.count = 1;
                    f_dvc.push(item)
                });
                for (let f_i in f_dvc) {
                    for (let i in this.formData.dvc) {
                        if (this.formData.dvc[i].unitID == f_dvc[f_i].unitID) {
                            f_dvc[f_i].count = this.formData.dvc[i].count;
                            break;
                        }
                    }
                }
                this.formData.dvc = JSON.parse(JSON.stringify(f_dvc));
                this.confirm[this.confirm.length - 2] = true;
                this.watchConfirm();
                this.$refs['dvc-count'].isFold = false;
            },
            getDvcCount(){
                this.confirm[this.confirm.length - 1] = true;
                this.watchConfirm();
            },
            watchConfirm(){
                for (let bool of this.confirm) {
                    if (!bool)
                        return;
                }
                this.isConfirm = true;
            },
            valid(){
                let count = 0;
                this.formData.dvc.forEach(item => {
                    count += parseInt(item.count);
                });
                return count > 100 ? false : true;
            },
            send(){
                if (!this.valid()) {
                    this.$MKODialog({msg: '一个巡查点/安装点最多只能添加100个设备'})
                    return;
                }
                Indicator.open({spinnerType: 'fading-circle'});
                let g_id = this.$store.getters.groupId;
                let f = this.formData;
                let that = this;

                let addPosFn = function (photoId) {
                    let device = f.dvc.map(item => {
                        return {
                            SSSB_SystemID: item.systemID,
                            SSSB_UnitID: item.unitID,
                            patrolFrequency: f.rate.value,
                            number: item.count,
                        }
                    });
                    
                    let obj = {
                        build: {
                            jzName: f.jzName,  //建筑名称必填
                            jzID: f.jzId || '',        //只有修改的时候填写jzID
                            jzLevel: f.jzLevel   //建筑楼层，正数为地上楼层，负数为地下
                        },
                        position: {
                            jzPosition: f.name  //位置点必填
                        },
                        device: device,
                    };

                    if (photoId)
                        obj.photoId = photoId;

                    api.addDvcPositionInAll(obj).then(res => {
                        if (res && res.code == 0) {
                            that.sendSucc();
                        }
                        Indicator.close();
                    })
                };

                let postPhoto = function () {
                    if (!that.photo) {
                        addPosFn('');
                        return;
                    }
                    let images = [];
                    images.push(that.photo);
                    let uploadURL = `${apiconf.resourcesDomain}/uploads`;
                    that.$uploadImages(images, uploadURL, function (result) {
                        if (result.error && result.error.length > 0) {
                            Indicator.close();
                            Toast({
                                message: '图片上传失败',
                                duration: 1000
                            });
                        }
                        if (result.resourceId && result.resourceId.length > 0) {
                            addPosFn(result.resourceId);
                        } else {
                            addPosFn('');
                        }
                    });
                };

                let dvcFn = function (pos_id) {
                    let dvc = f.dvc.map(item => {
                        return {
                            brand: '',
                            model: '',
                            installDate: '',
                            checkFrequency: '',
                            maintainFrequency: '',
                            groupId: g_id,
                            SSSB_SystemID: item.systemID,
                            SSSB_UnitID: item.unitID,
                            positionId: pos_id,
                            patrolFrequency: f.rate.value,
                            number: JSON.parse(item.count)
                        }
                    });
                    api.addDvc(dvc).then(res => {
                        if (res && res.code == 0) {
                            that.sendSucc();
                        }
                        Indicator.close();
                    })
                };

                if (this.onlyDvc) {
                    dvcFn(this.$route.params.spotId);
                } else {
                    postPhoto();
                }
            },
            sendSucc(){
                if (this.onlyDvc) {
                    this.$MKODialog({msg: '保存成功！'}).then(res => {
                        this.$MKOPop();
                        sessionStorage.setItem(`spotInfoIsUpdate`, true);
                        this.$destroy();
                    });
                    return;
                }

                this.$MKODialog({
                    title: '保存成功',
                    msg: `<div class="text-center">你已成功创建${this.title}，是否继续创建？</div>`,
                    cancelBtn: true,
                    cancelText: '完成',
                    confirmText: '继续创建',
                }).then(msg => {
                    if (msg == 'confirm') {
                        let path = this.$route.fullPath;
                        this.$MKOPop();
//                        if (this.onlyDvc) {
//                            this.$nextTick(() => {
//                                this.$MKOPush(path);
//                            });
//                        }
                    } else {
//                        if (this.onlyDvc)
//                            this.$MKOPop();
                        this.$MKOPop(2);
                    }
                    sessionStorage.setItem(`spotInfoIsUpdate`, true);
                    this.$destroy();
                })
            },
            setBackButton() {
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                if (window.mkoBackButton.bInputData) {
                    window.mkoBackButton.callback = this.back;
                }
            },
            back(){
                if (this.spotInfoOnSelJz) {
                    this.$MKOPop();
                    return;
                }
                if (this.sheetShow) {
                    this.sheetShow = false;
                    return;
                }
                this.$MKODialog({
                    title: '确定返回吗？',
                    msg: '<div class="text-center">当前编辑的信息不保存，是否确定返回？</div>',
                    cancelBtn: true,
                    cancelText: '取消',
                    confirmText: '确定',
                }).then(msg => {
                    if (msg == 'confirm') {
                        if (this.onlyDvc) {
                            this.$MKOPop();
                        } else {
                            this.$MKOPop();
                            this.$MKOPop();
                        }
                        this.$destroy();
                    }
                })
            }

        },
        components: {
            spotInfo, dvcType, dvcCount
        }
    }
</script>

<style lang="less" rel="stylesheet/less" src="./index.less"></style>
