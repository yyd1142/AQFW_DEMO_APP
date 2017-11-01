<template>
  <div>
    <div class="placeholder-item"></div> 
    <mko-header title="风险级别" left-icon="icon-back" @handleLeftClick="changePage"></mko-header>
    <div class="page-wrap hdc-sel-wrap">
      <mt-search class="search-wrap"></mt-search>
      <div class="data-wrap">
        <mt-cell :title="item.name" @click="selData(item.name)"  v-for="item in levelList"></mt-cell>
      </div>
    </div>
  </div>
</template>

<style lang="less" rel="stylesheet/less">
</style>

<script>
  let list = [
    {name: '万象城A栋'},
    {name: '万象城B栋'},
    {name: '万象城C栋'}
  ];
  export default{
    data() {
      return {
        levelList:[]
      }
    },
    created() {
      this.levelList = list;
    },
    methods: {
      selData(val){
        this.$emit('sel', val);
      },
      changePage(){
        this.$emit('changePage', 'main');
      }
    },
    components: {}
  }
</script>


