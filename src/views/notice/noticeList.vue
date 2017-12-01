<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="通知公告" left-icon="icon-back" right-icon-text="刷新" @handleLeftClick="back" @handleRightClick="refresh"></mko-header>
        <div class="page-wrap notice-list-wrap" id="pageWrapper">
            <mt-loadmore :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="bottomAllLoaded" ref="loadmore" :auto-fill="autoFill">
                <ul class="notice-table-view">
                    <mko-double-cell :title="`${item.status == 0?notReadIcon:''}${item.title || '标题为空'}`" :label="`来源：${item.releaseDw || '未知'}`"
                                     :val="item.createTime | formatDate" is-link
                                     @click="linkPath(item)" v-for="item in notices">
                    </mko-double-cell>
                </ul>
            </mt-loadmore>
        </div>
        <no-data class="not-data-wrap" v-if="notData"></no-data>
    </div>
</template>

<script src="./js/notice.js">

</script>

<style lang="less">
    @import "../../config.less";

    .notice-list-wrap {
        .not-read-item {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: @blueColor;
            display: inline-block;
            margin-right: 6px;
        }
        .not-notice-data {
            margin-top: 40px;
        }
    }
</style>
