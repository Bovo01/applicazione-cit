<template>
  <div>
    <navbar />
    <b-container>
      <el-table :data="persons" border style="width: 100%">
        <el-table-column prop="nome" label="Nome" />
        <el-table-column prop="birth_date" label="Data di nascita" />
        <el-table-column fixed="right" label="" width="120">
          <template slot-scope="scope">
            <el-button @click="detail(scope.$index)" type="text" size="small">
              Dettagli
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
      persons: [],
    };
  },
  methods: {
    setPersons() {
      this.persons = [];
      let self = this;
      this.$store.getters.database
        .collection("persone")
        .get()
        .then((response) => {
          response.docs.forEach((persona) => {
            let newPersona = persona.data();
            newPersona.id = persona.id;
            self.persons.push(newPersona);
          });
        });
    },
    detail(index) {
      this.$router.push({
        path: `/person-detail/${this.persons[index].id}`,
      });
    },
  },
  mounted() {
    this.$store.dispatch("startLoading");
    // Metodo di sicurezza contro quelli che non hanno permesso di vedere
    if (!(this.$store.getters.admin || this.$store.getters.permissions)) {
      this.$router.push({ name: "Home" });
    }
    this.setPersons();
    this.$store.dispatch("stopLoading");
  },
};
</script>