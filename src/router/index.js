import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Register from '../views/Register'
import Home from '../views/Home'
import ElencoCit from '../views/ElencoCit'
import CitDetail from '../views/CitDetail'
import AddCit from '../views/AddCit'
import ElencoPersone from '../views/ElencoPersone'
import AddPerson from '../views/AddPerson'
import PersonDetail from '../views/PersonDetail'
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