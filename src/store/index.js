
import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import * as getters from './getters';
import * as actions from './actions';
import mutations from './mutations';
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  // 检查state的修改是否来源于action和mutation
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store