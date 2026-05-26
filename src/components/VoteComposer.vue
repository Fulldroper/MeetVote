<script setup lang="ts">
import { computed } from 'vue'
import { FdBadge, FdButton, FdInput, FdSwitch } from '@fulldroper/ui-kit'
import DayTagRow from './DayTagRow.vue'
import TimelineCanvas from './TimelineCanvas.vue'
import type { Poll } from '../composables/useApp'

type Interval = { start: number; end: number }
type DayMeta = { weekday: string; monthDay: string }
type HoverPosition = { minute: number; x: number; y: number }
type PreviewRange = { x: number; width: number }
type SelectedIntervalRect = {
  start: number
  end: number
  startMinute: number
  endMinute: number
  width: number
}
type TimelinePoint = { x: number; y: number; count: number; minute: number }

const props = defineProps<{
  nickname: string
  dateOptions: string[]
  selectedDays: string[]
  applyToAllDays: boolean
  currentDayKey: string
  currentDayMeta: DayMeta
  currentDayIntervals: Interval[]
  visibleMarkerMinutes: number[]
  hoursLength: number
  timelinePoints: TimelinePoint[]
  wavePath: string
  selectedIntervalRects: SelectedIntervalRect[]
  hoverPosition: HoverPosition | null
  previewRange: PreviewRange | null
  showArrows: boolean
  poll: Poll
  totalParticipants: number
  isPollClosed: boolean
}>()

const emit = defineEmits<{
  (event: 'update:nickname', value: string): void
  (event: 'update:applyToAllDays', value: boolean): void
  (event: 'toggle-day', day: string): void
  (event: 'move-day', direction: -1 | 1): void
  (event: 'reset-selection', days: string[]): void
  (event: 'submit-vote'): void
  (event: 'pointer-move', payload: PointerEvent): void
  (event: 'pointer-up'): void
  (event: 'pointer-leave'): void
  (event: 'pointer-down', payload: PointerEvent): void
  (event: 'point-hover', point: TimelinePoint): void
  (event: 'point-leave'): void
  (event: 'point-click', minute: number): void
  (event: 'edit-selection', payload: PointerEvent, range: Interval): void
}>()

const timelineWidth = 960
const timelineHeight = 180

const shareUrl = computed(() => `${window.location.origin}${window.location.pathname.replace(/\/?$/, '')}#/poll/${props.poll.id}`.replace('#//', '/'))

const totalSelected = computed(() =>
  props.selectedDays.reduce(
    (sum, day) => sum + (props.currentDayKey === day ? props.currentDayIntervals.length : 0),
    0,
  ),
)

const copyShare = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
  } catch {
    // ignore
  }
}

const canSubmit = computed(
  () => props.nickname.trim().length > 0 && props.currentDayIntervals.length > 0,
)
</script>

