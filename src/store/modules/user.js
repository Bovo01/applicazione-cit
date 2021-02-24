export default {
  state: {
    user: undefined,
    pass: undefined,
    admin: false
  },
  mutations: {
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
  getters: {
    user: state => state.user,
    pass: state => state.pass,
    admin: state => state.admin
  }
}