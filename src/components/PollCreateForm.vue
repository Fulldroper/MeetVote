<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { FdButton, FdInput, FdPanel, FdSelect, FdSwitch } from '@fulldroper/ui-kit'
import type { Poll } from '../composables/useApp'

const props = defineProps<{
  poll: Poll
}>()

const emit = defineEmits<{
  (event: 'create'): void
}>()

const toUtcDate = (d: Date) => {
  const normalized = new Date(d)
  normalized.setHours(0, 0, 0, 0)
  return normalized.toISOString().slice(0, 10)
}

const parseUtcDay = (value: string) => new Date(`${value}T00:00:00Z`)

const getMonday = (date: Date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

const addDays = (d: Date, n: number) => {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

const weekOptions = computed(() => {
  const monday = getMonday(new Date())

  return [0, 1, 2, 3].map((offset) => {
    const start = addDays(monday, offset * 7)
    const end = addDays(start, 6)
    const fmt = (d: Date) =>
      d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })
    const prefix =
      offset === 0
        ? 'Цей тиждень'
        : offset === 1
        ? 'Наступний тиждень'
        : `Через ${offset} тижні`
    return {
      value: toUtcDate(start),
      label: `${prefix} · ${fmt(start)} – ${fmt(end)}`,
    }
  })
})

const selectedWeek = ref<string>(weekOptions.value[0].value)

const weekRangeLabel = computed(() => {
  const start = parseUtcDay(selectedWeek.value)
  const end = addDays(start, 6)
  const fmt = (d: Date) =>
    d.toLocaleDateString('uk-UA', { weekday: 'short', day: 'numeric', month: 'long' })
  return `${fmt(start)} → ${fmt(end)}`
})

const closeModeOptions = [
  { value: 'time', label: 'За часом' },
  { value: 'weeks', label: 'Через тижні' },
  { value: 'votes', label: 'За кількістю голосів' },
]

const closeModeHint = computed(() => {
  if (props.poll.closeMode === 'votes') {
    return 'Голосування закривається автоматично, коли досягнуто порогової кількості голосів.'
  }
  if (props.poll.closeMode === 'weeks') {
    return 'Голосування закривається через задану кількість тижнів після початку.'
  }
  return 'Голосування закривається наприкінці обраного тижня.'
})

const applyWeek = (monday: string) => {
  const start = parseUtcDay(monday)
  const end = addDays(start, 6)
  const endAt = new Date(end)
  endAt.setUTCHours(23, 59, 0, 0)

  props.poll.startDate = monday
  props.poll.endDate = toUtcDate(end)
  props.poll.endAt = endAt.toISOString().slice(0, 16)
}

watch(selectedWeek, (value) => applyWeek(value))

onMounted(() => {
  const existingMonday = props.poll.startDate ? props.poll.startDate : null
  const match = weekOptions.value.find((opt) => opt.value === existingMonday)
  selectedWeek.value = match ? match.value : weekOptions.value[0].value
  applyWeek(selectedWeek.value)
})

const canCreate = computed(() => props.poll.title.trim().length > 0)
</script>

