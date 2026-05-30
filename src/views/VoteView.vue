<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VoteComposer from '../components/VoteComposer.vue'
import { useApp } from '../composables/useApp'

const route = useRoute()
const router = useRouter()
const app = useApp()

const pollId = computed(() => String(route.params.id ?? ''))
const notFound = computed(() => Boolean(pollId.value) && app.poll.value.id !== pollId.value)

const loadCurrent = async () => {
  if (!pollId.value) {
    router.replace('/')
    return
  }
  await app.ensurePollLoaded(pollId.value)
}

onMounted(loadCurrent)
watch(pollId, loadCurrent)
</script>

<template>
  <section v-if="notFound" class="poll-missing">
    <p class="kicker">
      <span class="kicker-mark">404</span>
      <span class="kicker-sep">/</span>
      <span>poll_not_found</span>
    </p>
    <h1>Голосування не знайдено</h1>
    <p>Перевірте посилання або створіть нове голосування.</p>
    <RouterLink to="/new" class="cta-link">Створити голосування</RouterLink>
  </section>

  <VoteComposer
    v-else
    :nickname="app.nickname.value"
    :dateOptions="app.dateOptions.value"
    :selectedDays="app.selectedDays.value"
    :applyToAllDays="app.applyToAllDays.value"
    :currentDayKey="app.currentDayKey.value"
    :currentDayMeta="app.currentDayMeta.value"
    :currentDayIntervals="app.currentDayIntervals.value"
    :visibleMarkerMinutes="app.visibleMarkerMinutes.value"
    :hoursLength="app.hours.value.length"
    :timelinePoints="app.timelinePoints.value"
    :wavePath="app.wavePath.value"
    :selectedIntervalRects="app.selectedIntervalRects.value"
    :hoverPosition="app.hoverPosition.value"
    :previewRange="app.previewRange.value"
    :showArrows="app.showArrows.value"
    :poll="app.poll.value"
    :totalParticipants="app.totalParticipants.value"
    :isPollClosed="app.isPollClosed.value"
    @update:nickname="(value: string) => (app.nickname.value = value)"
    @update:applyToAllDays="(value: boolean) => (app.applyToAllDays.value = value)"
    @toggle-day="app.toggleDayTag"
    @move-day="app.moveCurrentDay"
    @reset-selection="app.resetSelection"
    @submit-vote="app.submitVote"
    @pointer-move="app.handlePointerMove"
    @pointer-up="app.endDragSelection"
    @pointer-leave="app.endDragSelection"
    @pointer-down="app.startDragSelection"
    @point-hover="(point) => (app.hoverPosition.value = { minute: point.minute, x: point.x, y: 90 })"
    @point-leave="() => (app.hoverPosition.value = null)"
    @point-click="app.applySelection"
    @edit-selection="app.startEditSelection"
  />
</template>

<style scoped lang="scss">
@use '../styles/variables' as vars;

$mono: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace;

.poll-missing {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 18px;
  padding: clamp(80px, 12vw, 140px) 24px;
  max-width: 520px;
  margin: 0 auto;
}

.kicker {
  margin: 0;
  display: inline-flex;
  gap: 6px;
  font-family: $mono;
  font-size: 12px;
  font-weight: 600;
  text-transform: lowercase;
  color: hsl(vars.$fd-muted);
}

.kicker-mark { color: hsl(vars.$fd-danger); }
.kicker-sep  { color: hsl(vars.$fd-border); }

.poll-missing h1 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  letter-spacing: -0.025em;
}

.poll-missing p {
  margin: 0;
  color: hsl(vars.$fd-muted);
  line-height: 1.6;
}

.cta-link {
  margin-top: 12px;
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
</style>
