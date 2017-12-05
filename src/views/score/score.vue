<template>
  <div>
    <div class="placeholder-item" :style="{backgroundColor:calcHeadColor(score.totalScore)}"></div>
    <mko-header title="社会单位安全评分" :background-color="calcHeadColor(score.totalScore)" left-icon="icon-back" right-icon-text="往期得分" @handleLeftClick="back" @handleRightClick="goPastScore"></mko-header>
    <div class="page-wrap score-page-wrap">
      <score-banner :unit-info="unitInfo" :unit-score="score.totalScore"></score-banner>

      <div class="bar-wrap">
        <div class="item des" :class="`color-${item.minScore}`" v-for="item in barData">
          <i class="sign abs-middle" :class="`color-${item.minScore}`" v-if="item.active"></i>{{item.text}}
        </div>
      </div>
      <div class="bar-wrap">
        <div class="item" :class="{'active':item.active}" v-for="item in barData">
          {{item.score}}分
        </div>
      </div>
      <!--总分-->
      <div class="total">
        <div class="label">社会单位安全评分构成 (共100分)</div>
        <div class="val">合计 {{score.totalScore | scoreFilter}}分</div>
      </div>
      <!--火灾风险评估得分-->
      <mko-menu-header title="建筑火灾风险评分 (共20分)" icon="icon-info" @clickIcon="showScoreDesc('jzhz')"
                       @show="showDetail.jzhz=!showDetail.jzhz">
        {{score.jzhzScore | scoreFilter}}分
      </mko-menu-header>
      <div v-show="showDetail.jzhz">
        <mko-menu-cell title="建筑属性">{{score.jzhzScore | scoreFilter}}分</mko-menu-cell>
      </div>

      <!--消防设施管理得分-->
      <mko-menu-header title="消防设施管理评分 (共20分)" icon="icon-info" @clickIcon="showScoreDesc('xfsssb')"
                       @show="showDetail.xfsssb=!showDetail.xfsssb">
        {{score.xfsssbScore | scoreFilter}}分
      </mko-menu-header>
      <div v-show="showDetail.xfsssb">
        <mko-menu-cell title="消防设施完好率">{{score.xfsssbScore | scoreFilter}}分</mko-menu-cell>
      </div>

      <!--消防安全管理得分-->
      <mko-menu-header title="消防安全管理得分 (共60分)" icon="icon-info" @clickIcon="showScoreDesc('xfaqgl')"
                       @show="showDetail.xfaqgl=!showDetail.xfaqgl">
        {{score.xfaqglScore | scoreFilter}}分
      </mko-menu-header>
      <div v-show="showDetail.xfaqgl">
        <mko-menu-cell title="基本信息完善率">{{basicInfoScore | scoreFilter}}分</mko-menu-cell>
        <mko-menu-cell title="消控中心在岗率">{{score.ryzbScore | scoreFilter}}分</mko-menu-cell>
        <mko-menu-cell title="人员履职率">{{score.ryxcScore | scoreFilter}}分</mko-menu-cell>
        <mko-menu-cell title="检查项目达标率">{{score.sssbCheckScore | scoreFilter}}分</mko-menu-cell>
        <mko-menu-cell title="安全管理执行率">{{aqglScore | scoreFilter}}分</mko-menu-cell>
        <mko-menu-cell title="学习培训覆盖率">{{xuexipeixunScore | scoreFilter}}分</mko-menu-cell>
        <mko-menu-cell title="第三方服务签约率">{{disanfangScore | scoreFilter}}分</mko-menu-cell>
        <mko-menu-cell title="物联网设备接入率">{{wuliuScore | scoreFilter}}分</mko-menu-cell>
      </div>

      <div class="data-count-wrap">
        <div class="section">
          <div class="folder">总体评分构成</div>
          <div class="sub-folder">
            <div id="chart1" style="margin: 0 auto; width:90%; height:380px"></div>
          </div>
        </div>
        <!--<div class="section">-->
        <!--<div class="folder">详细失分率</div>-->
        <!--<div class="sub-folder">-->
        <!--<div id="chart3" style="margin: 0 auto; width:90%; height:550px"></div>-->
        <!--</div>-->
        <!--</div>-->
        <div class="section">
          <div class="folder">总体评分趋势</div>
          <div class="sub-folder">
            <div id="chart2" style="margin: 0 auto; width:90%; height:350px"></div>
          </div>
        </div>
      </div>
      <!--<div class="btn-wrap">-->
      <!--<mt-button class="btn" size="large" @click="goPastScore()">查看往期得分</mt-button>-->
      <!--</div>-->
    </div>

  </div>
</template>

