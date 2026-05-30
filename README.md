# MeetVote

> Опенсорс-інструмент для пошуку спільного часу зустрічі. Без сервера за замовчуванням, без реєстрації, без трекінгу.

Vue 3 + TypeScript SPA. Працює локально через `localStorage`, опційно — з власним Supabase для шарингу між учасниками. Деплоїться як статика на GitHub Pages.

---

## Можливості

- 🗓️ Інтерактивний 24-годинний таймлайн: drag для виділення інтервалів, перетягування країв для зміни розміру
- 📊 Жива heatmap-візуалізація популярності слотів у вигляді хвилі
- 🌐 Опційно Supabase як бекенд для синхронізації голосів між учасниками
- 🌗 Light / dark тема (`prefers-color-scheme` за замовчуванням)
- ⚡ Жодних cookies, трекінгу, аналітики — дані живуть у вашому браузері або вашому Supabase-проєкті
- 🚀 Static-friendly: SPA розгортається на будь-якому статичному хостингу

---

## Стек

| Шар | Технологія |
|---|---|
| Framework | [Vue 3](https://vuejs.org/) (`<script setup>` SFC) |
| Мова | TypeScript |
| Bundler | [Vite 8](https://vite.dev/) |
| Router | [vue-router 4](https://router.vuejs.org/) (history mode) |
| UI-кіт | [`@fulldroper/ui-kit`](https://www.npmjs.com/package/@fulldroper/ui-kit) |
| Стилі | SCSS + HSL CSS-змінні |
| Бекенд (опційно) | [Supabase](https://supabase.com/) (`@supabase/supabase-js`) |
| Деплой | GitHub Pages через Actions |

---

## Швидкий старт

```bash
# Встановити залежності
npm install

# Запустити dev-сервер (http://localhost:5173)
npm run dev

# Зібрати продакшн-білд
npm run build

# Превʼю продакшн-білду локально
npm run preview
```

---

## Environment variables

Скопіюйте `.env.example` у `.env.local` і заповніть значення:

```bash
cp .env.example .env.local
```

| Змінна | Призначення | Обовʼязково |
|---|---|---|
| `VITE_SUPABASE_URL` | URL вашого Supabase-проєкту | Тільки для Supabase-режиму |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Публічний (browser-safe) ключ Supabase | Тільки для Supabase-режиму |
| `VITE_BASE` | Base path для деплою (наприклад `/repo-name/`) | Тільки для GH Pages |

> Без Supabase-вар проєкт працює виключно через `localStorage`. UI прозоро перемикається.

---

## Supabase (опційно)

### 1. Створіть проєкт

Зайдіть на [supabase.com](https://supabase.com/) → New project → візьміть **URL** та **publishable key** з налаштувань.

### 2. SQL-схема

У Supabase SQL editor виконайте:

```sql
create table polls (
  id uuid primary key,
  title text not null,
  description text default '',
  timezone text default 'Europe/Kyiv',
  start_date date not null,
  end_date date not null,
  end_at timestamptz not null,
  interval_minutes int not null default 60,
  allow_edit boolean default true,
  status text default 'live',
  created_at timestamptz default now()
);

create table votes (
  id uuid primary key,
  poll_id uuid references polls(id) on delete cascade,
  nickname text not null,
  edit_token text not null,
  slots jsonb not null,
  created_at timestamptz default now()
);

alter table polls enable row level security;
alter table votes enable row level security;

create policy "polls_read"  on polls for select using (true);
create policy "polls_write" on polls for insert with check (true);
create policy "votes_read"  on votes for select using (true);
create policy "votes_write" on votes for insert with check (true);
```

### 3. Додайте env

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
```

API-хелпери — в [src/api/polls.ts](src/api/polls.ts).

---

## Деплой на GitHub Pages

Workflow в [.github/workflows/deploy.yml](.github/workflows/deploy.yml) запускається на `push` до `main`.

### Налаштування репозиторію

1. **Pages**: Settings → Pages → Source = **GitHub Actions**
2. **Variables** (Settings → Secrets and variables → Actions → **Variables**):
   - `VITE_SUPABASE_URL` — якщо використовуєте Supabase
   - `VITE_SUPABASE_PUBLISHABLE_KEY` — якщо використовуєте Supabase

`VITE_BASE` встановлюється автоматично з імені репозиторію (`/${repo-name}/`).

### SPA fallback

Workflow копіює `dist/index.html` → `dist/404.html`, щоб прямі URL типу `/poll/uuid` працювали без 404.

---

## Маршрути

| Шлях | Сторінка | Опис |
|---|---|---|
| `/` | [HomeView](src/views/HomeView.vue) | Лендінг |
| `/new` | [CreateView](src/views/CreateView.vue) | Створення голосування |
| `/poll/:id` | [VoteView](src/views/VoteView.vue) | Голосування + результати |
| `/about` | [AboutView](src/views/AboutView.vue) | Про проєкт |
| `/privacy` | [PrivacyView](src/views/PrivacyView.vue) | Конфіденційність |

Невідомі шляхи → редірект на `/`.

---

## Структура проєкту

```
src/
├── api/
│   └── polls.ts            # Supabase CRUD (опційно)
├── components/
│   ├── AppHeader.vue       # Брендинг + тема
│   ├── DayTagRow.vue       # Чіпи днів тижня
│   ├── PollCreateForm.vue  # Форма створення голосування
│   ├── TimelineCanvas.vue  # SVG-таймлайн (інтерактив)
│   └── VoteComposer.vue    # Композиція голосування
├── composables/
│   └── useApp.ts           # Глобальний state + дії (poll, votes, drag, persist)
├── lib/
│   └── supabase.ts         # Lazy supabase-клієнт
├── router/
│   └── index.ts            # vue-router
├── styles/
│   ├── _mixins.scss
│   └── _variables.scss
├── views/
│   ├── AboutView.vue
│   ├── CreateView.vue
│   ├── HomeView.vue
│   ├── PrivacyView.vue
│   └── VoteView.vue
├── App.vue                 # Shell: header + router-view + footer
├── env.d.ts                # Типи import.meta.env
├── main.ts
└── style.scss              # Глобальні стилі + radial accent backdrop
```

---

## Айдентика

Лендінг та інтерфейс тримаються в дизайн-мові `@fulldroper/ui-kit`:

- Моноспейс для кикерів/лейблів (`ui-monospace, SFMono-Regular, Menlo, Consolas`)
- Lowercase з `kebab_case` для технічних лейблів (`step_1 / identify_yourself`)
- Слеш як роздільник у бренд-кикерах (`fd / meetvote`)
- Пунктирні `1px dashed` рамки замість важких тіней
- Радіальний accent-градієнт як підкладка
- Малі радіуси (8–14px), високий контраст типографіки

---

## Зберігання даних

**Локальний режим:**

```
meetvote-poll-<id>     # Poll JSON
meetvote-votes-<id>    # Vote[] JSON
meetvote-theme         # light | dark
```

**Supabase-режим:** дані пишуться у ваш Supabase. Ми не маємо доступу.

Детальніше — у [/privacy](src/views/PrivacyView.vue).

---

## Ліцензія GPLv3

[LICENSE](LICENSE)