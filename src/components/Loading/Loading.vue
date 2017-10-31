<template>
    <div>
        <div class="loading-blank"></div>
    </div>
</template>

<style lang="less" scoped>
@import "../../config.less";
.loading-blank {
    position: fixed;
    width: 100%;
    z-index: 20;
    height: 100vh;
    background-color: #ffffff;
    margin: auto;
    left: 0;
    right: 0;
    top: 40px + @headerTop;
}
</style>

<script>
export default {
    data() {
        return {}
    }
}
</script>