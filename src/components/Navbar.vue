<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <!-- Home page -->
    <el-menu-item index="/home">Home</el-menu-item>
    <!-- Cit -->
    <el-submenu v-if="$store.getters.admin" index="/dropdown-cits">
      <template slot="title">Cits</template>
      <el-menu-item index="/cits">Elenco cit</el-menu-item>
      <el-menu-item index="/add-cit">Aggiungi cit</el-menu-item>
    </el-submenu>
    <el-menu-item index="/cits" v-else-if="$store.getters.permissions">
      Elenco cit
    </el-menu-item>
    <!-- Persone -->
    <el-submenu v-if="$store.getters.admin" index="/dropdown-persone">
      <template slot="title">Persone</template>
      <el-menu-item index="/persone">Elenco persone</el-menu-item>
      <el-menu-item index="/add-person">Aggiungi persona</el-menu-item>
    </el-submenu>
    <el-menu-item index="/persone" v-else-if="$store.getters.permissions">
      Elenco persone
    </el-menu-item>
    <!-- Luoghi -->
    <el-submenu v-if="$store.getters.admin" index="/dropdown-luoghi">
      <template slot="title">Luoghi</template>
      <el-menu-item index="/luoghi">Elenco luoghi</el-menu-item>
      <el-menu-item index="/add-luogo">Aggiungi luogo</el-menu-item>
    </el-submenu>
    <el-menu-item index="/luoghi" v-else-if="$store.getters.permissions">
      Elenco luoghi
    </el-menu-item>
    <!-- Backups -->
    <el-menu-item index="/backups" v-if="$store.getters.admin">
      Backups
    </el-menu-item>
    <!-- Permessi -->
    <el-menu-item index="/accept-permissions" v-if="$store.getters.admin">
      Accetta permessi
    </el-menu-item>
    <el-menu-item index="/request-permissions" v-else>
      Richiedi permessi
    </el-menu-item>

    <!-- Dropdown a destra (profilo) -->
    <el-submenu index="/dropdown-profilo" style="float: right">
      <template slot="title"><i class="fas fa-user" /></template>
      <el-menu-item index="/profile"> Profilo </el-menu-item>
      <el-menu-item @click="logout()" index="logout"> Logout </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import { login } from "@/plugins/functions.js";

export default {
  data() {
    return {
      activeIndex: "",
    };
  },
  methods: {
    logout() {
      this.$store.commit("logout");
      this.$router.push({ name: "Login" });
    },
    handleSelect(path) {
      if (path && this.$route.path !== path) this.$router.push({ path });
    },
  },
  mounted() {
    this.$store.dispatch("startLoading");
    let user = this.$store.getters.user;
    let pass = this.$store.getters.pass;
    login(user, pass, this);
    this.activeIndex = this.$route.path;
    this.$store.dispatch("stopLoading");
  },
  computed: {
    admin: function () {
      return this.$store.getters.admin;
    },
  },
};
</script>