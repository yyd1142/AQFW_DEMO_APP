<template>
    <div>
        <div class="placeholder-item"></div>     <mt-header class="header-wrap" fixed title="任务详情">
            <mt-button class="header-item" slot="left" icon="back"></mt-button>
        </mt-header>
        <div class="page-wrap">
            <div class="jiancha-wrap">
                检查人：德德<br>开始：2017-01-09<br>结束：2017-02-02
            </div>
            <form class="jiancha-form-wrap">
                <textarea class="jiancha-text" placeholder="请输入内容"></textarea>
            </form>
        </div>
    </div>
</template>

<style lang="less" rel="stylesheet/less" scoped>
    .jiancha-form-wrap {
        width: 100%;
        box-sizing: border-box;
        .jiancha-text{
            width: 100%;
        }
    }
</style>

<script>
    export default {
        data() {
            return {}
        },
        mounted() {

        },
        methods: {
           
        },
        components: {}
    }

</script>