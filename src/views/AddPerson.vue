<template>
  <div>
    <navbar></navbar>
    <b-container>
      
    </b-container>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import { mdbInput } from "mdbvue";

export default {
  data() {
    return {
      username: "",
      required: [(value) => !!value || "Required."],
      birth_date: null,
      menu: false,
    };
  },
  components: {
    Navbar,
    mdbInput,
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
  },
};
</script>