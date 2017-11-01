<template>
    <div>
        <div class="placeholder-item"></div>
        <mt-header class="header-wrap" fixed title="消防设施日常巡查">
            <mt-button class="header-item" icon="back" slot="left" @click="back">任务</mt-button>
        </mt-header>
        <div class="page-wrap">
            <xuncha-status></xuncha-status>
            <div class="xuncha-wrap summary">
                <div class="time-consuming-item">本次巡查用时<span>1小时38分钟</span></div>
                <div class="time-consuming-item">共巡查点位<span>10</span>个，未巡查点位<span>10</span>个，发现风险<span>10</span>个</div>
            </div>
            <div  v-for="item in checkPoints">
                <div class="xc-title" v-text="item.title"></div>
                <ul class="xc-table-view">
                    <li class="xc-table-cell"  v-for="(position, index) in item.positions" @click="xuncha(index)">
                        <span class="title">{{position.name}}</span>
                        <div  v-if="!notTime">
                            <i class="icon iconfont icon-xiangyoujiantou" :class="position.status | xunchaStatusColor"  v-if="!notTime"></i>
                            <span class="value" :class="position.status | xunchaStatusColor">
                                    <mt-badge class="badge" size="small" color="#FE6A6A"  v-if="position.status == '2'">30</mt-badge>
                                    {{position.status | taskStatusFilter}}
                                </span>
                        </div>
                        <div v-else>
                            <span class="value font-weikaishi">未开始</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { taskStatusFilter, xunchaStatusColor } from 'filters';
    import xunchaStatus from 'components';
    export default {
        // props: ['checkPoints'],
        data() {
            return {
                active: 'tab-container1',
                notTime: false,
                todoItem: {
                    text: '开始<br>巡查',
                    class: '',
                    isTodo: false
                },
                checkPoints: [{
                    title: '万象城A座1楼',
                    positions: [{
                        name: '消控室',
                        status: '2'
                    }]
                }]
            }
        },
        mounted() {

        },
        methods: {
            xuncha(index) {
                this.$MKOPush(`/xuncha_info/${this.$route.params.id}/qiandao/${index}`)
            },
            routerLink(path) {
                if (!this.notTime)
                    this.$MKOPush(path)
            },
            back() {
                this.$MKOPop()
            }
        },
        components: {
            xunchaStatus
        }
    }
</script>

<style lang="less" src="./../xuncha.less" scoped>

</style>
