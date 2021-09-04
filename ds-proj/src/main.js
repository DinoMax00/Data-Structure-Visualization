import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'
import Particles from 'particles.vue3'

import './assets/fonts/font.css'
import './assets/css/base.css'

const app = createApp(App)
installElementPlus(app)

app.use(router).use(Particles).mount('#app')
