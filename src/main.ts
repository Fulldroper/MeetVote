import { createApp } from 'vue'
import '@fulldroper/ui-kit/styles.css'
import FdUnifiedUiKit from '@fulldroper/ui-kit'
import App from './App.vue'
import router from './router'
import './style.scss'

createApp(App).use(router).use(FdUnifiedUiKit).mount('#app')
console.log({
  url: import.meta.env.VITE_SUPABASE_URL,
  key: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
})