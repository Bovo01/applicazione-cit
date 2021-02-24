import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import firebase from './modules/firebase'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({
    paths: ['user']
  })],
  modules: {
    user,
    firebase
  }
});