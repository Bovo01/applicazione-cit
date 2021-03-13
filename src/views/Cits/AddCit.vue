<template>
  <div>
    <navbar />
    <b-container>
      <!-- Titolo -->
      <b-row align-v="center" class="my-2">
        <b-col align="right" align-self="end" :cols="numCols">
          <b><label class="demonstration">Titolo</label></b>
        </b-col>
        <b-col align="left">
          <el-input
            placeholder="Inserisci il titolo della cit"
            v-model="title"
          />
        </b-col>
      </b-row>
      <!-- Descrizione -->
      <b-row align-v="center" class="my-2">
        <b-col align="right" align-self="end" :cols="numCols">
          <label class="demonstration">Descrizione</label>
        </b-col>
        <b-col align="left">
          <el-input
            type="textarea"
            placeholder="Inserisci la descrizione della cit"
            v-model="description"
          />
        </b-col>
      </b-row>
      <!-- Data della cit -->
      <b-row align-v="center" class="my-2">
        <b-col align="right" align-self="end" :cols="numCols">
          <label class="demonstration">Data della cit</label>
        </b-col>
        <b-col align="left">
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="Seleziona data"
            format="dd/MM/yyyy"
          />
        </b-col>
      </b-row>
      <!-- Ora della cit -->
      <b-row align-v="center" class="my-2">
        <b-col align="right" align-self="end" :cols="numCols">
          <label class="demonstration">Ora della cit</label>
        </b-col>
        <b-col align="left" align-self="end">
          <el-time-picker
            arrow-control
            v-model="ora"
            placeholder="Seleziona ora"
            format="HH:mm"
          />
        </b-col>
      </b-row>
      <!-- Persona/e -->
      <b-row align-v="center" class="my-2">
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
            />
          </el-select>
        </b-col>
      </b-row>
      <!-- Persone presenti -->
      <b-row align-v="center" class="my-2">
        <b-col align="right" align-self="end" :cols="numCols">
          <label class="demonstration">Persone presenti</label>
        </b-col>
        <b-col>
          <el-select
            v-model="selected_spectators"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Seleziona le persone che erano presenti al momento della cit"
          >
            <el-option
              v-for="persona in persons"
              :key="persona.id"
              :label="persona.nome"
              :value="persona.id"
            />
          </el-select>
        </b-col>
      </b-row>
      <!-- Luogo -->
      <b-row align-v="center" class="my-2">
        <b-col align="right" align-self="end" :cols="numCols">
          <label class="demonstration">Luogo</label>
        </b-col>
        <b-col>
          <el-select
            v-model="selected_luogo"
            filterable
            allow-create
            default-first-option
            placeholder="Inserisci il luogo"
          >
            <el-option
              v-for="luogo in luoghi"
              :key="luogo.id"
              :label="luogo.nome"
              :value="luogo.id"
            />
          </el-select>
        </b-col>
        <b-col
          align="left"
          v-show="
            selected_luogo !== '' &&
            selected_luogo !== null &&
            selected_luogo !== undefined
          "
        >
          <el-button type="warning" plain @click="selected_luogo = ''"
            >Deseleziona luogo</el-button
          >
        </b-col>
      </b-row>
      <!-- Bottoni footer -->
      <div class="text-center" style="margin-top: 10%">
        <el-button type="success" plain @click="modifica()" v-if="edit">
          Modifica cit
        </el-button>
        <el-button type="success" plain @click="add()" v-else>
          Aggiungi cit
        </el-button>
      </div>
    </b-container>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import moment from "moment";

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
      selected_spectators: [],
      luoghi: [],
      selected_luogo: "",
      edit: false,
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
    async verifiche() {
      // Controllo il titolo
      if (this.title === "") {
        this.error("Devi inserire il titolo");
        return false;
      }
      // Controllo che ci sia almeno una persona
      if (this.selected_persons.length < 1) {
        this.error("Devi inserire almeno una persona");
        return false;
      }
      // Controllo le persone non inserite nel db
      let controllatePersone = false;
      if (this.getNewPersone(this.selected_persons).length > 0) {
        controllatePersone = true;
        let stop;
        this.$store.dispatch("stopLoading");
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
        this.$store.dispatch("startLoading");
        if (stop) {
          this.error(
            "Salvataggio della cit annullato. Inserisci manualmente le persone per aggiungere la cit"
          );
          return false;
        }
      }
      // Controllo le persone (spettatori) non inserite nel db
      if (
        this.getNewPersone(this.selected_spectators).length > 0 &&
        !controllatePersone
      ) {
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
          return false;
        }
      }
      // Controllo se il luogo è già stato inserito nel db
      if (this.isNewLuogo(this.selected_luogo)) {
        this.$store.dispatch("stopLoading");
        let stop;
        await this.$confirm(
          "Hai inserito un luogo non presente nel database. Vuoi continuare con la creazione automatica del luogo?",
          "Vuoi creare automaticamente il luogo inserito?",
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
        this.$store.dispatch("startLoading");
        if (stop) {
          this.error(
            "Salvataggio della cit annullato. Inserisci manualmente il luogo per aggiungere la cit"
          );
          return false;
        }
      }
      // Ultimo return statement
      return true;
    },
    async add() {
      this.$store.dispatch("startLoading");
      if (!(await this.verifiche())) {
        this.$store.dispatch("stopLoading");
        return;
      }

      // Creo le persone mancanti
      let newPersone = this.getNewPersone(this.selected_persons);
      let persone = this.getPersoneInDb(this.selected_persons);
      for (let personaDaAggiungere of newPersone) {
        // Inserisco la persona
        await this.$store.dispatch("addElement", {
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
      // Creo gli spettatori mancanti
      let newSpettatori = this.getNewPersone(this.selected_spectators);
      let spettatori = this.getPersoneInDb(this.selected_spectators);
      for (let personaDaAggiungere of newSpettatori) {
        // Controllo se la persona è già presente
        if (
          !(await this.$store.getters.database
            .collection("persone")
            .where("nome", "==", personaDaAggiungere)
            .get()
            .then((response) => response.docs.length > 0))
        )
          // Inserisco la persona
          await this.$store.dispatch("addElement", {
            tableName: "persone",
            item: { nome: personaDaAggiungere, birth_date: null },
          });
        // Prendo l'id dalla persona
        await this.$store.getters.database
          .collection("persone")
          .where("nome", "==", personaDaAggiungere)
          .get()
          .then((response) => {
            spettatori.push(response.docs[0].id);
          });
      }
      // Creo il luogo mancante
      let newLuogo = this.selected_luogo || null;
      if (this.isNewLuogo(newLuogo)) {
        // Inserisco il luogo
        await this.$store.dispatch("addElement", {
          tableName: "luoghi",
          item: { nome: newLuogo },
        });
        // Prendo l'id dalla persona
        await this.$store.getters.database
          .collection("luoghi")
          .where("nome", "==", newLuogo)
          .get()
          .then((response) => {
            newLuogo = response.docs[0].id;
          });
      }

      this.$store.dispatch("addElement", {
        tableName: "cits",
        item: {
          title: this.title,
          description: this.description,
          date: this.dateToString(this.date),
          ora: this.oraToString(this.ora),
          persone,
          spettatori,
          luogo: newLuogo,
        },
      });
      this.$router.push({ name: "Elenco cit" });
      this.$store.dispatch("stopLoading");
    },
    async modifica() {
      this.$store.dispatch("startLoading");
      if (!(await this.verifiche())) {
        this.$store.dispatch("stopLoading");
        return;
      }

      // Creo le persone mancanti
      let newPersone = this.getNewPersone(this.selected_persons);
      let persone = this.getPersoneInDb(this.selected_persons);
      for (let personaDaAggiungere of newPersone) {
        // Inserisco la persona
        await this.$store.dispatch("addElement", {
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
      // Creo gli spettatori mancanti
      let newSpettatori = this.getNewPersone(this.selected_spectators);
      let spettatori = this.getPersoneInDb(this.selected_spectators);
      for (let personaDaAggiungere of newSpettatori) {
        // Controllo se la persona è già presente
        if (
          !(await this.$store.getters.database
            .collection("persone")
            .where("nome", "==", personaDaAggiungere)
            .get()
            .then((response) => response.docs.length > 0))
        )
          // Inserisco la persona
          await this.$store.dispatch("addElement", {
            tableName: "persone",
            item: { nome: personaDaAggiungere, birth_date: null },
          });
        // Prendo l'id dalla persona
        await this.$store.getters.database
          .collection("persone")
          .where("nome", "==", personaDaAggiungere)
          .get()
          .then((response) => {
            spettatori.push(response.docs[0].id);
          });
      }
      // Creo il luogo mancante
      let newLuogo = this.selected_luogo || null;
      if (this.isNewLuogo(newLuogo)) {
        // Inserisco il luogo
        await this.$store.dispatch("addElement", {
          tableName: "luoghi",
          item: { nome: newLuogo },
        });
        // Prendo l'id dalla persona
        await this.$store.getters.database
          .collection("luoghi")
          .where("nome", "==", newLuogo)
          .get()
          .then((response) => {
            newLuogo = response.docs[0].id;
          });
      }

      this.$store.dispatch("editElement", {
        tableName: "cits",
        id: this.$route.params.id,
        item: {
          title: this.title,
          description: this.description,
          date: this.dateToString(this.date),
          ora: this.oraToString(this.ora),
          persone,
          spettatori,
          luogo: newLuogo,
        },
      });
      this.$router.push({ name: "Elenco cit" });
      this.$store.dispatch("stopLoading");
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
            self.persons.push({ id: persona.id, nome: persona.data().nome });
          });
        });
    },
    getShortLuoghi() {
      let self = this;
      this.$store.getters.database
        .collection("luoghi")
        .get()
        .then((response) => {
          self.luoghi = [];
          response.docs.forEach((luogo) => {
            self.luoghi.push({ id: luogo.id, nome: luogo.data().nome });
          });
        });
    },
    getNewPersone(selected_persons) {
      let newPersone = [];
      for (let persona of selected_persons) {
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
    getPersoneInDb(selected_persons) {
      let newPersone = [];
      for (let persona of selected_persons) {
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
    isNewLuogo(luogo) {
      if (luogo === undefined || luogo === null || luogo == "") return false;
      for (let l of this.luoghi) {
        if (luogo === l.id) return false;
      }
      return true;
    },
    setCit() {
      if (this.$route.params.id !== undefined) {
        let self = this;
        this.$store.getters.database
          .collection("cits")
          .doc(this.$route.params.id)
          .get()
          .then((response) => {
            if (response.data() === undefined) {
              self.$router.push({ name: "Add cit" });
              return;
            }
            self.edit = true;
            // Imposto le variabili della view
            self.title = response.data().title;
            self.description = response.data().description;
            let date = moment(response.data().date, "DD/MM/YYYY");
            self.date = date.isValid() ? date.toDate() : "";
            let ora = moment(response.data().ora, "HH:mm");
            self.ora = ora.isValid() ? ora.toDate() : "";
            self.selected_persons = response.data().persone;
            self.selected_spectators = response.data().spettatori;
            self.selected_luogo = response.data().luogo;
          });
      }
    },
  },
  mounted() {
    this.$store.dispatch("startLoading");
    // Metodo di sicurezza contro i non admin
    if (!this.$store.getters.admin) {
      this.$router.push({ name: "Elenco cit" });
      this.$store.dispatch("stopLoading");
    }
    this.setCit();
    this.getShortLuoghi();
    this.getShortPersons();
    this.$store.dispatch("stopLoading");
  },
  watch: {
    $route: function (to) {
      if (to.name === "Add cit") {
        this.edit = false;
        this.title = "";
        this.description = "";
        this.date = "";
        this.ora = "";
        this.selected_persons = [];
        this.selected_spectators = [];
        this.selected_luogo = "";
      } else {
        this.setCit();
      }
    },
  },
};
</script>