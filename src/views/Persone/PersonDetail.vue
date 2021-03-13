<template>
  <div>
    <navbar />
    <b-container>
      <h1 class="text-center">{{ person.nome }}</h1>
      <div>
        <!-- Data di nascita -->
        <b-row align-v="center" class="my-2">
          <b-col align="right" align-self="end">
            <label>Data di nascita:</label>
          </b-col>
          <b-col align="left">
            <label>{{
              person.birth_date
                ? person.birth_date
                : "Data di nascita non inserita"
            }}</label>
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
  data() {
    return {
      person: {},
    };
  },
  components: {
    Navbar,
  },
  methods: {
    edit() {
      this.$router.push({ path: `/edit-person/${this.$route.params.id}` });
    },
    async elimina() {
      this.$store.dispatch("startLoading");
      // Segno quante volte ho utilizzato la persona nelle cit
      let volteUtilizzatoInCit;
      // Controllo le cit in cui ha detto qualcosa
      await this.$store.getters.database
        .collection("cits")
        .where("persone", "array-contains", this.$route.params.id)
        .get()
        .then((response) => {
          volteUtilizzatoInCit = response.docs.length;
        });
      // Controllo le cit in cui era presente
      await this.$store.getters.database
        .collection("cits")
        .where("spettatori", "array-contains", this.$route.params.id)
        .get()
        .then((response) => {
          volteUtilizzatoInCit += response.docs.length;
        });
      // Segno quante volte ho utilizzato il luogo nei backups delle cit
      let volteUtilizzatoInBackups;
      // Controllo i backups in cui ha detto qualcosa
      await this.$store.getters.database
        .collection("backup-cit")
        .where("persone", "array-contains", this.$route.params.id)
        .get()
        .then((response) => {
          volteUtilizzatoInBackups = response.docs.length;
        });
      // Controllo i backups in cui era presente
      await this.$store.getters.database
        .collection("backup-cit")
        .where("spettatori", "array-contains", this.$route.params.id)
        .get()
        .then((response) => {
          volteUtilizzatoInBackups += response.docs.length;
        });
      if (volteUtilizzatoInCit > 0 || volteUtilizzatoInBackups > 0) {
        this.$store.dispatch("stopLoading");
        this.$notify.error({
          title: "Errore",
          message: `Non posso eliminare questa persona perché è presente in ${volteUtilizzatoInCit} cit ed in ${volteUtilizzatoInBackups} backups`,
        });
        return;
      }
      // Elimino la persona dal db
      await this.$store.dispatch("deleteElement", {
        tableName: "persone",
        id: this.$route.params.id,
      });
      this.$store.dispatch("stopLoading");
      this.$router.push({ name: "Elenco persone" });
    },
  },
  mounted() {
    this.$store.dispatch("startLoading");
    // Metodo di sicurezza contro quelli che non hanno permesso di vedere
    if (!(this.$store.getters.admin || this.$store.getters.permissions)) {
      this.$router.push({ name: "Elenco persone" });
    }
    let self = this;
    this.$store.getters.database
      .collection("persone")
      .doc(this.$route.params.id)
      .get()
      .then((response) => {
        if (response.data() === undefined)
          this.$router.push({ name: "Elenco persone" });
        self.person = response.data();
      });
    this.$store.dispatch("stopLoading");
  },
};
</script>