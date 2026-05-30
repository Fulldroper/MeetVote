import { createApp } from 'vue'
import '@fulldroper/ui-kit/styles.css'
import FdUnifiedUiKit from '@fulldroper/ui-kit'
import App from './App.vue'
import router from './router'
import './style.scss'

const defaultTitle = 'MeetVote'
const defaultDescription =
  'MeetVote — безсерверний інструмент для узгодження часу зустрічі. Створюйте опитування, діліться посиланням і кожен бачить свій локальний час.'

const setMeta = (
  key: string,
  value: string,
  attr: 'name' | 'property' = 'name',
) => {
  let element = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', value)
}

const updatePageMeta = (route: typeof router.currentRoute.value) => {
  const title = String(route.meta.title ?? defaultTitle)
  const description = String(route.meta.description ?? defaultDescription)

  document.title = title
  setMeta('description', description)
  setMeta('og:title', title, 'property')
  setMeta('og:description', description, 'property')
  setMeta('twitter:title', title)
  setMeta('twitter:description', description)
}

router.afterEach((to) => {
  updatePageMeta(to)
})

createApp(App).use(router).use(FdUnifiedUiKit).mount('#app')
