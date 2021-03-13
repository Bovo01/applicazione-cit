<template>
  <div>
    <navbar />
    <b-container>
      <el-table :data="requests" border style="width: 100%">
        <el-table-column prop="user" label="User" width="150" />
        <el-table-column prop="type" label="Tipo richiesta" width="110" />
        <el-table-column prop="message" label="Messaggio" />
        <el-table-column fixed="right" label="Operazioni" width="120">
          <template slot-scope="scope">
            <el-button @click="accept(scope.$index)" type="text" size="small">
              Accetta
            </el-button>
            <el-button @click="refuse(scope.$index)" type="text" size="small">
              Rifiuta
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
      requests: [],
    };
  },
  methods: {
    async setRequests() {
      this.requests = [];
      let response = await this.$store.getters.database
        .collection("view-requests")
        .get();

      for (let request of response.docs) {
        let newRequest = {
          requestId: request.id,
          message: request.data().message,
          type: request.data().type,
          userId: request.data().userId,
        };
        newRequest.user = await this.getUsername(request.data().userId);
        this.requests.push(newRequest);
      }
    },
    async getUsername(userId) {
      return this.$store.getters.database
        .collection("account")
        .doc(userId)
        .get()
        .then((response) => {
          return response.data().user;
        });
    },
    async accept(index) {
      this.$store.dispatch("startLoading");
      await this.$store.getters.database
        .collection("view-requests")
        .doc(this.requests[index].requestId)
        .get()
        .then((response) => {
          this.$store.dispatch("editElement", {
            tableName: "account",
            id: response.data().userId,
            item: {
              viewPermission:
                response.data().type === "view" ||
                response.data().type === "admin",
              admin: response.data().type === "admin",
            },
          });
        });
      await this.$store.dispatch("deleteElement", {
        tableName: "view-requests",
        id: this.requests[index].requestId,
      });
      this.requests.splice(index, 1);
      this.$store.dispatch("stopLoading");
    },
    async refuse(index) {
      this.$store.dispatch("startLoading");
      await this.$store.dispatch("deleteElement", {
        tableName: "view-requests",
        id: this.requests[index].requestId,
      });
      this.requests.splice(index, 1);
      this.$store.dispatch("stopLoading");
    },
  },
  async mounted() {
    this.$store.dispatch("startLoading");
    // Metodo di sicurezza contro i non admin
    if (!this.$store.getters.admin) {
      this.$router.push({ name: "Home" });
    }
    await this.setRequests();
    this.$store.dispatch("stopLoading");
  },
};
</script>