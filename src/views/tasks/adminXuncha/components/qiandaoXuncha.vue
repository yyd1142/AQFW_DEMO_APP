<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="巡查" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">
            <xuncha-status></xuncha-status>
            <div class="patrol-qiandao">
                <div class="qiandao-icon"><i class="icon-wxbdingwei"></i>到达巡更点后，请拍照签到</div>
                <ul class="photo-table-view">
                    <!--<li class="photo-table-cell"  v-for="item in 3">
                            <img src="/static/image-square.png" />
                        </li>-->
                    <li class="photo-table-cell">
                        <div class="photo-plus-btn">
                            <span class="plus">
                                    <i class="icon iconfont icon-zhaoxiangji"></i>
                                </span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="patorl-table-wrap"  v-for="(group, gIndex) in xunchaData.devices" @click="goDevice(deviceIndex)">
                <mt-cell class="patorl-mt-cell" is-link  v-for="(device, deviceIndex) in group">
                    <div class="patorl-table-cell">
                        <i class="icon iconfont icon-success success"></i>
                        <span class="patorl-name">{{device.unitName}}</span>
                        <span class="patorl-status">{{device.status}}</span>
                    </div>
                </mt-cell>
            </div>
        </div>
        <mt-button type="primary" size="large" class="btn-primary bottom-btn">确认</mt-button>
    </div>
</template>

<script>
    import xunchaStatus from '../../../components/xunchaStatusNavbar/xunchaStatus.vue';
    
    export default {
        // props: ['title', 'xunchaData'],
        data() {
            return {
                title: '水泵房-01',
                xunchaData: {
                    photos: ["fdssalkds", "fdsaipjfdvcxds"],
                    devices: [
                        [{
                            id: 293,
                            code: '',
                            unitId: '1',
                            unitName: '水泵-001',
                            status: '1'
                        }, {
                            id: 293,
                            code: '',
                            unitId: '1',
                            unitName: '水泵-001',
                            status: '1'
                        }],
                        [{
                            id: 295,
                            name: '水泵-003',
                            status: '1'
                        }],
                    ]
                }
            }
        },
        mounted() {
    
        },
        methods: {
            back() {
                this.$MKOPop();
            },
            goDevice(index) {
                this.$MKOPush(`/xuncha_info/${this.$route.params.id}/device/${index}`)
            }
        },
        components: {
            xunchaStatus
        }
    }
</script>

<style lang="less" src="./../xuncha.less" scoped>
    
</style>