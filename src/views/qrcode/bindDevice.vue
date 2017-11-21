<template>
    <div class="bind-device">
        <div v-show="!$route.query.sel">
            <div class="placeholder-item"></div>
            <mko-header :title="isBindDevice ? '绑定设施设备' : '绑定巡查点'" left-icon="icon-back" @handleLeftClick="back">
            </mko-header>
            <div class="page-wrap">
                <img class="qr-code" src="/static/image-square.png"/>
                <div class="center">绑定后扫描二维码可快速查看设备详情</div>
                <mko-form-cell title="编号" :val="$route.params.id"></mko-form-cell>
                <mko-form-cell title="类型" val="巡查点二维码"></mko-form-cell>
                <mko-form-cell title="绑定巡查点" :val="selSpot ? selSpot : '请选择'" :edit="true" type="sel"
                               @click="goSelSpot(true)"></mko-form-cell>
                <mko-form-cell title="绑定设备" :val="selDevice ? selDevice : '请选择'" :edit="true" type="sel"
                               @click="goSelDevice(true)" v-if="isBindDevice"></mko-form-cell>
                <mko-button class="footer-btn" size="large" @click="confirm" no-radius>确认</mko-button>
            </div>
        </div>
        <sel-spot @sel="selSpotOnList" :selected-form="formData" v-if="$route.query.sel === 'spot'"></sel-spot>
    </div>
</template>

<script>
    import { Toast } from 'mint-ui'
    import SelSpot from './components/selSpot.vue'
    export default {
        data() {
            return {
                selSpot: null,
                formData: [],
                selDevice: null
            }
        },
        computed: {
            isBindDevice() {
                return this.$route.query.isBindDevice;
            }
        },
        methods: {
            back() {
                this.$MKOPop()
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
                this.getDevices(form.spot[0].positionId)
            },
            confirm() {
                if (!this.selSpot) return false;
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
            },
            getDevices(positionId) {

            }
        },
        components: {
            SelSpot
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .bind-device {
        .page-wrap {
            .qr-code {
                width: 100px;
                height: 100px;
                margin-left: auto;
                margin-right: auto;
                display: block;
                margin-top: 30px;
            }
            .center {
                font-size: 14px;
                text-align: center;
                margin-top: 14px;
                color: #666;
                margin-bottom: 14px;
            }
            .footer-btn {
                position: fixed;
                bottom: 0;
            }
        }
    }
</style>
