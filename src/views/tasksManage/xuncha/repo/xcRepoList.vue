<template>
  <div>
    <div class="placeholder-item"></div>
    <mko-header title="巡查记录列表" left-icon="icon-back" @handleLeftClick="back"></mko-header>
    <div class="page-wrap xc-repo-list-wrap">
      <mko-double-cell :title="r" val="Todo" label="巡查12个设备" is-link v-for="r in list"></mko-double-cell>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        list:['记录1','记录2']
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
      back(){
        this.$MKOPop();
      }
    },
    components: {}
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../../../config.less";

  .xc-repo-list-wrap{

  }
</style>
