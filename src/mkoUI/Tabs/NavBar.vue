<template>
    <div class="mkotabs" :class="{'is-header': isHeader !== undefined, 'border-bottom': borderBottom !== undefined}">
        <nav class="tabs-wrap">
            <slot></slot>
        </nav>
    </div>
</template>

<script>
export default {
    props: ['is-header', 'border-bottom']
}
</script>

<style lang="less" scoped>
  @import "../../config.less";
.mkotabs {
    width: 100%;
    height: 50px;
    background-color: #ffffff;
    padding: 10px 14px;
    &.is-header{
        position: fixed;
        z-index: 100;
        top: 8px + @headerTop;
        left: 50%;
        transform: translate(-50%, 0);
        -webkit-transform: translate(-50%, 0);
        width: 204px;
        padding: 0;
        background-color: transparent;
    }
    &.border-bottom {
        border-bottom: 1px solid #eeeeee;
    }
    .tabs-wrap {
        width: 100%;
        height: 30px;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex
    }

}
</style>
