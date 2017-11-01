<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header title="教育培训" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap exam-wrap">
            <div class="exam-title" v-text="examPageItem.examTitle"></div>
            <div class="exam-main">
                <div class="exam-rule" v-text="examPageItem.examDescription || '暂无描述'"></div>
                <div class="rule-content">
                    <span  v-for="(item, index) in examPageItem.examInfo" v-text="item"  v-if="index != 0"></span>
                </div>
            </div>
            <!--<div class="footer-bar">
                <div class="test-btn right" @click="startExam(examPageItem.id)">
                </div>
            </div>-->
            <div class="footer-bar">
                <div class="test-btn left" @click="startSimulationExam(examPageItem)"> 模拟考试 </div>
                <div class="test-btn right" @click="startExam(examPageItem)"> 开始考试 </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                examPageItem: {}
            }
        },
        activated() {
            this.getExamRule()
        },
        methods: {
            getExamRule() {
                this.examPageItem = this.$route.query.examPageItem;
            },
            back() {
                this.$MKOPop()
            },
            startExam(item){
                this.$MKOPush({
                    path: `exam/${item.id}`,
                    query: {
                        title: item.examTitle
                    }
                })
            },
            startSimulationExam(item) {
                this.$MKOPush({
                    path: `simulation_exam/${item.id}`,
                    query: {
                        title: item.examTitle
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../config.less";
    .notice-table-view {
        width: 100%;
        margin: 0 auto;
        padding-left: 14px;
        box-sizing: border-box;
        background-color: #fff;
        .notice-table-cell {
            width: 100%;
            height: 50px;
            background-color: #fff;
            border-bottom: 1px solid #d8d8d8;
            padding: 6px 14px 0 0;
            box-sizing: border-box;
            position: relative;
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
    
    .train-wrap {
        padding: 0 !important;
    }
    
    .page-wrap {
        box-sizing: border-box;
        padding: 0 10px;
    }
    
    .exam-wrap {
        background-color: #ffffff;
        height: 100vh;
        margin: 0;
        padding-top: 40px + @headerTop;
    }
    
    .exam-title {
        width: 100%;
        text-align: CENTER;
        font-size: 16px;
        color: @blueColor;
        margin-top: 14px;
    }
    
    .exam-main {
        width: 100%;
        box-sizing: border-box;
        margin: 0 auto;
        background-color: #ffffff;
        margin-bottom: 55px;
        .exam-rule {
            text-align: center;
            font-size: 12px;
            padding: 5px 0;
            line-height: 20px;
            color: #9D9D9D;
        }
        .rule-content {
            line-height: 20px;
            font-size: 14px;
            color: #333333;
            span {
                width: 100%;
                display: block;
                margin-top: 8px;
            }
        }
    }
    
    .footer-bar {
        width: 100%;
        height: 40px;
        position: fixed;
        bottom: 0;
        background-color: #fff;
        z-index: 10;
        left: 0;
        right: 0;
        margin: auto;
        .test-btn {
            width: 50%;
            height: 40px;
            line-height: 40px;
            text-align: CENTER;
            color: #ffffff;
            font-size: 18px;
        }
        .left {
            float: left;
            background-color: #5B5E60;
        }
        .right {
            float: right;
            background-color: @blueColor;
            a {
                color: #fff;
            }
        }
        .start-left {
            float: left;
            background-color: #2094E1;
            width: 60%;
            font-size: 12px;
        }
        .start-right {
            float: right;
            background-color: @blueColor;
            width: 40%;
        }
    }
</style>