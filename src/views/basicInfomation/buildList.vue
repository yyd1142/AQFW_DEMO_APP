<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="建筑信息" left-icon="icon-back" right-icon="icon-add" @handleLeftClick="back" @handleRightClick="$MKOPush('/add_jz')"></mko-header>
        <div class="page-wrap dw-data-wrap"  v-if="!notData">
            <mko-cell :title="item.jzName" main="left"
                      @click="linkPath(item.jzID)" v-for="(item, index) in datas" is-link></mko-cell>
        </div>
        <no-data  v-if="notData"></no-data>
    </div>
</template>

<script>
    import api from 'api'
    import { NoData } from 'components'
    import { Indicator, Toast } from 'mint-ui'
    var needUpdate = true;
    var isTOPLoad = false;
    var updateDatas = {};
    var _groupId = ''
    export default {
        data() {
            return {
                notData: false,
                datas: [],
                autoFill: false,
                topAllLoaded: false,
                topStatus: '',
                wrapperHeight: 0
            }
        },
        activated() {
          this.jzList();
        },
        methods: {
            linkPath(id) {
                this.$MKOPush(`/jz_info/${id}`);
            },
            jzList() {
                let params = {
                    m: 'list',
                    groupId: this.$store.getters.groupId
                }
                api.getJZList(params).then(result => {
                    _groupId = this.$store.getters.groupId
                    if (result.code === 0) {
                        if (isTOPLoad) {
                            Toast({
                                message: '刷新成功',
                                position: 'middle',
                                duration: 1500
                            });
                        }
                        if (result.response.length <= 0) {
                            updateDatas = [];
                            this.notData = true;
                        } else {
                            updateDatas = result.response;
                            this.datas = result.response;
                            this.notData = false;
                        }
                        needUpdate = false;
                        Indicator.close();
                    }
                });
            },
            back(){
                this.$MKOPop();
            }
        },
        components: {
            NoData
        }
    }
</script>

<!--<style lang="less" src="./index.less"></style>-->
