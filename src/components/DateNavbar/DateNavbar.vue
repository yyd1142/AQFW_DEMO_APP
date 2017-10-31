<template>
  <div class="date-navbar">
    <mt-navbar>
      <mt-tab-item :id="index"  v-for="(item,index) in dateList">
        <div @click="selDate(item.value)">
          <div class="day">{{item.day}}</div>
          <div class="date">{{item.date}}</div>
        </div>
      </mt-tab-item>
    </mt-navbar>
  </div>
</template>

<style lang="less" rel="stylesheet/less">
@import '../../config.less';
  .date-navbar {
    box-shadow: 0 2px 6px 0 rgba(212, 212, 212, 0.50);
    position: fixed;
    width: 100%;
    top: 40px + @headerTop;
    z-index: 10;
    .mint-tab-item {
      padding-top: 5px;
      padding-bottom: 3px;
      &:nth-child(3) {
        border-bottom: 3px solid #26a2ff;
        .day, .date {
          color: #0398FF;
        }
      }
      .day {
        line-height: 17px;
        font-size: 12px;
        color: #5E5E5E;
      }
      .date {
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
        color: #313336;
      }
    }
  }
</style>

<script>
import moment from 'moment'
  export default {
    data() {
      return {
        dateList: [
          {
            value: '',
            day: '',
            date: ''
          }
        ]
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initDateNavbar();
      })
    },
    methods: {
      selDate(value){
        this.initDateNavbar(value);
        this.selValue(value);
      },
      initDateNavbar(_date) {
        let dateList = [];
        let selDate = _date || new Date();
        let selDateDate = selDate.getDate();
        for (let i = -2; i < 3; i++) {
          let date = new Date(selDate);
          date.setDate(selDateDate + i);
          dateList.push(date);
        }
        this.dateList = dateList.map((item) => {
          return this.translateDate(item);
        });
      },
      translateDate(_date) {
        let day = _date.getDay();
        let today = new Date();
        if (_date.getFullYear() === today.getFullYear() && _date.getMonth() === today.getMonth() && _date.getDate() === today.getDate()) {
          day = '今天';
        } else {
          const dayList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
          day = dayList[day];
        }
        let date = moment(_date).format('MM月DD日');
        return {
          value: _date,
          day: day,
          date: date
        };

      },
      selValue(dateValue) {
        this.$emit('sel', dateValue);
//        console.log(dateValue);
      }
    },
    components: {}
  }

</script>
