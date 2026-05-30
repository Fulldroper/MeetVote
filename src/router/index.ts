import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: 'MeetVote — знайдіть час для зустрічі',
      description:
        'MeetVote — безсерверний інструмент для узгодження часу зустрічі. Створюйте опитування, діліться посиланням і кожен бачить свій локальний час.',
    },
  },
  {
    path: '/new',
    name: 'create',
    component: () => import('../views/CreateView.vue'),
    meta: {
      title: 'Створити голосування — MeetVote',
      description: 'Швидко створіть голосування та поділіться посиланням із командою без реєстрації.',
    },
  },
  {
    path: '/profile/my_polls',
    name: 'my-polls',
    component: () => import('../views/MyPollsView.vue'),
    meta: {
      title: 'Мої голоси — MeetVote',
      description: 'Переглядайте та редагуйте історію своїх голосувань у MeetVote.',
    },
  },
  {
    path: '/poll/:id',
    name: 'poll',
    component: () => import('../views/VoteView.vue'),
    props: true,
    meta: {
      title: 'Голосування — MeetVote',
      description: 'Вкажіть свій нік та оберіть доступні проміжки часу у локальному часовому поясі.',
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      title: 'Про проєкт — MeetVote',
      description: 'Дізнайтесь про MeetVote, концепцію безсерверного голосування та користь для команд.',
    },
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('../views/PrivacyView.vue'),
    meta: {
      title: 'Конфіденційність — MeetVote',
      description: 'Політика конфіденційності MeetVote: без трекінгу, без реєстрації, без відстеження.',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
