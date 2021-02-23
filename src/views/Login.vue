<template>
  <div>
    <b-container>
      <form>
        <p class="h4 text-center mb-4">Accedi</p>
        <div class="grey-text">
          <mdb-input label="Username" icon="user" type="email" v-model="user" />
          <mdb-input
            label="Password"
            icon="lock"
            type="password"
            v-model="pass"
          />
        </div>
        <div class="text-center" style="margin-top: 10%">
          <el-button type="success" plain @click="login()">Accedi</el-button>
          <el-button type="primary" plain @click="register()"
            >Registrati</el-button
          >
        </div>
      </form>
    </b-container>
    <b-alert
      v-model="showAlert"
      class="position-fixed fixed-top m-0 rounded-0"
      style="z-index: 2000"
      variant="success"
      dismissible
      >{{ alertText }}</b-alert
    ><b-alert
      v-model="showAlert2"
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
import { login, isAdmin } from "@/plugins/functions.js";
import CryptoJS from "crypto-js";

export default {
  name: "Login",
  data() {
    return {
      alertText: String,
      showAlert: false,
      user: "",
      pass: "",
      errorText: String,
      showAlert2: false,
    };
  },
  components: {
    mdbInput,
  },
  methods: {
    register() {
      this.$router.push({ path: "/registrazione" });
    },
    login() {
      if (this.user === "") {
        this.showError("Devi inserire lo username");
        return;
      }
      if (this.pass === "") {
        this.showError("Devi inserire la password");
        return;
      }

      let self = this;
      let encryptedPass = CryptoJS.MD5(this.pass).toString();
      this.$store.commit("setUser", this.user);
      this.$store.commit("setPass", encryptedPass);
      login(this.user, encryptedPass, this, false).then((response) => {
        if (response) {
          isAdmin(self.user, encryptedPass, self).then((newResponse) => {
            self.$store.commit("setAdmin", newResponse);
          });
          self.$router.push({
            name: "Home",
          });
        } else {
          self.showError("Nome utente o password non sono corretti");
        }
      });
    },
    showError(text) {
      this.errorText = text;
      this.showAlert2 = true;
    },
  },
  mounted() {
    if (this.$route.params.alertText) {
      this.showAlert = true;
      this.alertText = this.$route.params.alertText;
    }
  },
};
</script>