<template>
    <div>
        <div class="placeholder-item"></div>
        <mko-header :title="examItem.examTitle" left-icon="icon-back" @handleLeftClick="back"></mko-header>
        <div class="page-wrap exam-wrap">
            <div class="score-wrap">
                <span class="score-value">{{examItem.score}}</span>
                <span class="benci">考试得分</span>
            </div>
            <div class="exam-main">
                <ul class="exam-table-view">
                    <li class="exam-table-cell" v-for="(item, index) in result">
                        <div class="title">{{index + 1}}、{{item.examTopic}}</div>
                        <span class="option" v-for="(obj, childIndex) in item.examOption">
                                    <i :class="obj.value | errorsExamFilter"></i>
                                    {{obj.label}}
                                </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import { errorsExamFilter } from 'filters'
    import { NoData } from 'components'
    var _id = ''
    export default {
        data() {
            return {
                notData: false,
                examItem: '',
                result: {}
            }
        },
        activated() {
            this.$nextTick(() => {
                if (_id != this.$route.params.pid) {
                    this.examScoreDetail()
                }
            })
        },
        methods: {
            examScoreDetail() {
                let params = {
                    m: 'examResultInfo',
                    id: this.$route.params.pid
                }
                api.examScoreDetail(params).then(result => {
                    _id = this.$route.params.pid;
                    if (result.code == 0) {
                        if (result.response.examTopic.length == 0) {
                            this.notData = true;
                        } else {
                            let submitDatas = result.response.examTopic;
                            let scoreDatas = [];
                            submitDatas.forEach((item) => {
                                let examOptionItem = [];
                                item.correctAnswer = JSON.parse(item.correctAnswer)
                                item.examOption.forEach((obj) => {
                                    let i = item.examOption.indexOf(obj);
                                    if(i == item.correctAnswer){
                                        examOptionItem.push({value: true, label: obj})
                                    }else {
                                        examOptionItem.push({value: false, label: obj})
                                    }
                                    if(item.correctAnswer != item.userAnswer && item.userAnswer == i){
                                        examOptionItem[i].value = 'checked'
                                    }
                                })
                                scoreDatas.push({
                                    examTopic: item.examTopic,
                                    examOption: examOptionItem
                                })
                            })
                            console.log(scoreDatas)
                            this.examItem = result.response;
                            this.result = scoreDatas;
                        }
                    }
                })
            },
            back() {
                this.$MKOPop()
            }
        },
        components: {
            NoData
        }
    }
</script>

<style lang="less" scoped>
    @import '../../config.less';
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
            background-color: @blueColor
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
    
    .score-wrap {
        width: 100%;
        margin: 0 auto 0 auto;
        .benci {
            text-align: center;
            display: block;
            width: 100%;
            padding: 0 0;
            font-size: 14px;
            color: #2CABFF;
        }
        .score-value {
            border-radius: 50%;
            display: block;
            margin: 25px auto 0 auto;
            text-align: center;
            color: #2CABFF;
            font-size: 50px;
        }
    }
    
    .tips {
        width: 100%;
        text-align: center;
        font-size: 12px;
        color: #333333;
        margin-top: 8px;
    }
    
    .exam-table-view {
        width: 100%;
        .exam-table-cell {
            width: 100%;
            padding: 12px 0;
            .title {
                font-size: 16px;
                color: #333333;
            }
            .option {
                display: block;
                font-size: 14px;
                color: #333333;
                padding: 0 0 0 25px;
                position: relative;
                margin-top: 14px;
                line-height: 20px;
                .true,
                .false,
                .checked {
                    width: 20px;
                    height: 20px;
                    display: inline-block;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .true {
                    background: url('/static/icons/resource.png') -734px 0 no-repeat;
                    background-size: 892px auto;
                }
                .false {
                    background: url('/static/icons/resource.png') -714px 0 no-repeat;
                    background-size: 892px auto;
                }
                .checked {
                    background: url('/static/icons/resource.png') -754px 0 no-repeat;
                    background-size: 892px auto;
                }
            }
        }
    }
    
    .time-up {
        color: @redColor !important;
    }
</style>
