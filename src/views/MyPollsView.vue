<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { FdInput } from '@fulldroper/ui-kit'
import { useApp } from '../composables/useApp'

const { userNickname, userHistory, setUserNickname } = useApp()

const hasVotes = computed(() => userHistory.value.length > 0)
const greetingText = computed(() => `Вітаємо, ${userNickname.value}`)
const sortedHistory = computed(() =>
  [...userHistory.value].sort(
    (a, b) => new Date(b.lastVotedAt).getTime() - new Date(a.lastVotedAt).getTime(),
  ),
)

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
</script>

<template>
  <section class="profile-page">
    <header class="profile-header">
      <div>
        <p class="section-label">Профіль</p>
        <h1 v-if="hasVotes">{{ greetingText }}</h1>
        <h1 v-else>Мої голоси</h1>
      </div>
    </header>

    <div class="profile-content">
      <section class="profile-nickname">
        <FdInput
          :model-value="userNickname"
          @update:modelValue="setUserNickname"
          label="Ваш нікнейм"
          placeholder="Наприклад: Олена"
        />
        <p class="profile-note">Зміна ніку зберігається локально і підставляється в майбутніх голосах.</p>
      </section>

      <template v-if="hasVotes">
        <p class="profile-metadata">У вас {{ userHistory.length }} голосів у історії.</p>
        <ul class="history-list">
          <li v-for="item in sortedHistory" :key="item.id" class="history-item">
            <div class="item-main">
              <RouterLink :to="`/poll/${item.id}`" class="item-title">{{ item.title }}</RouterLink>
              <span class="item-status">{{ item.status === 'live' ? 'Активне' : 'Закрите' }}</span>
            </div>
            <p class="item-description">{{ item.description || 'Без опису' }}</p>
            <div class="item-meta">
              <span>{{ item.startDate }} → {{ item.endDate }}</span>
              <span>Останній голос: {{ formatDateTime(item.lastVotedAt) }}</span>
            </div>
          </li>
        </ul>
      </template>

      <template v-else>
        <div class="empty-state">
          <p>Тут з’являться ваші голосування, як тільки ви проголосуєте.</p>
          <RouterLink to="/new" class="create-link">Створити нове голосування</RouterLink>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.profile-page {
  display: grid;
  gap: 24px;
  min-height: 100%;
}

.profile-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-label {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  color: hsl(var(--fd-accent));
}

.profile-header h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.6rem);
}

.profile-metadata {
  margin: 0 0 16px;
  color: hsl(var(--fd-muted));
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 16px;
}

.history-item {
  padding: 24px;
  border: 1px solid hsl(var(--fd-border));
  border-radius: 22px;
  background: hsl(var(--fd-surface));
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.045);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.history-item:hover {
  transform: translateY(-1px);
  border-color: hsl(var(--fd-accent));
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
}

.item-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.item-title {
  font-weight: 800;
  color: hsl(var(--fd-text));
  text-decoration: none;
  font-size: 1.05rem;
  line-height: 1.4;
}

.item-title:hover {
  color: hsl(var(--fd-accent));
  text-decoration: underline;
}

.item-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  background: hsl(var(--fd-surface-muted));
  color: hsl(var(--fd-muted));
}

.item-status::before {
  content: '';
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  margin-right: 0.55rem;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.55;
}

.item-status {
  color: hsl(var(--fd-muted));
}

.item-status[title='Активне'] {
  color: hsl(var(--fd-accent));
  background: rgba(96, 165, 250, 0.12);
}

.item-status[title='Закрите'] {
  color: hsl(var(--fd-muted));
  background: rgba(148, 163, 184, 0.12);
}

.item-description {
  margin: 16px 0 0;
  color: hsl(var(--fd-muted));
  line-height: 1.75;
}

.item-meta {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  color: hsl(var(--fd-muted));
  font-size: 0.95rem;
}

.item-meta span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.item-meta span::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: hsl(var(--fd-border));
}

.empty-state {
  padding: 32px;
  border: 1px dashed hsl(var(--fd-border));
  border-radius: 18px;
  text-align: center;
}

.create-link {
  display: inline-block;
  margin-top: 16px;
  color: hsl(var(--fd-accent));
  text-decoration: none;
  font-weight: 700;
}

.profile-nickname {
  display: grid;
  gap: 10px;
  padding: 22px;
  border: 1px dashed hsl(var(--fd-border));
  border-radius: 18px;
  background: hsl(var(--fd-surface));
}

.profile-note {
  margin: 0;
  color: hsl(var(--fd-muted));
  font-size: 0.95rem;
  line-height: 1.6;
}
</style>
