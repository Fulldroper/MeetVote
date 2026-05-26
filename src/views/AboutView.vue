<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { FdBadge } from '@fulldroper/ui-kit'

const stack = [
  { label: 'Vue 3', detail: 'reactivity + script setup' },
  { label: 'TypeScript', detail: 'strict types' },
  { label: 'Vite', detail: 'dev server + build' },
  { label: '@fulldroper/ui-kit', detail: 'design system' },
  { label: 'Supabase', detail: 'опційний бекенд' },
  { label: 'GitHub Pages', detail: 'статичний хостинг' },
]
</script>

<template>
  <section class="page">
    <header class="page-head">
      <p class="kicker">
        <span class="kicker-mark">about</span>
        <span class="kicker-sep">/</span>
        <span>what_is_meetvote</span>
      </p>
      <h1>Про проєкт</h1>
      <p class="lead">
        MeetVote — простий інструмент для пошуку спільного часу зустрічі.
        Опенсорс, без сервера за замовчуванням, без реєстрації.
      </p>
    </header>

    <article class="block">
      <p class="block-label">
        <span class="kicker-mark">why</span>
        <span class="kicker-sep">/</span>
        <span>no_more_threads</span>
      </p>
      <h2>Чому ще один планувальник часу?</h2>
      <p>
        Більшість існуючих сервісів вимагають реєстрації, надсилають листи,
        збирають аналітику. Тут — лише браузер, посилання та інтерактивний
        таймлайн. Дані живуть у вашому <code>localStorage</code> або у вашому
        власному Supabase-проєкті — на вибір.
      </p>
    </article>

    <article class="block">
      <p class="block-label">
        <span class="kicker-mark">how</span>
        <span class="kicker-sep">/</span>
        <span>serverless</span>
      </p>
      <h2>Як це працює без сервера</h2>
      <p>
        За замовчуванням голосування зберігаються у <code>localStorage</code>
        вашого браузера. Це працює для приватних команд, які діляться лінком
        на одному пристрої або через скріншот.
      </p>
      <p>
        Для повноцінного шарингу між учасниками — підніміть власний
        Supabase-інстанс (free tier) і додайте URL+key у
        <code>.env.local</code>. SQL-схема та політики є в репозиторії.
      </p>
    </article>

    <article class="block">
      <p class="block-label">
        <span class="kicker-mark">stack</span>
        <span class="kicker-sep">/</span>
        <span>tech</span>
      </p>
      <h2>Що під капотом</h2>
      <div class="stack-grid">
        <div v-for="item in stack" :key="item.label" class="stack-item">
          <FdBadge tone="accent">{{ item.label }}</FdBadge>
          <span>{{ item.detail }}</span>
        </div>
      </div>
    </article>

    <div class="cta-row">
      <RouterLink to="/new" class="cta-link">Створити голосування</RouterLink>
      <RouterLink to="/privacy" class="ghost-link">Конфіденційність →</RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/variables' as vars;
@use '../styles/mixins' as *;

$mono: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace;

.page {
  display: grid;
  gap: clamp(32px, 5vw, 56px);
  padding: clamp(48px, 8vw, 96px) 0 clamp(40px, 6vw, 72px);
  max-width: 760px;
  margin: 0 auto;
}

.page-head {
  display: grid;
  gap: 14px;
}

.kicker, .block-label {
  margin: 0;
  display: inline-flex;
  gap: 6px;
  align-items: baseline;
  font-family: $mono;
  font-size: 12px;
  font-weight: 600;
  text-transform: lowercase;
  color: hsl(vars.$fd-muted);
  letter-spacing: 0.02em;
}

.kicker-mark { color: hsl(vars.$fd-accent); }
.kicker-sep  { color: hsl(vars.$fd-border); }

.page-head h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.6rem);
  letter-spacing: -0.025em;
}

.lead {
  margin: 0;
  color: hsl(vars.$fd-muted);
  line-height: 1.7;
  max-width: 640px;
}

.block {
  display: grid;
  gap: 14px;
  padding: clamp(20px, 3vw, 28px);
  border: 1px dashed hsl(vars.$fd-border);
  border-radius: 14px;
  background: hsl(vars.$fd-surface);
}

.block h2 {
  margin: 0;
  font-size: 1.25rem;
  letter-spacing: -0.015em;
}

.block p {
  margin: 0;
  color: hsl(vars.$fd-muted);
  line-height: 1.75;
}

.block code {
  font-family: $mono;
  font-size: 0.9em;
  padding: 1px 6px;
  border-radius: 4px;
  background: hsl(vars.$fd-surface-2);
  color: hsl(vars.$fd-accent);
}

.stack-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 16px;

  @include respond(sm) {
    grid-template-columns: 1fr;
  }
}

.stack-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: hsl(vars.$fd-muted);
  font-size: 0.92rem;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  padding-top: 12px;
  border-top: 1px dashed hsl(vars.$fd-border);
}

.cta-link {
  padding: 10px 18px;
  border: 1px dashed hsl(vars.$fd-border);
  border-radius: 10px;
  font-family: $mono;
  font-size: 13px;
  font-weight: 700;
  text-transform: lowercase;
  color: hsl(vars.$fd-accent);
  text-decoration: none;
  transition: border-color 180ms ease;
}

.cta-link:hover { border-color: hsl(vars.$fd-accent); }

.ghost-link {
  font-family: $mono;
  font-size: 12px;
  text-transform: lowercase;
  color: hsl(vars.$fd-muted);
  text-decoration: none;
  transition: color 160ms ease;
}

.ghost-link:hover { color: hsl(vars.$fd-accent); }
</style>
