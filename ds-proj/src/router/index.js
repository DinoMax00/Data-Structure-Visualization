import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/bTree',
    name: 'bTree',
    component: () => import(/* webpackChunkName: "about" */ '../views/bTree.vue')
  },
  {
    path: '/Chain',
    name: 'Chain',
    component: () => import(/* webpackChunkName: "about" */ '../views/Chain.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
