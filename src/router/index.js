import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
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