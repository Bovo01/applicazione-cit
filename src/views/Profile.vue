<template>
  <div>
    <navbar />
    <b-container>
      <!-- Username -->
      <b-row align-v="center" class="my-2">
        <b-col align="right" align-self="end" :cols="numCols">
          <label class="demonstration">Username</label>
        </b-col>
        <b-col align="left">
          <el-input
            placeholder="Inserisci lo username"
            v-model="user"
            :disabled="state !== 1"
          />
        </b-col>
      </b-row>
      <!-- Password -->
      <b-row align-v="center" class="my-2" v-if="state !== 2">
        <b-col align="right" align-self="end" :cols="numCols">
          <label class="demonstration">Password</label>
        </b-col>
        <b-col align="left">
          <el-input
            placeholder="Inserisci la password"
            v-model="pass"
            disabled
            show-password
          />
        </b-col>
      </b-row>
      <!-- Form per modificare la password -->
      <div v-if="state === 2">
        <!-- Old password -->
        <b-row align-v="center" class="my-2">
          <b-col align="right" align-self="end" :cols="numCols">
            <label class="demonstration">Inserisci la vecchia password</label>
          </b-col>
          <b-col align="left">
            <el-input
              placeholder="Inserisci la vecchia password"
              v-model="old_pass"
              show-password
            />
          </b-col>
        </b-row>
        <!-- Password 1 -->
        <b-row align-v="center" class="my-2">
          <b-col align="right" align-self="end" :cols="numCols">
            <label class="demonstration">Inserisci la nuova password</label>
          </b-col>
          <b-col align="left">
            <el-input
              placeholder="Inserisci la nuova password"
              v-model="pass1"
              show-password
            />
          </b-col>
        </b-row>
        <!-- Password 2 -->
        <b-row align-v="center" class="my-2">
          <b-col align="right" align-self="end" :cols="numCols">
            <label class="demonstration">Ripeti la password</label>
          </b-col>
          <b-col align="left">
            <el-input
              placeholder="Ripeti la password"
              v-model="pass2"
              show-password
            />
          </b-col>
        </b-row>
      </div>
      <!-- Bottoni footer -->
      <div class="text-center" style="margin-top: 10%">
        <div v-if="state === 0">
          <el-button type="primary" plain @click="modificaUsername()">
            Modifica username
          </el-button>
          <el-button type="warning" plain @click="cambiaPassword()">
            Cambia password
          </el-button>
        </div>
        <div v-else-if="state === 1">
          <el-button type="info" plain @click="annulla()"> Annulla </el-button>
          <el-button type="success" plain @click="confermaUsername()">
            Modifica username
          </el-button>
        </div>
        <div v-else-if="state === 2">
          <el-button type="info" plain @click="annulla()"> Annulla </el-button>
          <el-button type="success" plain @click="confermaPassword()">
            Modifica password
          </el-button>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import CryptoJS from "crypto-js";
import { login } from "@/plugins/functions.js";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      numCols: 4,
      user: "",
      pass: "",
      old_pass: "",
      pass1: "",
      pass2: "",
      state: 0,
    };
  },
  methods: {
    modificaUsername() {
      this.state = 1;
    },
    cambiaPassword() {
      this.state = 2;
      this.old_pass = "";
      this.pass1 = "";
      this.pass2 = "";
    },
    async confermaUsername() {
      if (this.user === "") {
        this.error("Devi inserire uno username");
        return;
      }
      // Verifico che lo username sia disponibile
      if (
        await this.$store.getters.database
          .collection("account")
          .where("user", "==", this.user)
          .get()
          .then((response) => {
            return response.docs.length > 0;
          })
      ) {
        this.error("Lo username inserito non è disponibile");
        return;
      }

      this.state = 0;
      this.$store.dispatch("editElement", {
        tableName: "account",
        id: this.$store.getters.userId,
        item: { user: this.user },
      });
      this.$store.commit("setUser", this.user);
      this.success({
        message: "Username cambiato con successo",
        title: "Username modificato",
      });
    },
    async confermaPassword() {
      // Controllo che siano state inserite delle password
      if (this.pass1 === "" || this.pass2 === "") {
        this.error("Devi inserire la password in entrambi i campi");
        return;
      }
      // Controllo che le due password coincidano
      if (this.pass1 !== this.pass2) {
        this.error("Le password non coincidono");
        return;
      }
      // Verifico che la vecchia password sia giusta
      if (
        !(await login(
          this.$store.getters.user,
          CryptoJS.MD5(this.old_pass).toString(),
          this,
          false
        ))
      ) {
        this.error("La vecchia password non è corretta");
        return;
      }

      this.state = 0;
      let encryptedPass = CryptoJS.MD5(this.pass1).toString();
      this.$store.dispatch("editElement", {
        tableName: "account",
        id: this.$store.getters.userId,
        item: { pass: encryptedPass },
      });
      this.$store.commit("setPass", encryptedPass);
      this.success({
        message: "Password cambiata con successo",
        title: "Password modificata",
      });
    },
    annulla() {
      this.state = 0;
      this.user = this.$store.getters.user;
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
    this.user = this.$store.getters.user;
    this.pass = "La tua password non è veramente scritta qua";
  },
};
</script>