// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(process.env.VUE_ROUTER_BASE),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export default router
