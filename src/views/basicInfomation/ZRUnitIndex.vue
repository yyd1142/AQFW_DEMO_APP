<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="消防责任单位" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap dw-data-wrap" v-if="!notData">
            <div class="com-data-wrap">
                <div v-for="(item, index) in unitItem.dwTypes" v-if="index != 0">
                    <mko-cell :title="item.name" :val="item.datas.length <= 0 ? '' : item.datas.length"
                              main="left" is-link @click="goDwInfo(item, index)"></mko-cell>
                </div>
            </div>
        </div>
        <no-data text="暂无数据" v-if="notData"></no-data>
    </div>
</template>

<!--<style lang="less" src="./index.less"></style>-->

<script>
    import api from 'api'
    import { NoData } from 'components'
    import { IDType } from 'filters'
    import { Toast } from 'mint-ui'
    var dwTypesDatas = []
    export default {
        data() {
            return {
                notData: false,
                unitItem: {
                    dwTypes: ''
                }
            }
        },
        activated() {
            this.$nextTick(() => {
                this.dwTypes();
            })
        },
        methods: {
            dwTypes() {
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
                api.getUnitInfo({
                    m: 'info',
                    groupId: this.$store.getters.groupId
                }).then(result => {
                    if (!result) return false;
                    if (result.code === 0) {
                        if (result.response.length <= 0) {
                        }
                        else {
                            if (result.response[1].length <= 0) {
                                this.notData = true;
                            } else {
                                result.response[1].forEach((item) => {
                                    if (dwTypes[item.dwType])
                                        dwTypes[item.dwType].datas.push(item)
                                });

                                this.unitItem = {
                                    dwTypes: dwTypes
                                };
                                this.notData = false;
                            }
                        }
                    } else {
                        this.notData = true;
                    }
                });
            },
            goDwInfo(item, index) {
                this.$MKOPush({
                    path: '/xfzr_list',
                    params: {
                        pid: item.id
                    },
                    query: {
                        title: item.name,
                        type: index
                    }
                })
            },
            back() {
                this.$MKOPop();
            },
            add(item, index) {
                this.$MKOPush({
                    path: '/addXFZRUnit',
                    query: {
                        title: item.name,
                        type: index
                    }
                })
            }
        },
        components: {
            NoData
        }
    }
</script>
