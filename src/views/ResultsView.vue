<script setup lang="ts">
import ResultsPanel from '../components/ResultsPanel.vue'

defineProps<{
  bestSlots: { day: string; start: number; end: number; score: number }[]
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
  <ResultsPanel
    :bestSlots="bestSlots"
    :totalParticipants="totalParticipants"
    :isPollClosed="isPollClosed"
    :dayLabel="dayLabel"
    :formatHour="formatHour"
    @download-csv="emit('download-csv')"
    @download-json="emit('download-json')"
    @download-png="emit('download-png')"
    @download-ics="emit('download-ics')"
  />
</template>
