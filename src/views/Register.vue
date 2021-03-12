<template>
  <div>
    <b-container>
      <form>
        <p class="h4 text-center mb-4">Registrati</p>
        <div class="grey-text">
          <mdb-input
            label="Username"
            icon="user"
            type="text"
            v-model="username"
            @keydown.enter.native="register()"
          />
          <mdb-input
            label="Password"
            icon="lock"
            type="password"
            v-model="pass1"
            @keydown.enter.native="register()"
          />
          <mdb-input
            label="Ripeti password"
            icon="lock"
            type="password"
            v-model="pass2"
            @keydown.enter.native="register()"
          />
        </div>
        <div class="text-center" style="margin-top: 10%">
          <el-button type="info" plain @click="login()">
            Torna al login
          </el-button>
          <el-button type="success" plain @click="register()">
            Registrati
          </el-button>
        </div>
      </form>
    </b-container>
  </div>
</template>

<script>
import { mdbInput } from "mdbvue";
import CryptoJS from "crypto-js";

export default {
  name: "Register",
  components: {
    mdbInput,
  },
  data() {
    return {
      username: "",
      pass1: "",
      pass2: "",
    };
  },
  methods: {
    async register() {
      this.$store.dispatch("startLoading");
      if (this.username === "") {
        this.error("Devi inserire lo username");
        return;
      }
      if (this.pass1 === "") {
        this.error("Devi inserire la password");
        return;
      }
      if (this.pass2 === "") {
        this.error("Devi ripetere la password");
        return;
      }
      if (this.pass1 !== this.pass2) {
        this.error("Le password non coincidono");
        return;
      }

      let self = this;
      let encryptedPass = CryptoJS.MD5(this.pass1).toString();
      let item = { user: this.username, pass: encryptedPass };
      this.isElementInTable(item).then((response) => {
        if (response) {
          self.error("Il nome utente inserito non è disponibile");
        } else {
          self.$store.dispatch("addElement", { tableName: "account", item });
          self.$router.push({
            name: "Login",
            params: {
              alertText: {
                title: "Registrazione effettuata",
                message: "Accedi con i dati appena inseriti",
              },
            },
          });
        }
      });
      this.$store.dispatch("stopLoading");
    },
    async isElementInTable(item) {
      let tmpTable = this.$store.getters.database
        .collection("account")
        .where("user", "==", item.user);
      let returned;
      await tmpTable.get().then((snapshot) => {
        returned = snapshot.docs.length > 0;
      });
      return returned;
    },
    login() {
      this.$router.push({ name: "Login" });
    },
    error(message) {
      this.$notify.error({
        title: "Errore",
        message,
      });
    },
  },
};
</script>