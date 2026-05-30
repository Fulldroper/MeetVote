<script setup lang="ts">
// import { computed } from 'vue'
import { FdBadge, FdButton } from '@fulldroper/ui-kit'
import { useRouter } from 'vue-router'
// import { useApp } from '../composables/useApp'

const router = useRouter()
// const app = useApp()
// const goToPoll = (id: string) => router.push(`/poll/${id}`)
const goCreate = () => router.push('/new')

// const hasHistory = computed(() => app.userHistory.value.length > 0)

const steps = [
  {
    number: '01',
    title: 'Створіть голосування',
    description: 'Опишіть зустріч, оберіть діапазон дат і крок інтервалу за лічені секунди.'
  },
  {
    number: '02',
    title: 'Поділіться посиланням',
    description: 'Учасники переходять за лінком — без реєстрації, акаунтів та зайвих кроків.'
  },
  {
    number: '03',
    title: 'Отримайте найкращий час',
    description: 'Алгоритм підбирає слот, який підходить максимальній кількості людей.'
  }
]

const features = [
  {
    label: 'select_time',
    title: 'Простий вибір часу',
    description: 'Обирайте кілька проміжків на день, щоб команда вказала всі доступні варіанти.'
  },
  {
    label: 'live_canvas',
    title: 'Жива візуалізація',
    description: 'Інтервали відображаються на інтерактивному таймлайні з підтвердженням вибору.'
  },
  {
    label: 'auto_pick',
    title: 'Швидкий результат',
    description: 'Отримуйте рекомендації з найбільш підходящим слотом і зберігайте дані одним кліком.'
  },
  {
    label: 'timezone_aware',
    title: 'Часові пояси',
    description: 'Автоматичне врахування TZ — кожен бачить час у власному поясі без плутанини.'
  },
  {
    label: 'export_ready',
    title: 'Експорт результатів',
    description: 'Завантажуйте підсумки у CSV, JSON, PNG або додавайте слот у календар через ICS.'
  },
  {
    label: 'zero_signup',
    title: 'Без реєстрації',
    description: 'Учасникам не потрібен акаунт — достатньо нікнейму, щоб віддати свій голос.'
  }
]

const audiences = [
  {
    tag: 'teams',
    title: 'Команди',
    description: 'Стендапи, ретро, синки — узгоджуйте час без листування у п\'яти чатах одночасно.'
  },
  {
    tag: 'friends',
    title: 'Друзі',
    description: 'Сплануйте кіно, барбекю чи подорож — нехай усі позначать вільні слоти на тижні.'
  },
  {
    tag: 'edu',
    title: 'Викладачі',
    description: 'Запросіть студентів обрати зручний час консультації або захисту проєкту.'
  }
]

const faqs = [
  {
    question: 'Чи потрібна реєстрація учасникам?',
    answer: 'Ні. Достатньо перейти за посиланням і вказати нікнейм — голос зберігається миттєво.'
  },
  {
    question: 'Чи можна редагувати свій голос?',
    answer: 'Так, якщо автор голосування ввімкнув цю опцію. Після збереження ви отримуєте edit-token.'
  },
  {
    question: 'Як враховуються часові пояси?',
    answer: 'Кожен учасник бачить інтервали у своєму локальному часі, а підсумки приводяться до TZ автора.'
  },
  {
    question: 'Що відбувається після завершення?',
    answer: 'Голосування автоматично закривається, і ви бачите рейтинг найкращих слотів з кількістю голосів.'
  }
]
</script>

