<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="title" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap xc-spot-add-wrap">
            <div class="title">一键创建</div>
            <div class="contact">根据你日常巡查习惯进行创建巡查点与设备，<br>请到达巡查点后点击下方拍照按钮添加巡查点，<br>未指定执行人员的巡查点所有人均可执行。</div>
            <div class="photo-btn-wrap mof-clear" @click="takePhoto">
                <div class="bg icon-camera-radar"></div>
                <div class="icon-camera abs-all-middle"></div>
            </div>
            <div class="next-btn" @click="goAddInfo">跳过</div>
        </div>
        <mt-actionsheet :actions="actions" v-model="sheetShow"></mt-actionsheet>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                title: '创建巡查点',
                sheetShow: false,
                actions: [],
            }
        },
        watch: {},
        computed: {},
        mounted() {
            this.actions = [{
                name: '拍照',
                method: this.takePhoto
            }, {
                name: '从相册中选择',
                method: this.choosePhoto
            }];
        },
        activated(){
            if (this.$route.query.from == 'device') {
                this.title = '创建安装点';
            } else {
                this.title = '创建巡查点';
            }
            this.setBackButton();
        },
        deactivated() {
            window.mkoBackButton.bInputData = false;
            window.mkoBackButton.callback = null;
        },
        destroyed(){
        },
        methods: {
            takePhoto(){
                this.$takePhoto((photo) => {
                    sessionStorage.setItem('xcSpotAddPhoto', photo.url);
                    this.goAddInfo();
                })
            },
            choosePhoto(){
                this.$choosePhoto((photos) => {
                    sessionStorage.setItem('xcSpotAddPhoto', photos[0].url);
                    this.goAddInfo();
                })
            },
            goAddInfo(){
                let path = '/spot_add/dvc';
                if (this.$route.query.from) {
                    path = path + '?from=' + this.$route.query.from;
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
                if (this.sheetShow) {
                    this.sheetShow = false;
                    return;
                }
                this.$MKOPop()
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../../config.less";

    .xc-spot-add-wrap {
        position: fixed;
        top: 0;
        bottom: 0;
        padding: 0;
        letter-spacing: 0;
        text-align: center;
        background-color: #fff;
        .title {
            margin: 30px auto 0;
            line-height: 16px;
            font-size: 16px;
            font-family: STHeitiSC-Medium;
        }
        .contact {
            margin: 26px auto 0;
            line-height: 18px;
            font-size: 14px;
        }
        .photo-btn-wrap {
            position: relative;
            margin: 100px auto 0;
            width: 240px;
            height: 240px;
            .bg {
                animation: rotate 3s linear infinite;
                -moz-animation: rotate 3s linear infinite;
                -webkit-animation: rotate 3s linear infinite;
                -o-animation: rotate 3s linear infinite;
            }
            @keyframes rotate {
                from {
                    transform: rotate(0deg);
                    -ms-transform: rotate(0deg); /* IE 9 */
                    -moz-transform: rotate(0deg); /* Firefox */
                    -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
                    -o-transform: rotate(0deg); /* Opera */
                }
                to {
                    transform: rotate(360deg);
                    -ms-transform:rotate(360deg); 	/* IE 9 */
                    -moz-transform:rotate(360deg); 	/* Firefox */
                    -webkit-transform:rotate(360deg); /* Safari 和 Chrome */
                    -o-transform:rotate(360deg); 	/* Opera */
                }
            }
        }
        .next-btn {
            position: absolute;
            bottom: 85px;
            width: 100%;
            font-size: 14px;
            color: @mainBlue;
        }
    }
</style>
