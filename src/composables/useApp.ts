import { computed, ref, watch } from 'vue'
import { hasSupabase } from '../lib/supabase'
import generateId from '../lib/id_generate'
import {
  createPollRemote,
  fetchPollRemote,
  fetchVotesRemote,
  submitVoteRemote,
  updateVoteRemote,
} from '../api/polls'

export type Interval = { start: number; end: number }

export type VoteSlot = { day: string; start: number; end: number }

export type Vote = {
  id: string
  nickname: string
  comment: string
  editToken: string
  slots: VoteSlot[]
}

export type Poll = {
  id: string
  title: string
  description: string
  timezone: string
  endAt: string
  startDate: string
  endDate: string
  intervalMinutes: number
  allowEdit: boolean
  showLiveResults: boolean
  anonymous: boolean
  autoClose: boolean
  status: 'live' | 'closed'
}

export type EditMode = 'move' | 'resize-left' | 'resize-right'

export type EditDragState = {
  day: string
  range: Interval
  mode: EditMode
  pointerMinute: number
} | null

const STORAGE_KEY = 'meetvote-prototype-v2'
const POLL_PREFIX = 'meetvote-poll-'
const VOTES_PREFIX = 'meetvote-votes-'
const USER_NICKNAME_KEY = 'meetvote-nickname'
const USER_HISTORY_KEY = 'meetvote-user-history'

export type UserPollHistoryItem = {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: 'live' | 'closed'
  editToken: string
  voteId: string
  lastVotedAt: string
}

const todayIso = () => new Date().toISOString().slice(0, 10)

const defaultPoll = (): Poll => ({
  id: '',
  title: 'Коли провести командний міт?',
  description: '',
  timezone: 'Europe/Kyiv',
  endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString().slice(0, 16),
  startDate: todayIso(),
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString().slice(0, 10),
  intervalMinutes: 60,
  allowEdit: true,
  showLiveResults: true,
  anonymous: false,
  autoClose: true,
  status: 'live',
})

const timelineWidth = 960
const timelineHeight = 180

const poll = ref<Poll>(defaultPoll())
const votes = ref<Vote[]>([])
const nickname = ref('')
const userNickname = ref('')
const userHistory = ref<UserPollHistoryItem[]>([])
const currentVoteId = ref<string | null>(null)
const currentEditToken = ref('')
const selectedDays = ref<string[]>([])
const selectedIntervals = ref<Record<string, Interval[]>>({})
const applyToAllDays = ref(true)
const activeDay = ref('')
const hoverPosition = ref<{ minute: number; x: number; y: number } | null>(null)
const dragState = ref({ start: 0, current: 0, active: false })
const editDragState = ref<EditDragState>(null)
const now = ref(new Date())
const realtimePulse = ref(0)

const dateOptions = computed(() => {
  const result: string[] = []
  const start = new Date(poll.value.startDate)
  const end = new Date(poll.value.endDate)
  while (start <= end) {
    result.push(start.toISOString().slice(0, 10))
    start.setDate(start.getDate() + 1)
  }
  return result
})

const timelineStep = computed(() => poll.value.intervalMinutes)
const hours = computed(() =>
  Array.from({ length: 24 * (60 / timelineStep.value) }, (_, index) => index * timelineStep.value),
)
const isPollClosed = computed(() => new Date(poll.value.endAt).getTime() <= now.value.getTime())
const totalParticipants = computed(() => votes.value.length)

const formatDayHeader = (day: string) => {
  const parsed = new Date(`${day}T12:00:00`)
  return {
    weekday: parsed.toLocaleDateString('uk-UA', { weekday: 'long' }),
    monthDay: parsed.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' }),
  }
}

const currentDayKey = computed(() => activeDay.value || selectedDays.value[0] || '')
const currentDayMeta = computed(() =>
  currentDayKey.value
    ? formatDayHeader(currentDayKey.value)
    : { weekday: 'Оберіть день', monthDay: '' },
)

const persistCurrent = () => {
  if (!poll.value.id) return
  localStorage.setItem(`${POLL_PREFIX}${poll.value.id}`, JSON.stringify(poll.value))
  localStorage.setItem(`${VOTES_PREFIX}${poll.value.id}`, JSON.stringify(votes.value))
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      poll: poll.value,
      votes: votes.value,
      selectedDays: selectedDays.value,
      selectedIntervals: selectedIntervals.value,
    }),
  )
  persistUserPreferences()
}

