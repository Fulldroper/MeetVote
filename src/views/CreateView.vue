<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PollCreateForm from '../components/PollCreateForm.vue'
import { useApp } from '../composables/useApp'

const router = useRouter()
const { poll, newDraft, createPoll } = useApp()

onMounted(() => {
  if (poll.value.id) newDraft()
})

const handleCreate = () => {
  createPoll()
  router.push(`/poll/${poll.value.id}`)
}
</script>

<template>
  <PollCreateForm :poll="poll" @create="handleCreate" />
</template>
