<template>
    <div class="device-list-wrap">
        <div class="title-info">
            <div class="label fl">设备列表</div>
            <div class="value fr">共1个设备</div>
        </div>
        <mko-double-cell :title="item.name" icon="icon-location"
                         :label="item.pos"
                         @click="goDetail(item.id)" is-link v-for="item in list">
            {{item.status == 0 ? '停用' : '正常'}}
        </mko-double-cell>
    </div>
</template>

<script>

    export default {
        data () {
            return {
                list: [
                    {id: 1, name: '电气火灾监控探测器', pos: '深圳湾体育中心-体育馆，-1层，东北角巡查点', status: 1},
                ]
            }
        },
        watch: {},
        computed: {},
        mounted() {
            sessionStorage.setItem('dqDeviceData', JSON.stringify(this.list));

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
                let data = sessionStorage.getItem('dqDeviceData');
                if (data) {
                    this.list = JSON.parse(data);
                }
            },
            goDetail(id){
                this.$MKOPush('/monitorDqDeviceDetail/' + id);
            }
        },
        components: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../config.less";
</style>
