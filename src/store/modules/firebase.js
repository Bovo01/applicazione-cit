export default {
  state: {
    firebaseApp: null,
  },
  mutations: {
    setApp(state, firebaseApp) {
      state.firebaseApp = firebaseApp;
    }
  },
  actions: {
    /**
     * Il payload contiene:
     * fromTable = tabella dalla quale faccio il backup
     * toTable = tabella in cui salvo il backup
     * id = l'id dell'elemento da copiare
     */
    async copyElement({
      getters
    }, payload) {
      let response = await getters.database
        .collection(payload.fromTable)
        .doc(payload.id)
        .get();
      getters.database
        .collection(payload.toTable)
        .add(response.data());
    },
    /**
     * Il payload contiene:
     * tableName = il nome della tabella in cui bisogna eliminare
     * id = l'id dell'oggetto da eliminare
     */
    async deleteElement({
      getters
    }, payload) {
      getters.database
        .collection(payload.tableName)
        .doc(payload.id)
        .delete();
    },
    /**
     * Il payload contiene:
     * tableName = il nome della tabella in cui bisogna modificare
     * id = l'id dell'oggetto da modificare
     * item = l'oggetto contenente le modifiche
     */
    async editElement({
      getters
    }, payload) {
      getters.database
        .collection(payload.tableName)
        .doc(payload.id)
        .update(payload.item);
    },
    /**
     * Il payload contiene:
     * tableName = il nome della tabella in cui bisogna aggiungere
     * item = l'oggetto da aggiungere
     */
    async addElement({
      getters
    }, payload) {
      getters.database
        .collection(payload.tableName)
        .add(payload.item);
    }
  },
  getters: {
    database: state => state.firebaseApp.firestore(),
    storage: state => state.firebaseApp.storage(),
  }
}