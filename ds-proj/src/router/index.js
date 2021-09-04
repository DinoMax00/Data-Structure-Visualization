import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/bTree',
    name: 'bTree',
    component: () => import(/* webpackChunkName: "about" */ '../views/bTree.vue')
  },
  {
    path: '/Editor',
    name: 'Editor',
    component: () => import(/* webpackChunkName: "about" */ '../views/Editor.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
