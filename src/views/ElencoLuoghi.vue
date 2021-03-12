<template>
  <div>
    <navbar />
    <b-container>
      <el-table :data="luoghi" border style="width: 100%">
        <el-table-column prop="nome" label="Nome luogo" />
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
  components: { Navbar },
  data() {
    return {
      luoghi: [],
    };
  },
  methods: {
    detail(index) {
      this.$router.push({
        path: `/luogo-detail/${this.luoghi[index].id}`,
      });
    },
    setLuoghi() {
      this.luoghi = [];
      let self = this;
      this.$store.getters.database
        .collection("luoghi")
        .get()
        .then((response) => {
          for (let luogo of response.docs) {
            let newLuogo = luogo.data();
            newLuogo.id = luogo.id;
            self.luoghi.push(newLuogo);
          }
        });
    },
  },
  mounted() {
    this.$store.dispatch("startLoading");
    this.setLuoghi();
    this.$store.dispatch("stopLoading");
  },
};
</script>