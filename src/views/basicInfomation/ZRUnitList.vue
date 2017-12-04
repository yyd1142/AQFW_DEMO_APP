<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="$route.query.title" left-icon="icon-back" @handleLeftClick="back" right-icon="icon-add" @handleRightClick="add"></mko-header>
        <div class="page-wrap dw-data-wrap" v-if="!notData">
            <mko-cell :title="item.dwName" is-link @click="goDwInfo(item)" v-for="(item, index) in unitItem"></mko-cell>
        </div>
        <no-data text="暂无数据"  v-if="notData"></no-data>
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
            unitItem: []
        }
    },
    activated() {
        this.$nextTick(() => {
            this.dwTypes();
        })
    },
    methods: {
        dwTypes() {
            this.unitItem = [];
            api.getUnitInfo({
                m: 'info',
                groupId: this.$store.getters.groupId
            }).then(result => {
                if (!result) return false;
                if (result.code === 0) {
                    if (result.response.length <= 0) { }
                    else {
                        if (result.response[1].length <= 0) {
                            this.notData = true;
                        } else {
                            result.response[1].forEach((item) => {
                                if (item.dwType == this.$route.query.type) {
                                    this.unitItem.push(item)
                                }
                            });
                            this.notData = this.unitItem.length <= 0 ? true : false;
                        }
                    }
                } else {
                    this.notData = true;
                }
            });
        },
        goDwInfo(item) {
            this.$MKOPush({
                name: 'ZRUnitInfo',
                params: {
                    pid: item.id
                },
                query: {
                    title: this.$route.query.title
                }
            })
        },
        back() {
            this.$MKOPop();
        },
        add() {
            this.$MKOPush({
                path: '/addXFZRUnit',
                query: this.$route.query
            })
        }
    },
    components: {
        NoData
    }
}
</script>
