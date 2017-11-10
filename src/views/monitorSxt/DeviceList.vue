<template>
    <div class="device-list-wrap">
        <div class="title-info">
            <div class="label fl">设施列表</div>
            <div class="value fr">共{{list.length}}个设施</div>
        </div>
        <mko-double-cell :title="item.name" icon="icon-location"
                         :label="item.pos" is-link @click="goDetail(item.id)" v-for="item in list">
            {{item.status == 0 ? '停用' : '正常'}}
        </mko-double-cell>
    </div>
</template>

<script>

    export default {
        data () {
            return {
                list: [
                    {id: 1, name: '水压监测', pos: '深圳湾体育中心-体育馆，-1层，东北角巡查点', status: 1},
                    {id: 2, name: '水位监测', pos: '深圳湾体育中心-体育馆，2层，西南角巡查点', status: 0}
                ]
            }
        },
        watch: {},
        computed: {},
        mounted() {
            sessionStorage.setItem('sxtDeviceData', JSON.stringify(this.list));
        },
        activated(){
            this.getData();
        },
        deactivated() {
        },
        destroyed(){
        },
        methods: {
            getData(){
                let data = sessionStorage.getItem('sxtDeviceData');
                if (data) {
                    this.list = JSON.parse(data);
                }
            },
            goDetail(id){
                this.$MKOPush('/monitorSxtDeviceDetail/' + id);
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";

    .monitor-sxt-wrap {
        .device-list-wrap {

        }
    }
</style>
