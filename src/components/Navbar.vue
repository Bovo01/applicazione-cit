<template>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/home">Home page</b-nav-item>
        <b-nav-item to="/cits">Elenco cit</b-nav-item>
        <b-nav-item to="/add-cit" v-if="admin">Aggiungi cit</b-nav-item>
        <b-nav-item to="/persone">Elenco persone</b-nav-item>
        <b-nav-item to="/add-person" v-if="admin">Aggiungi persona</b-nav-item>
        <b-nav-item to="/luoghi">Elenco luoghi</b-nav-item>
        <b-nav-item to="/add-luogo" v-if="admin">Aggiungi luogo</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <i class="fas fa-user"></i>
          </template>
          <b-dropdown-item to="/profile">Profilo</b-dropdown-item>
          <b-dropdown-item @click="logout()"> Logout </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { login } from "@/plugins/functions.js";

export default {
  methods: {
    logout() {
      this.$store.commit("logout");
      this.$router.push({ name: "Login" });
    },
  },
  mounted() {
    let user = this.$store.getters.user;
    let pass = this.$store.getters.pass;
    login(user, pass, this);
  },
  computed: {
    admin: function () {
      return this.$store.getters.admin;
    },
  },
};
</script>