<template>
  <div>
    <navbar />
    <b-container>
      <!-- Nome -->
      <b-row align-v="center" class="my-2">
        <b-col align="right" align-self="end">
          <label class="demonstration">Nome</label></b-col
        >
        <b-col align="left">
          <el-input placeholder="Inserisci il nome" v-model="nome"></el-input
        ></b-col>
      </b-row>
      <!-- Data di nascita -->
      <b-row align-v="center" class="my-2">
        <b-col align="right" align-self="end">
          <label class="demonstration">Data di nascita</label></b-col
        >
        <b-col align="left">
          <el-date-picker
            v-model="birth_date"
            type="date"
            placeholder="Seleziona data"
            format="dd/MM/yyyy"
          >
          </el-date-picker
        ></b-col>
      </b-row>

      <div class="text-center" style="margin-top: 10%">
        <el-button type="success" plain @click="insert()"
          >Aggiungi persona</el-button
        >
      </div>
    </b-container>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      birth_date: "",
      nome: "",
    };
  },
  methods: {
    insert() {
      if (this.nome === "") {
        this.error("Devi inserire il nome");
        return;
      }
      this.$store.commit("addElement", {
        tableName: "persone",
        item: { birth_date: this.birth_date ?? null, nome: this.nome },
      });
      this.$router.push({ name: "Home" });
    },
    error(message) {
      message = message ?? "Errore";
      this.$notify.error({
        title: "Errore",
        message,
      });
    },
  },
};
</script>