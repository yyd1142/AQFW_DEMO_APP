<template>
    <div class="live-video-device">
        <mko-form-cell title="所属系统" val="视频监控系统"></mko-form-cell>
        <mko-form-cell title="设备名称" :val="id == 1 ? '消防通道堵塞监测设备' : '明火监测设备'"></mko-form-cell>
        <mko-form-cell title="所属单位" val="无锡万象城"></mko-form-cell>
        <mko-form-cell title="设备ID" val="98K"></mko-form-cell>
        <mko-form-cell title="安装时间" val="2017-08-17"></mko-form-cell>
        <mko-form-cell title="监控类型" val="消防通道堵塞监测"></mko-form-cell>
        <mko-form-cell title="设备品牌" val="三星"></mko-form-cell>
        <mko-form-cell title="型号" val="C0019"></mko-form-cell>
        <mko-form-cell title="安装位置" :val="address"></mko-form-cell>
        <mko-form-cell title="设备状态" :val="status == 0 ? '停用': '正常'"></mko-form-cell>
    </div>
</template>
<script>
//    明火监测、 消防通道堵塞监测、消防门闭合监测、消防控制室值班人员脱岗监测
    export default {
        props: ['status', 'address', 'id'],
        data() {
            return {
                isEdit: false
            }
        },
        methods: {
            edit() {

            },
            updateDvc() {

            }
        }
    }
</script>
<style></style>
