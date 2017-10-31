<template>
    <div class="VideoSurveillance">
        <div class="placeholder-item"></div>
        <mko-header title="视频监控" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap">

        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        activated() {
        },
        methods: {
            back() {
                this.$MKOPop()
            }
        }
    }
</script>
<style lang="less">
    .VideoSurveillance {
    }
</style>
