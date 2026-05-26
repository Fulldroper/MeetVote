<script setup lang="ts">
import { FdButton } from '@fulldroper/ui-kit'
import { RouterLink } from 'vue-router'

defineProps<{
  theme: 'light' | 'dark'
}>()

const emit = defineEmits<{
  (event: 'toggle-theme'): void
}>()
</script>

<template>
  <header class="header-bar">
    <div class="brand-row">
      <RouterLink to="/" class="brand-badge" aria-label="На головну">MeetVote</RouterLink>
    </div>

    <div class="header-actions">
      <FdButton variant="ghost" size="small" class="theme-toggle" @click="emit('toggle-theme')" aria-label="Перемкнути тему">
        <svg v-if="theme === 'light'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </FdButton>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '../styles/variables' as vars;
@use '../styles/mixins' as *;

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 0;
  color: hsl(vars.$fd-text);
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.brand-badge {
  font-weight: 800;
  font-size: 1.3rem;
  letter-spacing: -0.04em;
  background: transparent;
  border: 0;
  padding: 0;
  color: inherit;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  display: inline-block;
  transition: color 160ms ease, transform 160ms ease;
}

.brand-badge:hover {
  color: hsl(vars.$fd-accent);
  transform: translateY(-1px);
}

.brand-badge:focus-visible {
  outline: 2px solid hsl(vars.$fd-accent);
  outline-offset: 4px;
  border-radius: 4px;
}

.header-actions {
  display: flex;
  align-items: center;
}

@media (max-width: 980px) {
  .header-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .brand-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
