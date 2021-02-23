<template>
  <div>
    <navbar />
    <b-container class="text-center">
      <h3>
        Buongiorno <b>{{ $store.getters.user }}</b> e benvenuto
        nell'applicazione delle cit
      </h3>
      <div style="margin-top: 5">
        <b-row>
          <router-link to="/cits">Visualizza tutte le cit</router-link></b-row
        >
        <b-row>
          <router-link to="/add-cit" v-if="$store.getters.admin"
            >Crea una nuova cit</router-link
          ></b-row
        ><b-row>
          <router-link to="/persone"
            >Visualizza le persone che possono dire le cit</router-link
          ></b-row
        ><b-row>
          <router-link to="/add-person" v-if="$store.getters.admin"
            >Aggiungi una persona</router-link
          ></b-row
        >
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