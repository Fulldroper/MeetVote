<script setup lang="ts">
import { FdBadge, FdPanel } from '@fulldroper/ui-kit'

defineProps<{
  isPollClosed: boolean
  totalParticipants: number
  realtimePulse: number
  pollId: string
}>()
</script>

<template>
  <section class="stack-grid">
    <FdPanel title="Поточний стан" subtitle="Короткий огляд прототипу">
      <div class="metric-grid">
        <div>
          <p class="muted-label">Статус</p>
          <FdBadge :tone="isPollClosed ? 'danger' : 'success'">{{ isPollClosed ? 'Закрито' : 'Активно' }}</FdBadge>
        </div>
        <div>
          <p class="muted-label">Учасники</p>
          <strong>{{ totalParticipants }}</strong>
        </div>
        <div>
          <p class="muted-label">Realtime</p>
          <strong>{{ realtimePulse }}</strong>
        </div>
        <div>
          <p class="muted-label">Share URL</p>
          <strong>meetvote.app/p/{{ pollId || 'abc123' }}</strong>
        </div>
      </div>
    </FdPanel>

    <FdPanel title="Що реалізовано" subtitle="MVP відповідно до ТЗ">
      <ul class="feature-list">
        <li>Створення голосування з описом</li>
        <li>Один центрований таймлайн у голосуванні</li>
        <li>Пожвавлена візуалізація з hover-ефектом та drag-виділенням</li>
        <li>Додавання кількох інтервалів на один день</li>
        <li>Експорт CSV, JSON, PNG та ICS</li>
      </ul>
    </FdPanel>
  </section>
</template>

<style scoped>
.stack-grid {
  display: grid;
  gap: 20px;
}

.metric-grid {
  margin-top: 18px;
  padding: 16px 18px;
  border-radius: 18px;
  background: hsl(var(--fd-surface-2));
  border: 1px dashed hsl(var(--fd-border));
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
}

.muted-label {
  margin: 0 0 8px;
  color: hsl(var(--fd-muted));
  font-size: 0.85rem;
}

.feature-list {
  margin: 12px 0 0;
  padding-left: 18px;
  color: hsl(var(--fd-muted));
}
</style>
