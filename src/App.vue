<template>
  <div class="main-page-wrap" id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import * as types from './store/mutation-types'
import api from 'api'

export default {
  name: 'app',
  mounted() {
    this.$setUpdateServerUrl(`http://www.aqfwy.com/api/appManager/info`, 'TEST');
    let userData = localStorage.getItem('USER_DATA');
    if (userData && userData.length > 0) {
      userData = JSON.parse(userData);
      this.$store.commit(types.USER_INIT_DATA, userData);
      let groupIdAndRole = `${userData.groupId}_Role_${userData.role}`;
      let groupId = userData.groupId;
      let userName = userData.userName;
      let tags = [groupIdAndRole, groupId];
      this.$registerPUSHService(tags.join(','), userData.userName);
      this.$Login(userName, groupId);
    } else {
      this.$MKOJump('/login');
    }
    // this.getAppState()
  },
  methods: {
    //获取APP状态
    getAppState() {
      api.getAppState().then(result => {
        if (!result) return false;
        if (result.code == 0) {
          if (result.response.status == 1) {
            this.$MKOJump({
              path: '/login',
              query: {
                appState: 1,
                time: '2017-05-10'
              }
            });
          }
        } else {

        }
      })
    }
  }
}
</script>

<style lang="less" src="./app.less">

</style>
