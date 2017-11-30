<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="基本信息" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap dw-data-wrap" style="padding-bottom: 0" ref="wrapper">
            <mt-loadmore ref="loadmore" :top-method="loadTop" @top-status-change="handleTopChange">
                <div :style="{ minHeight: wrapperHeight + 'px' }">
                    <mko-cell :title="item.title" is-link main="left"
                              @click="linkPath(item.url)" v-for="(item, index) in datas"></mko-cell>
                </div>
            </mt-loadmore>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import { Indicator, Toast } from 'mint-ui'
    import { MkoCell } from 'mko-ui'

    var _groupId = ''
    export default {
        data(){
            return {
                topStatus: '',
                wrapperHeight: 0
            }
        },
        computed: {
            datas() {
                let isAdmin = this.$store.state.user.isAdmin;
                if (!isAdmin) {
                    return [{
                        id: 2,
                        title: '建筑信息',
                        url: '/jz_info'
                    }]
                } else {
                    return [{
                        id: 1,
                        title: '单位信息',
                        url: '/unit_info'
                    }, {
                        id: 2,
                        title: '建筑信息',
                        url: '/jz_info'
                    }, {
                        id: 3,
                        title: '消防责任单位',
                        url: '/xfzr_unit'
                    }]
                }
            }
        },
        mounted(){
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        },
        activated() {
            this.$nextTick(() => {
                if (_groupId != this.$store.getters.groupId) {
                    this.getDWInfo();
                }
            })
        },
        methods: {
            getDWInfo() {
                let dwTypes = [{
                    name: '',
                    datas: []
                }, {
                    name: '设计单位',
                    datas: []
                }, {
                    name: '施工单位',
                    datas: []
                }, {
                    name: '维保单位',
                    datas: []
                }, {
                    name: '检测单位',
                    datas: []
                }, {
                    name: '运维单位',
                    datas: []
                }];

                let params = {
                    m: 'info',
                    groupId: this.$store.getters.groupId
                }
                api.getUnitInfo(params).then(result => {
                    this.$refs.loadmore.onTopLoaded();
                    Indicator.close();
                    _groupId = this.$store.getters.groupId
                    if (result.code === 0) {
                        if (result.response.length <= 0) {

                        } else {
                            sessionStorage.setItem('unitDatas', JSON.stringify(result.response))
                        }
                    }
                });
            },
            //刷新
            loadTop(){
                setTimeout(() => {
                    sessionStorage.removeItem('dwTypesDatas')
                    sessionStorage.removeItem('unitDatas')
                    this.getDWInfo();
                    Toast({
                        message: '刷新完成',
                        position: 'middle',
                        duration: 1500
                    });
                }, 1500)
            },
            handleTopChange(status) {
                this.topStatus = status;
            },
            linkPath(url) {
                if (this.topStatus == 'drop' || this.topStatus == 'loading') {
                    return false;
                }
                this.$MKOPush(url);
            },
            back() {
                this.$MKOPop();
            }
        },
        components: {
            MkoCell
        }
    }
</script>

<style lang="less" src="./index.less"></style>
