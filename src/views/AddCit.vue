<template>
  <div>
    <navbar />
    <b-container>
      <!-- Titolo -->
      <b-row align-v="center" class="my-2">
        <b-col align="right" align-self="end" :cols="numCols">
          <label class="demonstration">Titolo</label></b-col
        >
        <b-col align="left">
          <el-input
            placeholder="Inserisci il titolo della cit"
            v-model="title"
          ></el-input
        ></b-col>
      </b-row>
      <!-- Descrizione -->
      <b-row align-v="center" class="my-2">
        <b-col align="right" align-self="end" :cols="numCols">
          <label class="demonstration">Descrizione</label></b-col
        >
        <b-col align="left">
          <el-input
            type="textarea"
            placeholder="Inserisci la descrizione della cit"
            v-model="description"
          ></el-input
        ></b-col>
      </b-row>
      <!-- Data della cit -->
      <b-row align-v="center" class="my-2">
        <b-col align="right" align-self="end" :cols="numCols">
          <label class="demonstration">Data della cit</label></b-col
        >
        <b-col align="left">
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="Seleziona data"
            format="dd/MM/yyyy"
          >
          </el-date-picker
        ></b-col>
      </b-row>
      <!-- Ora della cit -->
      <b-row align-v="center" class="my-2">
        <b-col align="right" align-self="end" :cols="numCols">
          <label class="demonstration">Ora della cit</label></b-col
        >
        <b-col align="left" align-self="end">
          <el-time-picker
            arrow-control
            v-model="ora"
            placeholder="Seleziona ora"
            format="HH:mm"
          >
          </el-time-picker>
        </b-col>
      </b-row>
      <!-- Persona/e -->
      <b-row>
        <b-col align="right" align-self="end" :cols="numCols">
          <label class="demonstration">Persona/e</label>
        </b-col>
        <b-col>
          <el-select
            v-model="selected_persons"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Seleziona le persone che hanno detto la cit"
          >
            <el-option
              v-for="persona in persons"
              :key="persona.id"
              :label="persona.nome"
              :value="persona.id"
            >
            </el-option> </el-select
        ></b-col>
      </b-row>
      <!-- Bottoni footer -->
      <div class="text-center" style="margin-top: 10%">
        <el-button type="success" plain @click="add()">Aggiungi cit</el-button>
      </div>
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
      numCols: 3,
      title: "",
      description: "",
      date: new Date(),
      ora: new Date(),
      persons: [],
      selected_persons: [],
    };
  },
  methods: {
    error(message) {
      message = message ?? "Errore";
      this.$notify.error({
        title: "Errore",
        message,
      });
    },
    async add() {
      if (this.title === "") {
        this.error("Devi inserire il titolo");
        return;
      }
      if (this.selected_persons.length < 1) {
        this.error("Devi inserire almeno una persona");
        return;
      }
      let newPersone = this.getNewPersone();
      if (newPersone.length > 0) {
        let stop;
        await this.$confirm(
          "Hai inserito delle persone non presenti nel database. Vuoi continuare con la creazione automatica dei profili?",
          "Vuoi creare automaticamente le persone mancanti?",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
          }
        )
          .then(() => {
            stop = false;
          })
          .catch(() => {
            stop = true;
          });
        if (stop) {
          this.error(
            "Salvataggio della cit annullato. Inserisci manualmente le persone per aggiungere la cit"
          );
          return;
        }
      }

      let persone = this.getPersoneInDb();
      for (let personaDaAggiungere of newPersone) {
        // Inserisco la persona
        await this.$store.commit("addElement", {
          tableName: "persone",
          item: { nome: personaDaAggiungere, birth_date: null },
        });
        // Prendo l'id dalla persona
        await this.$store.getters.database
          .collection("persone")
          .where("nome", "==", personaDaAggiungere)
          .get()
          .then((response) => {
            persone.push(response.docs[0].id);
          });
      }

      this.$store.commit("addElement", {
        tableName: "cits",
        item: {
          title: this.title,
          description: this.description,
          date: this.dateToString(this.date),
          ora: this.oraToString(this.ora),
          persone,
        },
      });
      this.$router.push({ name: "Elenco cit" });
    },
    dateToString(date) {
      if (date === undefined || date === null || date === "") return null;
      return (
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        "/" +
        (date.getMonth() < 9
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "/" +
        date.getFullYear()
      );
    },
    oraToString(ora) {
      if (ora === undefined || ora === null || ora === "") return null;
      return (
        (ora.getHours() < 10 ? "0" + ora.getHours() : ora.getHours()) +
        ":" +
        (ora.getMinutes() < 10 ? "0" + ora.getMinutes() : ora.getMinutes())
      );
    },
    getShortPersons() {
      let self = this;
      this.$store.getters.database
        .collection("persone")
        .get()
        .then((response) => {
          self.persons = [];
          response.docs.forEach((persona) => {
            let newPersona = {};
            newPersona.id = persona.id;
            newPersona.nome = persona.data().nome;
            self.persons.push(newPersona);
          });
        });
    },
    getNewPersone() {
      let newPersone = [];
      for (let persona of this.selected_persons) {
        let present = false;
        for (let other of this.persons) {
          if (persona === other.id) {
            present = true;
            break;
          }
        }
        if (!present) newPersone.push(persona);
      }
      return newPersone;
    },
    getPersoneInDb() {
      let newPersone = [];
      for (let persona of this.selected_persons) {
        let present = false;
        for (let other of this.persons) {
          if (persona === other.id) {
            present = true;
            break;
          }
        }
        if (present) newPersone.push(persona);
      }
      return newPersone;
    },
  },
  mounted() {
    this.getShortPersons();
  },
};
</script>