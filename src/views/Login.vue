<template>
  <div>
    <b-container>
      <p class="h4 text-center mb-4">Accedi</p>
      <div class="grey-text">
        <mdb-input
          label="Username"
          icon="user"
          type="email"
          v-model="user"
          @keydown.enter.native="login()"
        />
        <mdb-input
          label="Password"
          icon="lock"
          type="password"
          v-model="pass"
          @keydown.enter.native="login()"
        />
      </div>
      <div class="text-center" style="margin-top: 10%">
        <el-button type="success" plain @click="login()">Accedi</el-button>
        <el-button type="primary" plain @click="register()">
          Registrati
        </el-button>
      </div>
    </b-container>
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
        this.error("Devi inserire lo username");
        return;
      }
      if (this.pass === "") {
        this.error("Devi inserire la password");
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
          self.error("Nome utente o password non sono corretti");
        }
      });
    },
    error(message) {
      message = message ?? "Errore";
      this.$notify.error({
        title: "Errore",
        message,
      });
    },
    success(text) {
      this.$notify.success({
        title: text.title,
        message: text.message,
      });
    },
  },
  mounted() {
    if (this.$route.params.alertText) {
      this.success(this.$route.params.alertText);
    }
  },
};
</script>