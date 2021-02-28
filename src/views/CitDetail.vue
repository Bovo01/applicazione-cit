<template>
  <div>
    <navbar />
    <b-container>
      <h1 class="text-center">{{ cit.title }}</h1>
      <div>
        <!-- Descrizione -->
        <b-row align-v="center" class="my-2">
          <b-col align="right" align-self="end">
            <label>Descrizione:</label>
          </b-col>
          <b-col align="left">
            <label>
              {{
                cit.description ? cit.description : "Descrizione non inserita"
              }}
            </label>
          </b-col>
        </b-row>
        <!-- Data -->
        <b-row align-v="center" class="my-2">
          <b-col align="right" align-self="end">
            <label>Data:</label>
          </b-col>
          <b-col align="left">
            <label>{{ cit.date ? cit.date : "Data non inserita" }}</label>
          </b-col>
        </b-row>
        <!-- Ora -->
        <b-row align-v="center" class="my-2">
          <b-col align="right" align-self="end">
            <label>Ora:</label>
          </b-col>
          <b-col align="left">
            <label>{{ cit.ora ? cit.ora : "Ora non inserita" }}</label>
          </b-col>
        </b-row>
        <!-- Persone -->
        <b-row align-v="center" class="my-2">
          <b-col align="right" align-self="start">
            <label>Persone:</label>
          </b-col>
          <b-col align="left">
            <ul>
              <li v-for="persona in cit.persone" :key="persona">
                {{ persona }}
              </li>
            </ul>
          </b-col>
        </b-row>
        <!-- Luogo -->
        <b-row align-v="center" class="my-2">
          <b-col align="right" align-self="start">
            <label>Luogo:</label>
          </b-col>
          <b-col align="left">
            <label>{{ cit.luogo || "Luogo non inserito" }}</label>
          </b-col>
        </b-row>
      </div>
      <!-- Bottoni footer -->
      <div
        class="text-center"
        style="margin-top: 10%"
        v-if="this.$store.getters.admin"
      >
        <el-button type="warning" plain @click="edit()">Modifica</el-button>
        <el-button type="danger" plain @click="elimina()">Elimina</el-button>
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
  data() {
    return {
      cit: {},
    };
  },
  methods: {
    edit() {
      this.$router.push({ path: `/edit-cit/${this.$route.params.id}` });
    },
    elimina() {
      this.$store.commit("deleteElement", {
        tableName: "cits",
        id: this.$route.params.id,
      });
      this.$router.push({ name: "Elenco cit" });
    },
    setCit() {
      let self = this;
      this.$store.getters.database
        .collection("cits")
        .doc(this.$route.params.id)
        .get()
        .then((response) => {
          if (response.data() === undefined)
            self.$router.push({ name: "Elenco cit" });
          self.cit = response.data();
          // Imposto le persone (converto gli id in nomi)
          let newPersone = [];
          for (let persona of self.cit.persone) {
            self.$store.getters.database
              .collection("persone")
              .doc(persona)
              .get()
              .then((risposta) => {
                newPersone.push(risposta.data().nome);
              });
          }
          self.cit.persone = newPersone;
          // Imposto il luogo (converto l'id in nome)
          if (self.cit.luogo) {
            self.$store.getters.database
              .collection("luoghi")
              .doc(self.cit.luogo)
              .get()
              .then((risposta) => {
                self.cit.luogo = risposta.data().nome;
              });
          }
        });
    },
  },
  mounted() {
    this.setCit();
  },
};
</script>