<template>
  <section class="hero">
    <p class="kicker">
      <span class="kicker-mark">fd</span>
      <span class="kicker-sep">/</span>
      <span>meetvote · find_time()</span>
    </p>

    <h1 class="hero-title">
      Знайдіть час,<br />
      що підходить <span class="accent">усім</span>
    </h1>

    <p class="hero-lead">
      Створюйте голосування, обирайте кілька проміжків та миттєво бачте,
      коли команда вільна. Проста інтерактивна система для швидких рішень.
    </p>

    <div class="hero-actions">
      <FdButton @click="goCreate()">Створити голосування</FdButton>
    </div>

    <div class="hero-meta">
      <FdBadge tone="muted">без реєстрації</FdBadge>
      <FdBadge tone="muted">часові пояси</FdBadge>
      <FdBadge tone="muted">CSV · ICS · PNG</FdBadge>
    </div>
  </section>

  <section class="section steps-section">
    <header class="section-head">
      <p class="kicker">
        <span class="kicker-mark">flow</span>
        <span class="kicker-sep">/</span>
        <span>how_it_works</span>
      </p>
      <h2>Три кроки до зручної зустрічі</h2>
      <p class="section-lead">Від створення голосування до фінального рішення — менше хвилини активної роботи.</p>
    </header>

    <div class="steps">
      <article v-for="step in steps" :key="step.number" class="step">
        <span class="step-num">{{ step.number }}</span>
        <h3>{{ step.title }}</h3>
        <p>{{ step.description }}</p>
      </article>
    </div>
  </section>

  <section class="section features-section">
    <header class="section-head">
      <p class="kicker">
        <span class="kicker-mark">kit</span>
        <span class="kicker-sep">/</span>
        <span>features</span>
      </p>
      <h2>Усе, що потрібно для планування</h2>
      <p class="section-lead">Інструменти, які прибирають тертя зі звичних процесів узгодження часу.</p>
    </header>

    <div class="features">
      <article v-for="feature in features" :key="feature.label" class="feature">
        <p class="feature-label">{{ feature.label }}</p>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </article>
    </div>
  </section>

  <section class="section audience-section">
    <header class="section-head">
      <p class="kicker">
        <span class="kicker-mark">audience</span>
        <span class="kicker-sep">/</span>
        <span>for_who</span>
      </p>
      <h2>Підходить різним сценаріям</h2>
    </header>

    <div class="audience">
      <article v-for="item in audiences" :key="item.tag" class="audience-card">
        <FdBadge tone="accent">{{ item.tag }}</FdBadge>
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </article>
    </div>
  </section>

  <section class="section faq-section">
    <header class="section-head">
      <p class="kicker">
        <span class="kicker-mark">faq</span>
        <span class="kicker-sep">/</span>
        <span>common_questions</span>
      </p>
      <h2>Питання, що виникають найчастіше</h2>
    </header>

    <div class="faqs">
      <details v-for="faq in faqs" :key="faq.question" class="faq">
        <summary>{{ faq.question }}</summary>
        <p>{{ faq.answer }}</p>
      </details>
    </div>
  </section>

  <section class="cta">
    <p class="kicker">
      <span class="kicker-mark">cta</span>
      <span class="kicker-sep">/</span>
      <span>get_started</span>
    </p>
    <h2>Готові спробувати?</h2>
    <p>Створіть перше голосування — це безкоштовно і займає менше хвилини.</p>
    <div class="hero-actions">
      <FdButton @click="goCreate()">Створити голосування</FdButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/variables' as vars;
@use '../styles/mixins' as *;

$mono: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace;

/* ---------- kicker (lowercase mono label з / роздільником) ---------- */

.kicker {
  margin: 0;
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  font-family: $mono;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: hsl(vars.$fd-muted);
  text-transform: lowercase;
}

.kicker-mark { color: hsl(vars.$fd-accent); }
.kicker-sep  { color: hsl(vars.$fd-border); }

/* ---------- секції ---------- */

.section {
  display: grid;
  gap: 56px;
  padding: clamp(72px, 10vw, 128px) 0;
}

.section-head {
  display: grid;
  gap: 14px;
  justify-items: center;
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
}

.section-head h2 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.6rem);
  line-height: 1.1;
  letter-spacing: -0.025em;
  font-weight: 700;
}

.section-lead {
  margin: 0;
  max-width: 580px;
  color: hsl(vars.$fd-muted);
  font-size: 1rem;
  line-height: 1.7;
}

/* ---------- hero ---------- */

.hero {
  display: grid;
  gap: 28px;
  justify-items: center;
  text-align: center;
  padding: clamp(96px, 14vw, 160px) 0 clamp(72px, 10vw, 120px);
}

.hero-title {
  margin: 0;
  font-size: clamp(2.8rem, 5.5vw, 5rem);
  line-height: 1;
  letter-spacing: -0.035em;
  font-weight: 800;
  max-width: 900px;
}

.hero-title .accent {
  color: hsl(vars.$fd-accent);
  font-style: italic;
  font-weight: 700;
}

.hero-lead {
  margin: 0;
  max-width: 580px;
  line-height: 1.75;
  font-size: 1.05rem;
  color: hsl(vars.$fd-muted);
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 4px;
}

.hero-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 12px;
}

/* ---------- steps ---------- */

.steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;

  @include respond(md) {
    grid-template-columns: 1fr;
  }
}

.step {
  position: relative;
  padding: 32px;
  border: 1px dashed hsl(vars.$fd-border);
  border-radius: 14px;
  background: hsl(vars.$fd-surface);
  display: grid;
  gap: 14px;
  transition: border-color 200ms ease, transform 200ms ease;
}

