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
          />
          <mdb-input
            label="Password"
            icon="lock"
            type="password"
            v-model="pass1"
          />
          <mdb-input
            label="Ripeti password"
            icon="lock"
            type="password"
            v-model="pass2"
          />
        </div>
        <div class="text-center">
          <b-button variant="outline-dark" @click="login()"
            >Torna al login</b-button
          >
          <b-button variant="outline-success" @click="register()"
            >Registrati</b-button
          >
        </div>
      </form>
    </b-container>
    <b-alert
      v-model="showError"
      class="position-fixed fixed-top m-0 rounded-0"
      style="z-index: 2000"
      variant="danger"
      dismissible
      >{{ errorText }}</b-alert
    >
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
      errorText: String,
      showError: false,
    };
  },
  methods: {
    async register() {
      if (this.username === "") {
        this.showAlert("Devi inserire lo username");
        return;
      }
      if (this.pass1 === "") {
        this.showAlert("Devi inserire la password");
        return;
      }
      if (this.pass2 === "") {
        this.showAlert("Devi ripetere la password");
        return;
      }
      if (this.pass1 !== this.pass2) {
        this.showAlert("Le password non coincidono");
        return;
      }

      let self = this;
      let encryptedPass = CryptoJS.MD5(this.pass1).toString();
      let item = { user: this.username, pass: encryptedPass };
      this.isElementInTable(item).then((response) => {
        if (response) {
          self.showAlert("Il nome utente inserito non è disponibile");
        } else {
          self.$store.commit("addElement", { tableName: "account", item });
          self.$router.push({
            name: "Login",
            params: {
              alertText:
                "Registrazione effettuata. Accedi con i dati appena inseriti",
            },
          });
        }
      });
    },
    async isElementInTable(item) {
      let tmpTable = this.$store.state.database
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
    showAlert(text) {
      this.errorText = text;
      this.showError = true;
    },
  },
  mounted() {
    this.showError = false;
  },
};
</script>