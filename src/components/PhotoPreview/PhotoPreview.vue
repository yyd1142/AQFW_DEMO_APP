<template>
  <div class="photo-preview-one">
    <mt-popup v-model="popupShow">
      <div class="photo">
        <img :src="img" width="350" height="350">
      </div>
      <!--<mt-button class="btn" type="primary" size="large" @click="download">下载图片</mt-button>-->
    </mt-popup>
    <mt-actionsheet v-model="sheetShow" :actions="actions" cancelText="取消"></mt-actionsheet>
  </div>
</template>

<style lang="less" rel="stylesheet/less">
  @import "../../config.less";

  .photo-preview-one {
    .mint-popup {
      padding-top: 30px;
      background: none;
      .photo {
        img {
          border-radius: 4px;
        }
      }
      .btn {
        margin-top: 20px;
        &.mint-button--primary{
          background-color: @mainBlue;
        }
      }
    }
    .v-modal {
      opacity: .8;
      background: #565656;
    }
  }
</style>

<script>
  export default{
    props: ['img', 'value'],
    data() {
      return {
        popupShow: false,
        sheetShow: false,
        actions: [],
      }
    },
    watch: {
      value(val){
        this.popupShow = val;
      },
      popupShow(val) {
        this.$emit('input', val)
      }
    },
    created() {
      this.actions = [
        {name: '确认删除', method: this.deletePhoto},
      ]
    },
    computed: {
    },
    methods: {
      show(){
        this.popupShow = true;
      },
      deletePhoto(){
//          this.$emit('',this.photoId);
      },
      download(){
        this.$emit('download')
      }
    },
    components: {}
  }
</script>


