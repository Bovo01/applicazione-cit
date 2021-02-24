import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Register from '../views/Register'
import Home from '../views/Home'
import ElencoCit from '../views/ElencoCit'
import AddCit from '../views/AddCit'
import ElencoPersone from '../views/ElencoPersone'
import AddPerson from '../views/AddPerson'
import PersonDetail from '../views/PersonDetail'

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
}, {
  path: '/edit-person/:id',
  name: 'Add person con id',
  component: AddPerson
}, {
  path: '/person-detail/:id',
  name: 'Person detail',
  component: PersonDetail
}];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;