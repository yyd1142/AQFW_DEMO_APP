<template>
  <div>
    <div class="placeholder-item"></div>
    <mko-header title="数据统计" left-icon="icon-back" @handleLeftClick="back"></mko-header>
    <div class="page-wrap data-count-info-wrap">
      <div class="section">
        <div class="folder">任务执行情况</div>
        <div class="sub-folder">
          <div id="" style="margin: 0 auto; width:90%; height:300px">
            <div class="item">
              <p class="lab">任务总数</p>
              <p class="val">368</p>
            </div>
            <div class="item">
              <p class="lab">任务完成数</p>
              <p class="val">327</p>
            </div>
            <div class="item">
              <p class="lab">任务完成率</p>
              <p class="val">88.86%</p>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="folder">任务完成率趋势</div>
        <div class="sub-folder">
          <div id="chart5" style="margin: 0 auto; width:90%; height:400px"></div>
        </div>
      </div>
      <div class="section">
        <div class="folder">人员任务完成率排名</div>
        <div class="sub-folder">
          <table width="90%">
            <thead>
            <tr>
              <th width="10%">排名</th>
              <th width="70%">安全员</th>
              <th width="20%">完成率</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>1</td>
              <td>单阳飙</td>
              <td>86.67%</td>
            </tr>
            <tr>
              <td>2</td>
              <td>赵明洁</td>
              <td>87.10%</td>
            </tr>
            <tr>
              <td>3</td>
              <td>缪依云</td>
              <td>87.30%</td>
            </tr>
            <tr>
              <td>4</td>
              <td>雀晓桐</td>
              <td>88.14%</td>
            </tr>
            <tr>
              <td>5</td>
              <td>粟涵亮</td>
              <td>88.52%</td>
            </tr>
            <tr>
              <td>6</td>
              <td>蔺雪晴</td>
              <td>95.24%</td>
            </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" rel="stylesheet/less">
  .data-count-info-wrap {
    background: #fff;
    p, div, ul {
      margin: 0;
      padding: 0;
    }

    .section {
      border-bottom: #ccc 1px solid;
    }

    .folder {
      display: block;
      width: 100%;
      height: 48px;

      text-align: center;
      line-height: 48px;
    }

    .folder p {
      line-height: 48px;
      padding: 0;
      display: block;

    }

    .item {
      padding: 20px 0;
    }

    .item .lab {
      text-align: left;
      float: left;
      width: 60%;
      margin-left: 12px;
    }
    .item .val {
      text-align: right;
      float: right;
      width: 20%;
      margin-right: 12px;
    }

    .sub-folder {
      position: relative;
      margin-top: 30px;
      /*display: none;*/
    }

    .sub-folder table {
      padding-bottom: 50px;
      margin: 0 auto;
    }
    .sub-folder table tr, .sub-folder table td {
      text-align: center;
      line-height: 38px;
    }
  }
</style>

<script>
  import echarts from 'echarts';
  let theme = 'macarons';
  export default{
    data() {
      return {}
    },
    mounted() {
      this.$nextTick(() => {
        this.DrawChart5(echarts);
      });
    },
    methods: {
      DrawChart5(ec){
        var chart = ec.init(document.getElementById('chart5'), theme);
        chart.setOption({
          title: {
            text: '任务完成率趋势',
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['最高分']
          },

          calculable: true,
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: ['2016年8月', '2016年9月', '2016年10月', '2016年11月', '2016年12月', '2017年1月', '2017年2月']
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '百分比',
              axisLabel: {
                formatter: '{value} '
              }
            }
          ],
          series: [
            {
              name: '当月分数',
              type: 'line',
              data: [89.54, 87.06, 89.71, 84.77, 87.71, 87.04, 88.86],
              markPoint: {
                data: [
                  {name: '2016年8月', value: 89.54, xAxis: 0, yAxis: 89.54},
                  {name: '2016年9月', value: 87.06, xAxis: 1, yAxis: 90.80},
                  {name: '2016年10月', value: 89.71, xAxis: 2, yAxis: 89.71},
                  {name: '2016年11月', value: 84.77, xAxis: 3, yAxis: 84.77},
                  {name: '2016年12月', value: 87.71, xAxis: 4, yAxis: 87.71},
                  {name: '2017年1月', value: 87.04, xAxis: 5, yAxis: 87.04},
                  {name: '2017年2月', value: 88.86, xAxis: 6, yAxis: 88.86},
                ]
              },


            },
          ]


        });
      },
      back() {
        this.$MKOPop()
      }
    },
    components: {}
  }
</script>