<template>
  <section class="vote-page">
    <header class="vote-head">
      <p class="kicker">
        <span class="kicker-mark">poll</span>
        <span class="kicker-sep">/</span>
        <span>{{ poll.id ? poll.id.slice(0, 8) : '—' }}</span>
      </p>
      <h1>{{ poll.title || 'Голосування' }}</h1>
      <p v-if="poll.description" class="lead">{{ poll.description }}</p>

      <div class="head-meta">
        <FdBadge :tone="isPollClosed ? 'danger' : 'success'">
          {{ isPollClosed ? 'closed' : 'live' }}
        </FdBadge>
        <FdBadge tone="muted">{{ totalParticipants }} учасників</FdBadge>
        <FdBadge tone="muted">{{ poll.intervalMinutes }} хв крок</FdBadge>
      </div>

      <div class="share-row">
        <code class="share-url">{{ shareUrl }}</code>
        <button type="button" class="share-copy" @click="copyShare">copy</button>
      </div>
    </header>

    <section class="block">
      <p class="block-label">
        <span class="kicker-mark">step_1</span>
        <span class="kicker-sep">/</span>
        <span>identify_yourself</span>
      </p>
      <FdInput
        :model-value="nickname"
        @update:modelValue="(value: string) => emit('update:nickname', String(value))"
        label="Нікнейм *"
        placeholder="Наприклад: Олена"
      />
    </section>

    <section class="block">
      <div class="block-head">
        <p class="block-label">
          <span class="kicker-mark">step_2</span>
          <span class="kicker-sep">/</span>
          <span>pick_days</span>
        </p>
        <p class="block-hint">{{ selectedDays.length }} / {{ dateOptions.length }} обрано</p>
      </div>
      <DayTagRow
        :date-options="dateOptions"
        :selected-days="selectedDays"
        @toggle-day="(day) => emit('toggle-day', day)"
      />
    </section>

    <section class="block">
      <div class="block-head">
        <p class="block-label">
          <span class="kicker-mark">step_3</span>
          <span class="kicker-sep">/</span>
          <span>pick_time</span>
        </p>
        <FdSwitch
          :model-value="applyToAllDays"
          @update:modelValue="(value: boolean) => emit('update:applyToAllDays', Boolean(value))"
          label="на всі дні"
        />
      </div>

      <div class="timeline-shell">
        <button
          class="arrow"
          :class="{ 'arrow-hidden': !showArrows }"
          @click="emit('move-day', -1)"
          aria-label="Попередній день"
          :aria-hidden="!showArrows"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <div class="timeline-card">
          <div class="timeline-head">
            <div class="day-title-block">
              <p class="day-title">{{ currentDayMeta.weekday }}</p>
              <p class="day-subtitle">{{ currentDayMeta.monthDay }}</p>
            </div>
            <FdBadge tone="accent">{{ currentDayIntervals.length }} інтервалів</FdBadge>
          </div>

          <div class="timeline-grid">
            <TimelineCanvas
              :timeline-width="timelineWidth"
              :timeline-height="timelineHeight"
              :visible-marker-minutes="visibleMarkerMinutes"
              :wave-path="wavePath"
              :timeline-points="timelinePoints"
              :current-day-intervals="currentDayIntervals"
              :preview-range="previewRange"
              :selected-interval-rects="selectedIntervalRects"
              :hover-position="hoverPosition"
              :current-day-key="currentDayKey"
              :current-day-meta="currentDayMeta"
              @pointer-move="(event: PointerEvent) => emit('pointer-move', event)"
              @pointer-up="() => emit('pointer-up')"
              @pointer-leave="() => emit('pointer-leave')"
              @pointer-down="(event: PointerEvent) => emit('pointer-down', event)"
              @point-hover="(point: TimelinePoint) => emit('point-hover', point)"
              @point-leave="() => emit('point-leave')"
              @point-click="(minute: number) => emit('point-click', minute)"
              @edit-selection="(event: PointerEvent, range: Interval) => emit('edit-selection', event, range)"
            />
          </div>

          <div class="timeline-actions-row">
            <p class="muted-hint">
              <span class="kicker-mark">hint</span>
              <span class="kicker-sep">·</span>
              <span>тягніть курсором, щоб додати інтервал; перетягуйте край для зміни розміру</span>
            </p>
            <button type="button" class="ghost-link" @click="emit('reset-selection', dateOptions)">
              очистити вибір
            </button>
          </div>
        </div>

        <button
          class="arrow"
          :class="{ 'arrow-hidden': !showArrows }"
          @click="emit('move-day', 1)"
          aria-label="Наступний день"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </section>

    <div class="submit-row">
      <p class="submit-meta">
        <span class="kicker-mark">selected</span>
        <span class="kicker-sep">/</span>
        <span>{{ totalSelected }} інтервалів на {{ currentDayMeta.weekday || 'дні' }}</span>
      </p>
      <FdButton :disabled="!canSubmit || isPollClosed" @click="emit('submit-vote')">
        Зберегти голос
      </FdButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/variables' as vars;
@use '../styles/mixins' as *;

$mono: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace;

