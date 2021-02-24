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
      <!-- Bottoni footer -->
      <div class="text-center" style="margin-top: 10%">
        <el-button type="success" plain @click="modifica()" v-if="edit"
          >Modifica persona</el-button
        >
        <el-button type="success" plain @click="insert()" v-else
          >Aggiungi persona</el-button
        >
      </div>
    </b-container>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import moment from "moment";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      birth_date: "",
      nome: "",
      edit: false,
    };
  },
  methods: {
    modifica() {
      if (this.nome === "") {
        this.error("Devi inserire il nome");
        return;
      }
      this.$store.commit("editElement", {
        tableName: "persone",
        id: this.$route.params.id,
        item: {
          birth_date: this.dateToString(this.birth_date) ?? null,
          nome: this.nome,
        },
      });
      this.$router.push({ name: "Elenco persone" });
    },
    insert() {
      if (this.nome === "") {
        this.error("Devi inserire il nome");
        return;
      }
      this.$store.commit("addElement", {
        tableName: "persone",
        item: {
          birth_date: this.dateToString(this.birth_date),
          nome: this.nome,
        },
      });
      this.$router.push({ name: "Elenco persone" });
    },
    error(message) {
      message = message ?? "Errore";
      this.$notify.error({
        title: "Errore",
        message,
      });
    },
    dateToString(date) {
      if (date === undefined || date === null || date === "") return null;
      return (
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        "/" +
        (date.getMonth() < 9
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "/" +
        date.getFullYear()
      );
    },
    setPerson() {
      if (this.$route.params.id !== undefined) {
        let self = this;
        this.$store.getters.database
          .collection("persone")
          .doc(this.$route.params.id)
          .get()
          .then((response) => {
            if (response.data() === undefined) {
              self.$router.push({ name: "Add person" });
              return;
            }
            self.edit = true;
            // Imposto le variabili della view
            self.nome = response.data().nome;
            let date = moment(response.data().birth_date, "DD/MM/YYYY");
            self.birth_date = date.isValid() ? date.toDate() : "";
          });
      }
    },
  },
  mounted() {
    this.setPerson();
  },
  watch: {
    $route: function (to) {
      if (to.name === "Add person") {
        this.edit = false;
        this.nome = "";
        this.birth_date = "";
      } else {
        this.setPerson();
      }
    },
  },
};
</script>