<template>
    <div>
        <mko-header title="水系统监测" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap monitor-sxt-wrap">
            <mko-nav-bar>
                <mko-tab-item :label="`${item.text} ${item.count}`" :activied="tabI==i" @handleTabClick="tab(i)"
                              v-for="(item,i) in headerBtnItems"></mko-tab-item>
            </mko-nav-bar>
            <alarm-list v-show="tabI==0"></alarm-list>
            <device-list v-show="tabI==1"></device-list>
        </div>
    </div>
</template>

<script>
    import alarmList from './AlarmList.vue'
    import deviceList from './DeviceList.vue'
    export default {
        data () {
            return {
                tabI: 0,
                headerBtnItems: [
                    {text: '设备报警', count: 2},
                    {text: '监测设备', count: 2},
                ],
            }
        },
        watch: {},
        computed: {},
        mounted() {
        },
        activated(){
        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            tab(i){
                this.tabI = i;
            },
            back(){
                this.$MKOPop();
            }
        },
        components: {
            alarmList, deviceList

        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .monitor-sxt-wrap {
        .title-info {
            height: 34px;
            padding: 14px 14px 8px;
            line-height: 12px;
            font-size: 12px;
            letter-spacing: 0;
            background-color: @baseBG01;
            .label {
                color: @baseText02;
            }
            .value {
                color: @baseText03;
            }
        }

        .mko-double-cell {
            .value {
                min-width: 0;
            }
        }
    }
</style>
