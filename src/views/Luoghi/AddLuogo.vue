<template>
  <div>
    <navbar />
    <b-container>
      <!-- Nome luogo -->
      <b-row align-v="center" class="my-2">
        <b-col align="right" align-self="end" :cols="numCols">
          <label class="demonstration">Nome luogo</label>
        </b-col>
        <b-col align="left">
          <el-input placeholder="Inserisci il nome del luogo" v-model="nome" />
        </b-col>
      </b-row>
      <!-- Bottoni footer -->
      <div class="text-center" style="margin-top: 10%">
        <el-button type="success" plain @click="modifica()" v-if="edit">
          Modifica luogo
        </el-button>
        <el-button type="success" plain @click="insert()" v-else>
          Aggiungi luogo
        </el-button>
      </div>
    </b-container>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  components: { Navbar },
  data() {
    return {
      numCols: 4,
      nome: "",
      edit: false,
    };
  },
  methods: {
    modifica() {
      if (this.nome === "") {
        this.error("Devi inserire il nome del luogo");
        return;
      }
      this.$store.dispatch("editElement", {
        tableName: "luoghi",
        id: this.$route.params.id,
        item: {
          nome: this.nome,
        },
      });
      this.$router.push({ name: "Elenco luoghi" });
    },
    insert() {
      if (this.nome === "") {
        this.error("Devi inserire il nome del luogo");
        return;
      }
      this.$store.dispatch("addElement", {
        tableName: "luoghi",
        item: {
          nome: this.nome,
        },
      });
      this.$router.push({ name: "Elenco luoghi" });
    },
    error(message) {
      message = message ?? "Errore";
      this.$notify.error({
        title: "Errore",
        message,
      });
    },
    setLuogo() {
      if (this.$route.params.id !== undefined) {
        let self = this;
        this.$store.getters.database
          .collection("luoghi")
          .doc(this.$route.params.id)
          .get()
          .then((response) => {
            if (response.data() === undefined) {
              self.$router.push({ name: "Add luogo" });
              return;
            }
            self.edit = true;
            // Imposto le variabili della view
            self.nome = response.data().nome;
          });
      }
    },
  },
  mounted() {
    // Metodo di sicurezza contro i non admin
    if (!this.$store.getters.admin) {
      this.$router.push({ name: "Elenco luoghi" });
    }
    this.setLuogo();
  },
  watch: {
    $route: function (to) {
      if (to.name === "Add luogo") {
        this.edit = false;
        this.nome = "";
      } else {
        this.setLuogo();
      }
    },
  },
};
</script>