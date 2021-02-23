<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Firebase from "firebase";
import "firebase/firestore";

export default {
  mounted() {
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
    // Creazione database
    let db = firebaseApp.firestore();
    /* Carico il db in Vuex */
    this.$store.commit("setDb", db);
    /*
     * Tabelle presenti:
     *
     * account
     * cit
     * persone
     */
  },
};
</script>

<style>
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