const persistUserPreferences = () => {
  localStorage.setItem(USER_NICKNAME_KEY, userNickname.value)
  localStorage.setItem(USER_HISTORY_KEY, JSON.stringify(userHistory.value))
}

const loadUserPreferences = () => {
  const storedNickname = localStorage.getItem(USER_NICKNAME_KEY)
  if (storedNickname) {
    userNickname.value = storedNickname
    nickname.value = storedNickname
  }
  const rawHistory = localStorage.getItem(USER_HISTORY_KEY)
  if (rawHistory) {
    try {
      userHistory.value = JSON.parse(rawHistory) as UserPollHistoryItem[]
    } catch {
      userHistory.value = []
    }
  }
}

const setUserVoteHistory = (vote: Vote) => {
  if (!poll.value.id) return
  const item: UserPollHistoryItem = {
    id: poll.value.id,
    title: poll.value.title,
    description: poll.value.description,
    startDate: poll.value.startDate,
    endDate: poll.value.endDate,
    status: poll.value.status,
    editToken: vote.editToken,
    voteId: vote.id,
    lastVotedAt: new Date().toISOString(),
  }
  const existingIndex = userHistory.value.findIndex((entry) => entry.id === poll.value.id)
  if (existingIndex >= 0) {
    userHistory.value.splice(existingIndex, 1)
  }
  userHistory.value.unshift(item)
  if (userHistory.value.length > 50) {
    userHistory.value.pop()
  }
  persistUserPreferences()
}

const restoreUserVoteForPoll = (id: string) => {
  const historyItem = userHistory.value.find((entry) => entry.id === id)
  if (historyItem) {
    currentEditToken.value = historyItem.editToken
    currentVoteId.value = historyItem.voteId
  }
  const vote = historyItem
    ? votes.value.find((item) => item.editToken === historyItem.editToken && item.nickname === userNickname.value)
    : null
  if (vote) {
    currentVoteId.value = vote.id
    currentEditToken.value = vote.editToken
    nickname.value = vote.nickname
    userNickname.value = vote.nickname
    const days = Array.from(new Set(vote.slots.map((slot) => slot.day))).sort()
    selectedDays.value = days
    selectedIntervals.value = Object.fromEntries(
      days.map((day) => [
        day,
        vote.slots
          .filter((slot) => slot.day === day)
          .map((slot) => ({ start: slot.start, end: slot.end })),
      ]),
    )
    activeDay.value = days[0] ?? ''
    return true
  }
  currentVoteId.value = null
  currentEditToken.value = ''
  if (userNickname.value) {
    nickname.value = userNickname.value
  }
  return false
}

const resetSelection = (days: string[]) => {
  selectedDays.value = days
  selectedIntervals.value = Object.fromEntries(days.map((day) => [day, [] as Interval[]]))
  activeDay.value = days[0] ?? ''
}

const loadPoll = (id: string): boolean => {
  const rawPoll = localStorage.getItem(`${POLL_PREFIX}${id}`)
  if (!rawPoll) return false
  try {
    poll.value = { ...defaultPoll(), ...(JSON.parse(rawPoll) as Poll) }
    const rawVotes = localStorage.getItem(`${VOTES_PREFIX}${id}`)
    votes.value = rawVotes ? (JSON.parse(rawVotes) as Vote[]) : []
    resetSelection(dateOptions.value)
    return true
  } catch {
    return false
  }
}

const loadLegacy = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    resetSelection(dateOptions.value)
    return
  }
  try {
    const parsed = JSON.parse(raw) as {
      poll?: Poll
      votes?: Vote[]
      selectedDays?: string[]
      selectedIntervals?: Record<string, Interval[]>
    }
    if (parsed.poll) poll.value = { ...defaultPoll(), ...parsed.poll }
    if (parsed.votes) votes.value = parsed.votes
    const days = parsed.selectedDays?.length ? parsed.selectedDays : dateOptions.value
    selectedDays.value = days
    selectedIntervals.value = Object.fromEntries(
      days.map((day) => [day, parsed.selectedIntervals?.[day] ?? []]),
    )
    if (!activeDay.value || !days.includes(activeDay.value)) {
      activeDay.value = days[0] ?? ''
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    resetSelection(dateOptions.value)
  }
}

