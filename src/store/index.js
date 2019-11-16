import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser()
  },
  mutations: {
    setUser (state, user) {
      state.user = user

      // 修改之后刷新会重新获取，所以要设置回user
      auth.setUser(user)
    },
    delUser (state) {
      state.user = {}
      // 同时删除本地
      auth.delUser()
    }
  },
  actions: {
  },
  modules: {
  }
})
