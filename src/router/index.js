import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Register from '../views/Register'
import Home from '../views/Home'
import ElencoCit from '../views/ElencoCit'
import CitDetail from '../views/CitDetail'
import AddCit from '../views/AddCit'
import ElencoPersone from '../views/ElencoPersone'
import PersonDetail from '../views/PersonDetail'
import AddPerson from '../views/AddPerson'
import ElencoLuoghi from '../views/ElencoLuoghi'
import LuogoDetail from '../views/LuogoDetail'
import AddLuogo from '../views/AddLuogo'
import Profile from '../views/Profile'

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
  path: '/cit-detail/:id',
  name: 'Cit detail',
  component: CitDetail
}, {
  path: '/add-cit',
  name: 'Add cit',
  component: AddCit
}, {
  path: '/edit-cit/:id',
  name: 'Edit cit',
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
  name: 'Edit person',
  component: AddPerson
}, {
  path: '/person-detail/:id',
  name: 'Person detail',
  component: PersonDetail
}, {
  path: '/luoghi',
  name: 'Elenco luoghi',
  component: ElencoLuoghi
}, {
  path: '/luogo-detail/:id',
  name: 'Luogo detail',
  component: LuogoDetail
}, {
  path: '/add-luogo',
  name: 'Add luogo',
  component: AddLuogo
}, {
  path: '/edit-luogo/:id',
  name: 'Edit luogo',
  component: AddLuogo
}, {
  path: '/profile',
  name: 'Profile',
  component: Profile
}];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;