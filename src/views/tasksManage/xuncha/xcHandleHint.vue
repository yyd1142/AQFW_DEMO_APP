<template>
  <div class="xc-handle-hint-wrap" :class="{'no-spot':status==0}">
    <div class="box">
      <div class="contact" v-html="info[status].contact"></div>
      <mko-button :text="info[status].btnText" :plain="status!=0" @click="info[status].handle"></mko-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['status'],
    data () {
      return {
        info: [
          {
            contact: `<div class="no-data-sign"></div>当前没有巡查点，<br>需创建巡查点与设备被才能执行任务。`,
            btnText: '开始创建',
            handle: this.goSpotAdd
          },
          {
            contact: `<span class="key">日常巡查是长期任务，一旦创建长期有效。</span><br>创建日常巡查任务需指定执行人员，<br>未指定执行人员的巡查点所有人均可执行。`,
            btnText: '开始创建',
            handle: this.goTaskAdd
          },
          {
            contact: `<span class="key">临时巡查是短期任务，执行完成不再生效。</span><br>创建临时巡查任务需指定完成日期，<br>并要求执行人员在规定日期执行任务。`,
            btnText: '开始创建',
            handle: this.goTaskAdd
          },
        ]
      }
    },
    watch: {},
    computed: {},
    mounted() {
    },
    activated(){
    },
    deactivated() {
    },
    destroyed(){
    },
    methods: {
      goSpotAdd(){
        this.$MKOPush('/spot_add')
      },
      goTaskAdd(){
        let type = this.status == 1 ? 'routine' : 'temporary';
        this.$MKOPush('/xc_task_add/' + type)
      }
    },
    components: {}
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../config.less";

  .xc-handle-hint-wrap {
    position: fixed;
    top: @headerHeight+@headerTop+109px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    &.no-spot {
      top: @headerHeight+@headerTop;
    }
    .box {
      position: absolute;
      top: 103px;
      left: 50%;
      transform: translate(-50%, 0);
      -webkit-transform: translate(-50%, 0);
      min-height: 100px;
      width: 100%;
      line-height: 22px;
      font-size: 14px;
      overflow: auto;
      color: @baseText01;
      .contact {
        margin-bottom: 10px;
        text-align: center;
        .key {
          line-height: 38px;
        }
      }
      .mko-button {
        margin: auto;
      }
    }
    .no-data-sign {
      margin: 0 auto 30px;
      width: 35px;
      height: 50px;
      background: url('/static/icons/resource.png') -668px -237px no-repeat;
      background-size: @bg-size;
      display: block;
    }
  }
</style>