<script>
  import api from 'api'
  import conf from 'config'
  import echarts from 'echarts';
  import { ScoreBanner } from 'components';
  import { Toast, Indicator } from 'mint-ui'
//  import { MkoDialogBox } from 'mko-ui'
  import { scoreFilter, calcHeadColor, calcScoreStyle, calcBannerCircle } from 'filters'
  import moment from 'moment'

  let theme = 'macarons';
  let keys = ['dwInfoScore', 'jzInfoScore', 'ryInfoScore', 'xfsssbInfoScore', 'ryzbScore', 'ryxcScore', 'sssbCheckScore', 'xfgzryScore', 'xfaqzdScore', 'xfgzjhScore', 'xfgzlhScore', 'yjyaScore', 'yjssylScore', 'zyxfdScore', 'dqzgpxScore', 'xfaqpxqkScore', 'yggqpxScore', 'sfqywbScore', 'sfqyjcScore', 'sfqybxScore', 'spjkfxScore', 'dqjcScore', 'ywgjcScore', 'sxtjcScore', 'krqtjcScore']
  let currentScore = {};
  let pastScore = [];
  export default {
    data() {
      return {
        unitInfo: {},
        score: {},
        barData: [
          {text: '极低', score: '0-59', minScore: 1, maxScore: 59, active: false},
          {text: '较低', score: '60-69', minScore: 60, maxScore: 69, active: false},
          {text: '中等', score: '70-79', minScore: 70, maxScore: 79, active: false},
          {text: '良好', score: '80-89', minScore: 80, maxScore: 89, active: false},
          {text: '优秀', score: '90-100', minScore: 90, maxScore: 100, active: false}
        ],
        showDetail: {jzhz: false, xfsssb: false, xfaqgl: false},
        scoreDesc: conf.scoreDesc
      }
    },
    activated() {
      this.$nextTick(() => {
        this.unitInfo = JSON.parse(localStorage.getItem('USER_DATA'))
        this.getScoreList();
        this.getHistoryScoreList();
      });
    },
    deactivated() {
      this.showDetail = {jzhz: false, xfsssb: false, xfaqgl: false};
    },
    computed: {
      basicInfoScore() {
        return this.score.dwInfoScore + this.score.ryInfoScore + this.score.jzInfoScore + this.score.xfsssbInfoScore
      },
      aqglScore() {
        return this.score.xfgzryScore + this.score.xfaqzdScore + this.score.xfgzjhScore + this.score.xfgzlhScore + this.score.yjyaScore + this.score.yjssylScore + this.score.zyxfdScore
      },
      xuexipeixunScore() {
        return this.score.dqzgpxScore + this.score.xfaqpxqkScore + this.score.yggqpxScore
      },
      disanfangScore() {
        return this.score.sfqywbScore + this.score.sfqyjcScore + this.score.sfqybxScore
      },
      wuliuScore() {
        return this.score.spjkfxScore + this.score.dqjcScore + this.score.ywgjcScore + this.score.sxtjcScore + this.score.krqtjcScore
      },
      // 火灾风险评级
      hzfxLevel() {
        let value = this.score.jzhzScore
        let level = '';
        if (value >= 0 && value < 10) {
          level = '超严重级'
        } else if (value >= 10 && value < 20) {
          level = '严重级'
        } else if (value >= 20 && value < 30) {
          level = '中级'
        } else if (value >= 30) {
          level = '轻级'
        }
        return level;
      },
      userInfo() {
        return JSON.parse(localStorage.getItem('USER_DATA'))
      }
    },
    methods: {
      scoreFilter,
      showScoreDesc(type){
        this.$MKODialog({
          title: this.scoreDesc[type].title,
          msg: this.scoreDesc[type].desc,
//          cancelBtn:true
        }).then(res => {
//          console.log(res)
        });
      },
      back() {
        this.$MKOPop()
      },
      goPastScore() {
        this.$MKOPush('/past_score_list')
      },
      getScoreList() {
        Indicator.open({spinnerType: 'fading-circle'});
        let params = {
          m: 'list',
          groupId: this.$store.getters.groupId
        };
        api.getScoreList(params).then(result => {
          if (result.code == 0) {
            Indicator.close();
            if (result.msg.length <= 0) {
              return false;
            }
            let data = result.msg[result.msg.length - 1]
            let xfaqglScore = 0;
            for (let key in data) {
              for (let i = 0; i < keys.length; i++) {
                if (key == keys[i]) {
                  xfaqglScore = xfaqglScore + data[key]
                  data[key] = Math.floor(data[key] * 100) / 100;
                }
              }
            }
            data['xfaqglScore'] = Math.floor(xfaqglScore * 100) / 100;
            this.score = result.msg[result.msg.length - 1];
            currentScore = result.msg[0];
            this.calcScoreBar();
            this.DrawChart1(echarts);
            this.getHistoryScoreList();
          }
        })
      },
      getHistoryScoreList() {
        let params = {
          m: 'historyList',
          groupId: this.$store.getters.groupId,
//        count: count,
          type: 1
        };
        api.getHistoryScoreList(params).then(result => {
          if (result.code == 0) {
            pastScore = [];
            let data = result.response.datas;
            for (let i = data.length - 1; i >= 0; i--) {
              pastScore.push(data[i]);
            }
            this.DrawChart2(echarts);
          }
        })
      },
      calcScoreBar() {
        let scoreValue = this.score.totalScore;
        this.barData.forEach((score) => {
          if (scoreValue >= score.minScore && scoreValue <= score.maxScore) {
            score.active = true
          } else {
            score.active = false
          }
        });
      },
      calcHeadColor,
      calcScoreStyle,
      //数据统计
      DrawChart1(ec) {
        var chart = ec.init(document.getElementById('chart1'), theme);
        chart.setOption({


          calculable: true,
          series: [{

            type: 'pie',
            radius: [40, 100],
            center: ['50%', '35%'],
            roseType: 'area',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function (params) {
                    return params.name + '\n' + params.value + '%'
                  }
                }
              }
            },
            data: [{
              value: this.score.jzhzScore,
              name: '建筑火灾风险评分'
            },
              {
                value: this.score.xfsssbScore,
                name: '消防设施管理评分'
              },
              {
                value: this.score.xfaqglScore,
                name: '消防安全管理评分'
              }
            ]
          }]
        });
      },
      DrawChart2(ec) {
        let chart = ec.init(document.getElementById('chart2'), theme);
        let dateList = [];
        let scoreList = [];
        let Data = [];

        let matchData = function (item, x) {
          let score = item.totalScore;
          dateList.push(moment(item.createDate).format("YYYY年MM月DD日"));
          scoreList.push(score);
          Data.push({
            name: moment(item.createDate).format("YYYY年MM月DD日"),
            value: score,
            xAxis: x,
            yAxis: score
          });
        };

        //处理往期分数
        pastScore.forEach((item, index) => {
          matchData(item, index);
        });
        //处理当前分数
        matchData(currentScore, pastScore.length);

        chart.setOption({
          legend: {
            data: ['最高分']
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: dateList
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              formatter: '{value} '
            }
          }],
          series: [
            {
              name: '往期分数',
              type: 'line',
              data: scoreList,
              markPoint: {
                data: Data
              },
            },
          ]
        });
      },
      DrawChart3(ec) {
        var chart = ec.init(document.getElementById('chart3'), theme);
        var builderJson = {
          "all": 100,
          "charts": {
            "安全服务云": 0.00,
            "烟、温感监测": this.score.ywgjcScore,
            "水系统监测": this.score.sxtjcScore,
            "视频监控分析": this.score.spjkfxScore,
            "可燃气体监测": this.score.krqtjcScore,
            "电气监测": this.score.dqjcScore,
            "消防设施完好率": 0,
            "基本信息完善率": 0,
            "中介机构": 0,
            "户籍化上报率": 0,
            "检查项目达标率": 0,
            "消控中心在岗率": 0,
            "学习培训覆盖率": this.score.dqzgpxScore + this.score.xfaqpxqkScore,
            "安全管理执行率": 0,
            "人员履职率": 0,
            "建筑属性": 0
          }
        };

        chart.setOption({


          grid: [{
            top: 0,
            width: '95%',
            bottom: '10%',
            left: 0,
            containLabel: true
          }],
          xAxis: [{
            type: 'value',

            max: builderJson.all,
            splitLine: {
              show: false
            }
          }],
          yAxis: [{
            type: 'category',
            data: Object.keys(builderJson.charts),
            axisLabel: {
              interval: 0,
              rotate: 30
            },
            splitLine: {
              show: false
            }
          }],
          series: [{
            type: 'bar',
            stack: 'chart',
            z: 3,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function (params) {
                    return params.value + '%'
                  }
                }
              }
            },

            label: {
              normal: {
                position: 'right',
                show: true
              }
            },
            data: Object.keys(builderJson.charts).map(function (key) {
              return builderJson.charts[key];
            })
          }, {
            type: 'bar',
            stack: 'chart',
            silent: true,
            itemStyle: {
              normal: {
                color: '#eee'
              }
            },
            data: Object.keys(builderJson.charts).map(function (key) {
              return builderJson.all - builderJson.charts[key];
            })
          }]


        });
      },

    },
    components: {
      ScoreBanner
    }
  }
</script>

<style lang="less" src="./index.less" rel="stylesheet/less" scoped></style>
