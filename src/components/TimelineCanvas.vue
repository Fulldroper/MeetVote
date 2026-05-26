<script setup lang="ts">
import { computed } from 'vue'

type Interval = { start: number; end: number }
type TimelinePoint = { x: number; y: number; count: number; minute: number }
type PreviewRange = { x: number; width: number }
type HoverPosition = { minute: number; x: number; y: number }
type SelectedIntervalRect = {
  start: number
  end: number
  startMinute: number
  endMinute: number
  width: number
}

const props = defineProps<{
  timelineWidth: number
  timelineHeight: number
  visibleMarkerMinutes: number[]
  wavePath: string
  timelinePoints: TimelinePoint[]
  currentDayIntervals: Interval[]
  previewRange: PreviewRange | null
  selectedIntervalRects: SelectedIntervalRect[]
  hoverPosition: HoverPosition | null
  currentDayKey: string
  currentDayMeta: { weekday: string; monthDay: string }
}>()

const emit = defineEmits<{
  (event: 'pointer-move', payload: PointerEvent): void
  (event: 'pointer-up'): void
  (event: 'pointer-leave'): void
  (event: 'pointer-down', payload: PointerEvent): void
  (event: 'point-hover', point: TimelinePoint): void
  (event: 'point-leave'): void
  (event: 'point-click', minute: number): void
  (event: 'edit-selection', payload: PointerEvent, range: Interval): void
}>()

const formatMinute = (minute: number) => {
  const m = Math.max(0, Math.min(1440, Math.round(minute)))
  const h = Math.floor(m / 60).toString().padStart(2, '0')
  const mm = (m % 60).toString().padStart(2, '0')
  return `${h}:${mm}`
}

const hourLabelMinutes = computed(() => [0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => h * 60))

const totalHeight = computed(() => props.timelineHeight + 28)

const rectY = computed(() => props.timelineHeight / 2 - 22)
const rectH = 44
</script>

<template>
  <div class="timeline-visual">
    <svg
      class="wave-svg"
      :width="timelineWidth"
      :height="totalHeight"
      :viewBox="`0 0 ${timelineWidth} ${totalHeight}`"
      @pointermove="(e: PointerEvent) => emit('pointer-move', e)"
      @pointerup="() => emit('pointer-up')"
      @pointerleave="() => emit('pointer-leave')"
      @pointerdown="(e: PointerEvent) => emit('pointer-down', e)"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="hsl(var(--fd-accent))" stop-opacity="0.95" />
          <stop offset="100%" stop-color="hsl(var(--fd-accent))" stop-opacity="0.25" />
        </linearGradient>
      </defs>

      <!-- Markers -->
      <g class="markers">
        <line
          v-for="m in visibleMarkerMinutes"
          :key="`mark-${m}`"
          :x1="(m / 1440) * timelineWidth"
          :x2="(m / 1440) * timelineWidth"
          y1="6"
          :y2="timelineHeight - 6"
          class="marker-line"
          :class="{ 'marker-hour': m % 60 === 0, 'marker-mid': m % 30 === 0 && m % 60 !== 0 }"
        />
      </g>

      <!-- Hour labels at bottom -->
      <g class="hour-labels">
        <text
          v-for="m in hourLabelMinutes"
          :key="`lbl-${m}`"
          :x="(m / 1440) * timelineWidth"
          :y="totalHeight - 6"
          text-anchor="middle"
          class="hour-label"
        >{{ formatMinute(m) }}</text>
      </g>

      <!-- Wave path -->
      <path v-if="wavePath" :d="wavePath" class="wave-path" />

      <!-- Selected intervals -->
      <rect
        v-for="(r, i) in selectedIntervalRects"
        :key="`sel-${i}`"
        :x="r.start"
        :y="rectY"
        :width="r.width"
        :height="rectH"
        rx="8"
        class="selection-rect"
        @pointerdown.stop="(e: PointerEvent) => emit('edit-selection', e, { start: r.startMinute, end: r.endMinute })"
      />

      <!-- Preview rect during drag -->
      <rect
        v-if="previewRange"
        :x="previewRange.x"
        :y="rectY"
        :width="previewRange.width"
        :height="rectH"
        rx="8"
        class="preview-rect"
      />

      <!-- Wave points -->
      <circle
        v-for="(p, i) in timelinePoints"
        :key="`pt-${i}`"
        :cx="p.x"
        :cy="p.y"
        r="3.5"
        class="wave-point"
        :class="{ 'wave-point-selected': p.count > 0 }"
        @pointerenter="emit('point-hover', p)"
        @pointerleave="emit('point-leave')"
        @click.stop="emit('point-click', p.minute)"
      />

      <!-- Cursor guide + tooltip -->
      <g v-if="hoverPosition" class="cursor-layer" pointer-events="none">
        <line
          :x1="hoverPosition.x"
          :x2="hoverPosition.x"
          y1="0"
          :y2="timelineHeight"
          class="cursor-guide"
        />
        <g :transform="`translate(${hoverPosition.x}, 14)`">
          <rect x="-32" y="-12" width="64" height="22" rx="6" class="tooltip-box" />
          <text x="0" y="3" text-anchor="middle" class="tooltip-text">
            {{ formatMinute(hoverPosition.minute) }}
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.timeline-visual {
  position: relative;
  min-width: 760px;
  border-radius: 14px;
  padding: 8px 4px 2px;
  background:
    radial-gradient(circle at 18% 0%, hsl(var(--fd-accent) / 0.1) 0%, transparent 32%),
    hsl(var(--fd-surface));
  border: 1px dashed hsl(var(--fd-border));
}

.wave-svg {
  width: 100%;
  height: auto;
  display: block;
  cursor: crosshair;
  user-select: none;
  touch-action: none;
}

.marker-line {
  stroke: hsl(var(--fd-border));
  stroke-width: 1;
  stroke-dasharray: 3 5;
  opacity: 0.55;
}

.marker-mid {
  opacity: 0.7;
}

.marker-hour {
  stroke-width: 1.4;
  opacity: 0.9;
  stroke-dasharray: 0;
}

.hour-label {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  fill: hsl(var(--fd-muted));
}

.wave-path {
  fill: none;
  stroke: url(#waveGradient);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
}

.wave-point {
  fill: hsl(var(--fd-surface-2));
  stroke: hsl(var(--fd-border));
  stroke-width: 1.2;
  cursor: pointer;
  transition: r 140ms ease, fill 140ms ease;
}

.wave-point:hover {
  fill: hsl(var(--fd-accent));
  stroke: hsl(var(--fd-accent));
}

.wave-point-selected {
  fill: hsl(var(--fd-accent));
  stroke: hsl(var(--fd-accent));
}

.selection-rect {
  fill: hsl(var(--fd-accent) / 0.85);
  stroke: hsl(var(--fd-accent));
  stroke-width: 1.5;
  cursor: grab;
  transition: fill 140ms ease;
}

.selection-rect:hover {
  fill: hsl(var(--fd-accent));
}

.preview-rect {
  fill: hsl(var(--fd-accent) / 0.18);
  stroke: hsl(var(--fd-accent));
  stroke-width: 1.5;
  stroke-dasharray: 6 5;
  pointer-events: none;
}

.cursor-guide {
  stroke: hsl(var(--fd-accent));
  stroke-width: 1.2;
  stroke-dasharray: 4 5;
  opacity: 0.7;
}

.tooltip-box {
  fill: hsl(var(--fd-accent));
}

.tooltip-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace;
  fill: hsl(var(--fd-accent-on));
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
}
</style>
