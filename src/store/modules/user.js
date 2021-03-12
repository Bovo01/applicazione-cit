export default {
  state: {
    user: undefined,
    pass: undefined,
    viewPermission: false,
    admin: false,
    userId: undefined,
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
    setPermissions(state, viewPermission) {
      state.viewPermission = viewPermission;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    logout(state) {
      state.user = undefined;
      state.pass = undefined;
    }
  },
  getters: {
    user: state => state.user,
    pass: state => state.pass,
    admin: state => state.admin ?? false,
    userId: state => state.userId,
    permissions: state => state.viewPermission ?? false
  }
}