.vote-page {
  display: grid;
  gap: clamp(32px, 5vw, 56px);
  padding: clamp(48px, 8vw, 96px) 0 clamp(40px, 6vw, 72px);
  max-width: 980px;
  margin: 0 auto;
}

/* ---------- head ---------- */

.vote-head {
  display: grid;
  gap: 14px;
}

.kicker, .block-label, .muted-hint, .submit-meta {
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

.vote-head h1 {
  margin: 0;
  font-size: clamp(1.8rem, 3.2vw, 2.4rem);
  letter-spacing: -0.025em;
  line-height: 1.15;
}

.lead {
  margin: 0;
  color: hsl(vars.$fd-muted);
  line-height: 1.7;
  max-width: 640px;
}

.head-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.share-row {
  display: flex;
  align-items: stretch;
  gap: 0;
  border: 1px dashed hsl(vars.$fd-border);
  border-radius: 10px;
  background: hsl(vars.$fd-surface);
  overflow: hidden;
  max-width: 640px;
}

.share-url {
  flex: 1;
  min-width: 0;
  padding: 10px 14px;
  font-family: $mono;
  font-size: 12px;
  color: hsl(vars.$fd-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.share-copy {
  border: 0;
  border-left: 1px dashed hsl(vars.$fd-border);
  background: hsl(vars.$fd-surface-2);
  padding: 0 16px;
  font-family: $mono;
  font-size: 12px;
  font-weight: 700;
  text-transform: lowercase;
  color: hsl(vars.$fd-accent);
  cursor: pointer;
  transition: background 160ms ease;
}

.share-copy:hover { background: hsl(var(--fd-accent) / 0.1); }

/* ---------- blocks ---------- */

.block {
  display: grid;
  gap: 14px;
  padding: clamp(20px, 3vw, 28px);
  border: 1px dashed hsl(vars.$fd-border);
  border-radius: 14px;
  background: hsl(vars.$fd-surface);
}

.block-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.block-hint {
  margin: 0;
  font-family: $mono;
  font-size: 11px;
  color: hsl(vars.$fd-muted);
  letter-spacing: 0.04em;
}

/* ---------- timeline ---------- */

.timeline-shell {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) 36px;
  align-items: center;
  gap: 16px;
}

.arrow {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px dashed hsl(vars.$fd-border);
  background: hsl(vars.$fd-surface);
  color: hsl(vars.$fd-text);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: border-color 160ms ease, color 160ms ease, transform 160ms ease;
}

.arrow:hover {
  border-color: hsl(vars.$fd-accent);
  color: hsl(vars.$fd-accent);
  transform: translateY(-1px);
}

.arrow-hidden {
  visibility: hidden;
  pointer-events: none;
}

.timeline-card {
  min-width: 0;
  padding: 18px;
  border-radius: 14px;
  background: hsl(vars.$fd-surface-2);
  border: 1px dashed hsl(vars.$fd-border);
}

.timeline-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 14px;
}

.day-title-block {
  display: grid;
  gap: 2px;
  text-align: left;
}

.day-title {
  margin: 0;
  font-size: 1.05rem;
  color: hsl(vars.$fd-text);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.day-subtitle {
  margin: 0;
  font-family: $mono;
  font-size: 12px;
  color: hsl(vars.$fd-muted);
  text-transform: lowercase;
}

.timeline-grid {
  display: grid;
  gap: 8px;
  overflow-x: auto;
}

.timeline-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.ghost-link {
  border: 0;
  background: transparent;
  padding: 0;
  font-family: $mono;
  font-size: 12px;
  font-weight: 700;
  text-transform: lowercase;
  color: hsl(vars.$fd-muted);
  cursor: pointer;
  transition: color 160ms ease;
}

.ghost-link:hover { color: hsl(vars.$fd-accent); }

/* ---------- submit ---------- */

.submit-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-top: 18px;
  border-top: 1px dashed hsl(vars.$fd-border);
  flex-wrap: wrap;
}

@include respond(md) {
  .timeline-shell {
    grid-template-columns: 1fr;
  }
  .arrow { display: none; }
}

@include respond(sm) {
  .submit-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
