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
        <!-- Spettatori -->
        <b-row align-v="center" class="my-2">
          <b-col align="right" align-self="start">
            <label>Persone presenti durante la cit:</label>
          </b-col>
          <b-col align="left">
            <ul v-if="cit.spettatori && cit.spettatori.length > 0">
              <li v-for="spettatore in cit.spettatori" :key="spettatore">
                {{ spettatore }}
              </li>
            </ul>
            <label v-else>Non erano presenti persone durante questa cit</label>
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
        <el-button type="success" plain @click="ripristina()"
          >Ripristina</el-button
        >
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
    async ripristina() {
      this.$store.dispatch("startLoading");
      await this.$store.dispatch("copyElement", {
        fromTable: "backup-cit",
        toTable: "cits",
        id: this.$route.params.id,
      });
      this.$store.dispatch("deleteElement", {
        tableName: "backup-cit",
        id: this.$route.params.id,
      });
      this.$router.push({ name: "Backups" });
      this.$store.dispatch("stopLoading");
    },
    async elimina() {
      if (
        !(await this.$confirm(
          "Se eliminerai questa cit non potrai più recuperarla. Sei sicuro di voler procedere?",
          "Attenzione",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        )
          .then(() => true)
          .catch(() => false))
      ) {
        this.$notify.error({
          title: "Eliminazione annullata",
          message: "Hai annullato l'eliminazione definitiva della cit",
        });
        return;
      }
      this.$store.dispatch("startLoading");
      // Creo un backup dell'elemento
      await this.$store.dispatch("deleteElement", {
        tableName: "backup-cit",
        id: this.$route.params.id,
      });
      this.$router.push({ name: "Backups" });
      this.$store.dispatch("stopLoading");
    },
    setCit() {
      let self = this;
      this.$store.getters.database
        .collection("backup-cit")
        .doc(this.$route.params.id)
        .get()
        .then((response) => {
          if (response.data() === undefined)
            self.$router.push({ name: "Backups" });
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
          // Imposto gli spettatori (converto gli id in nomi)
          let newSpettatori = [];
          for (let persona of self.cit.spettatori) {
            self.$store.getters.database
              .collection("persone")
              .doc(persona)
              .get()
              .then((risposta) => {
                newSpettatori.push(risposta.data().nome);
              });
          }
          self.cit.spettatori = newSpettatori;
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
    this.$store.dispatch("startLoading");
    // Metodo di sicurezza contro i non admin
    if (!this.$store.getters.admin) {
      this.$router.push({ name: "Home" });
    }
    this.setCit();
    this.$store.dispatch("stopLoading");
  },
};
</script>