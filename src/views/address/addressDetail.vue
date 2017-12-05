<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="联系人详情" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap address-detail-wrap">
            <div class="card-wrap">
                <div class="avatar-wrap">
                    <div class="default"></div>
                    <!--<img class="avatar" src="./logo.png">-->
                </div>
                <div class="name no-overflow">{{contactDetail.employeeName}}</div>
                <div class="phone no-overflow">{{contactDetail.phone}}</div>
                <div class="btn-wrap">
                    <a :href="'sms:' + contactDetail.phone" class="fl">
                        <div class="btn msg"></div>
                        <span class="text">消息</span>
                    </a>
                    <a :href="'tel:' + contactDetail.phone" class="fr">
                        <div class="btn"></div>
                        <span class="text">呼叫</span>
                    </a>
                </div>
            </div>
            <div class="info-wrap">
                <mko-cell :title="contactDetail.dwName || '暂无'" main="left">
                    <span slot="icon" class="sign"></span>
                </mko-cell>
                <mko-cell :title="contactDetail.role|roleFilter" main="left">
                    <span slot="icon" class="sign sign-p"></span>
                </mko-cell>
            </div>
        </div>
    </div>
</template>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .address-detail-wrap {

        min-height: 400px;
        .card-wrap {
            position: relative;
            height: 282px;
            text-align: center;
            background-color: #fff;
            > div {
                position: absolute;
                left: 50%;
                transform: translate(-50%, 0);
                -webkit-transform: translate(-50%, 0);
            }
            .avatar-wrap {
                top: 32px;
                width: 86px;
                height: 84px;
                border-radius: 50%;
                .default {
                    height: 100%;
                    background: url('/static/icons/resource.png') -568px 0 no-repeat;
                    background-size: @bg-size;
                }
                .avatar {
                    width: 100%;
                }
            }
            .name {
                top: 124px;
                max-width: 300px;
                font-size: 26px;
                height: 37px;
                line-height: 37px;
            }
            .phone {
                top: 161px;
                max-width: 300px;
                font-size: 16px;
                height: 22px;
                line-height: 22px;
            }
            .btn-wrap {
                top: 201px;
                width: 112px;
                .btn {
                    width: 40px;
                    height: 40px;
                    background: url(/static/icons/resource.png) -608px -86px no-repeat;
                    background-size: @bg-size;
                    &.msg {
                        background: url(/static/icons/resource.png) -568px -86px no-repeat;
                        background-size: @bg-size;
                    }
                }
                .text {
                    margin-top: 2px;
                    line-height: 17px;
                    font-size: 12px;
                }
            }
        }
        .info-wrap {
            .sign {
                position: relative;
                top: 18px;
                padding: 22px 22px 0 0;
                background: url(/static/icons/resource.png) -568px -126px no-repeat;
                background-size: @bg-size;
                &.sign-p {
                    background: url(/static/icons/resource.png) -590px -126px no-repeat;
                    background-size: @bg-size;
                }
            }
        }
    }
</style>

<script>
    import api from 'api';
    import { roleFilter } from 'filters';
    import { Indicator } from 'mint-ui';
    var _id = '';
    export default {
        data() {
            return {
                contactDetail: {},
            }
        },
        activated(){
            if (_id != this.$route.params.pid) {
                this.contactDetail = {};
                this.getContactData();
            }
        },
        deactivated() {
        },
        methods: {
            getContactData() {
                Indicator.open({spinnerType: 'fading-circle'});
                api.getAddressInfo({
                    id: this.$route.params.pid
                }).then(res => {
                    _id = this.$route.params.pid;
                    if (res.code === 0) {
                        this.contactDetail = res.response;
                        Indicator.close();
                    }
                });
            },
            back() {
                this.$MKOPop()
            }
        }
    }
</script>
