<script setup lang="ts">
import { RouterLink } from 'vue-router'

const facts = [
  { label: 'tracking', value: 'немає', tone: 'success' as const },
  { label: 'analytics', value: 'немає', tone: 'success' as const },
  { label: 'cookies', value: 'немає', tone: 'success' as const },
  { label: 'fingerprinting', value: 'немає', tone: 'success' as const },
]
</script>

<template>
  <section class="page">
    <header class="page-head">
      <p class="kicker">
        <span class="kicker-mark">data</span>
        <span class="kicker-sep">/</span>
        <span>your_data_your_browser</span>
      </p>
      <h1>Конфіденційність</h1>
      <p class="lead">
        Коротко: ми не збираємо нічого. Голосування живуть у вашому браузері
        або у вашому власному Supabase-проєкті.
      </p>
    </header>

    <article class="block">
      <p class="block-label">
        <span class="kicker-mark">storage</span>
        <span class="kicker-sep">/</span>
        <span>where_data_lives</span>
      </p>
      <h2>Де зберігаються дані</h2>
      <p>
        <strong>Локальний режим (за замовчуванням):</strong> голосування та голоси
        записуються у <code>localStorage</code> вашого браузера за ключами
        <code>meetvote-poll-&lt;id&gt;</code> та <code>meetvote-votes-&lt;id&gt;</code>.
        Дані не залишають пристрій.
      </p>
      <p>
        <strong>Supabase-режим (опційно):</strong> якщо ви налаштували
        <code>VITE_SUPABASE_URL</code> у <code>.env.local</code>, дані пишуться у
        ваш Supabase-проєкт. Ми не маємо доступу до нього — це повністю ваша
        база.
      </p>
    </article>

    <article class="block">
      <p class="block-label">
        <span class="kicker-mark">facts</span>
        <span class="kicker-sep">/</span>
        <span>what_we_dont_do</span>
      </p>
      <h2>Чого ми не робимо</h2>
      <ul class="facts">
        <li v-for="fact in facts" :key="fact.label">
          <span class="fact-label">{{ fact.label }}</span>
          <span class="fact-sep">·</span>
          <span class="fact-value">{{ fact.value }}</span>
        </li>
      </ul>
    </article>

    <article class="block">
      <p class="block-label">
        <span class="kicker-mark">delete</span>
        <span class="kicker-sep">/</span>
        <span>remove_data</span>
      </p>
      <h2>Як видалити свої дані</h2>
      <p>
        У локальному режимі — очистіть site data в налаштуваннях браузера або
        виконайте <code>localStorage.clear()</code> у DevTools. У
        Supabase-режимі — видаліть рядки з таблиць <code>polls</code> /
        <code>votes</code> у власному дашборді.
      </p>
    </article>

    <div class="cta-row">
      <RouterLink to="/about" class="cta-link">Про проєкт</RouterLink>
      <RouterLink to="/new" class="ghost-link">Створити голосування →</RouterLink>
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

.block strong {
  color: hsl(vars.$fd-text);
}

.block code {
  font-family: $mono;
  font-size: 0.9em;
  padding: 1px 6px;
  border-radius: 4px;
  background: hsl(vars.$fd-surface-2);
  color: hsl(vars.$fd-accent);
}

.facts {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @include respond(sm) {
    grid-template-columns: 1fr;
  }
}

.facts li {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  font-family: $mono;
  font-size: 12px;
  letter-spacing: 0.02em;
  padding: 10px 14px;
  border: 1px dashed hsl(vars.$fd-border);
  border-radius: 10px;
  background: hsl(vars.$fd-surface-2);
}

.fact-label { color: hsl(vars.$fd-muted); text-transform: lowercase; }
.fact-sep   { color: hsl(vars.$fd-border); }
.fact-value { color: hsl(vars.$fd-accent); font-weight: 700; text-transform: lowercase; }

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
