<template>
  <div id="app">
    <loading
      :active.sync="$store.getters.isLoading"
      :can-cancel="false"
      :is-full-page="true"
    />
    <router-view />
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import Firebase from "firebase";
import "firebase/firestore";

export default {
  components: {
    Loading
  },
  beforeCreate() {
    if (this.$store.state.firebase.firebaseApp === null) {
      // Initialize Firebase
      let firebaseApp = Firebase.initializeApp({
        apiKey: "AIzaSyDcORjXovpvnRC2uGsDFVOLGpOjzuLrjRc",
        authDomain: "storage-cit.firebaseapp.com",
        databaseURL:
          "https://storage-cit-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "storage-cit",
        storageBucket: "storage-cit.appspot.com",
        messagingSenderId: "11199924806",
        appId: "1:11199924806:web:6892521b73099f3511d847",
        measurementId: "G-2RNP8Z8RY5",
      });
      /* Carico l'app in Vuex */
      this.$store.commit("setApp", firebaseApp);
      /*
       * Tabelle presenti:
       *
       * account
       * persone
       * cit
       */
    }
  },
};
</script>

<style>
div.container {
  margin-top: 5%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
