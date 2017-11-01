<template>
    <div>
        <div class="placeholder-item"></div>
        <mt-header class="header-wrap" fixed :title="examItem.title">
            <mt-button class="header-item" icon="back" @click="back()" slot="left"></mt-button>
        </mt-header>
        <div class="page-wrap exam-wrap">
            <div v-if="startExamShow">
                <div class="exam-main">
                    <ul class="exam-table-view">
                        <li class="exam-table-cell" v-for="(item, index) in subjects">
                            <div class="title">{{index + 1}}、{{item.examTopic}}</div>
                            <div class="option" v-for="(obj, childIndex) in item.examOption" @click="exam(index, childIndex)">
                                <i :class="obj.value ? 'true' : 'false'"></i>{{obj.label}}
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="footer-bar">
                    <div class="test-btn start-left" :class="timeUpClass">剩余时间：
                        <span id="timer" v-text="time"></span>
                    </div>
                    <div class="test-btn start-right" @click="submit()">完成答题</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import api from 'api'
    import { errorsExamFilter } from 'filters'
    import { Indicator, Toast } from 'mint-ui'
    var _id = ''
    var timer = null;
    var examDatas = [];
    export default {
        data() {
            return {
                maxtime: 60 * 50,
                time: '00: 00',
                isTimeup: false,
                startExamShow: true,
                timeUpClass: '',
                bInputData: false,
                examItem: {
                    title: this.$route.query.title
                },
                subjects: []
            }
        },
        activated() {
            this.examShow = 1;
            let self = this;
            this.$nextTick(() => {
                let maxtime = this.maxtime;
                timer = setInterval(() => {
                    if (maxtime >= 0) {
                        let minutes = Math.floor(maxtime / 60);
                        let seconds = Math.floor(maxtime % 60);
                        minutes = 9 < minutes <= 0 ? `0${minutes}` : minutes;
                        seconds = 9 < seconds <= 0 ? `0${seconds}` : seconds;
                        if (maxtime <= 30) {
                            self.timeUpClass = 'time-up';
                        }
                        self.time = `${minutes}: ${seconds}`;
                        --maxtime;
                    } else {
                        this.isTimeup = true;
                        clearInterval(timer);
                    }
                }, 1000);
                if (_id != this.$route.params.pid) {
                    this.startExam();
                }
                setTimeout(() => {
                    this.startExamShow = true
                }, 200)
            })
        },
        deactivated() {
            window.mkoBackButton.bInputData = false;
            this.startExamShow = false;
            this.subjects = JSON.parse(sessionStorage.getItem('EXAMDATAS'));
            this.maxtime = 60 * 50
            this.time = '00: 00'
            clearInterval(timer);
        },
        methods: {
            startExam() {
                let params = {
                    m: 'startExam',
                    id: this.$route.params.pid
                }
                api.startExam(params).then(result => {
                    _id = this.$route.params.pid;
                    if (result.code == 0) {
                        let datas = result.response;
                        datas.forEach((item) => {
                            let examOptions = [];
                            item.examOption.forEach((obj) => {
                                examOptions.push({
                                    label: obj,
                                    value: false
                                })
                            })
                            item.examOption = examOptions;
                        })
                        this.subjects = datas;
                        sessionStorage.setItem('EXAMDATAS', JSON.stringify(result.response))
                        this.examItem.title = this.$route.query.title
                    }
                })
            },
            exam(index, childIndex) {
                let options = this.subjects[index].examOption;
                this.subjects[index].userAnswer = childIndex;
                options.forEach((item) => {
                    if (options.indexOf(item) == childIndex) {
                        item.value = true;
                    } else {
                        item.value = false;
                    }
                })
                this.onInputData()
            },
            submit() {
                if (this.isTimeup) {
                    Toast({
                        message: '答题时间超时',
                        position: 'middle',
                        duration: 1500
                    });
                    return false;
                }
                let validate = true;
                let submitDatas = this.subjects;
                let examTopic = [];
                let params = {
                    userName: this.$store.getters.userName,
                    examTitleId: this.$route.params.pid
                }
                submitDatas.forEach((item) => {
                    if (item.userAnswer === undefined) {
                        validate = false;
                    } else {
                        let options = [];
                        let userAnswer = '';
                        item.examOption.forEach((obj) => {
                            if (obj.value) {
                                userAnswer = item.examOption.indexOf(obj);
                            }
                            options.push(obj.label)
                        })
                        examTopic.push({
                            examTopic: item.examTopic,
                            correctAnswer: item.correctAnswer,
                            examOption: options,
                            userAnswer: userAnswer
                        })
                    }
                })
                if (!validate) {
                    Toast({
                        message: '您还有未完成的题目',
                        position: 'middle',
                        duration: 1500
                    });
                    return false;
                }
                Indicator.open({
                    spinnerType: 'fading-circle'
                });
                setTimeout(() => {
                    let errors = [];
                    let score = 0;
                    submitDatas.forEach((item) => {
                        item.correctAnswer = JSON.parse(item.correctAnswer);
                        if (item.correctAnswer != item.userAnswer) {
                            item.examOption[item.userAnswer].value = 'checked';
                            item.examOption[item.correctAnswer].value = true;
                            errors.push(item);
                        } else {
                            score = score + item.subjectScore
                        }
                    })

                    this.result = {
                        examTitle: '模拟考试结果',
                        score: score,
                        examTopic: errors
                    }
                    let from = {
                        path: '/train'
                    }
                    Indicator.close()
                    window.mkoBackButton.bInputData = false;
                    this.$MKOPush({
                        path: '/exam_result',
                        query: {
                            result: this.result,
                            isSimulation: true
                        }
                    }, from, true)
                }, 1500);
            },
            back() {
                if (this.bInputData && this.examShow == 1 && !this.isTimeup) {
                    this.$MKODialog({title: '提示', msg: '返回上一级将不会保存当前操作，确认要返回吗？', cancelBtn: true}).then(action => {
                        if (action == 'confirm') {
                            window.mkoBackButton.bInputData = false;
                            this.$MKOPop()
                        } else {

                        }
                    });
                } else {
                    this.$MKOPop()
                }
            },
            onInputData() {
                let self = this;
                this.bInputData = true;
                window.mkoBackButton = {};
                window.mkoBackButton.bInputData = true;
                window.mkoBackButton.callback = function (action) {
                    self.$MKODialog({title: '提示', msg: '返回上一级将不会保存当前操作，确认要返回吗？', cancelBtn: true}).then(action => {
                        if (action == 'confirm') {
                            window.mkoBackButton.bInputData = false;
                            self.$MKOPop()
                        }
                    });
                }
            }
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
