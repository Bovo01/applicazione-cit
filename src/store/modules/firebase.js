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
    /**
     * Il payload contiene:
     * tableName = il nome della tabella in cui bisogna modificare
     * id = l'id dell'oggetto da modificare
     * item = l'oggetto contenente le modifiche
     */
    editElement(state, payload) {
      state.firebaseApp.firestore().collection(payload.tableName).doc(payload.id).update(payload.item);
    },
    /**
     * Il payload contiene:
     * tableName = il nome della tabella in cui bisogna eliminare
     * id = l'id dell'oggetto da eliminare
     */
    deleteElement(state, payload) {
      state.firebaseApp.firestore().collection(payload.tableName).doc(payload.id).delete();
    }
  },
  getters: {
    database: state => state.firebaseApp.firestore(),
    storage: state => state.firebaseApp.storage(),
  }
}