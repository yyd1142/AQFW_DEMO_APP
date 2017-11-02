<template>
    <div class="live-video-device">
        <mko-edit-card title="基础信息">
            <mko-form-cell title="设备名称" val="消防灭火器" non-text="未填"></mko-form-cell>
            <mko-form-cell title="设备编号" val="98K" ype="text" non-text="未填" :edit="isEdit"></mko-form-cell>
            <mko-form-cell title="品牌名称" val="98K" type="text" non-text="未知品牌" :edit="isEdit"></mko-form-cell>
            <mko-form-cell title="品牌型号" val="98K" type="text" non-text="未知型号" :edit="isEdit"></mko-form-cell>
            <mko-form-cell title="所属系统" val="消防灭火系统" type="text" non-text="未填"></mko-form-cell>
            <mko-form-cell title="安装日期" val="2017-09-09" type="sel" non-text="未填" :edit="isEdit"></mko-form-cell>
            <mko-form-cell title="巡查频率" val="每日一次" type="sel" non-text="未填" :edit="isEdit">
            </mko-form-cell>
            <mko-form-cell title="设备状态" type="sel" non-text="未填">
                <span>正常</span>
            </mko-form-cell>
        </mko-edit-card>
    </div>
</template>
<script>
    export default {
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