.step:hover {
  border-color: hsl(vars.$fd-accent);
  transform: translateY(-2px);
}

.step-num {
  font-family: $mono;
  font-size: 13px;
  letter-spacing: 0.12em;
  color: hsl(vars.$fd-accent);
}

.step h3 {
  margin: 0;
  font-size: 1.25rem;
  letter-spacing: -0.015em;
}

.step p {
  margin: 0;
  color: hsl(vars.$fd-muted);
  line-height: 1.7;
}

/* ---------- features ---------- */

.features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  border: 1px dashed hsl(vars.$fd-border);
  border-radius: 14px;
  overflow: hidden;
  background: hsl(vars.$fd-surface);

  @include respond(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include respond(sm) {
    grid-template-columns: 1fr;
  }
}

.feature {
  padding: 36px 32px;
  display: grid;
  gap: 12px;
  border-right: 1px dashed hsl(vars.$fd-border);
  border-bottom: 1px dashed hsl(vars.$fd-border);
  transition: background 180ms ease;

  &:hover { background: hsl(vars.$fd-surface-2); }

  &:nth-child(3n) { border-right: 0; }
  &:nth-last-child(-n+3) { border-bottom: 0; }

  @include respond(md) {
    &:nth-child(3n) { border-right: 1px dashed hsl(vars.$fd-border); }
    &:nth-last-child(-n+3) { border-bottom: 1px dashed hsl(vars.$fd-border); }
    &:nth-child(2n) { border-right: 0; }
    &:nth-last-child(-n+2) { border-bottom: 0; }
  }

  @include respond(sm) {
    border-right: 0;
    border-bottom: 1px dashed hsl(vars.$fd-border);
    &:last-child { border-bottom: 0; }
  }
}

.feature-label {
  margin: 0;
  font-family: $mono;
  font-size: 11px;
  color: hsl(vars.$fd-accent);
  letter-spacing: 0.08em;
}

.feature h3 {
  margin: 0;
  font-size: 1.15rem;
  letter-spacing: -0.015em;
}

.feature p {
  margin: 0;
  color: hsl(vars.$fd-muted);
  line-height: 1.7;
}

/* ---------- audience ---------- */

.audience-section {
  position: relative;
  padding-left: clamp(24px, 4vw, 56px);
  padding-right: clamp(24px, 4vw, 56px);
  border-radius: 18px;
  background:
    radial-gradient(circle at 0% 50%, hsl(var(--fd-accent) / 0.08) 0%, transparent 40%),
    hsl(vars.$fd-surface-2);
  border: 1px dashed hsl(vars.$fd-border);
}

.audience {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;

  @include respond(md) {
    grid-template-columns: 1fr;
  }
}

.audience-card {
  padding: 32px;
  background: hsl(vars.$fd-surface);
  border: 1px dashed hsl(vars.$fd-border);
  border-radius: 14px;
  display: grid;
  gap: 14px;
  align-content: start;
}

.audience-card h3 {
  margin: 0;
  font-size: 1.25rem;
  letter-spacing: -0.015em;
}

.audience-card p {
  margin: 0;
  color: hsl(vars.$fd-muted);
  line-height: 1.7;
}

/* ---------- faq ---------- */

.faqs {
  display: grid;
  gap: 12px;
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
}

.faq {
  padding: 22px 26px;
  border: 1px dashed hsl(vars.$fd-border);
  border-radius: 12px;
  background: hsl(vars.$fd-surface);
  transition: border-color 200ms ease;
}

.faq[open] { border-color: hsl(vars.$fd-accent); }

.faq summary {
  list-style: none;
  cursor: pointer;
  font-weight: 600;
  color: hsl(vars.$fd-text);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.faq summary::-webkit-details-marker { display: none; }

.faq summary::after {
  content: '+';
  font-family: $mono;
  font-size: 1.2rem;
  line-height: 1;
  color: hsl(vars.$fd-accent);
  transition: transform 200ms ease;
}

.faq[open] summary::after { transform: rotate(45deg); }

.faq p {
  margin: 14px 0 0;
  color: hsl(vars.$fd-muted);
  line-height: 1.7;
}

/* ---------- cta ---------- */

.cta {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 18px;
  padding: clamp(72px, 10vw, 120px) 24px;
  margin: 32px 0 0;
  border-top: 1px dashed hsl(vars.$fd-border);
}

.cta h2 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.6rem);
  letter-spacing: -0.025em;
}

.cta > p {
  margin: 0;
  max-width: 520px;
  color: hsl(vars.$fd-muted);
  line-height: 1.7;
}

@include respond(sm) {
  .section { gap: 40px; }
}
</style>
