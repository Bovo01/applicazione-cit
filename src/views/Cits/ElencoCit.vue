<template>
  <div>
    <navbar />
    <b-container>
      <el-table :data="cits" border style="width: 100%">
        <el-table-column prop="title" label="Titolo" />
        <el-table-column prop="date" label="Data" />
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
      cits: [],
    };
  },
  methods: {
    setCits() {
      this.cits = [];
      let self = this;
      this.$store.getters.database
        .collection("cits")
        .orderBy("date")
        .get()
        .then((response) => {
          response.docs.forEach((cit) => {
            let newCit = {};
            newCit.id = cit.id;
            newCit.title = cit.data().title;
            newCit.date = cit.data().date;
            self.cits.push(newCit);
          });
        });
    },
    detail(index) {
      this.$router.push({
        path: `/cit-detail/${this.cits[index].id}`,
      });
    },
  },
  mounted() {
    this.$store.dispatch("startLoading");
    // Metodo di sicurezza contro quelli che non hanno permesso di vedere
    if (!(this.$store.getters.admin || this.$store.getters.permissions)) {
      this.$router.push({ name: "Home" });
    }
    this.setCits();
    this.$store.dispatch("stopLoading");
  },
};
</script>