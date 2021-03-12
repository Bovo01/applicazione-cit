export default {
  state: {
    loading: false
  },
  actions: {
    startLoading({ state }) {
      state.loading = true;
    },
    stopLoading({ state }) {
      state.loading = false;
    }
  },
  getters: {
    isLoading: state => state.loading
  }
}