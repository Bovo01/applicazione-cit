import Vue from 'vue'
import VueRouter from 'vue-router'
// views/
import Home from '../views/Home'
// views/Login/
import Login from '../views/Login/Login'
import Register from '../views/Login/Register'
// views/Cits/
import ElencoCit from '../views/Cits/ElencoCit'
import CitDetail from '../views/Cits/CitDetail'
import AddCit from '../views/Cits/AddCit'
// views/Cits/Backups
import Backups from '../views/Cits/Backups/Backups'
import BackupDetail from '../views/Cits/Backups/BackupDetail'
// views/Persone/
import ElencoPersone from '../views/Persone/ElencoPersone'
import PersonDetail from '../views/Persone/PersonDetail'
import AddPerson from '../views/Persone/AddPerson'
// views/Luoghi/
import ElencoLuoghi from '../views/Luoghi/ElencoLuoghi'
import LuogoDetail from '../views/Luoghi/LuogoDetail'
import AddLuogo from '../views/Luoghi/AddLuogo'
// views/Permessi/
import RequestPermissions from '../views/Permessi/RequestPermissions'
import AcceptPermissions from '../views/Permessi/AcceptPermissions'
import ManagePermissions from '../views/Permessi/ManagePermissions'
// views/Profilo/
import Profile from '../views/Profilo/Profile'


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
  path: '/backups',
  name: 'Backups',
  component: Backups
}, {
  path: '/backup-detail/:id',
  name: 'Backup detail',
  component: BackupDetail
}, {
  path: '/persone',
  name: 'Elenco persone',
  component: ElencoPersone
}, {
  path: '/person-detail/:id',
  name: 'Person detail',
  component: PersonDetail
}, {
  path: '/add-person',
  name: 'Add person',
  component: AddPerson
}, {
  path: '/edit-person/:id',
  name: 'Edit person',
  component: AddPerson
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
  path: '/request-permissions',
  name: 'Request permissions',
  component: RequestPermissions
}, {
  path: '/accept-permissions',
  name: 'Accept permissions',
  component: AcceptPermissions
}, {
  path: '/manage-permissions',
  name: 'Manage permissions',
  component: ManagePermissions
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