const heatmap = computed(() => {
  const map: Record<string, number[]> = {}
  dateOptions.value.forEach((day) => {
    map[day] = Array.from({ length: hours.value.length }, () => 0)
  })
  votes.value.forEach((vote) => {
    vote.slots.forEach((slot) => {
      for (let i = 0; i < hours.value.length; i += 1) {
        const minute = hours.value[i]
        if (minute >= slot.start && minute < slot.end && map[slot.day]) {
          map[slot.day][i] += 1
        }
      }
    })
  })
  return map
})

const maxHeat = computed(() => Math.max(1, ...Object.values(heatmap.value).flat()))
const showArrows = computed(() => !applyToAllDays.value && selectedDays.value.length > 1)
const currentDayIndex = computed(() =>
  Math.max(0, selectedDays.value.indexOf(currentDayKey.value)),
)

const moveCurrentDay = (direction: -1 | 1) => {
  if (!selectedDays.value.length) return
  const nextIndex =
    (currentDayIndex.value + direction + selectedDays.value.length) % selectedDays.value.length
  activeDay.value = selectedDays.value[nextIndex]
}

const toggleDayTag = (day: string) => {
  const next = new Set(selectedDays.value)
  if (next.has(day)) next.delete(day)
  else next.add(day)
  if (next.size === 0) return
  selectedDays.value = Array.from(next).sort()
  selectedIntervals.value = Object.fromEntries(
    selectedDays.value.map((item) => [item, selectedIntervals.value[item] ?? []]),
  )
  if (!selectedDays.value.includes(currentDayKey.value)) {
    activeDay.value = selectedDays.value[0]
  }
}

const snapToStep = (minute: number) => {
  const step = timelineStep.value
  const snapped = Math.round(minute / step) * step
  return Math.max(0, Math.min(1440, snapped))
}

const minuteToX = (minute: number) =>
  (Math.max(0, Math.min(1440, minute)) / 1440) * timelineWidth

const xToMinute = (x: number, rectWidth: number) => {
  const ratio = Math.max(0, Math.min(1, x / rectWidth))
  return snapToStep(Math.round(ratio * 1440))
}

const buildRangeFromDrag = (start: number, end: number) => {
  const left = snapToStep(Math.min(start, end))
  const right = snapToStep(Math.max(start, end))
  const normalizedEnd = right === left ? left + timelineStep.value : right
  return { start: left, end: Math.min(1440, normalizedEnd) }
}

const mergeIntervals = (existing: Interval[], incoming: Interval[]) => {
  const merged = [...existing, ...incoming]
  merged.sort((a, b) => a.start - b.start || a.end - b.end)
  const result: Interval[] = []
  merged.forEach((range) => {
    const last = result[result.length - 1]
    if (!last) {
      result.push({ ...range })
      return
    }
    if (range.start <= last.end + timelineStep.value) {
      last.end = Math.max(last.end, range.end)
    } else {
      result.push({ ...range })
    }
  })
  return result
}

const addRange = (days: string[], range: Interval) => {
  days.forEach((day) => {
    selectedIntervals.value[day] = mergeIntervals(selectedIntervals.value[day] ?? [], [range])
  })
}

const removeRange = (days: string[], range: Interval) => {
  days.forEach((day) => {
    const current = selectedIntervals.value[day] ?? []
    selectedIntervals.value[day] = current.filter(
      (item) => !(item.start === range.start && item.end === range.end),
    )
  })
}

const applySelection = (minute: number) => {
  const targets = applyToAllDays.value ? selectedDays.value : [currentDayKey.value]
  const normalized = snapToStep(minute)
  const range = { start: normalized, end: Math.min(1440, normalized + timelineStep.value) }
  const selected = targets.some((day) =>
    (selectedIntervals.value[day] ?? []).some(
      (item) => item.start === range.start && item.end === range.end,
    ),
  )
  if (selected) {
    targets.forEach((day) => removeRange([day], range))
    return
  }
  addRange(targets, range)
}

const currentDayIntervals = computed(() => selectedIntervals.value[currentDayKey.value] ?? [])

