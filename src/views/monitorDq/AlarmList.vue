<template>
  <div class="alarm-list-wrap">
      <div class="title-info">
          <div class="label fl">实时报警记录</div>
          <div class="value fr">共2条记录</div>
      </div>
      <mko-double-cell title="测温式电气火宅监控探测器"
                       label="温度报警，警告值：0.0~60.0℃" is-link>
          未处理
      </mko-double-cell>
      <mko-double-cell title="剩余电流式电气火灾监控探测器"
                       label="温度报警，警告值：0.0~0.6A" is-link>
          已通知
      </mko-double-cell>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
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
    methods: {},
    components: {}
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../config.less";
    .monitor-dq-wrap{
        .alarm-list-wrap{

        }
    }
</style>
