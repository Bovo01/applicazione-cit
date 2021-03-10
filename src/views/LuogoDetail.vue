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
    elimina() {
      this.$store.dispatch("deleteElement", {
        tableName: "luoghi",
        id: this.$route.params.id,
      });
      this.$router.push({ name: "Elenco luoghi" });
    },
  },
  mounted() {
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
  },
}
</script>