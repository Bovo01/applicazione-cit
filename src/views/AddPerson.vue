<template>
  <div>
    <navbar></navbar>
    <b-container>
      <v-text-field
        label="Inserisci il nome"
        :rules="required"
        hide-details="auto"
      >
        <v-icon slot="prepend"> mdi-account </v-icon>
      </v-text-field>

      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="birth_date"
            label="Birthday date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          ref="picker"
          v-model="birth_date"
          :max="new Date().toISOString().substr(0, 10)"
          min="1950-01-01"
          @change="save"
        ></v-date-picker>
      </v-menu>

      <div align="center" style="margin-top: 100px">
        <v-btn dark color="success"> Conferma </v-btn>
      </div>
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