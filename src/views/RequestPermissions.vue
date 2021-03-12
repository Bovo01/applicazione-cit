<template>
  <div>
    <navbar />
    <b-container>
      <div v-if="canRequest">
        <!-- Messaggio -->
        <b-row align-v="center" class="my-2">
          <b-col align="right" :cols="numCols">
            <label class="demonstration">
              Scrivi un messaggio per accompagnare la tua richiesta
            </label>
          </b-col>
          <b-col align="left">
            <el-input
              type="textarea"
              placeholder="Inserisci il messaggio (se non è chiaro dallo username, identificati, bekko)"
              v-model="message"
            />
          </b-col>
        </b-row>
        <!-- Bottoni footer -->
        <div class="text-center" style="margin-top: 10%">
          <el-button v-if="!$store.getters.permissions" type="primary" plain @click="viewPermissions()">
            Richiedi permessi di visione
          </el-button>
          <el-button type="warning" plain @click="adminPermissions()">
            Richiedi permessi di amministratore
          </el-button>
        </div>
      </div>
      <div v-else>
        <h1>
          Hai già effettuato una richiesta. Aspetta che venga accettata o
          rifiutata per poterne fare un'altra
        </h1>
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
      numCols: 4,
      message: "",
      canRequest: false,
    };
  },
  methods: {
    async viewPermissions() {
      this.$store.dispatch("startLoading");
      await this.$store.dispatch("addElement", {
        tableName: "view-requests",
        item: {
          message: this.message,
          userId: this.$store.getters.userId,
          type: "view",
        },
      });
      this.$router.push({ name: "Home" });
      this.$store.dispatch("stopLoading");
    },
    async adminPermissions() {
      this.$store.dispatch("startLoading");
      await this.$store.dispatch("addElement", {
        tableName: "view-requests",
        item: {
          message: this.message,
          userId: this.$store.getters.userId,
          type: "admin",
        },
      });
      this.$router.push({ name: "Home" });
      this.$store.dispatch("stopLoading");
    },
  },
  async mounted() {
    this.$store.dispatch("startLoading");
    // Controllo se è già stata effettuata una richiesta da parte di questo utente
    let self = this;
    await this.$store.getters.database
      .collection("view-requests")
      .where("userId", "==", this.$store.getters.userId)
      .get()
      .then((response) => {
        self.canRequest = response.docs.length <= 0;
      });
    this.$store.dispatch("stopLoading");
  },
};
</script>