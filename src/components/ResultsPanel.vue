<script setup lang="ts">
import { FdBadge, FdButton, FdPanel } from '@fulldroper/ui-kit'

type BestSlot = {
  day: string
  start: number
  end: number
  score: number
}

defineProps<{
  bestSlots: BestSlot[]
  totalParticipants: number
  isPollClosed: boolean
  dayLabel: (day: string) => string
  formatHour: (minute: number) => string
}>()

const emit = defineEmits<{
  (event: 'download-csv'): void
  (event: 'download-json'): void
  (event: 'download-png'): void
  (event: 'download-ics'): void
}>()
</script>

<template>
  <section>
    <FdPanel title="Теплова мапа доступності" subtitle="Порівняння популярності слотів">
      <div class="legend-row">
        <FdBadge tone="muted">0 голосів</FdBadge>
        <FdBadge tone="accent">середній рівень</FdBadge>
        <FdBadge tone="success">висока доступність</FdBadge>
        <FdBadge tone="danger">найкращий підбір</FdBadge>
      </div>

      <div class="results-grid">
        <div class="export-actions">
          <FdButton @click="emit('download-csv')">CSV</FdButton>
          <FdButton variant="ghost" @click="emit('download-json')">JSON</FdButton>
          <FdButton variant="ghost" @click="emit('download-png')">PNG</FdButton>
          <FdButton variant="ghost" @click="emit('download-ics')">ICS</FdButton>
        </div>

        <div class="result-summary">
          <div>
            <p class="muted-label">Учасники</p>
            <strong>{{ totalParticipants }}</strong>
          </div>
          <div>
            <p class="muted-label">Найкращий слот</p>
            <strong>{{ bestSlots[0] ? `${dayLabel(bestSlots[0].day)} · ${formatHour(bestSlots[0].start)}-${formatHour(bestSlots[0].end)}` : 'Немає' }}</strong>
          </div>
          <div>
            <p class="muted-label">Статус</p>
            <strong>{{ isPollClosed ? 'Закрито' : 'Активно' }}</strong>
          </div>
        </div>

        <div class="top-slots">
          <div v-for="slot in bestSlots" :key="`${slot.day}-${slot.start}`" class="slot-card">
            <FdBadge tone="success">#{{ bestSlots.indexOf(slot) + 1 }}</FdBadge>
            <div>
              <strong>{{ dayLabel(slot.day) }} {{ formatHour(slot.start) }}–{{ formatHour(slot.end) }}</strong>
              <p>{{ slot.score }} голосів у вікні</p>
            </div>
          </div>
        </div>
      </div>
    </FdPanel>
  </section>
</template>

<style scoped>
.results-grid {
  display: grid;
  gap: 18px;
}

.result-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
  padding: 16px 18px;
  border-radius: 18px;
  background: hsl(var(--fd-surface-2));
}

.top-slots {
  display: grid;
  gap: 12px;
}

.slot-card {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 18px;
  background: hsl(var(--fd-surface));
  border: 1px solid hsl(var(--fd-border));
}

.slot-card p {
  margin: 4px 0 0;
  color: hsl(var(--fd-muted));
}

.legend-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.export-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.muted-label {
  margin: 0 0 8px;
  color: hsl(var(--fd-muted));
  font-size: 0.85rem;
}
</style>
