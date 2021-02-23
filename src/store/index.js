import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    database: Object,
    storage: Object,
    user: undefined,
    pass: undefined,
    admin: false
  },
  mutations: {
    setDb(state, db) {
      state.database = db;
    },
    setStorage(state, storage) {
      state.storage = storage;
    },
    /**
     * Il payload contiene:
     * tableName = il nome della tabella in cui bisogna aggiungere
     * item = l'oggetto da aggiungere
     */
    addElement(state, payload) {
      state.database.collection(payload.tableName).add(payload.item);
    },
    setUser(state, user) {
      state.user = user;
    },
    setPass(state, pass) {
      state.pass = pass;
    },
    setAdmin(state, admin) {
      state.admin = admin;
    },
    logout(state) {
      state.user = undefined;
      state.pass = undefined;
    }
  },
  actions: {},
  modules: {},
  getters: {
    database: state => state.database,
    storage: state => state.storage,
    user: state => state.user,
    pass: state => state.pass,
    admin: state => state.admin
  }
});