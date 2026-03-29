import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store/index.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../views/TestView.vue'),
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('../views/ResultView.vue'),
    beforeEnter: (to, from, next) => {
      if (!store.state.result) {
        next({ name: 'Home' })
      } else {
        next()
      }
    },
  },
  {
    path: '/stats',
    name: 'Stats',
    component: () => import('../views/StatsView.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
