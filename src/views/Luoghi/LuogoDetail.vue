<template>
  <div>
    <navbar />
    <b-container>
      <h1 class="text-center">{{ luogo.nome }}</h1>
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
      luogo: {},
    };
  },
  components: {
    Navbar,
  },
  methods: {
    edit() {
      this.$router.push({ path: `/edit-luogo/${this.$route.params.id}` });
    },
    async elimina() {
      this.$store.dispatch("startLoading");
      // Segno quante volte ho utilizzato il luogo nelle cit
      let volteUtilizzatoInCit;
      await this.$store.getters.database
        .collection("cits")
        .where("luogo", "==", this.$route.params.id)
        .get()
        .then((response) => {
          volteUtilizzatoInCit = response.docs.length;
        });
      // Segno quante volte ho utilizzato il luogo nei backups delle cit
      let volteUtilizzatoInBackups;
      await this.$store.getters.database
        .collection("backup-cit")
        .where("luogo", "==", this.$route.params.id)
        .get()
        .then((response) => {
          volteUtilizzatoInBackups = response.docs.length;
        });
      if (volteUtilizzatoInCit > 0 || volteUtilizzatoInBackups > 0) {
        this.$store.dispatch("stopLoading");
        this.$notify.error({
          title: "Errore",
          message: `Non posso eliminare questo luogo perché è utilizzato in ${volteUtilizzatoInCit} cit ed è presente in ${volteUtilizzatoInBackups} backups`,
        });
        return;
      }
      // Elimino il luogo
      await this.$store.dispatch("deleteElement", {
        tableName: "luoghi",
        id: this.$route.params.id,
      });
      this.$store.dispatch("stopLoading");
      this.$router.push({ name: "Elenco luoghi" });
    },
  },
  mounted() {
    this.$store.dispatch("startLoading");
    // Metodo di sicurezza contro quelli che non hanno permesso di vedere
    if (!(this.$store.getters.admin || this.$store.getters.permissions)) {
      this.$router.push({ name: "Elenco luoghi" });
    }
    let self = this;
    this.$store.getters.database
      .collection("luoghi")
      .doc(this.$route.params.id)
      .get()
      .then((response) => {
        if (response.data() === undefined)
          this.$router.push({ name: "Elenco luoghi" });
        self.luogo = response.data();
      });
    this.$store.dispatch("stopLoading");
  },
};
</script>