<template>
  <section class="create-page">
    <header class="create-head">
      <p class="kicker">
        <span class="kicker-mark">new</span>
        <span class="kicker-sep">/</span>
        <span>create_poll</span>
      </p>
      <h1>Створіть голосування</h1>
      <p class="lead">Тільки те, що дійсно потрібно — назва, опис та тиждень. Решту визначимо автоматично.</p>
    </header>

    <FdPanel class="create-panel" title="Параметри" subtitle="Заповніть мінімум для запуску">
      <div class="form-stack">
        <FdInput
          v-model="props.poll.title"
          label="Назва голосування *"
          placeholder="Коли провести командний міт?"
        />

        <FdInput
          v-model="props.poll.description"
          label="Опис (опціонально)"
          placeholder="Короткий контекст зустрічі"
        />

        <FdSelect
          v-model="selectedWeek"
          label="Тиждень"
          :options="weekOptions"
        />

        <div class="week-preview">
          <p class="week-preview-label">
            <span class="kicker-mark">range</span>
            <span class="kicker-sep">/</span>
            <span>{{ weekRangeLabel }}</span>
          </p>
        </div>

        <div class="close-settings">
          <FdSelect
            v-model="props.poll.closeMode"
            label="Умова завершення"
            :options="closeModeOptions"
          />

          <div class="close-params">
            <template v-if="props.poll.closeMode === 'weeks'">
              <FdInput
                v-model="props.poll.closeAfterWeeks"
                type="number"
                label="Кількість тижнів"
                min="1"
                placeholder="1"
              />
            </template>
            <template v-else-if="props.poll.closeMode === 'votes'">
              <FdInput
                v-model="props.poll.closeVotesThreshold"
                type="number"
                label="Порог голосів"
                min="1"
                placeholder="5"
              />
            </template>
          </div>

          <p class="close-hint">{{ closeModeHint }}</p>
        </div>

        <div class="switch-row">
          <div class="switch-copy">
            <strong>Дозволити редагування голосу</strong>
            <p>Учасники зможуть змінити свій голос через edit-token.</p>
          </div>
          <FdSwitch
            :model-value="props.poll.allowEdit"
            @update:modelValue="(value: boolean) => props.poll.allowEdit = Boolean(value)"
            label=""
          />
        </div>
      </div>

      <div class="form-actions">
        <FdButton :disabled="!canCreate" @click="emit('create')">
          Створити голосування
        </FdButton>
      </div>
    </FdPanel>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/variables' as vars;
@use '../styles/mixins' as *;

$mono: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace;

.create-page {
  display: grid;
  gap: clamp(40px, 6vw, 64px);
  padding: clamp(48px, 8vw, 96px) 0 clamp(40px, 6vw, 72px);
  max-width: 720px;
  margin: 0 auto;
}

.create-head {
  display: grid;
  gap: 14px;
  justify-items: center;
  text-align: center;
}

.kicker {
  margin: 0;
  display: inline-flex;
  gap: 6px;
  align-items: baseline;
  font-family: $mono;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: lowercase;
  color: hsl(vars.$fd-muted);
}

.kicker-mark { color: hsl(vars.$fd-accent); }
.kicker-sep  { color: hsl(vars.$fd-border); }

.create-head h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.6rem);
  line-height: 1.1;
  letter-spacing: -0.025em;
}

.lead {
  margin: 0;
  max-width: 520px;
  color: hsl(vars.$fd-muted);
  line-height: 1.7;
}

.create-panel :deep(.fd-panel) {
  padding: clamp(24px, 4vw, 40px);
}

.form-stack {
  display: grid;
  gap: 22px;
}

.week-preview {
  padding: 14px 18px;
  border: 1px dashed hsl(vars.$fd-border);
  border-radius: 10px;
  background: hsl(vars.$fd-surface-2);
}

.close-settings {
  display: grid;
  gap: 18px;
  padding: 18px;
  border: 1px dashed hsl(vars.$fd-border);
  border-radius: 14px;
  background: hsl(vars.$fd-surface);
}

.close-params {
  display: grid;
  gap: 14px;
}

.close-hint {
  margin: 0;
  color: hsl(vars.$fd-muted);
  font-size: 0.95rem;
  line-height: 1.6;
}

.week-preview-label {
  margin: 0;
  display: inline-flex;
  gap: 6px;
  align-items: baseline;
  font-family: $mono;
  font-size: 12px;
  letter-spacing: 0.02em;
  color: hsl(vars.$fd-text);
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 20px;
  border: 1px dashed hsl(vars.$fd-border);
  border-radius: 12px;
  background: hsl(vars.$fd-surface);
}

.switch-copy strong {
  display: block;
  margin-bottom: 4px;
  font-size: 0.98rem;
  color: hsl(vars.$fd-text);
}

.switch-copy p {
  margin: 0;
  color: hsl(vars.$fd-muted);
  font-size: 0.88rem;
  line-height: 1.5;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 28px;
}

@include respond(sm) {
  .switch-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .form-actions {
    justify-content: stretch;
  }
}
</style>
