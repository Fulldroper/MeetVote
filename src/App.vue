<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import { useApp } from './composables/useApp'

const GITHUB_URL = 'https://github.com/Fulldroper/MeetVote'
const LICENSE_URL = 'https://www.gnu.org/licenses/gpl-3.0.html'

const theme = ref<'light' | 'dark'>('light')
const { bootstrap } = useApp()

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
  localStorage.setItem('meetvote-theme', theme.value)
}

onMounted(() => {
  bootstrap()
  const stored = localStorage.getItem('meetvote-theme') as 'light' | 'dark' | null
  theme.value =
    stored ??
    (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
})
</script>

<template>
  <div class="app-shell">
    <AppHeader :theme="theme" @toggle-theme="toggleTheme" />

    <main>
      <router-view />
    </main>

    <footer class="app-footer">
      <div class="footer-main">
        <div class="footer-brand">
          <p class="footer-kicker">
            <span class="kicker-mark">fd</span>
            <span class="kicker-sep">/</span>
            <span>meetvote</span>
          </p>
          <p>Опенсорс-інструмент для пошуку спільного часу. Без сервера за замовчуванням — усе у вашому браузері.</p>
        </div>

        <div class="footer-columns">
          <div class="footer-col">
            <p class="footer-col-title">project</p>
            <RouterLink to="/about">Про проєкт</RouterLink>
            <a :href="GITHUB_URL" target="_blank" rel="noopener">GitHub</a>
            <a :href="LICENSE_URL" target="_blank" rel="noopener">GPL-3.0-ліцензія</a>
          </div>
          <div class="footer-col">
            <p class="footer-col-title">data</p>
            <RouterLink to="/privacy">Конфіденційність</RouterLink>
            <RouterLink to="/new">Створити голосування</RouterLink>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© {{ new Date().getFullYear() }} meetvote · open source · gpl-3.0</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1240px;
  margin: 0 auto;
  padding: 24px clamp(20px, 4vw, 48px);
}

main {
  flex: 1;
}

.app-footer {
  display: grid;
  gap: 36px;
  margin-top: 48px;
  padding: 56px 0 32px;
  border-top: 1px dashed hsl(var(--fd-border));
  color: hsl(var(--fd-muted));
}

.footer-main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: 56px;
  align-items: start;
}

.footer-kicker {
  margin: 0 0 12px;
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: lowercase;
  color: hsl(var(--fd-text));
}

.footer-kicker .kicker-mark { color: hsl(var(--fd-accent)); }
.footer-kicker .kicker-sep  { color: hsl(var(--fd-border)); }

.footer-brand p {
  margin: 0;
  max-width: 320px;
  color: hsl(var(--fd-muted));
  font-size: 0.95rem;
  line-height: 1.7;
}

.footer-columns {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
}

.footer-col {
  display: grid;
  gap: 12px;
  align-content: start;
}

.footer-col-title {
  margin: 0 0 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: lowercase;
  color: hsl(var(--fd-accent));
}

.footer-col a {
  color: hsl(var(--fd-muted));
  text-decoration: none;
  font-size: 0.92rem;
  transition: color 140ms ease;
}

.footer-col a:hover {
  color: hsl(var(--fd-accent));
}

.footer-bottom {
  padding-top: 24px;
  border-top: 1px dashed hsl(var(--fd-border));
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace;
  font-size: 12px;
  letter-spacing: 0.02em;
  text-transform: lowercase;
  color: hsl(var(--fd-muted));
}

@media (max-width: 980px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 680px) {
  .footer-columns {
    grid-template-columns: 1fr;
  }
}
</style>
