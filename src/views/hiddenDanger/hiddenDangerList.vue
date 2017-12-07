<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="风险管理" left-icon="icon-back" right-icon="icon-add" @handleLeftClick="back" @handleRightClick="goHiddenDangerCheck"></mko-header>
        <res-error v-if="resError"></res-error>
        <div class="page-wrap hidden-danger-page-wrap" v-show="!resError" id="pageWrapper">
            <mko-nav-bar>
                <mko-tab-item :label="item.text" :activied="item.actived" @handleTabClick="tab(item, index)"
                              v-for="(item, index) in tabs"></mko-tab-item>
            </mko-nav-bar>
            <mt-loadmore :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="bottomAllLoaded" ref="loadmore" :auto-fill="autoFill">
                <ul class="notice-table-view">
                    <mko-double-cell :title="item.yhDesc || '暂无风险描述'" :val="item.createDate | formatDate" is-link
                                     :label="`上报人：${item.employeeName || '暂无'}（${item.sbDWName || '暂无上报单位'}）`"
                                     v-for="item in hiddenDangers" @click="linkPath('/hidden_danger_info/' + item.id)"></mko-double-cell>
                </ul>
            </mt-loadmore>
        </div>
        <no-data class="not-data-wrap" v-if="notData"></no-data>
    </div>
</template>

<script src="./hiddenDanger.js"></script>

<style lang="less" rel="stylesheet/less" scoped>
    @import "../../config.less";

    .hidden-danger-page-wrap {
        padding-bottom: 0;
        margin-top: @headerTop + @headerHeight;
    }

    .notice-table-view {
        width: 100%;
        margin: 0 auto;
        .notice-table-cell {
            width: 100%;
            height: 50px;
            background-color: #fff;
            border-bottom: 1px solid #d8d8d8;
            padding: 6px 14px 0 14px;
            box-sizing: border-box;
            position: relative;
            a {
                width: 100%;
                height: 100%;
                .not-read-item {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background-color: @blueColor;
                    display: inline-block;
                    margin-right: 6px;
                }
                .title {
                    width: 100%;
                    font-size: 14px;
                    color: #232323;
                    padding-right: 120px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .from {
                    width: 100%;
                    font-size: 12px;
                    color: #A0A0A0;
                    margin-top: 2px;
                }
                .time {
                    width: auto;
                    position: absolute;
                    right: 14px;
                    color: #606060;
                    font-size: 12px;
                    top: 6px;
                }
            }
        }
    }
</style>
