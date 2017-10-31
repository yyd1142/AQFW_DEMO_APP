import * as types from '../mutation-types'
import api from 'api'
const state = {
    lastTaskTabIndex: 0
}

const getters = {
    keepAliveUpdateTime: (state) => {
        return state.keepAliveUpdateTime;
    }
}

const actions = {

}

const mutations = {
    [types.APPSTATE_CHANGE_LAST_TABINDEX](state, index) {
        state.lastTaskTabIndex = index;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
