import { createMemoryHistory, createRouter } from 'vue-router'

import ResumeUpload from './components/ResumeUpload.vue'
import AboutView from './AboutView.vue'

const routes = [
  { path: '/', component: ResumeUpload },
  { path: '/about', component: AboutView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router