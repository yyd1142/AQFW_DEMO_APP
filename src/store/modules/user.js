import * as types from '../mutation-types'
import api from 'api'

const state = {
  user: {},
  isAdmin: false,
  isTopAdmin: false,
  keepAlive: false
}

const getters = {
  userName: (state) => {
    return state.user.userName;
  },
  employeeName: (state) => {
    return state.user.employeeName;
  },
  groupId: (state) => {
    return state.user.groupId
  },
  UUID: (state) => {
    return state.user.UUID
  },
  executorAndEmployeeName: (state) => {
    return `${state.user.userName}|${state.user.employeeName}`;
  }
}

const actions = {
  saveUserData({commit, state}, data) {
    let userInfo = data.userData;
    localStorage.setItem('USER_DATA', JSON.stringify(userInfo));
    commit(types.USER_INIT_DATA, userInfo);
    data.callback(true);
  },
  logout({commit, state}) {
    localStorage.removeItem('USER_DATA');
    commit(types.USER_INIT_DATA, {});
  }
}

const mutations = {
  [types.USER_INIT_DATA](state, userInfo) {
    let role = userInfo.role;
    let roleRuls = userInfo.roleRuls || '';
    state.isAdmin = (role == 2 || roleRuls.indexOf('0') != -1) ? true : false;
    state.isTopAdmin = (role == 2 ) ? true : false;
    state.user = userInfo;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
