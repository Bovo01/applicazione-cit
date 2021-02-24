export default {
  state: {
    firebaseApp: null,
  },
  mutations: {
    setApp(state, firebaseApp) {
      state.firebaseApp = firebaseApp;
    },
    /**
     * Il payload contiene:
     * tableName = il nome della tabella in cui bisogna aggiungere
     * item = l'oggetto da aggiungere
     */
    addElement(state, payload) {
      state.firebaseApp.firestore().collection(payload.tableName).add(payload.item);
    },
  },
  getters: {
    database: state => state.firebaseApp.firestore(),
    storage: state => state.firebaseApp.storage(),
  }
}