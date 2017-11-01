<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="消息列表" left-icon="icon-back" @handleLeftClick="back" right-icon-text="刷新" @handleRightClick="refresh"></mko-header>
        <div class="page-wrap message-page-wrap" id="pageWrapper">
            <mt-loadmore
                :bottom-method="loadBottom" 
                @bottom-status-change="handleBottomChange" 
                :bottom-all-loaded="bottomAllLoaded" 
                :auto-fill="autoFill" ref="loadmore">
                <ul class="message-table-view" id="messageTable">
                    <li class="message-table-cell"  v-for="item in systemMessages" @click="linkPath(item)">
                        <div class="message-item">
                            <i class="is-not-read" v-if="item.status == 0"></i>
                            <span :class="item.status == 0 ? 'not-read-title' : ''">{{titleFilters(item.title)}}</span>
                        </div>
                        <i class="message-jiantou"></i>
                        <div class="message-time">
                            <span>{{item.createTime | formatDate('YYYY-MM-DD')}}</span>
                        </div>
                    </li>
                </ul>
            </mt-loadmore>
        </div>
        <no-data class="not-data-wrap"  v-if="notData"></no-data>
        <res-error  v-if="resError"></res-error>
    </div>
</template>

<script src="./message.js"></script>

<style lang="less" scoped>
@import "../../config.less";
.message-page-wrap {
    padding: 40px + @headerTop 0 0 0;
    margin: 0 0 0 0;
}

.message-table-view {
    width: 100%;
    margin: 0 auto;
    background-color: #fff;
    box-sizing: border-box;
    padding-left: 14px;
    .message-table-cell {
        width: 100%;
        height: 44px;
        margin: 0 auto;
        .border-btm(@borderColor);
        .message-jiantou {
            background: url('/static/icons/resource.png') -111px -234px no-repeat;
            background-size: 892px auto;
            float: right;
            margin: 15px 14px 0 0;
            width: 9px;
            height: 14px;
        }
        .message-item {
            font-size: 14px;
            color: #232323;
            float: left;
            display: table;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 60%;
            .is-not-read {
                background-color: @blueColor;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                position: absolute;
                margin: auto;
                top: 0;
                bottom: 0;
                left: 0;
            }
            .not-read-title {
                padding-left: 20px;
            }
            span {
                height: 44px;
                line-height: 44px;
                display: table-cell;
                vertical-align: middle;
            }
        }
        .message-time {
            font-size: 14px;
            color: #606060;
            float: right;
            margin-right: 5px;
            display: table;
            span {
                line-height: 44px;
                display: table-cell;
                vertical-align: middle;
                height: 44px;
            }
        }
    }
}
</style>