const timelinePoints = computed(() => {
  if (!currentDayKey.value) return []
  const values = heatmap.value[currentDayKey.value] ?? []
  const stepX = timelineWidth / Math.max(1, values.length - 1)
  const centerY = timelineHeight / 2
  const amplitude = 45
  return values.map((count, index) => {
    const normalized = count / maxHeat.value
    const x = index * stepX
    const y = centerY - normalized * amplitude
    return { x, y, count, minute: hours.value[index] }
  })
})

const wavePath = computed(() => {
  if (!timelinePoints.value.length) return ''
  return timelinePoints.value
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ')
})

const isMarkerVisible = (minute: number) => {
  const step = timelineStep.value
  if (step === 15) return true
  if (step === 30) return minute % 30 === 0
  if (step === 45) return minute % 45 === 0
  if (step === 60) return minute % 60 === 0
  return false
}

const markerMinutes = computed(() =>
  Array.from({ length: 24 * 4 }, (_, index) => index * 15),
)
const visibleMarkerMinutes = computed(() => markerMinutes.value.filter(isMarkerVisible))

const selectedIntervalRects = computed(() => {
  if (!currentDayKey.value) return []
  return currentDayIntervals.value.map((range) => {
    const startX = minuteToX(range.start)
    const endX = minuteToX(range.end)
    let width = endX - startX
    if (width < 16) width = 16
    return {
      start: startX,
      end: endX,
      startMinute: range.start,
      endMinute: range.end,
      width,
    }
  })
})

const updateHoverFromEvent = (event: PointerEvent, svgRect: DOMRect) => {
  const x = Math.max(
    0,
    Math.min(timelineWidth, ((event.clientX - svgRect.left) / svgRect.width) * timelineWidth),
  )
  const minute = xToMinute(x, svgRect.width)
  hoverPosition.value = {
    minute,
    x,
    y: Math.max(12, Math.min(timelineHeight - 12, event.clientY - svgRect.top)),
  }
}

const startDragSelection = (event: PointerEvent) => {
  const target = event.currentTarget as SVGSVGElement
  const rect = target.getBoundingClientRect()
  const minute = xToMinute(event.clientX - rect.left, rect.width)
  dragState.value = { start: minute, current: minute, active: true }
  editDragState.value = null
  hoverPosition.value = {
    minute,
    x: Math.max(
      0,
      Math.min(timelineWidth, ((event.clientX - rect.left) / rect.width) * timelineWidth),
    ),
    y: timelineHeight / 2,
  }
  target.setPointerCapture(event.pointerId)
}

const startEditSelection = (event: PointerEvent, range: Interval) => {
  event.stopPropagation()
  const target = event.currentTarget as SVGElement
  const svg = target.ownerSVGElement as SVGSVGElement | null
  const rect = svg?.getBoundingClientRect()
  if (!svg || !rect) return
  const currentMinute = xToMinute(event.clientX - rect.left, rect.width)
  const edgeThreshold = 20
  const startX = minuteToX(range.start)
  const endX = minuteToX(range.end)
  const x = Math.max(
    0,
    Math.min(timelineWidth, ((event.clientX - rect.left) / rect.width) * timelineWidth),
  )
  const mode: EditMode =
    x <= startX + edgeThreshold
      ? 'resize-left'
      : x >= endX - edgeThreshold
      ? 'resize-right'
      : 'move'
  editDragState.value = {
    day: currentDayKey.value,
    range,
    mode,
    pointerMinute: currentMinute,
  }
  dragState.value = { start: 0, current: 0, active: false }
  svg.setPointerCapture(event.pointerId)
}

