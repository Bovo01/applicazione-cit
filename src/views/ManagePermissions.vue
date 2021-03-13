<template>
  <div>
    <navbar />
    <b-container>
      <el-table :data="users" border style="width: 100%">
        <el-table-column prop="user" label="Nome utente" />
        <el-table-column prop="permissions" label="Permessi" />
        <el-table-column fixed="right" label="Fornisci permessi" width="300">
          <template slot-scope="scope">
            <el-button
              @click="removePermissions(scope.$index)"
              type="text"
              size="small"
              v-if="users[scope.$index].permissions !== 'none'"
            >
              Rimuovi permessi
            </el-button>
            <el-button
              @click="giveViewPermissions(scope.$index)"
              type="text"
              size="small"
              v-if="users[scope.$index].permissions !== 'view'"
            >
              Permessi di visione
            </el-button>
            <el-button
              @click="giveAdminPermissions(scope.$index)"
              type="text"
              size="small"
              v-if="users[scope.$index].permissions !== 'admin'"
            >
              Permessi di amministratore
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
      users: [],
    };
  },
  methods: {
    async removePermissions(index) {
      this.$store.dispatch("startLoading");
      await this.$store.dispatch("editElement", {
        tableName: "account",
        id: this.users[index].id,
        item: {
          viewPermission: false,
          admin: false,
        },
      });
      let self = this;
      await this.$store.getters.database
        .collection("view-requests")
        .where("userId", "==", this.users[index].id)
        .get()
        .then((response) => {
          for (let doc of response.docs) {
            self.$store.dispatch("deleteElement", {
              tableName: "view-requests",
              id: doc.id,
            });
          }
        });
      this.users[index].permissions = "none";
      this.$store.dispatch("stopLoading");
    },
    async giveViewPermissions(index) {
      this.$store.dispatch("startLoading");
      await this.$store.dispatch("editElement", {
        tableName: "account",
        id: this.users[index].id,
        item: {
          viewPermission: true,
          admin: false,
        },
      });
      let self = this;
      await this.$store.getters.database
        .collection("view-requests")
        .where("userId", "==", this.users[index].id)
        .where("type", "==", "view")
        .get()
        .then((response) => {
          for (let doc of response.docs) {
            self.$store.dispatch("deleteElement", {
              tableName: "view-requests",
              id: doc.id,
            });
          }
        });
      this.users[index].permissions = "view";
      this.$store.dispatch("stopLoading");
    },
    async giveAdminPermissions(index) {
      this.$store.dispatch("startLoading");
      await this.$store.dispatch("editElement", {
        tableName: "account",
        id: this.users[index].id,
        item: {
          viewPermission: true,
          admin: true,
        },
      });
      let self = this;
      await this.$store.getters.database
        .collection("view-requests")
        .where("userId", "==", this.users[index].id)
        .where("type", "==", "admin")
        .get()
        .then((response) => {
          for (let doc of response.docs) {
            self.$store.dispatch("deleteElement", {
              tableName: "view-requests",
              id: doc.id,
            });
          }
        });
      this.users[index].permissions = "admin";
      this.$store.dispatch("stopLoading");
    },
    async setUsers() {
      this.users = [];
      let self = this;
      this.$store.getters.database
        .collection("account")
        .get()
        .then((response) => {
          for (let account of response.docs) {
            if (account.id === self.$store.getters.userId) continue;
            self.users.push({
              id: account.id,
              user: account.data().user,
              permissions: account.data().admin
                ? "admin"
                : account.data().viewPermission
                ? "view"
                : "none",
            });
          }
        });
    },
  },
  async mounted() {
    this.$store.dispatch("startLoading");
    await this.setUsers();
    this.$store.dispatch("stopLoading");
  },
};
</script>
