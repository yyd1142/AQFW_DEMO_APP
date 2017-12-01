<template>
    <div class="bind-device">
        <div v-show="!$route.query.sel">
            <div class="placeholder-item white-placeholder"></div>
            <mko-header background-color="#ffffff" title-color="#333333" border-color="#eee" :title="isBindDevice ? '绑定设施设备' : '绑定巡查点'" left-icon="icon-back-black" @handleLeftClick="back">
            </mko-header>
            <div class="page-wrap">
                <img class="qr-code" :src="isBindDevice ? '/static/bindDevice_banner.png' : '/static/bindPosition_banner.png'"/>
                <mko-cell title="二维码类型" :val="isBindDevice ? '设施设备' : '巡查点'"></mko-cell>
                <mko-form-cell title="巡查点位置" :val="selSpot ? selSpot : '请选择'" :edit="true" type="sel" @click="goSelSpot(true)"></mko-form-cell>
                <mko-form-cell title="设备名称" :val="selDevice ? selDevice : '请选择'" :edit="true" type="sel" @click="goSelDevice(true)" v-if="isBindDevice && selSpot"></mko-form-cell>
                <div class="center-text">{{isBindDevice ? '绑定后，扫描该二维码可快速查看设备详情' : '绑定后，扫描该二维码可快速查看巡查点详情'}}</div>
                <mko-button size="large" @click="confirm">完成</mko-button>
            </div>
        </div>
        <sel-spot @sel="selSpotOnList" :selected-form="formData" v-if="$route.query.sel === 'spot'"></sel-spot>
        <sel-device :position-id="positionId" @sel="selDeviceOnList" :selected-form="formDeviceData" v-if="$route.query.sel === 'device'"></sel-device>
    </div>
</template>

<script>
    import { Toast } from 'mint-ui'
    import SelSpot from './components/selSpot.vue'
    import SelDevice from './components/selDevice.vue'
    export default {
        data() {
            return {
                selSpot: null,
                formData: [],
                formDeviceData: [],
                selDevice: null,
                positionId: ''
            }
        },
        computed: {
            isBindDevice() {
                return this.$route.query.isBindDevice;
            }
        },
        deactivated() {
           this.resetData()
        },
        methods: {
            back() {
                this.$MKOPop()
            },
            resetData () {
                Object.assign(this.$data, this.$options.data());
            },
            goSelSpot(bool){
                if (bool) {
                    let path = this.$route.fullPath;
                    this.$MKOPush(path + '&sel=spot');
                } else {
                    this.$MKOPop();
                }
            },
            goSelDevice(bool) {
                if (bool) {
                    let path = this.$route.fullPath;
                    this.$MKOPush(path + '&sel=device');
                } else {
                    this.$MKOPop();
                }
            },
            selSpotOnList(form){
                this.selSpot = `${form.jz.jzName},${form.jzLevel.label},${form.spot[0].jzPosition}`;
                this.positionId = form.spot[0].positionId;
            },
            selDeviceOnList(form) {
                this.formDeviceData = form;
                this.selDevice = form.device.unitName;
            },
            confirm() {
                if(this.isBindDevice) {
                    if(!this.selDevice) return false;
                    this.$MKODialog({
                        title: "提示",
                        msg: '绑定后此二维码将不能再绑定其他设备，确认绑定吗',
                        cancelBtn: true,
                        confirmText: '确认',
                        cancelText: "取消"
                    }).then(msg => {
                        if (msg == "confirm") {
                            Toast({message: "绑定成功", duration: 2000});
                            setTimeout(() => {
                                this.back();
                            }, 1500);
                        }
                    });
                } else {
                    if(!this.selSpot) return false;
                    this.$MKODialog({
                        title: "提示",
                        msg: '绑定后此二维码将不能再绑定其他巡查点，确认绑定吗',
                        cancelBtn: true,
                        confirmText: '确认',
                        cancelText: "取消"
                    }).then(msg => {
                        if (msg == "confirm") {
                            Toast({message: "绑定成功", duration: 2000});
                            setTimeout(() => {
                                this.back();
                            }, 1500);
                        }
                    });
                }
            }
        },
        components: {
            SelSpot,
            SelDevice
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .bind-device {
        .white-placeholder {
            background-color: #ffffff;
        }
        .page-wrap {
            margin-top: 0;
            .qr-code {
                width: 100%;
                height: auto;
                margin-left: auto;
                margin-right: auto;
                display: block;
            }
            .center-text {
                font-size: 12px;
                color: #666666;
                letter-spacing: 0;
                line-height: 12px;
                width: 100%;
                padding: 14px 0 14px 14px;
            }
            .footer-btn {
                position: fixed;
                bottom: 0;
            }
        }
        .mko-basic-cell >.cell >.value {
            flex: auto;
        }
    }
</style>