const handlePointerMove = (event: PointerEvent) => {
  const target = event.currentTarget as SVGSVGElement
  const rect = target.getBoundingClientRect()

  if (editDragState.value) {
    const currentMinute = xToMinute(event.clientX - rect.left, rect.width)
    const drag = editDragState.value
    const duration = drag.range.end - drag.range.start

    if (drag.mode === 'move') {
      const delta = currentMinute - drag.pointerMinute
      const newStart = Math.max(0, Math.min(1440 - duration, drag.range.start + delta))
      const newEnd = newStart + duration
      selectedIntervals.value[drag.day] = (selectedIntervals.value[drag.day] ?? []).map((item) =>
        item.start === drag.range.start && item.end === drag.range.end
          ? { start: newStart, end: newEnd }
          : item,
      )
    }
    if (drag.mode === 'resize-left') {
      const candidate = Math.min(drag.range.end - timelineStep.value, Math.max(0, currentMinute))
      selectedIntervals.value[drag.day] = (selectedIntervals.value[drag.day] ?? []).map((item) =>
        item.start === drag.range.start && item.end === drag.range.end
          ? { start: candidate, end: drag.range.end }
          : item,
      )
    }
    if (drag.mode === 'resize-right') {
      const candidate = Math.max(
        drag.range.start + timelineStep.value,
        Math.min(1440, currentMinute),
      )
      selectedIntervals.value[drag.day] = (selectedIntervals.value[drag.day] ?? []).map((item) =>
        item.start === drag.range.start && item.end === drag.range.end
          ? { start: drag.range.start, end: candidate }
          : item,
      )
    }

    hoverPosition.value = {
      minute: currentMinute,
      x: Math.max(
        0,
        Math.min(timelineWidth, ((event.clientX - rect.left) / rect.width) * timelineWidth),
      ),
      y: timelineHeight / 2,
    }
    return
  }

  if (dragState.value.active) {
    const currentMinute = xToMinute(event.clientX - rect.left, rect.width)
    dragState.value.current = currentMinute
    hoverPosition.value = {
      minute: currentMinute,
      x: Math.max(
        0,
        Math.min(timelineWidth, ((event.clientX - rect.left) / rect.width) * timelineWidth),
      ),
      y: timelineHeight / 2,
    }
    return
  }

  updateHoverFromEvent(event, rect)
}

const previewRange = computed(() => {
  if (!dragState.value.active || dragState.value.start === dragState.value.current) {
    return null
  }
  const start = Math.min(dragState.value.start, dragState.value.current)
  const end = Math.max(dragState.value.start, dragState.value.current)
  const range = buildRangeFromDrag(start, end)
  return {
    x: minuteToX(range.start),
    width: Math.max(12, minuteToX(range.end) - minuteToX(range.start)),
  }
})

const endDragSelection = () => {
  if (editDragState.value) {
    editDragState.value = null
    return
  }
  if (!dragState.value.active) return
  const start = Math.min(dragState.value.start, dragState.value.current)
  const end = Math.max(dragState.value.start, dragState.value.current)
  dragState.value = { start: 0, current: 0, active: false }
  if (start === end) {
    applySelection(start)
    return
  }
  const range = buildRangeFromDrag(start, end)
  const targets = applyToAllDays.value ? selectedDays.value : [currentDayKey.value]
  addRange(targets, range)
  hoverPosition.value = { minute: range.end, x: minuteToX(range.end), y: timelineHeight / 2 }
}

const createPoll = async () => {
  poll.value.id = generateId()
  poll.value.status = 'live'
  poll.value.startDate = new Date(poll.value.startDate).toISOString().slice(0, 10)
  poll.value.endDate = new Date(poll.value.endDate).toISOString().slice(0, 10)
  poll.value.endAt = new Date(poll.value.endAt).toISOString()
  votes.value = []
  resetSelection(dateOptions.value)

  if (hasSupabase()) {
    try {
      const remote = await createPollRemote(poll.value)
      poll.value = { ...poll.value, ...remote }
    } catch (error) {
      // keep local copy if remote save fails
      console.warn('Supabase poll creation failed', error)
    }
  }

  persistCurrent()
}

const submitVote = async () => {
  const slots = Object.entries(selectedIntervals.value).flatMap(([day, ranges]) =>
    ranges.map((range) => ({ day, start: range.start, end: range.end })),
  )
  if (!nickname.value.trim() || slots.length === 0) return

  const trimmedNickname = nickname.value.trim()
  const currentEdit = currentEditToken.value
  const existingVoteIndex = votes.value.findIndex(
    (item) => item.editToken === currentEdit || item.nickname === trimmedNickname,
  )
  const vote: Vote = {
    id: generateId(),
    nickname: trimmedNickname,
    comment: '',
    editToken: currentEdit || generateId().slice(0, 8),
    slots,
  }

  if (existingVoteIndex >= 0) {
    vote.id = votes.value[existingVoteIndex].id
    vote.editToken = votes.value[existingVoteIndex].editToken
  }

  if (hasSupabase() && poll.value.id) {
    try {
      if (existingVoteIndex >= 0) {
        await updateVoteRemote(poll.value.id, vote)
      } else {
        await submitVoteRemote(poll.value.id, vote)
      }
    } catch (error) {
      console.warn('Supabase vote submission failed', error)
    }
  }

  if (existingVoteIndex >= 0) {
    votes.value[existingVoteIndex] = vote
  } else {
    votes.value = [vote, ...votes.value]
  }
  userNickname.value = trimmedNickname
  nickname.value = trimmedNickname
  currentEditToken.value = vote.editToken
  setUserVoteHistory(vote)
  resetSelection(dateOptions.value)
  persistCurrent()
  realtimePulse.value += 1
}

