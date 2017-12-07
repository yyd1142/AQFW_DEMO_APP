<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="我的"></mko-header>
        <div class="page-wrap person-page-wrap" v-if="!resError">
            <div ref="wrapper">
                <mt-loadmore ref="loadmore" :top-method="loadTop" @top-status-change="handleTopChange"
                             :auto-fill="autoFill">
                    <div :style="{ height: wrapperHeight - 50 + 'px'}">
                        <div class="data" @click="go('/person_data')">
                            <mko-double-cell :title="`${personData.employeeName}（${roleFilter(personData.role)}）`"
                                             :label="personData.dwName" is-link>
                                <div class="avatar-wrap" slot="icon">
                                    <div class="default"></div>
                                    <!--<img class="avatar" slot="icon" src="./logo.png">-->
                                </div>
                            </mko-double-cell>
                        </div>
                        <div class="cell-wrap">
                            <mko-cell title="基本信息" icon="sign jibenxinxi-icon" is-link @click="go('/basic_info')" v-if="isAdmin"></mko-cell>
                            <mko-cell title="消息" icon="sign sign-msg" is-link @click="go('/message?from=my')"></mko-cell>
                            <mko-cell title="设置" icon="sign sign-conf" is-link @click="go('/config')"></mko-cell>
                        </div>
                    </div>
                    <!--<div slot="top" class="mint-loadmore-top">
                      <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
                      <span v-show="topStatus === 'loading'">
                        <mt-spinner type="snake"></mt-spinner>
                      </span>
                    </div>-->
                </mt-loadmore>
            </div>
        </div>
        <tabs actived="my"></tabs>
        <res-error v-if="resError"></res-error>
    </div>
</template>


<script>
    import api from 'api';
    import { roleFilter } from 'filters';
    import { Indicator } from 'mint-ui';
    import { Tabs, ResError } from 'components';
    export default {
        data() {
            return {
                //loadMore
                wrapperHeight: 0,
                autoFill: false,
                topStatus: '',
                //数据
                personData: {},
                resError: false
            }
        },
        computed: {
            isAdmin() {
                return this.$store.state.user.isAdmin;
            }
        },
        activated() {
            this.$nextTick(() => {
                this.getLocalData();
                this.wrapperHeight = Math.max(document.documentElement.clientHeight, document.body.clientHeight) - this.$refs.wrapper.getBoundingClientRect().top;
            });
        },
        methods: {
            roleFilter,
            getLocalData() {
                let local = localStorage['USER_DATA'];
                if (local && local.length > 0) {
                    try {
                        this.personData = JSON.parse(local);
                    } catch (err) {
                        console.log(err.name + '：' + err.message);
                        return;
                    }
                } else {
                    this.UpdateData();
                }
            },
            UpdateData() {
                api.getUserData({
                    userName: this.$store.getters.userName
                }).then(res => {
                    this.$refs.loadmore.onTopLoaded();
                    if (!res) {
                        this.resError = true;
                        return;
                    }
                    try {
                        localStorage.setItem('USER_DATA', JSON.stringify(res.response));
                    } catch (err) {
                        console.log(err.name + '：' + err.message);
                        return;
                    }
                    this.personData = res.response;
                });
            },
            loadTop() {
                let timer = setTimeout(() => {
                    this.UpdateData();
                    clearTimeout(timer);
                }, 1000);
            },
            handleTopChange(status) {
                this.topStatus = status;
            },
            go(path) {
                if (this.topStatus != 'loading') {
                    this.$MKOPush(path)
                }
            }
        },
        components: {
            Tabs,
            ResError
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .person-page-wrap {
        padding-top: 10px;
        padding-bottom: 0;
        .data {
            .mko-double-cell {
                .avatar-wrap {
                    width: 46px;
                    height: 46px;
                    /*margin-right: 12px;*/
                    .default {
                        height: 100%;
                        background: url(/static/icons/resource.png) -654px*0.7666 0 no-repeat;
                        background-size: 892px*0.766 auto;
                    }
                    .avatar {
                        width: 100%;
                    }
                }
                .value {
                    min-width: 0;
                }
            }
        }
        .cell-wrap {
            margin-top: 10px;
            .sign {
                position: relative;
                padding: 11px;
                font-size: 0;
                &.sign-msg {
                    background: url(/static/icons/resource.png) -654px -60px no-repeat;
                    background-size: @bg-size;
                }
                &.sign-conf {
                    background: url(/static/icons/resource.png) -676px -60px no-repeat;
                    background-size: @bg-size;
                }
                &.jibenxinxi-icon {
                    background: url(/static/icons/jbxx.png) 0 0 no-repeat;
                    background-size: cover;
                    /*width: 22px;*/
                    /*height: 22px;*/
                }
            }
        }
    }
</style>
