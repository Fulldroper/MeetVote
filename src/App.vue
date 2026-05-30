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
            <RouterLink to="/about">
              <span class="footer-link-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="8" cy="8" r="3" />
                  <path d="M8 1v2M8 13v2M1 8h2M13 8h2" />
                </svg>
              </span>
              Про проєкт
            </RouterLink>
            <a :href="GITHUB_URL" target="_blank" rel="noopener">
              <span class="footer-link-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2C3.5 2 2 4 2 6.5c0 2 1.5 3.5 3 4.5 0 .5-.5 1-1 1.5v1c0 .3.2.5.5.5h5c.3 0 .5-.2.5-.5v-1c-.5-.5-1-1-1-1.5 1.5-1 3-2.5 3-4.5C14 4 12.5 2 10 2h-4z" />
                </svg>
              </span>
              GitHub
            </a>
            <a :href="LICENSE_URL" target="_blank" rel="noopener">
              <span class="footer-link-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 2h8v12H4z" />
                  <path d="M4 6h8" />
                </svg>
              </span>
              GPL-3.0-ліцензія
            </a>
          </div>
          <div class="footer-col">
            <p class="footer-col-title">data</p>
            <RouterLink to="/privacy">
              <span class="footer-link-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 7V5a4 4 0 0 1 8 0v2" />
                  <rect x="3" y="7" width="10" height="6" rx="2" />
                </svg>
              </span>
              Конфіденційність
            </RouterLink>
            <RouterLink to="/new">
              <span class="footer-link-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 3v10M3 8h10" />
                </svg>
              </span>
              Створити голосування
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© {{ new Date().getFullYear() }} meetvote · open source · gpl-3.0 · made by <a href="https://github.com/Fulldroper">Full_droper</a></span>
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
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: hsl(var(--fd-muted));
  text-decoration: none;
  font-size: 0.92rem;
  transition: color 140ms ease;
}

.footer-link-icon {
  display: inline-flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
}

.footer-link-icon svg {
  width: 100%;
  height: 100%;
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