const sampleDemoVotes = () => {
  if (dateOptions.value.length < 4) return
  votes.value = [
    {
      id: 'demo-1',
      nickname: 'Аня',
      comment: '',
      editToken: 'demo-1',
      slots: [
        { day: dateOptions.value[0], start: 540, end: 660 },
        { day: dateOptions.value[1], start: 600, end: 720 },
        { day: dateOptions.value[2], start: 720, end: 780 },
      ],
    },
    {
      id: 'demo-2',
      nickname: 'Макс',
      comment: '',
      editToken: 'demo-2',
      slots: [
        { day: dateOptions.value[0], start: 540, end: 600 },
        { day: dateOptions.value[1], start: 600, end: 660 },
        { day: dateOptions.value[3], start: 660, end: 720 },
      ],
    },
  ]
  persistCurrent()
}

watch([poll, votes, selectedIntervals], () => {
  persistCurrent()
}, { deep: true })

let bootstrapped = false
const bootstrap = () => {
  if (bootstrapped) return
  bootstrapped = true
  loadLegacy()
  loadUserPreferences()
  if (!votes.value.length) sampleDemoVotes()
  setInterval(() => {
    now.value = new Date()
    realtimePulse.value += 1
  }, 15000)
  if (!activeDay.value && selectedDays.value.length) {
    activeDay.value = selectedDays.value[0]
  }
}

const loadPollRemote = async (id: string): Promise<boolean> => {
  if (!hasSupabase()) return false
  const remotePoll = await fetchPollRemote(id)
  if (!remotePoll) return false

  poll.value = { ...defaultPoll(), ...remotePoll }
  votes.value = await fetchVotesRemote(id)
  resetSelection(dateOptions.value)
  persistCurrent()
  return true
}

const ensurePollLoaded = async (id: string) => {
  if (poll.value.id === id) {
    if (!selectedDays.value.length) resetSelection(dateOptions.value)
    if (hasSupabase()) {
      try {
        votes.value = await fetchVotesRemote(id)
        persistCurrent()
        restoreUserVoteForPoll(id)
      } catch (error) {
        console.warn('Supabase vote sync failed', error)
      }
    }
    return true
  }

  if (loadPoll(id)) {
    if (hasSupabase()) {
      try {
        votes.value = await fetchVotesRemote(id)
        persistCurrent()
        restoreUserVoteForPoll(id)
      } catch (error) {
        console.warn('Supabase vote sync failed', error)
      }
    }
    restoreUserVoteForPoll(id)
    return true
  }

  return await loadPollRemote(id)
}

const newDraft = () => {
  poll.value = defaultPoll()
  votes.value = []
  resetSelection(dateOptions.value)
}

export function useApp() {
  return {
    // state
    poll,
    votes,
    nickname,
    userNickname,
    userHistory,
    selectedDays,
    selectedIntervals,
    applyToAllDays,
    activeDay,
    hoverPosition,
    dragState,
    editDragState,
    now,
    realtimePulse,
    // computeds
    dateOptions,
    timelineStep,
    hours,
    isPollClosed,
    totalParticipants,
    currentDayKey,
    currentDayMeta,
    currentDayIntervals,
    heatmap,
    maxHeat,
    showArrows,
    currentDayIndex,
    timelinePoints,
    wavePath,
    visibleMarkerMinutes,
    selectedIntervalRects,
    previewRange,
    // constants
    timelineWidth,
    timelineHeight,
    // actions
    resetSelection,
    moveCurrentDay,
    toggleDayTag,
    applySelection,
    startDragSelection,
    startEditSelection,
    handlePointerMove,
    endDragSelection,
    createPoll,
    submitVote,
    bootstrap,
    ensurePollLoaded,
    newDraft,
    restoreUserVoteForPoll,
  }
}
