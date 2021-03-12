<template>
  <div>
    <navbar />
    <b-container class="text-center">
      <h3>
        Buongiorno <b>{{ $store.getters.user }}</b> e benvenuto
        nell'applicazione delle cit
      </h3>
      <div style="margin-top: 5; margin-left: 3%">
        <b-row>
          <router-link to="/cits">Visualizza tutte le cit</router-link>
        </b-row>
        <b-row v-if="$store.getters.admin">
          <router-link to="/add-cit">Crea una nuova cit</router-link>
        </b-row>
        <b-row>
          <router-link to="/persone">
            Visualizza le persone che possono dire le cit
          </router-link>
        </b-row>
        <b-row v-if="$store.getters.admin">
          <router-link to="/add-person">Aggiungi una persona</router-link>
        </b-row>
        <b-row>
          <router-link to="/luoghi">Visualizza i luoghi</router-link>
        </b-row>
        <b-row v-if="$store.getters.admin">
          <router-link to="/add-luogo">Aggiungi un luogo</router-link>
        </b-row>
        <b-row v-if="$store.getters.admin">
          <router-link to="/backups">Visualizza/Ripristina backups</router-link>
        </b-row>
        <b-row v-if="$store.getters.admin">
          <router-link to="/accept-permissions">Accetta permessi di visione/amministratore</router-link>
        </b-row>
        <b-row v-else>
          <router-link to="/request-permissions">Richiedi permessi di visione/amministratore</router-link>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  components: {
    Navbar,
  },
};
</script>

<style scoped>
div.row {
  margin-top: 3%;
}
</style>