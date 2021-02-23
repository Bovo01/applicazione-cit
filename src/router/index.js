import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import ElencoCit from '../views/ElencoCit.vue'
import AddCit from '../views/AddCit.vue'
import ElencoPersone from '../views/ElencoPersone.vue'
import AddPerson from '../views/AddPerson.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Login',
  component: Login
}, {
  path: '/registrazione',
  name: 'Registrati',
  component: Register
}, {
  path: '/home',
  name: 'Home',
  component: Home
}, {
  path: '/cits',
  name: 'Elenco cit',
  component: ElencoCit
}, {
  path: '/add-cit',
  name: 'Aggiungi cit',
  component: AddCit
}, {
  path: '/persone',
  name: 'Elenco persone',
  component: ElencoPersone
}, {
  path: '/add-person',
  name: 'Add person',
  component: AddPerson
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router